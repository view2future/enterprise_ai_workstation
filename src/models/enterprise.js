/**
 * 企业数据模型
 * 定义企业相关数据结构和数据库操作
 */

const { Pool } = require('pg');

// 数据库连接池
const pool = new Pool({
  user: process.env.DB_USER || 'wangyu94',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'enterprise_db',
  password: process.env.DB_PASSWORD || '',
  port: process.env.DB_PORT || 5432,
});

class Enterprise {
  // 获取企业列表（带分页和筛选）
  static async findAll(filters = {}, page = 1, limit = 20, sort = 'id', order = 'ASC', userId = null) {
    try {
      const { search = '', ...otherFilters } = filters;
      const offset = (page - 1) * limit;
      
      // 根据用户权限决定查询范围
      let baseQuery = `SELECT * FROM enterprises WHERE status = 'active'`;
      let countQuery = `SELECT COUNT(*) as total FROM enterprises WHERE status = 'active'`;
      let params = [];
      let paramIndex = 1;
      
      // 搜索条件
      if (search) {
        baseQuery += ` AND (
          "企业名称" ILIKE $${paramIndex} OR 
          "企业背景" ILIKE $${paramIndex} OR 
          "使用场景" ILIKE $${paramIndex} OR 
          "联系人信息" ILIKE $${paramIndex} OR
          "生态ai产品" ILIKE $${paramIndex}
        )`;
        countQuery += ` AND (
          "企业名称" ILIKE $${paramIndex} OR 
          "企业背景" ILIKE $${paramIndex} OR 
          "使用场景" ILIKE $${paramIndex} OR 
          "联系人信息" ILIKE $${paramIndex} OR
          "生态ai产品" ILIKE $${paramIndex}
        )`;
        params.push(`%${search}%`);
        paramIndex++;
      }
      
      // 其他筛选条件
      for (const [key, value] of Object.entries(otherFilters)) {
        if (value !== undefined && value !== null && value !== '') {
          let column = `"${key}"`;
          
          // 处理多值筛选（如数组类型字段）
          if (Array.isArray(value)) {
            // 对于JSON数组字段，如行业
            if (key === '行业') {
              const conditions = value.map(() => `("行业" ? $${paramIndex})`).join(' OR ');
              baseQuery += ` AND (${conditions})`;
              countQuery += ` AND (${conditions})`;
              value.forEach(v => {
                params.push(v);
                paramIndex++;
              });
            } else {
              const conditions = value.map(() => `${column} = $${paramIndex}`).join(' OR ');
              baseQuery += ` AND (${conditions})`;
              countQuery += ` AND (${conditions})`;
              value.forEach(v => {
                params.push(v);
                paramIndex++;
              });
            }
          } else {
            baseQuery += ` AND ${column} = $${paramIndex}`;
            countQuery += ` AND ${column} = $${paramIndex}`;
            params.push(value);
            paramIndex++;
          }
        }
      }
      
      // 排序
      baseQuery += ` ORDER BY "${sort}" ${order} LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
      params.push(limit, offset);
      
      const [result, countResult] = await Promise.all([
        pool.query(baseQuery, params),
        pool.query(countQuery, params.slice(0, -2)) // 不包括LIMIT和OFFSET参数
      ]);
      
      const total = parseInt(countResult.rows[0].total);
      const totalPages = Math.ceil(total / limit);
      
      return {
        data: result.rows,
        pagination: {
          currentPage: page,
          totalPages,
          totalItems: total,
          itemsPerPage: limit
        }
      };
    } catch (error) {
      console.error('获取企业列表失败:', error);
      throw error;
    }
  }

  // 根据ID获取企业详情
  static async findById(id) {
    try {
      const query = 'SELECT * FROM enterprises WHERE id = $1 AND status = \'active\'';
      const result = await pool.query(query, [id]);
      
      if (result.rows.length === 0) {
        return null;
      }
      
      return result.rows[0];
    } catch (error) {
      console.error('获取企业详情失败:', error);
      throw error;
    }
  }

  // 创建企业
  static async create(data, userId = null) {
    try {
      const {
        企业名称, 飞桨_文心, 线索入库时间, 伙伴等级, 生态ai产品, 优先级,
        base, 注册资本, 参保人数, 企业背景, 行业, 任务方向, 联系人信息, 使用场景
      } = data;

      // 验证必需字段
      if (!企业名称) {
        throw new Error('企业名称是必需的');
      }

      const query = `
        INSERT INTO enterprises (
          "企业名称", "飞桨_文心", "线索入库时间", "伙伴等级", "生态ai产品", "优先级",
          "base", "注册资本", "参保人数", "企业背景", "行业", "任务方向",
          "联系人信息", "使用场景", "created_by"
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
        RETURNING *
      `;

      const result = await pool.query(query, [
        企业名称, 飞桨_文心, 线索入库时间, 伙伴等级, 生态ai产品, 优先级,
        base, 注册资本, 参保人数, 企业背景, 行业, 任务方向,
        联系人信息, 使用场景, userId || 'system'
      ]);

      // 记录变更日志
      if (userId) {
        await Enterprise.addChangeLog({
          enterprise_id: result.rows[0].id,
          field: 'create',
          old_value: null,
          new_value: '企业创建',
          changed_by: userId
        });
      }

      return result.rows[0];
    } catch (error) {
      console.error('创建企业失败:', error);
      throw error;
    }
  }

  // 更新企业
  static async update(id, data, userId = null) {
    try {
      // 获取当前企业信息用于变更日志
      const current = await Enterprise.findById(id);
      if (!current) {
        throw new Error('企业不存在');
      }

      // 构建更新字段和参数
      const updateFields = [];
      const values = [];
      let valueIndex = 1;

      for (const [key, value] of Object.entries(data)) {
        if (value !== undefined && value !== null) {
          // 处理特殊字段（如JSON类型）
          if (key === '行业' && Array.isArray(value)) {
            updateFields.push(`"${key}" = $${valueIndex}::jsonb`);
            values.push(JSON.stringify(value));
          } else {
            updateFields.push(`"${key}" = $${valueIndex}`);
            values.push(value);
          }
          valueIndex++;
        }
      }

      if (updateFields.length === 0) {
        throw new Error('没有提供需要更新的字段');
      }

      updateFields.push('"updated_by" = $${valueIndex}');
      values.push(userId || 'system');
      valueIndex++;
      
      updateFields.push('"updated_at" = CURRENT_TIMESTAMP');
      updateFields.push('"线索更新时间" = CURRENT_TIMESTAMP');

      const query = `
        UPDATE enterprises
        SET ${updateFields.join(', ')}
        WHERE id = $${valueIndex} AND status = 'active'
        RETURNING *
      `;

      values.push(id);

      const result = await pool.query(query, values);

      if (result.rows.length === 0) {
        return null; // 企业不存在或已被删除
      }

      // 记录变更日志
      if (userId) {
        for (const [key, newValue] of Object.entries(data)) {
          const oldValue = current[key];
          if (oldValue !== newValue) {
            await Enterprise.addChangeLog({
              enterprise_id: id,
              field: key,
              old_value: oldValue,
              new_value: newValue,
              changed_by: userId
            });
          }
        }
      }

      return result.rows[0];
    } catch (error) {
      console.error('更新企业失败:', error);
      throw error;
    }
  }

  // 删除企业（软删除）
  static async delete(id, userId = null) {
    try {
      const query = 'UPDATE enterprises SET status = \'deleted\', updated_at = CURRENT_TIMESTAMP, updated_by = $2 WHERE id = $1 RETURNING *';
      const result = await pool.query(query, [id, userId || 'system']);

      if (result.rows.length === 0) {
        return null; // 企业不存在
      }

      return result.rows[0];
    } catch (error) {
      console.error('删除企业失败:', error);
      throw error;
    }
  }

  // 批量导入数据
  static async batchImport(enterprises, userId = null) {
    try {
      const successful = [];
      const failed = [];

      for (const enterprise of enterprises) {
        try {
          // 检查是否已存在
          const existing = await pool.query(
            'SELECT id FROM enterprises WHERE "企业名称" = $1 AND status = \'active\'',
            [enterprise['企业名称']]
          );
          
          if (existing.rows.length > 0) {
            // 如果已存在，更新而不是创建 - 根据PRD的去重策略
            const updated = await Enterprise.update(existing.rows[0].id, enterprise, userId);
            successful.push(updated);
          } else {
            // 创建新企业
            const created = await Enterprise.create(enterprise, userId);
            successful.push(created);
          }
        } catch (error) {
          failed.push({
            enterprise,
            error: error.message
          });
        }
      }

      return {
        successful: successful.length,
        failed: failed.length,
        results: {
          successful,
          failed
        }
      };
    } catch (error) {
      console.error('批量导入失败:', error);
      throw error;
    }
  }

  // 获取变更日志
  static async getChangeLogs(enterpriseId, page = 1, limit = 20) {
    try {
      const offset = (page - 1) * limit;
      
      const query = `
        SELECT * FROM audit_logs 
        WHERE table_name = 'enterprises' AND record_id = $1
        ORDER BY changed_at DESC 
        LIMIT $2 OFFSET $3
      `;
      
      const countQuery = `
        SELECT COUNT(*) as total FROM audit_logs 
        WHERE table_name = 'enterprises' AND record_id = $1
      `;
      
      const [result, countResult] = await Promise.all([
        pool.query(query, [enterpriseId, limit, offset]),
        pool.query(countQuery, [enterpriseId])
      ]);
      
      const total = parseInt(countResult.rows[0].total);
      const totalPages = Math.ceil(total / limit);
      
      return {
        data: result.rows,
        pagination: {
          currentPage: page,
          totalPages,
          totalItems: total,
          itemsPerPage: limit
        }
      };
    } catch (error) {
      console.error('获取变更日志失败:', error);
      throw error;
    }
  }

  // 添加变更日志
  static async addChangeLog(logData) {
    try {
      const { enterprise_id, field, old_value, new_value, changed_by } = logData;
      
      const query = `
        INSERT INTO audit_logs (
          table_name, record_id, operation, old_values, new_values, changed_by
        ) VALUES ($1, $2, $3, $4, $5, $6)
      `;
      
      await pool.query(query, [
        'enterprises',
        enterprise_id,
        'UPDATE',
        old_value ? JSON.stringify({ [field]: old_value }) : null,
        new_value ? JSON.stringify({ [field]: new_value }) : null,
        changed_by
      ]);
    } catch (error) {
      console.error('添加变更日志失败:', error);
      // 这里我们不抛出错误，因为变更日志是辅助功能，不影响主要业务
    }
  }

  // 检查企业是否已存在（用于去重）
  static async checkDuplicate(企业名称, 统一社会信用代码 = null) {
    try {
      let query = 'SELECT id FROM enterprises WHERE "企业名称" = $1 AND status = \'active\'';
      let params = [企业名称];
      
      if (统一社会信用代码) {
        query += ' AND "统一社会信用代码" = $2';
        params = [企业名称, 统一社会信用代码];
      }
      
      const result = await pool.query(query, params);
      return result.rows.length > 0;
    } catch (error) {
      console.error('检查重复企业失败:', error);
      throw error;
    }
  }
}

module.exports = Enterprise;