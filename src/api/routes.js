/**
 * API路由定义
 * 定义所有API端点
 */

const express = require('express');
const router = express.Router();

// 导入控制器
const EnterpriseController = require('../controllers/enterpriseController');
const { getAIStatistics } = require('../controllers/dashboardController');

// 企业相关路由
router.get('/enterprises', EnterpriseController.getAll);
router.get('/enterprises/:id', EnterpriseController.getById);
router.post('/enterprises', EnterpriseController.create);
router.put('/enterprises/:id', EnterpriseController.update);
router.delete('/enterprises/:id', EnterpriseController.delete);
router.post('/enterprises/batch-import', EnterpriseController.batchImport);

// 仪表盘统计路由
router.get('/ai-ecosystem-stats', getAIStatistics);

module.exports = router;