/**
 * 仪表盘控制器
 * 处理仪表盘相关的统计请求
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

// 获取AI生态统计信息
const getAIStatistics = async (req, res) => {
  try {
    // 获取企业总数
    const totalResult = await pool.query('SELECT COUNT(*) as total FROM enterprises WHERE status = \'active\'');
    const totalEnterprises = parseInt(totalResult.rows[0].total);

    // 获取使用飞桨/文心的企业数量
    const baiduAIResult = await pool.query(`
      SELECT COUNT(*) as total 
      FROM enterprises 
      WHERE "飞桨_文心" IS NOT NULL AND "飞桨_文心" != '' AND status = 'active'
    `);
    const baiduAICoverage = parseInt(baiduAIResult.rows[0].total);

    // 获取P0优先级企业（视为深度合作企业）
    const deepCooperationResult = await pool.query(`
      SELECT COUNT(*) as total 
      FROM enterprises 
      WHERE "优先级" = 'P0' AND status = 'active'
    `);
    const deepCooperation = parseInt(deepCooperationResult.rows[0].total);

    // 获取各行业分布
    const industryResult = await pool.query(`
      SELECT 
        TRIM(("行业"->>0)::text) as industry,
        COUNT(*) as count
      FROM enterprises
      WHERE "行业" IS NOT NULL AND "行业" != '[]' AND TRIM(("行业"->>0)::text) != '' AND status = 'active'
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
      WHERE "任务方向" IS NOT NULL AND "任务方向" != '' AND status = 'active'
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
      WHERE "优先级" IS NOT NULL AND status = 'active'
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
      WHERE "优先级" = 'P0' AND status = 'active'
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
      WHERE status = 'active'
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

    // 获取趋势数据（最近12个月）
    const trendQuery = `
      SELECT 
        DATE_TRUNC('month', created_at) as month,
        COUNT(*) as count
      FROM enterprises
      WHERE created_at >= CURRENT_DATE - INTERVAL '12 months' AND status = 'active'
      GROUP BY DATE_TRUNC('month', created_at)
      ORDER BY month
    `;
    
    const trendResult = await pool.query(trendQuery);
    
    // 生成完整的12个月数据（如果某些月份没有数据则补0）
    const now = new Date();
    const months = [];
    for (let i = 11; i >= 0; i--) {
      const monthDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthStr = monthDate.toLocaleString('zh-CN', { month: 'short' });
      months.push({
        month: monthStr,
        count: 0
      });
    }
    
    // 填充实际数据
    trendResult.rows.forEach(row => {
      const monthStr = new Date(row.month).toLocaleString('zh-CN', { month: 'short' });
      const monthObj = months.find(m => m.month === monthStr);
      if (monthObj) {
        monthObj.count = parseInt(row.count);
      }
    });
    
    const trendData = months;

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
        trendData
      }
    });

  } catch (error) {
    console.error('获取AI生态统计信息失败:', error);
    res.status(500).json({
      success: false,
      message: '获取AI生态统计信息失败',
      error: error.message
    });
  }
};

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

module.exports = {
  getAIStatistics
};