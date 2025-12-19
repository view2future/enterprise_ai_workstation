const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// 中间件
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// PostgreSQL连接池
const pool = new Pool({
  user: process.env.DB_USER || 'wangyu94',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'enterprise_db',
  password: process.env.DB_PASSWORD || '',
  port: process.env.DB_PORT || 5432,
  max: 20, // 最大连接数
  idleTimeoutMillis: 30000, // 30秒空闲超时
  connectionTimeoutMillis: 2000, // 2秒连接超时,
});

// 数据库连接测试
pool.on('connect', () => {
  console.log('已连接到PostgreSQL数据库');
});

pool.on('error', (err) => {
  console.error('PostgreSQL连接错误:', err);
});

// 企业相关API路由

// 1. 获取所有企业（带分页和搜索）
app.get('/api/enterprises', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      search = '',
      飞桨文心 = '',
      线索入库时间 = '',
      伙伴等级 = '',
      优先级 = '',
      任务方向 = '',
      注册资本_min = 0,
      注册资本_max = 9999999999,
      参保人数_min = 0,
      参保人数_max = 999999,
      sort = '线索更新时间',
      order = 'DESC'
    } = req.query;

    const offset = (page - 1) * limit;

    // 使用我们之前创建的搜索函数
    const searchQuery = `
      SELECT * FROM search_enterprises_fulltext(
        $1, $2, $3, $4, $5, '', $6,
        $7::BIGINT, $8::BIGINT, $9::INTEGER, $10::INTEGER,
        $11, $12, $13::INTEGER, $14::INTEGER
      )
    `;

    const result = await pool.query(searchQuery, [
      search,
      飞桨文心,
      线索入库时间,
      伙伴等级,
      优先级,
      任务方向,
      parseInt(注册资本_min),
      parseInt(注册资本_max),
      parseInt(参保人数_min),
      parseInt(参保人数_max),
      sort,
      order,
      offset,
      parseInt(limit)
    ]);

    // 提取总数（使用第一个结果的total_count）
    const totalCount = result.rows.length > 0 ? result.rows[0].total_count : 0;
    const data = result.rows.map(row => {
      // 移除总数字段，只返回实际数据
      const { total_count, ...rowData } = row;
      return rowData;
    });

    res.json({
      success: true,
      data: data,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalCount / parseInt(limit)),
        totalItems: totalCount,
        itemsPerPage: parseInt(limit)
      }
    });

  } catch (error) {
    console.error('获取企业列表错误:', error);
    res.status(500).json({
      success: false,
      message: '获取企业列表失败',
      error: error.message
    });
  }
});

// 2. 获取单个企业详情
app.get('/api/enterprises/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // 查询企业基本信息
    const enterpriseQuery = 'SELECT * FROM enterprises WHERE id = $1';
    const enterpriseResult = await pool.query(enterpriseQuery, [id]);

    if (enterpriseResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: '企业未找到'
      });
    }

    const enterprise = enterpriseResult.rows[0];

    // 获取最新进展
    const progressResult = await pool.query(
      'SELECT * FROM get_latest_progress($1)',
      [id]
    );
    const latestProgress = progressResult.rows;

    // 获取进展时间线
    const timelineResult = await pool.query(
      'SELECT * FROM get_progress_timeline($1)',
      [id]
    );
    const progressTimeline = timelineResult.rows;

    res.json({
      success: true,
      data: {
        ...enterprise,
        latestProgress,
        progressTimeline
      }
    });

  } catch (error) {
    console.error('获取企业详情错误:', error);
    res.status(500).json({
      success: false,
      message: '获取企业详情失败',
      error: error.message
    });
  }
});

// 3. 创建企业
app.post('/api/enterprises', async (req, res) => {
  try {
    const {
      企业名称,
      飞桨文心,
      线索入库时间,
      伙伴等级,
      生态AI产品,
      优先级,
      base,
      注册资本,
      参保人数,
      企业背景,
      行业,
      任务方向,
      联系人信息,
      使用场景,
      created_by = 'system'
    } = req.body;

    // 验证必需字段
    if (!企业名称) {
      return res.status(400).json({
        success: false,
        message: '企业名称是必需的'
      });
    }

    // 验证枚举字段
    const valid飞桨文心 = ['飞桨', '文心'];
    const valid伙伴等级 = ['认证级', '优选级', '无'];
    const valid优先级 = ['P0', 'P1', 'P2'];

    if (飞桨文心 && !valid飞桨文心.includes(飞桨文心)) {
      return res.status(400).json({
        success: false,
        message: '飞桨文心字段值不合法'
      });
    }

    if (伙伴等级 && !valid伙伴等级.includes(伙伴等级)) {
      return res.status(400).json({
        success: false,
        message: '伙伴等级字段值不合法'
      });
    }

    if (优先级 && !valid优先级.includes(优先级)) {
      return res.status(400).json({
        success: false,
        message: '优先级字段值不合法'
      });
    }

    // 插入企业数据
    const insertQuery = `
      INSERT INTO enterprises (
        企业名称, 飞桨文心, 线索入库时间, 伙伴等级, 生态AI产品, 优先级, 
        base, 注册资本, 参保人数, 企业背景, 行业, 任务方向, 
        联系人信息, 使用场景, created_by, 线索更新时间
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, CURRENT_TIMESTAMP)
      RETURNING *
    `;

    const insertResult = await pool.query(insertQuery, [
      企业名称, 飞桨文心, 线索入库时间, 伙伴等级, 生态AI产品, 优先级,
      base, 注册资本, 参保人数, 企业背景, 行业, 任务方向,
      联系人信息, 使用场景, created_by
    ]);

    res.status(201).json({
      success: true,
      message: '企业创建成功',
      data: insertResult.rows[0]
    });

  } catch (error) {
    console.error('创建企业错误:', error);
    res.status(500).json({
      success: false,
      message: '创建企业失败',
      error: error.message
    });
  }
});

// 4. 更新企业
app.put('/api/enterprises/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      企业名称,
      飞桨文心,
      线索入库时间,
      伙伴等级,
      生态AI产品,
      优先级,
      base,
      注册资本,
      参保人数,
      企业背景,
      行业,
      任务方向,
      联系人信息,
      使用场景,
      updated_by = 'system'
    } = req.body;

    // 验证枚举字段
    const valid飞桨文心 = ['飞桨', '文心'];
    const valid伙伴等级 = ['认证级', '优选级', '无'];
    const valid优先级 = ['P0', 'P1', 'P2'];

    if (飞桨文心 && !valid飞桨文心.includes(飞桨文心)) {
      return res.status(400).json({
        success: false,
        message: '飞桨文心字段值不合法'
      });
    }

    if (伙伴等级 && !valid伙伴等级.includes(伙伴等级)) {
      return res.status(400).json({
        success: false,
        message: '伙伴等级字段值不合法'
      });
    }

    if (优先级 && !valid优先级.includes(优先级)) {
      return res.status(400).json({
        success: false,
        message: '优先级字段值不合法'
      });
    }

    // 构建更新查询
    const updateFields = [];
    const values = [];
    let valueIndex = 1;

    if (企业名称 !== undefined) {
      updateFields.push(`企业名称 = $${valueIndex}`);
      values.push(企业名称);
      valueIndex++;
    }
    if (飞桨文心 !== undefined) {
      updateFields.push(`飞桨文心 = $${valueIndex}`);
      values.push(飞桨文心);
      valueIndex++;
    }
    if (线索入库时间 !== undefined) {
      updateFields.push(`线索入库时间 = $${valueIndex}`);
      values.push(线索入库时间);
      valueIndex++;
    }
    if (伙伴等级 !== undefined) {
      updateFields.push(`伙伴等级 = $${valueIndex}`);
      values.push(伙伴等级);
      valueIndex++;
    }
    if (生态AI产品 !== undefined) {
      updateFields.push(`生态AI产品 = $${valueIndex}`);
      values.push(生态AI产品);
      valueIndex++;
    }
    if (优先级 !== undefined) {
      updateFields.push(`优先级 = $${valueIndex}`);
      values.push(优先级);
      valueIndex++;
    }
    if (base !== undefined) {
      updateFields.push(`base = $${valueIndex}`);
      values.push(base);
      valueIndex++;
    }
    if (注册资本 !== undefined) {
      updateFields.push(`注册资本 = $${valueIndex}`);
      values.push(注册资本);
      valueIndex++;
    }
    if (参保人数 !== undefined) {
      updateFields.push(`参保人数 = $${valueIndex}`);
      values.push(参保人数);
      valueIndex++;
    }
    if (企业背景 !== undefined) {
      updateFields.push(`企业背景 = $${valueIndex}`);
      values.push(企业背景);
      valueIndex++;
    }
    if (行业 !== undefined) {
      updateFields.push(`行业 = $${valueIndex}`);
      values.push(行业);
      valueIndex++;
    }
    if (任务方向 !== undefined) {
      updateFields.push(`任务方向 = $${valueIndex}`);
      values.push(任务方向);
      valueIndex++;
    }
    if (联系人信息 !== undefined) {
      updateFields.push(`联系人信息 = $${valueIndex}`);
      values.push(联系人信息);
      valueIndex++;
    }
    if (使用场景 !== undefined) {
      updateFields.push(`使用场景 = $${valueIndex}`);
      values.push(使用场景);
      valueIndex++;
    }
    
    updateFields.push(`updated_by = $${valueIndex}`);
    values.push(updated_by);
    valueIndex++;
    
    updateFields.push(`updated_at = CURRENT_TIMESTAMP`);
    
    values.push(id); // 最后一个参数是WHERE条件的ID
    
    if (updateFields.length === 2) { // 只有updated_by和updated_at被更新
      return res.status(400).json({
        success: false,
        message: '没有提供需要更新的字段'
      });
    }

    const updateQuery = `
      UPDATE enterprises 
      SET ${updateFields.slice(0, -1).join(', ')} 
      WHERE id = $${valueIndex}
      RETURNING *
    `;

    const result = await pool.query(updateQuery, values);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: '企业未找到'
      });
    }

    res.json({
      success: true,
      message: '企业更新成功',
      data: result.rows[0]
    });

  } catch (error) {
    console.error('更新企业错误:', error);
    res.status(500).json({
      success: false,
      message: '更新企业失败',
      error: error.message
    });
  }
});

// 5. 删除企业
app.delete('/api/enterprises/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const deleteQuery = 'DELETE FROM enterprises WHERE id = $1 RETURNING *';
    const result = await pool.query(deleteQuery, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: '企业未找到'
      });
    }

    res.json({
      success: true,
      message: '企业删除成功',
      data: result.rows[0]
    });

  } catch (error) {
    console.error('删除企业错误:', error);
    res.status(500).json({
      success: false,
      message: '删除企业失败',
      error: error.message
    });
  }
});

// 6. 添加企业进展
app.post('/api/enterprises/:id/progress', async (req, res) => {
  try {
    const { id } = req.params;
    const { content, progress_type = '本周进展', created_by = 'system' } = req.body;

    if (!content) {
      return res.status(400).json({
        success: false,
        message: '进展内容不能为空'
      });
    }

    // 验证企业是否存在
    const enterpriseCheck = await pool.query(
      'SELECT id FROM enterprises WHERE id = $1', 
      [id]
    );
    
    if (enterpriseCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: '企业不存在'
      });
    }

    // 使用我们之前创建的函数添加进展
    const result = await pool.query(
      'SELECT * FROM add_enterprise_progress($1, $2, $3, $4)',
      [id, content, progress_type, created_by]
    );

    res.status(201).json({
      success: true,
      message: '进展记录添加成功',
      data: { id: result.rows[0].add_enterprise_progress }
    });

  } catch (error) {
    console.error('添加企业进展错误:', error);
    res.status(500).json({
      success: false,
      message: '添加进展记录失败',
      error: error.message
    });
  }
});

// 7. 获取企业统计信息
app.get('/api/statistics', async (req, res) => {
  try {
    // 获取优先级统计
    const priorityResult = await pool.query('SELECT * FROM get_priority_statistics()');
    const priorityStats = priorityResult.rows;

    // 获取飞桨/文心统计
    const 飞桨文心Result = await pool.query('SELECT * FROM get_飞桨文心_statistics()');
    const 飞桨文心Stats = 飞桨文心Result.rows;

    // 获取企业总数
    const countResult = await pool.query('SELECT COUNT(*) as total FROM enterprises');
    const totalCount = parseInt(countResult.rows[0].total);

    // 获取最新更新的企业
    const recentResult = await pool.query(`
      SELECT 企业名称, 线索更新时间, 优先级, 飞桨文心
      FROM enterprises
      ORDER BY 线索更新时间 DESC
      LIMIT 10
    `);
    const recentEnterprises = recentResult.rows;

    res.json({
      success: true,
      data: {
        totalEnterprises: totalCount,
        priorityStats,
        飞桨文心Stats,
        recentEnterprises
      }
    });

  } catch (error) {
    console.error('获取统计信息错误:', error);
    res.status(500).json({
      success: false,
      message: '获取统计信息失败',
      error: error.message
    });
  }
});

// 8. 获取AI生态统计信息
app.get('/api/ai-ecosystem-stats', async (req, res) => {
  try {
    // 获取企业总数
    const totalResult = await pool.query('SELECT COUNT(*) as total FROM enterprises');
    const totalEnterprises = parseInt(totalResult.rows[0].total);

    // 获取使用飞桨/文心的企业数量
    const baiduAIResult = await pool.query(`
      SELECT COUNT(*) as total
      FROM enterprises
      WHERE "飞桨_文心" IS NOT NULL AND "飞桨_文心" != ''
    `);
    const baiduAICoverage = parseInt(baiduAIResult.rows[0].total);

    // 获取P0优先级企业（视为深度合作企业）
    const deepCooperationResult = await pool.query(`
      SELECT COUNT(*) as total
      FROM enterprises
      WHERE "优先级" = 'P0'
    `);
    const deepCooperation = parseInt(deepCooperationResult.rows[0].total);

    // 获取各行业分布
    const industryResult = await pool.query(`
      SELECT
        TRIM(("行业"->>0)::text) as industry,
        COUNT(*) as count
      FROM enterprises
      WHERE "行业" IS NOT NULL AND "行业" != '[]' AND TRIM(("行业"->>0)::text) != ''
      GROUP BY TRIM(("行业"->>0)::text)
      ORDER BY count DESC
      LIMIT 6
    `);

    // 计算行业占比
    const industryDistribution = industryResult.rows.map(row => ({
      industry: row.industry,
      count: parseInt(row.count),
      percentage: parseFloat(((row.count / totalEnterprises) * 100).toFixed(1))
    }));

    // 获取AI应用场景分布（从任务方向字段）
    const scenarioResult = await pool.query(`
      SELECT
        "任务方向",
        COUNT(*) as count
      FROM enterprises
      WHERE "任务方向" IS NOT NULL AND "任务方向" != ''
      GROUP BY "任务方向"
      ORDER BY count DESC
      LIMIT 6
    `);

    const scenarioDistribution = scenarioResult.rows.map(row => ({
      scenario: row.任务方向,
      count: parseInt(row.count),
      percentage: parseFloat(((row.count / totalEnterprises) * 100).toFixed(1))
    }));

    // 获取企业优先级分布
    const priorityResult = await pool.query(`
      SELECT
        "优先级",
        COUNT(*) as count
      FROM enterprises
      WHERE "优先级" IS NOT NULL
      GROUP BY "优先级"
      ORDER BY "优先级"
    `);

    const priorityDistribution = priorityResult.rows.map(row => ({
      stage: row.优先级,
      count: parseInt(row.count),
      percentage: parseFloat(((row.count / totalEnterprises) * 100).toFixed(1))
    }));

    // 获取高优先级企业详情（作为深度合作企业展示）
    const highPriorityEnterprises = await pool.query(`
      SELECT
        id,
        "企业名称",
        "行业",
        "任务方向",
        "优先级",
        "飞桨_文心",
        "base"
      FROM enterprises
      WHERE "优先级" = 'P0'
      LIMIT 4
    `);

    const deepCooperationEnterprises = highPriorityEnterprises.rows.map(enterprise => ({
      id: enterprise.id,
      name: enterprise.企业名称,
      industry: enterprise.行业 && Array.isArray(enterprise.行业) ? enterprise.行业[0] || '未知' : enterprise.行业 ? enterprise.行业 : '未知',
      aiScenario: enterprise.任务方向 || '未知',
      cooperationLevel: enterprise.优先级 === 'P0' ? 4 : enterprise.优先级 === 'P1' ? 3 : 2,
      aiMaturity: enterprise.优先级 === 'P0' ? 'scaling' : enterprise.优先级 === 'P1' ? 'deploying' : 'piloting',
      baiduAI: !!enterprise.飞桨_文心,
      cooperationValue: enterprise.优先级 === 'P0' ? '高' : '中',
      location: enterprise.base || '未知'
    }));

    // 获取最近活动（从线索更新时间排序）
    const recentActivitiesResult = await pool.query(`
      SELECT
        "企业名称",
        "线索更新时间",
        "优先级",
        "飞桨_文心"
      FROM enterprises
      ORDER BY "线索更新时间" DESC
      LIMIT 4
    `);

    const recentActivities = recentActivitiesResult.rows.map((activity, index) => ({
      id: index + 1,
      type: '企业更新',
      title: `${activity.企业名称} - ${activity.优先级 || '未知优先级'}企业`,
      time: calculateTimeAgo(activity.线索更新时间),
      color: activity.优先级 === 'P0' ? '#3b82f6' :
             activity.优先级 === 'P1' ? '#8b5cf6' :
             '#10b981'
    }));

    res.json({
      success: true,
      data: {
        totalEnterprises,
        aiAdopters: totalEnterprises, // 所有企业都是AI相关企业
        baiduAICoverage,
        deepCooperation,
        monthlyGrowth: '+12%', // 假设值，实际应用中需要计算
        aiAdoptionRate: '100%', // 所有企业都是AI相关企业
        baiduAIUsageRate: parseFloat(((baiduAICoverage / totalEnterprises) * 100).toFixed(2)) + '%',
        deepCooperationRate: parseFloat(((deepCooperation / totalEnterprises) * 100).toFixed(2)) + '%',
        industryDistribution,
        scenarioDistribution,
        priorityDistribution, // 可以作为AI成熟度的近似
        deepCooperationEnterprises,
        recentActivities,
        // 简化版趋势数据，实际应用中需要更复杂的时间序列分析
        trendData: Array.from({ length: 12 }, (_, i) => Math.floor(totalEnterprises * (i + 1) / 12))
      }
    });

  } catch (error) {
    console.error('获取AI生态统计信息错误:', error);
    res.status(500).json({
      success: false,
      message: '获取AI生态统计信息失败',
      error: error.message
    });
  }
});

// 辅助函数：计算时间间隔
function calculateTimeAgo(dateString) {
  if (!dateString) return '未知时间';

  const date = new Date(dateString);
  const now = new Date();
  const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));

  if (diffInHours < 1) {
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    if (diffInMinutes < 1) return '刚刚';
    return `${diffInMinutes}分钟前`;
  } else if (diffInHours < 24) {
    return `${diffInHours}小时前`;
  } else {
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}天前`;
  }
}

// 服务静态文件 - 添加前端文件服务
app.use(express.static(path.join(__dirname, 'frontend_demo')));

// 健康检查端点
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    service: 'Enterprise Management API'
  });
});

// 主页路由 - 仪表盘
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend_demo', 'ai_ecosystem_dashboard_real_data.html'));
});

// 仪表盘页面
app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend_demo', 'ai_ecosystem_dashboard_real_data.html'));
});

// 企业管理页面
app.get('/enterprise', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend_demo', 'index.html'));
});

// 数据导入导出页面
app.get('/import', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend_demo', 'index.html'));
});

// 通用路由 - 返回主页面，让前端路由处理
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend_demo', 'index.html'));
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`企业AI工作站服务器运行在端口 ${PORT}`);
  console.log(`仪表盘: http://localhost:${PORT}/dashboard`);
  console.log(`企业管理: http://localhost:${PORT}/enterprise`);
  console.log(`数据导入: http://localhost:${PORT}/import`);
  console.log(`API文档: http://localhost:${PORT}/api`);
  console.log(`健康检查: http://localhost:${PORT}/health`);
});

module.exports = app;