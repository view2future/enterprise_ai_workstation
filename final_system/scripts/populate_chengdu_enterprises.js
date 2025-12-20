const { Pool } = require('pg');
require('dotenv').config();

// 数据库连接
const pool = new Pool({
  user: process.env.DB_USER || 'wangyu94',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'enterprise_ai_db',
  password: process.env.DB_PASSWORD || '',
  port: process.env.DB_PORT || 5432,
});

// 成都企业名称数据
const companyPrefixes = [
  '成都智汇', '锦江科技', '武侯创新', '成华智能', '青羊数据', 
  '金牛云', '高新未来', '天府创新', '温江科技', '龙泉驿', 
  '新都智联', '双流航空', '郫都数字', '新津创新', '都江堰智慧',
  '彭州科技', '邛崃智创', '崇州数字', '金堂创新', '大邑科技',
  '蒲江智联', '简阳未来', '东部新区', '青白江科创', '天府软件',
  '青羊数据', '锦江软件', '武侯数据', '成华云', '金牛科技',
  '高新智', '天府软件', '温江云', '龙泉驿科技', '新都智',
  '双流航空', '郫都数字', '新津创新', '青白江科创', '都江堰智慧',
  '彭州科技', '邛崃智创', '崇州数字', '金堂创新', '大邑科技',
  '蒲江智联', '简阳未来', '东部新区', '天府创新', '锦江科技'
];

const companySuffixes = [
  '科技有限公司', '智能科技有限公司', '数据服务有限公司', 
  '网络科技有限公司', '软件开发有限公司', '信息科技有限公司',
  '人工智能有限公司', '云计算有限公司', '大数据有限公司',
  '物联网科技有限公司', '区块链科技有限公司', '智能制造有限公司',
  '创新科技有限公司', '智慧科技有限公司', '科创有限公司',
  '信息技术有限公司', '科技发展有限公司', '智能系统有限公司',
  '数字科技有限公司', '软件科技有限公司', '科技服务有限公司',
  '智能解决方案有限公司', '数据智能有限公司', '云端科技有限公司',
  '智慧数据有限公司', '智能创新有限公司', '科技研发有限公司',
  '智慧物联科技有限公司', '数字智能科技有限公司', '科技智造有限公司'
];

const industries = [
  ['人工智能', '软件开发'], ['云计算', '大数据'], ['物联网', '智能硬件'],
  ['金融科技', '区块链'], ['生物医药', '健康科技'], ['智能制造', '工业互联网'],
  ['教育科技', '在线学习'], ['农业科技', '智慧农业'], ['物流科技', '智能配送'],
  ['环保科技', '清洁能源'], ['文旅科技', '数字娱乐'], ['交通科技', '智慧城市'],
  ['医疗科技', '智能诊疗'], ['安防科技', '智能监控'], ['能源科技', '智能电网']
];

const taskDirections = [
  '智能问答系统', '计算机视觉', 'OCR识别', '语音识别', '自然语言处理',
  '数据分析挖掘', '智能推荐系统', '图像识别处理', '语音合成技术', '预测性维护',
  '智能客服系统', '工业视觉检测', '智能监控系统', '自动驾驶感知', '智慧城市管理'
];

const contactPositions = [
  '总经理', '技术总监', '产品总监', 'CTO', '首席执行官', '运营总监',
  '首席技术官', '首席信息官', '首席运营官', '首席产品官', '首席营销官',
  '研发总监', '项目总监', '业务总监', '解决方案总监', '创新总监'
];

const techTypes = ['飞桨', '文心'];
const priorityLevels = ['P0', 'P1', 'P2'];
const partnerLevels = ['认证级', '优选级', '无'];
const regions = ['西南', '华南', '华北', '华中', '华东', '西北'];

// 生成随机数据的函数
function getRandomElement(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function generateRandomEnterprise(id) {
  const companyName = getRandomElement(companyPrefixes) + getRandomElement(companySuffixes);
  const techType = getRandomElement(techTypes);
  const quarter = `2025Q${Math.floor(Math.random() * 4) + 1}`;
  const level = getRandomElement(partnerLevels);
  const priority = getRandomElement(priorityLevels);
  const region = '西南'; // 成都企业
  const registeredCapital = Math.floor(Math.random() * 50000) + 100; // 100万到50100万
  const employeeCount = Math.floor(Math.random() * 2000) + 10; // 10到2010人
  const industry = getRandomElement(industries);
  const taskDirection = getRandomElement(taskDirections);
  const contactName = ['张', '李', '王', '刘', '陈', '杨', '赵', '黄', '周', '吴'][Math.floor(Math.random() * 10)] + '先生/女士';
  const contactPhone = '1' + Math.floor(Math.random() * 9).toString() + Math.floor(100000000 + Math.random() * 900000000).toString();
  const contactPosition = getRandomElement(contactPositions);
  const backgroundStarters = [
    '专注于AI技术研发的创新型企业，致力于为各行业提供智能化解决方案。公司拥有一支高素质的技术团队，持续推动技术创新，',
    '领先的云计算服务提供商，为企业数字化转型提供全方位技术支撑。具备丰富的行业实施经验，服务众多知名企业，',
    '在大数据分析领域有深厚技术积累，服务众多知名客户，具备强大的数据处理和分析能力，',
    '专注于智能制造领域的技术研发，助力传统制造业转型升级，提供完整的智能制造解决方案，',
    '在医疗健康科技领域具有领先地位，与多家医院建立合作关系，推动医疗信息化发展，',
    '专业从事物联网技术开发，为智慧城市提供核心技术支持，技术实力雄厚，',
    '在人工智能和机器学习领域有丰富实践经验，获得多项技术专利，技术领先优势明显，',
    '致力于教育科技产品研发，为教育行业提供数字化转型方案，助力教育现代化发展，',
    '专注于金融科技服务，为金融机构提供风险控制和智能决策支持，技术成熟可靠，',
    '在区块链技术应用方面有独特优势，服务多个行业客户，具备丰富的区块链项目实施经验，',
    '提供云计算和大数据一体化解决方案，帮助企业实现数据价值最大化，服务完善，',
    '在智能硬件和物联网领域有深厚技术实力，产品覆盖多个行业应用，市场前景广阔，',
    '专注于智慧城市建设，为政府和企业客户提供智能化解决方案，推动城市数字化转型，',
    '在工业互联网领域有丰富经验，服务众多制造企业，助力传统制造业智能化升级，',
    '在网络安全领域有深厚积累，为企业提供全方位的网络安全防护服务，保障信息安全，'
  ];
  const background = getRandomElement(backgroundStarters) + 
    '在AI技术生态合作方面，公司积极参与百度技术生态，与百度建立了良好的合作关系，在飞桨/文心等技术领域有多项合作成果。';
  
  const useScenarios = [
    '为金融行业提供智能风控解决方案',
    '在教育领域开发AI教学助手',
    '为制造业实现智能质检系统',
    '在医疗领域开展智能诊断辅助',
    '为政务系统提供智能客服',
    '在零售行业部署智能推荐系统',
    '为物流行业开发路径优化系统',
    '在农业领域实现智能种植管理',
    '为交通行业提供智能调度系统',
    '在安防领域部署智能监控系统'
  ];

  // 生成BMO互动经历
  const bmoActivities = [];
  const activityTypes = ['技术会议', '开发者大会', '培训活动', '产品发布会', '商务交流', '合作签约仪式', '技术沙龙', '行业论坛'];
  const activityResults = [
    '深入了解了最新AI技术发展趋势，获得了宝贵的技术见解',
    '与百度技术专家深入交流，解决了关键技术难点',
    '建立新的合作联系，推进了项目进展',
    '学习了先进的产品设计理念和开发方法',
    '明确了未来技术路线和应用场景',
    '签署了合作协议，开启了新的合作篇章',
    '分享了实践经验，获得了行业认可'
  ];

  // 随机生成1-3个BMO活动记录
  const activityCount = Math.floor(Math.random() * 3) + 1;
  for (let i = 0; i < activityCount; i++) {
    const months = ['03', '05', '06', '07', '08', '09', '10', '11'];
    const month = getRandomElement(months);
    const day = String(Math.floor(Math.random() * 28) + 1).padStart(2, '0');
    
    bmoActivities.push({
      活动名称: `${getRandomElement(['百度AI', '飞桨', '文心', 'BMO'])}${getRandomElement(['开发者', '技术', '生态', '合作'])}${getRandomElement(['大会', '峰会', '沙龙', '交流会'])}2025`,
      时间: `2025-${month}-${day}`,
      类型: getRandomElement(activityTypes),
      参与人员: [`${getRandomElement(['张', '李', '王', '刘'])}${getRandomElement(['总', '董', '技', '产'])}（${getRandomElement(['总经理', '技术总监', '产品总监', 'CTO', '业务总监'])}）`],
      成果: getRandomElement(activityResults)
    });
  }

  const recentActivity = bmoActivities[bmoActivities.length - 1] || null;
  const activityFrequency = getRandomElement(['高', '中', '低']);
  const activityPreferences = [
    getRandomElement(['技术会议', '开发者大会', '培训活动', '产品发布会', '商务交流']),
    getRandomElement(['技术交流', '产品体验', '商务洽谈', '解决方案展示'])
  ];

  // 生成合作满意度（70-98之间）
  const satisfaction = (Math.random() * 28 + 70).toFixed(1);

  // 生成历史合作项目
  const projectTypes = ['智能客服', 'OCR识别', '图像处理', '语音识别', 'NLP应用', '数据分析', '预测模型'];
  const projectResults = [
    '显著提升效率',
    '降低运营成本',
    '改善用户体验',
    '提高服务质量',
    '增强竞争优势',
    '实现技术突破'
  ];

  const historyProjects = [];
  const projectCount = Math.floor(Math.random() * 3) + 1; // 1-3个项目
  for (let i = 0; i < projectCount; i++) {
    const monthsDiff = Math.floor(Math.random() * 12) + 1;
    const startDate = new Date(2024, new Date().getMonth() - monthsDiff, 1);
    const endDate = new Date(startDate.getTime() + Math.random() * 6 * 30 * 24 * 60 * 60 * 1000);
    
    historyProjects.push({
      项目名称: `${getRandomElement(['智能', '智慧', '数字', '云'])}${getRandomElement(['客服', '质检', '分析', '识别', '监管'])}系统`,
      开始时间: startDate.toISOString().split('T')[0],
      完成时间: endDate.toISOString().split('T')[0],
      成果: `${getRandomElement(['效率提升', '成本降低', '质量改善', '服务优化'])}${Math.floor(Math.random() * 50) + 20}%`
    });
  }

  return {
    企业名称: companyName,
    飞桨_文心: techType,
    线索入库时间: quarter,
    伙伴等级: level,
    生态AI产品: Math.random() > 0.3 ? `${new Date().getFullYear()}-${Math.floor(Math.random() * 12) + 1} ${taskDirection}` : '',
    优先级: priority,
    base: '成都',
    所在区域: region,
    注册资本: registeredCapital,
    参保人数: employeeCount,
    企业背景: background,
    行业: JSON.stringify(industry),
    任务方向: taskDirection,
    联系人信息: `${contactName}（${contactPosition}）${contactPhone}`,
    使用场景: getRandomElement(useScenarios),
    BMO互动活动: JSON.stringify(bmoActivities),
    最近BMO活动: recentActivity ? JSON.stringify(recentActivity) : null,
    活动参与频次: activityFrequency,
    活动偏好: JSON.stringify(activityPreferences),
    合作满意度: parseFloat(satisfaction),
    历史合作项目: JSON.stringify(historyProjects)
  };
}

async function populateEnterprises() {
  console.log('🏢 开始填充500家成都企业数据...');

  try {
    // 生成500家企业的数据
    const enterprises = [];
    for (let i = 0; i < 500; i++) {
      enterprises.push(generateRandomEnterprise(i + 1));
    }

    // 批量插入数据
    const batchSize = 50;
    for (let i = 0; i < enterprises.length; i += batchSize) {
      const batch = enterprises.slice(i, i + batchSize);
      
      // 构建查询语句
      const placeholders = [];
      const values = [];
      
      for (let j = 0; j < batch.length; j++) {
        const enterprise = batch[j];
        // 计算当前批次的参数索引
        const baseIndex = j * 15 + 1; // 15个字段
        
        placeholders.push(`($${baseIndex}, $${baseIndex + 1}, $${baseIndex + 2}, $${baseIndex + 3}, $${baseIndex + 4}, $${baseIndex + 5}, $${baseIndex + 6}, $${baseIndex + 7}, $${baseIndex + 8}, $${baseIndex + 9}, $${baseIndex + 10}, $${baseIndex + 11}, $${baseIndex + 12}, $${baseIndex + 13}, $${baseIndex + 14})`);
        
        values.push(
          enterprise.企业名称,
          enterprise.飞桨_文心,
          enterprise.线索入库时间,
          enterprise.伙伴等级,
          enterprise.生态AI产品,
          enterprise.优先级,
          enterprise.base,
          enterprise.所在区域,
          enterprise.注册资本,
          enterprise.参保人数,
          enterprise.企业背景,
          enterprise.行业,
          enterprise.任务方向,
          enterprise.联系人信息,
          enterprise.使用场景
        );
      }
      
      const query = `
        INSERT INTO enterprises (
          企业名称, 飞桨_文心, 线索入库时间, 伙伴等级, 生态AI产品, 优先级,
          base, 所在区域, 注册资本, 参保人数, 企业背景, 行业, 任务方向, 
          联系人信息, 使用场景
        ) VALUES ${placeholders.join(', ')}
        ON CONFLICT (企业名称) DO NOTHING
      `;
      
      await pool.query(query, values);
      console.log(`✅ 已插入第 ${i + 1} - ${Math.min(i + batchSize, enterprises.length)} 家企业`);
    }

    // 更新BMO相关字段（因为它们在之前的表结构中未被包含）
    // 首先确保字段存在
    await pool.query(`
      ALTER TABLE enterprises ADD COLUMN IF NOT EXISTS "BMO互动活动" JSONB,
      ADD COLUMN IF NOT EXISTS "最近BMO活动" JSONB,
      ADD COLUMN IF NOT EXISTS "活动参与频次" VARCHAR(20),
      ADD COLUMN IF NOT EXISTS "活动偏好" JSONB,
      ADD COLUMN IF NOT EXISTS "合作满意度" DECIMAL(5,2),
      ADD COLUMN IF NOT EXISTS "历史合作项目" JSONB
    `);

    // 为已存在的企业更新BMO字段
    for (const enterprise of enterprises) {
      await pool.query(`
        UPDATE enterprises 
        SET 
          "BMO互动活动" = $1,
          "最近BMO活动" = $2,
          "活动参与频次" = $3,
          "活动偏好" = $4,
          "合作满意度" = $5,
          "历史合作项目" = $6
        WHERE "企业名称" = $7
      `, [
        enterprise.BMO互动活动,
        enterprise.最近BMO活动,
        enterprise.活动参与频次,
        enterprise.活动偏好,
        enterprise.合作满意度,
        enterprise.历史合作项目,
        enterprise.企业名称
      ]);
    }

    // 验证数据
    const countResult = await pool.query('SELECT COUNT(*) as total FROM enterprises WHERE base = $1', ['成都']);
    console.log(`\n📊 成都企业总数: ${countResult.rows[0].total}`);
    
    const allCountResult = await pool.query('SELECT COUNT(*) as total FROM enterprises');
    console.log(`📊 企业总数: ${allCountResult.rows[0].total}`);

    console.log('\n🎉 成都企业数据填充完成！');
    
  } catch (error) {
    console.error('❌ 成都企业数据填充失败:', error.message);
    throw error;
  } finally {
    await pool.end();
  }
}

populateEnterprises()
  .then(() => {
    console.log('\n✅ 500家成都企业数据填充成功！');
    process.exit(0);
  })
  .catch(error => {
    console.error('\n❌ 500家成都企业数据填充失败:', error);
    process.exit(1);
  });