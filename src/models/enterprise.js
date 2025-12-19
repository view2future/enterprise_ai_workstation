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
  static async findAll(filters = {}, page = 1, limit = 20, sort = 'id', order = 'ASC') {
    try {
      const { search = '', ...otherFilters } = filters;
      const offset = (page - 1) * limit;
      
      let query = `SELECT * FROM enterprises WHERE status = 'active'`;
      let countQuery = `SELECT COUNT(*) as total FROM enterprises WHERE status = 'active'`;
      let params = [];
      let paramIndex = 1;
      
      // 搜索条件
      if (search) {
        query += ` AND (
          "企业名称" ILIKE $${paramIndex} OR 
          "企业背景" ILIKE $${paramIndex} OR 
          "使用场景" ILIKE $${paramIndex} OR 
          "联系人信息" ILIKE $${paramIndex}
        )`;
        countQuery += ` AND (
          "企业名称" ILIKE $${paramIndex} OR 
          "企业背景" ILIKE $${paramIndex} OR 
          "使用场景" ILIKE $${paramIndex} OR 
          "联系人信息" ILIKE $${paramIndex}
        )`;
        params.push(`%${search}%`);
        paramIndex++;
      }
      
      // 其他筛选条件
      for (const [key, value] of Object.entries(otherFilters)) {
        if (value !== undefined && value !== null && value !== '') {
          let column = `"${key}"`;
          if (key === '飞桨_文心') {
            column = `"飞桨_文心"`;
          } else if (key === '优先级') {
            column = `"优先级"`;
          } else if (key === '伙伴等级') {
            column = `"伙伴等级"`;
          }
          
          query += ` AND ${column} = $${paramIndex}`;
          countQuery += ` AND ${column} = $${paramIndex}`;
          params.push(value);
          paramIndex++;
        }
      }
      
      // 排序
      query += ` ORDER BY "${sort}" ${order} LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
      params.push(limit, offset);
      
      const [result, countResult] = await Promise.all([
        pool.query(query, params),
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
  static async create(data) {
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
          "联系人信息", "使用场景"
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
        RETURNING *
      `;

      const result = await pool.query(query, [
        企业名称, 飞桨_文心, 线索入库时间, 伙伴等级, 生态ai产品, 优先级,
        base, 注册资本, 参保人数, 企业背景, 行业, 任务方向,
        联系人信息, 使用场景
      ]);

      return result.rows[0];
    } catch (error) {
      console.error('创建企业失败:', error);
      throw error;
    }
  }

  // 更新企业
  static async update(id, data) {
    try {
      // 构建更新字段和参数
      const updateFields = [];
      const values = [];
      let valueIndex = 1;

      for (const [key, value] of Object.entries(data)) {
        if (value !== undefined && value !== null) {
          updateFields.push(`"${key}" = $${valueIndex}`);
          values.push(value);
          valueIndex++;
        }
      }

      if (updateFields.length === 0) {
        throw new Error('没有提供需要更新的字段');
      }

      updateFields.push('"updated_at" = CURRENT_TIMESTAMP');
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

      return result.rows[0];
    } catch (error) {
      console.error('更新企业失败:', error);
      throw error;
    }
  }

  // 删除企业（软删除）
  static async delete(id) {
    try {
      const query = 'UPDATE enterprises SET status = \'deleted\', updated_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *';
      const result = await pool.query(query, [id]);

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
  static async batchImport(enterprises) {
    try {
      const successful = [];
      const failed = [];

      for (const enterprise of enterprises) {
        try {
          const created = await Enterprise.create(enterprise);
          successful.push(created);
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
        details: {
          successful,
          failed
        }
      };
    } catch (error) {
      console.error('批量导入失败:', error);
      throw error;
    }
  }
}

module.exports = Enterprise;