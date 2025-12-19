const { Pool } = require('pg');
require('dotenv').config();

// 数据库连接池
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'enterprise_db',
  password: process.env.DB_PASSWORD || 'postgres',
  port: process.env.DB_PORT || 5432,
});

async function testDatabaseConnection() {
  try {
    console.log('正在测试数据库连接...');
    const result = await pool.query('SELECT NOW()');
    console.log('✅ 数据库连接成功:', result.rows[0]);
    return true;
  } catch (error) {
    console.error('❌ 数据库连接失败:', error.message);
    return false;
  }
}

async function testDatabaseTables() {
  try {
    console.log('\n正在测试数据库表...');
    
    // 检查企业表
    const enterprisesResult = await pool.query(`
      SELECT COUNT(*) as count 
      FROM information_schema.tables 
      WHERE table_name = 'enterprises'
    `);
    
    if (parseInt(enterprisesResult.rows[0].count) > 0) {
      console.log('✅ 企业表存在');
    } else {
      console.log('❌ 企业表不存在');
    }
    
    // 检查进展表
    const progressResult = await pool.query(`
      SELECT COUNT(*) as count 
      FROM information_schema.tables 
      WHERE table_name = 'enterprise_progress'
    `);
    
    if (parseInt(progressResult.rows[0].count) > 0) {
      console.log('✅ 进展表存在');
    } else {
      console.log('❌ 进展表不存在');
    }
    
    // 检查函数
    const functionsResult = await pool.query(`
      SELECT COUNT(*) as count 
      FROM information_schema.routines 
      WHERE routine_name = 'search_enterprises_fulltext'
    `);
    
    if (parseInt(functionsResult.rows[0].count) > 0) {
      console.log('✅ 搜索函数存在');
    } else {
      console.log('❌ 搜索函数不存在');
    }
    
    return true;
  } catch (error) {
    console.error('❌ 检查数据库表失败:', error.message);
    return false;
  }
}

async function testSampleData() {
  try {
    console.log('\n正在测试示例数据...');
    
    // 插入一个测试企业
    const testEnterprise = {
      企业名称: '测试企业-' + Date.now(),
      飞桨文心: '飞桨',
      线索入库时间: '2025Q1',
      伙伴等级: '认证级',
      生态AI产品: '2025-10 智能客服产品',
      优先级: 'P0',
      base: '北京',
      注册资本: 1000,
      参保人数: 50,
      企业背景: '这是一家测试企业，用于验证系统功能。' + 'x'.repeat(40),
      行业: JSON.stringify(['人工智能', '软件开发']),
      任务方向: '智能问答、OCR识别',
      联系人信息: '张三（技术总监）13800138000',
      使用场景: '用于测试企业管理系统的所有功能模块，验证CRUD操作的正确性。'
    };
    
    const insertResult = await pool.query(`
      INSERT INTO enterprises (
        企业名称, 飞桨_文心, 线索入库时间, 伙伴等级, 生态AI产品, 优先级, 
        base, 注册资本, 参保人数, 企业背景, 行业, 任务方向, 
        联系人信息, 使用场景
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
      RETURNING id, 企业名称
    `, [
      testEnterprise.企业名称,
      testEnterprise.飞桨文心,
      testEnterprise.线索入库时间,
      testEnterprise.伙伴等级,
      testEnterprise.生态AI产品,
      testEnterprise.优先级,
      testEnterprise.base,
      testEnterprise.注册资本,
      testEnterprise.参保人数,
      testEnterprise.企业背景,
      testEnterprise.行业,
      testEnterprise.任务方向,
      testEnterprise.联系人信息,
      testEnterprise.使用场景
    ]);
    
    console.log('✅ 成功插入测试企业:', insertResult.rows[0]);
    
    // 测试添加进展
    const progressResult = await pool.query(`
      INSERT INTO enterprise_progress (enterprise_id, content, progress_type) 
      VALUES ($1, $2, $3) RETURNING id
    `, [insertResult.rows[0].id, '这是测试进展内容', '本周进展']);
    
    console.log('✅ 成功添加测试进展');
    
    // 验证数据
    const verifyResult = await pool.query(`
      SELECT * FROM enterprises WHERE id = $1
    `, [insertResult.rows[0].id]);
    
    console.log('✅ 数据验证成功，读取到企业:', verifyResult.rows[0].企业名称);
    
    // 清理测试数据
    await pool.query('DELETE FROM enterprise_progress WHERE enterprise_id = $1', [insertResult.rows[0].id]);
    await pool.query('DELETE FROM enterprises WHERE id = $1', [insertResult.rows[0].id]);
    
    console.log('✅ 测试数据清理完成');
    
    return true;
  } catch (error) {
    console.error('❌ 测试示例数据失败:', error.message);
    return false;
  }
}

async function runTests() {
  console.log('🧪 开始测试企业管理系统数据库...');
  
  const dbConnection = await testDatabaseConnection();
  const dbTables = await testDatabaseTables();
  const sampleData = await testSampleData();
  
  console.log('\n📋 测试结果:');
  console.log(`数据库连接: ${dbConnection ? '✅ 通过' : '❌ 失败'}`);
  console.log(`数据库表: ${dbTables ? '✅ 通过' : '❌ 失败'}`);
  console.log(`示例数据: ${sampleData ? '✅ 通过' : '❌ 失败'}`);
  
  if (dbConnection && dbTables && sampleData) {
    console.log('\n🎉 所有测试通过！企业管理系统数据库已准备就绪。');
  } else {
    console.log('\n❌ 部分测试失败，请检查配置。');
  }
  
  await pool.end();
}

runTests().catch(console.error);