require('dotenv').config();
const { Pool } = require('pg');

// 数据库连接池
const pool = new Pool({
  user: process.env.DB_USER || 'wangyu94',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'enterprise_db',
  password: process.env.DB_PASSWORD || '',
  port: process.env.DB_PORT || 5432,
});

// 成都企业名称数据
const companyPrefixes = [
  '成都智汇', '锦江科技', '武侯创新', '成华智能', '青羊数据', 
  '金牛云', '高新未来', '天府创新', '温江科技', '龙泉驿', 
  '新都智联', '双流航空', '郫都数字', '新津创新', '都江堰智慧',
  '彭州科技', '邛崃智创', '崇州数字', '金堂创新', '大邑科技',
  '蒲江智联', '简阳未来', '东部新区', '青白江科创', '天府软件'
];

const companySuffixes = [
  '科技有限公司', '智能科技有限公司', '数据服务有限公司', 
  '网络科技有限公司', '软件开发有限公司', '信息科技有限公司',
  '人工智能有限公司', '云计算有限公司', '大数据有限公司',
  '物联网科技有限公司', '区块链科技有限公司', '智能制造有限公司'
];

const industries = [
  ['人工智能', '软件开发'], ['云计算', '大数据'], ['物联网', '智能硬件'],
  ['金融科技', '区块链'], ['生物医药', '健康科技'], ['智能制造', '工业互联网'],
  ['教育科技', '在线学习'], ['农业科技', '智慧农业'], ['物流科技', '智能配送'],
  ['环保科技', '清洁能源'], ['文旅科技', '数字娱乐'], ['交通科技', '智慧城市']
];

const taskDirections = [
  '智能问答系统', '计算机视觉', 'OCR识别', '语音识别', '自然语言处理',
  '数据分析挖掘', '智能推荐系统', '图像识别处理', '语音合成技术', '预测性维护',
  '智能客服系统', '工业视觉检测', '智能监控系统', '自动驾驶感知', '智慧城市管理'
];

const contactPositions = ['总经理', '技术总监', '产品总监', 'CTO', '首席执行官', '运营总监'];

const companyBackgrounds = [
  '专注于AI技术研发的创新型企业，致力于为各行业提供智能化解决方案。',
  '领先的云计算服务提供商，为企业数字化转型提供全方位技术支撑。',
  '在大数据分析领域有深厚技术积累，服务众多知名客户。',
  '专注于智能制造领域的技术研发，助力传统制造业转型升级。',
  '在医疗健康科技领域具有领先地位，与多家医院建立合作关系。',
  '专业从事物联网技术开发，为智慧城市提供核心技术支持。',
  '在人工智能和机器学习领域有丰富实践经验，获得多项技术专利。',
  '致力于教育科技产品研发，为教育行业提供数字化转型方案。',
  '专注于金融科技服务，为金融机构提供风险控制和智能决策支持。',
  '在区块链技术应用方面有独特优势，服务多个行业客户。',
  '提供云计算和大数据一体化解决方案，帮助企业实现数据价值最大化。',
  '在智能硬件和物联网领域有深厚技术实力，产品覆盖多个行业应用。'
];

// 生成随机数据的函数
function getRandomElement(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function generateRandomData() {
  const companyName = getRandomElement(companyPrefixes) + getRandomElement(companySuffixes);
  const techType = Math.random() > 0.5 ? '飞桨' : '文心';
  const quarter = `2025Q${Math.floor(Math.random() * 4) + 1}`;
  const level = Math.random() > 0.7 ? '认证级' : Math.random() > 0.4 ? '优选级' : '无';
  const priority = Math.random() > 0.8 ? 'P0' : Math.random() > 0.5 ? 'P1' : 'P2';
  const registeredCapital = Math.floor(Math.random() * 50000) + 100; // 100万到50100万
  const employeeCount = Math.floor(Math.random() * 2000) + 10; // 10到2010人
  const industry = getRandomElement(industries);
  const taskDirection = getRandomElement(taskDirections);
  const contactName = ['张', '李', '王', '刘', '陈', '杨', '赵', '黄', '周', '吴'][Math.floor(Math.random() * 10)] + '先生/女士';
  const contactPhone = '1' + Math.floor(Math.random() * 9).toString() + Math.floor(100000000 + Math.random() * 900000000).toString();
  const contactPosition = getRandomElement(contactPositions);
  const background = getRandomElement(companyBackgrounds) + '公司拥有一支高素质的技术团队，持续推动技术创新。';
  const useScenario = `公司专注于${taskDirection}技术的研发与应用，目前已在${['金融', '医疗', '教育', '制造', '政务', '零售'][Math.floor(Math.random() * 6)]}行业成功实施了多个项目。`;

  return {
    企业名称: companyName,
    飞桨文心: techType,
    线索入库时间: quarter,
    伙伴等级: level,
    生态AI产品: Math.random() > 0.3 ? `${new Date().getFullYear()}-${Math.floor(Math.random() * 12) + 1} ${taskDirection}` : '',
    优先级: priority,
    base: '成都',
    注册资本: registeredCapital,
    参保人数: employeeCount,
    企业背景: background,
    行业: JSON.stringify(industry),
    任务方向: taskDirection,
    联系人信息: `${contactName}（${contactPosition}）${contactPhone}`,
    使用场景: useScenario
  };
}

async function insertChengduEnterprises() {
  console.log('🏢 开始添加100家成都企业数据...');

  try {
    let successCount = 0;
    let failCount = 0;

    for (let i = 0; i < 100; i++) {
      try {
        const data = generateRandomData();
        
        const result = await pool.query(`
          INSERT INTO enterprises (
            企业名称, 飞桨_文心, 线索入库时间, 伙伴等级, 生态AI产品, 优先级,
            base, 注册资本, 参保人数, 企业背景, 行业, 任务方向,
            联系人信息, 使用场景
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
          ON CONFLICT (企业名称) DO NOTHING
          RETURNING id
        `, [
          data.企业名称,
          data.飞桨文心,
          data.线索入库时间,
          data.伙伴等级,
          data.生态AI产品,
          data.优先级,
          data.base,
          data.注册资本,
          data.参保人数,
          data.企业背景,
          data.行业,
          data.任务方向,
          data.联系人信息,
          data.使用场景
        ]);
        
        if (result.rows.length > 0) {
          console.log(`✅ 第${i+1}家企业: ${data.企业名称}`);
          successCount++;
          
          // 为部分企业添加进展记录
          if (Math.random() > 0.5) { // 50%的企业有进展记录
            const progressTypes = ['本周进展', '上周进展'];
            const progressContent = `项目进展顺利，完成了${getRandomElement(['需求分析', '系统设计', '开发实现', '测试验证', '部署上线', '产品优化'])}阶段的工作，${getRandomElement(['客户反馈良好', '技术难题已解决', '性能优化完成', '团队协作高效', '项目按计划进行', '获得客户认可'])}。`;
            
            await pool.query(`
              INSERT INTO enterprise_progress (enterprise_id, content, progress_type)
              VALUES ($1, $2, $3)
            `, [result.rows[0].id, progressContent, getRandomElement(progressTypes)]);
          }
        } else {
          console.log(`ℹ️  企业已存在: ${data.企业名称} (跳过)`);
          failCount++;
        }
      } catch (error) {
        console.error(`❌ 添加第${i+1}家企业失败:`, error.message);
        failCount++;
      }
    }

    // 验证数据
    const countResult = await pool.query('SELECT COUNT(*) as total FROM enterprises WHERE base = $1', ['成都']);
    console.log(`\n📊 成都企业总数: ${countResult.rows[0].total}`);
    
    const allCountResult = await pool.query('SELECT COUNT(*) as total FROM enterprises');
    console.log(`📊 企业总数: ${allCountResult.rows[0].total}`);
    
    const progressCountResult = await pool.query('SELECT COUNT(*) as total FROM enterprise_progress');
    console.log(`📊 进展记录总数: ${progressCountResult.rows[0].total}`);

    console.log(`\n🎉 成都企业数据添加完成！`);
    console.log(`✅ 成功: ${successCount} 家`);
    console.log(`❌ 失败/已存在: ${failCount} 家`);
    
    if (successCount > 0) {
      console.log(`\n🏠 访问 http://localhost:3001 查看新增的成都企业数据`);
    }

  } catch (error) {
    console.error('❌ 添加成都企业数据失败:', error.message);
    throw error;
  }
}

insertChengduEnterprises()
  .then(() => {
    console.log('\n✅ 成都企业数据初始化成功！');
    process.exit(0);
  })
  .catch(error => {
    console.error('\n❌ 成都企业数据初始化失败:', error);
    process.exit(1);
  });