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
        base = ''
      } = req.query;

      // 构建筛选条件
      const filters = {};
      if (search) filters.search = search;
      if (飞桨_文心) filters['飞桨_文心'] = 飞桨_文心;
      if (优先级) filters['优先级'] = 优先级;
      if (伙伴等级) filters['伙伴等级'] = 伙伴等级;
      if (base) filters['base'] = base;

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

  // 获取企业详情
  static async getById(req, res) {
    try {
      const { id } = req.params;
      const enterprise = await Enterprise.findById(id);

      if (!enterprise) {
        return res.status(404).json({
          success: false,
          message: '企业未找到'
        });
      }

      res.json({
        success: true,
        data: enterprise
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
      const enterprise = await Enterprise.create(req.body);

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
      const enterprise = await Enterprise.update(parseInt(id), req.body);

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
      const enterprise = await Enterprise.delete(parseInt(id));

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
      
      if (!enterprises || !Array.isArray(enterprises)) {
        return res.status(400).json({
          success: false,
          message: '请提供有效的企业数组'
        });
      }

      const result = await Enterprise.batchImport(enterprises);

      res.json({
        success: true,
        message: '批量导入完成',
        data: result
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
}

module.exports = EnterpriseController;