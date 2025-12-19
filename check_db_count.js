require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DB_USER || 'wangyu94',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'enterprise_db',
  password: process.env.DB_PASSWORD || '',
  port: process.env.DB_PORT || 5432,
});

async function countEnterprises() {
  try {
    const result = await pool.query('SELECT COUNT(*) as total FROM enterprises');
    console.log('📊 数据库中的企业总数:', result.rows[0].total);
    
    const chengduResult = await pool.query('SELECT COUNT(*) as total FROM enterprises WHERE base = $1', ['成都']);
    console.log('🏢 成都企业数量:', chengduResult.rows[0].total);
    
    const feijiangResult = await pool.query('SELECT COUNT(*) as total FROM enterprises WHERE 飞桨_文心 = $1', ['飞桨']);
    console.log('🔥 使用飞桨技术的企业数量:', feijiangResult.rows[0].total);
    
    const wenxinResult = await pool.query('SELECT COUNT(*) as total FROM enterprises WHERE 飞桨_文心 = $1', ['文心']);
    console.log('💡 使用文心技术的企业数量:', wenxinResult.rows[0].total);
    
    const p0Result = await pool.query('SELECT COUNT(*) as total FROM enterprises WHERE 优先级 = $1', ['P0']);
    console.log('🎯 P0优先级企业数量:', p0Result.rows[0].total);
    
    await pool.end();
  } catch (error) {
    console.error('查询失败:', error.message);
  }
}

countEnterprises();