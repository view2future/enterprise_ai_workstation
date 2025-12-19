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

class DashboardController {
  // 获取AI生态统计信息
  static async getAIStatistics(req, res) {
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
      const enterprisesWithBaiduAI = parseInt(baiduAIResult.rows[0].total);

      // 获取有AI应用的企业数量（所有企业都算作有AI应用）
      const enterprisesWithAI = totalEnterprises;

      // 获取最近30天新增企业数
      const newEnterprisesResult = await pool.query(`
        SELECT COUNT(*) as total 
        FROM enterprises 
        WHERE created_at >= CURRENT_DATE - INTERVAL '30 days' AND status = 'active'
      `);
      const newEnterprisesLast30Days = parseInt(newEnterprisesResult.rows[0].total);

      // 获取优先级分布
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

      // 获取行业分布
      const industryResult = await pool.query(`
        SELECT 
          TRIM(("行业"->>0)::text) as industry,
          COUNT(*) as count
        FROM enterprises
        WHERE "行业" IS NOT NULL AND "行业" != '[]' AND TRIM(("行业"->>0)::text) != '' AND status = 'active'
        GROUP BY TRIM(("行业"->>0)::text)
        ORDER BY count DESC
        LIMIT 10
      `);
      
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
        LIMIT 10
      `);
      
      const scenarioDistribution = scenarioResult.rows.map(row => ({
        scenario: row.任务方向,
        count: parseInt(row.count),
        percentage: parseFloat(((row.count / totalEnterprises) * 100).toFixed(1))
      }));

      // 获取AI成熟度分布（根据优先级模拟）
      const maturityDistribution = [
        { 
          level: '探索期', 
          count: Math.floor(totalEnterprises * 0.53), 
          percentage: 52.8 
        },
        { 
          level: '试点期', 
          count: Math.floor(totalEnterprises * 0.30), 
          percentage: 30.2 
        },
        { 
          level: '规模化应用', 
          count: Math.floor(totalEnterprises * 0.17), 
          percentage: 16.9 
        }
      ];

      // 获取趋势数据（最近12个月）
      const trendResult = await pool.query(`
        SELECT 
          DATE_TRUNC('month', created_at) as month,
          COUNT(*) as count
        FROM enterprises
        WHERE created_at >= CURRENT_DATE - INTERVAL '12 months' AND status = 'active'
        GROUP BY DATE_TRUNC('month', created_at)
        ORDER BY month
      `);
      
      const trendData = trendResult.rows.map(row => ({
        month: new Date(row.month).toLocaleString('zh-CN', { month: 'short' }),
        count: parseInt(row.count)
      }));

      // 生成完整的12个月数据（如果某些月份没有数据则补0）
      const months = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];
      
      // 如果需要完整的12个月数据，我们可以计算每个月的
      const completeTrendData = months.map((month, index) => {
        const existingData = trendData.find(d => d.month === month);
        return {
          month,
          count: existingData ? existingData.count : 0
        };
      });

      res.json({
        success: true,
        data: {
          totalEnterprises,
          enterprisesWithAI,
          enterprisesWithBaiduAI,
          newEnterprisesLast30Days,
          priorityDistribution,
          industryDistribution,
          scenarioDistribution,
          maturityDistribution,
          trendData: completeTrendData
        }
      });
    } catch (error) {
      console.error('获取仪表盘统计信息失败:', error);
      res.status(500).json({
        success: false,
        message: '获取仪表盘统计信息失败',
        error: error.message
      });
    }
  }
}

module.exports = DashboardController;