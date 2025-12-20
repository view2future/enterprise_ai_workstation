/**
 * 企业控制器
 * 处理企业相关的HTTP请求
 */

const Enterprise = require('../models/enterprise');

class EnterpriseController {
  // 获取企业列表
  static async getAll(req, res) {
    try {
      const {
        page = 1,
        limit = 20,
        search = '',
        sort = 'id',
        order = 'ASC',
        飞桨_文心 = '',
        优先级 = '',
        伙伴等级 = '',
        base = '',
        注册资本_min = '',
        注册资本_max = '',
        参人数_min = '',
        参人数_max = '',
        任务方向 = '',
        行业 = ''
      } = req.query;

      // 构建筛选条件
      const filters = {};
      if (search) filters.search = search;
      if (飞桨_文心) filters['飞桨_文心'] = 飞性;
      if (优先级) filters['优先级'] = 优先级;
      if (伙伴等级) filters['伙伴等级'] = 伙伴等级;
      if (base) filters['base'] = base;
      if (注册资本_min) filters['注册资本_min'] = parseInt(注册资本_min);
      if (注册资本_max) filters['注册资本_max'] = parseInt(注册资本_max);
      if (参保人数_min) filters['参保人数_min'] = parseInt(参保人数_min);
      if (参保人数_max) filters['参保人数_max'] = parseInt(参保人数_max);
      if (任务方向) filters['任务方向'] = 任务方向;
      if (行业) {
        // 如果行业是逗号分隔的多个值，转换为数组
        const industryArray = 行业.includes(',') ? 行业.split(',') : [行业];
        filters['行业'] = industryArray;
      }

      const result = await Enterprise.findAll(filters, parseInt(page), parseInt(limit), sort, order);
      
      res.json({
        success: true,
        data: result.data,
        pagination: result.pagination
      });
    } catch (error) {
      console.error('获取企业列表失败:', error);
      res.status(500).json({
        success: false,
        message: '获取企业列表失败',
        error: error.message
      });
    }
  }

  // 获取企业详情（包含变更日志）
  static async getById(req, res) {
    try {
      const { id } = req.params;
      const enterprise = await Enterprise.findById(parseInt(id));

      if (!enterprise) {
        return res.status(404).json({
          success: false,
          message: '企业未找到'
        });
      }

      // 获取变更日志（可选，可以根据需要启用）
      // const changeLogs = await Enterprise.getChangeLogs(id);

      res.json({
        success: true,
        data: enterprise
        // changeLogs: changeLogs?.data || []
      });
    } catch (error) {
      console.error('获取企业详情失败:', error);
      res.status(500).json({
        success: false,
        message: '获取企业详情失败',
        error: error.message
      });
    }
  }

  // 创建企业
  static async create(req, res) {
    try {
      const userId = req.user?.id || null; // 从认证信息获取用户ID
      const enterprise = await Enterprise.create(req.body, userId);

      res.status(201).json({
        success: true,
        message: '企业创建成功',
        data: enterprise
      });
    } catch (error) {
      console.error('创建企业失败:', error);
      res.status(400).json({
        success: false,
        message: error.message || '创建企业失败',
        error: error.message
      });
    }
  }

  // 更新企业
  static async update(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user?.id || null; // 从认证信息获取用户ID
      const enterprise = await Enterprise.update(parseInt(id), req.body, userId);

      if (!enterprise) {
        return res.status(404).json({
          success: false,
          message: '企业未找到'
        });
      }

      res.json({
        success: true,
        message: '企业更新成功',
        data: enterprise
      });
    } catch (error) {
      console.error('更新企业失败:', error);
      res.status(400).json({
        success: false,
        message: error.message || '更新企业失败',
        error: error.message
      });
    }
  }

  // 删除企业
  static async delete(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user?.id || null; // 从认证信息获取用户ID
      const enterprise = await Enterprise.delete(parseInt(id), userId);

      if (!enterprise) {
        return res.status(404).json({
          success: false,
          message: '企业未找到'
        });
      }

      res.json({
        success: true,
        message: '企业删除成功',
        data: enterprise
      });
    } catch (error) {
      console.error('删除企业失败:', error);
      res.status(500).json({
        success: false,
        message: '删除企业失败',
        error: error.message
      });
    }
  }

  // 批量导入企业
  static async batchImport(req, res) {
    try {
      const { enterprises } = req.body;
      const userId = req.user?.id || null; // 从认证信息获取用户ID
      
      if (!enterprises || !Array.isArray(enterprises)) {
        return res.status(400).json({
          success: false,
          message: '请提供有效的企业数组'
        });
      }

      const result = await Enterprise.batchImport(enterprises, userId);

      res.json({
        success: true,
        message: `批量导入完成: 成功${result.successful}条, 失败${result.failed}条`,
        data: {
          successful: result.successful,
          failed: result.failed,
          details: result.results
        }
      });
    } catch (error) {
      console.error('批量导入失败:', error);
      res.status(500).json({
        success: false,
        message: '批量导入失败',
        error: error.message
      });
    }
  }

  // 获取企业的变更日志
  static async getChangeLogs(req, res) {
    try {
      const { id } = req.params;
      const { page = 1, limit = 20 } = req.query;

      const result = await Enterprise.getChangeLogs(parseInt(id), parseInt(page), parseInt(limit));

      res.json({
        success: true,
        data: result.data,
        pagination: result.pagination
      });
    } catch (error) {
      console.error('获取变更日志失败:', error);
      res.status(500).json({
        success: false,
        message: '获取变更日志失败',
        error: error.message
      });
    }
  }

  // 检查企业重复
  static async checkDuplicate(req, res) {
    try {
      const { 企业名称, 统一社会信用代码 } = req.body;

      if (!企业名称) {
        return res.status(400).json({
          success: false,
          message: '企业名称是必需的'
        });
      }

      const isDuplicate = await Enterprise.checkDuplicate(企业名称, 统一社会信用代码);

      res.json({
        success: true,
        isDuplicate,
        message: isDuplicate ? '企业已存在' : '企业名称可用'
      });
    } catch (error) {
      console.error('检查企业重复失败:', error);
      res.status(500).json({
        success: false,
        message: '检查企业重复失败',
        error: error.message
      });
    }
  }

  // 获取筛选选项（用于前端下拉选择）
  static async getFilterOptions(req, res) {
    try {
      const pool = require('pg').Pool;
      const dbPool = new pool({
        user: process.env.DB_USER || 'wangyu94',
        host: process.env.DB_HOST || 'localhost',
        database: process.env.DB_NAME || 'enterprise_db',
        password: process.env.DB_PASSWORD || '',
        port: process.env.DB_PORT || 5432,
      });

      // 获取所有唯一的飞桨_文心值
      const 飞桨文心Result = await dbPool.query(`
        SELECT DISTINCT "飞桨_文心" 
        FROM enterprises 
        WHERE "飞桨_文心" IS NOT NULL AND "飞桨_文心" != '' AND status = 'active'
        ORDER BY "飞桨_文心"
      `);

      // 获取所有唯一的优先级值
      const 优先级Result = await dbPool.query(`
        SELECT DISTINCT "优先级" 
        FROM enterprises 
        WHERE "优先级" IS NOT NULL AND "优先级" != '' AND status = 'active'
        ORDER BY "优先级"
      `);

      // 获取所有唯一的伙伴等级值
      const 伙伴等级Result = await dbPool.query(`
        SELECT DISTINCT "伙伴等级" 
        FROM enterprises 
        WHERE "伙伴等级" IS NOT NULL AND "伙伴等级" != '' AND status = 'active'
        ORDER BY "伙伴等级"
      `);

      // 获取所有唯一的基地值
      const baseResult = await dbPool.query(`
        SELECT DISTINCT "base" 
        FROM enterprises 
        WHERE "base" IS NOT NULL AND "base" != '' AND status = 'active'
        ORDER BY "base"
      `);

      // 获取所有唯一的行业值（从JSONB字段）
      const 行业Result = await dbPool.query(`
        SELECT DISTINCT jsonb_array_elements_text("行业") as industry
        FROM enterprises 
        WHERE "行业" IS NOT NULL AND "行业" != '[]' AND status = 'active'
        ORDER BY industry
        LIMIT 50
      `);

      // 获取所有唯一的任务方向值
      const 任务方向Result = await dbPool.query(`
        SELECT DISTINCT "任务方向" 
        FROM enterprises 
        WHERE "任务方向" IS NOT NULL AND "任务方向" != '' AND status = 'active'
        ORDER BY "任务方向"
        LIMIT 50
      `);

      res.json({
        success: true,
        data: {
          飞桨文心: 飞桨文心Result.rows.map(r => r['飞桨_文心']),
          优先级: 优先级Result.rows.map(r => r['优先级']),
          伙伴等级: 伙伴等级Result.rows.map(r => r['伙伴等级']),
          base: baseResult.rows.map(r => r.base),
          行业: 行业Result.rows.map(r => r.industry),
          任务方向: 任务方向Result.rows.map(r => r['任务方向'])
        }
      });

      await dbPool.end();
    } catch (error) {
      console.error('获取筛选选项失败:', error);
      res.status(500).json({
        success: false,
        message: '获取筛选选项失败',
        error: error.message
      });
    }
  }
}

module.exports = EnterpriseController;