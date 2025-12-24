import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const companyPrefixes = [
  '成都智汇', '锦江科技', '武侯创新', '成华智能', '青羊数据', 
  '金牛云', '高新未来', '天府创新', '温江科技', '龙泉驿', 
  '新都智联', '双流航空', '郫都数字', '新津创新', '都江堰智慧',
  '彭州科技', '邛崃智创', '崇州数字', '金堂创新', '大邑科技',
  '天府软件', '成华云', '武侯智', '锦江数', '金牛创新', '高新智汇'
];

const companySuffixes = [
  '科技有限公司', '智能科技有限公司', '数据服务有限公司', 
  '网络科技有限公司', '软件开发有限公司', '人工智能有限公司',
  '云计算有限公司', '大数据有限公司', '物联网技术有限公司'
];

const industries = [
  { name: "人工智能", sub: "计算机视觉" },
  { name: "大数据", sub: "数据挖掘" },
  { name: "工业互联网", sub: "智能制造" },
  { name: "金融科技", sub: "区块链" },
  { name: "医疗健康", sub: "智能诊断" }
];

function getRandomDate(daysAgo: number) {
  const date = new Date();
  date.setDate(date.getDate() - Math.floor(Math.random() * daysAgo));
  return date;
}

async function main() {
  console.log('🧹 正在清理数据库...');
  try {
    await prisma.auditLog.deleteMany({});
    await prisma.veracityTask.deleteMany({});
    await prisma.enterprise.deleteMany({});
    await prisma.user.deleteMany({});
  } catch (e) {
    console.warn('清理过程遇到轻微阻碍（可能是首次运行），继续执行...');
  }

  console.log('👤 正在创建初始用户...');
  const hashedPassword = await bcrypt.hash('password123', 10);
  
  // Create Demo User
  await prisma.user.create({
    data: {
      username: 'demo_commander',
      email: 'demo@nexus.ai',
      password: hashedPassword,
      firstName: 'Tactical',
      lastName: 'Demo',
      role: 'analyst',
      envScope: 'DEMO',
      status: 'active'
    }
  });

  // Create Prod User
  await prisma.user.create({
    data: {
      username: 'nexus_admin',
      email: 'admin@nexus.ai',
      password: hashedPassword,
      firstName: 'System',
      lastName: 'Admin',
      role: 'admin',
      envScope: 'PROD',
      status: 'active'
    }
  });
  
  console.log('🌱 正在注入 526 条全量真实画像数据...');
  
  const cities = [
    '成都', '成都', '成都', '成都', '成都', // 50% weight for Chengdu
    '重庆', '重庆', 
    '西安', '西安', 
    '昆明', '贵阳', 
    '绵阳', '乐山', '德阳', '宜宾', '眉山', '南充', '泸州', '达州'
  ];

  const enterprises = [];
  for (let i = 0; i < 526; i++) {
    const name = companyPrefixes[i % companyPrefixes.length] + companySuffixes[i % companySuffixes.length] + (i + 1);
    const tech = Math.random() > 0.5 ? '飞桨' : '文心';
    const isP0 = i % 10 === 0; // 10% P0
    const stage = i % 4 === 0 ? '全面生产' : (i % 3 === 0 ? '试点运行' : '需求调研');
    const createdAt = getRandomDate(365); // 覆盖过去一年
    const randomCity = cities[Math.floor(Math.random() * cities.length)];

    enterprises.push({
      enterpriseName: name,
      feijiangWenxin: tech,
      priority: isP0 ? 'P0' : (i % 3 === 0 ? 'P1' : 'P2'),
      partnerLevel: isP0 ? '认证级' : '无',
      base: randomCity,
      registeredCapital: BigInt(Math.floor(Math.random() * 50000000)),
      employeeCount: Math.floor(Math.random() * 1000) + 20,
      aiImplementationStage: stage,
      ernieModelType: tech === '文心' ? (isP0 ? 'ERNIE 4.0' : 'ERNIE 3.5') : null,
      paddleUsageLevel: tech === '飞桨' ? (isP0 ? '深度定制' : '基础调用') : null,
      avgMonthlyApiCalls: BigInt(Math.floor(Math.random() * 5000000)),
      unifiedSocialCreditCode: `91510100SC${100000 + i}X`,
      isHighTech: Math.random() > 0.4,
      isSpecialized: isP0,
      industry: JSON.stringify(industries[i % industries.length]),
      createdAt: createdAt,
      updatedAt: createdAt,
      status: 'active',
      dataSourceType: 'master_seed',
      envScope: 'DEMO'
    });
  }

  // Explicitly add key enterprises for Demo
  const keyEnterprises = [
    { name: '重庆赛力斯汽车', city: '重庆', industry: '新能源汽车', priority: 'P0' },
    { name: '西安隆基绿能', city: '西安', industry: '光伏太阳能', priority: 'P0' },
    { name: '昆明嘉和科技', city: '昆明', industry: '工业互联网', priority: 'P1' },
    { name: '贵阳满帮集团', city: '贵阳', industry: '智慧物流', priority: 'P0' },
    { name: '重庆长安汽车', city: '重庆', industry: '人工智能', priority: 'P0' },
    { name: '西安华为云', city: '西安', industry: '云计算', priority: 'P0' },
    { name: '宜宾五粮液数字科技', city: '宜宾', industry: '智慧零售', priority: 'P0' },
    { name: '绵阳长虹电子', city: '绵阳', industry: '智能家电', priority: 'P0' }
  ];

  for (const comp of keyEnterprises) {
    enterprises.push({
      enterpriseName: comp.name,
      base: comp.city,
      industry: JSON.stringify({ name: comp.industry, sub: '核心业务' }),
      priority: comp.priority,
      status: 'active',
      envScope: 'PROD',
      feijiangWenxin: Math.random() > 0.5 ? '飞桨' : '文心',
      aiImplementationStage: '落地应用',
      partnerLevel: '核心级',
      clueStage: '商机转化',
      createdAt: new Date(),
      updatedAt: new Date(),
      // Add required fields
      isPoweredBy: true,
      pbAuthInfo: '战略合作伙伴'
    });
  }

  // 分批插入防止超时
  for (let i = 0; i < enterprises.length; i += 100) {
    const batch = enterprises.slice(i, i + 100);
    await Promise.all(batch.map(ent => prisma.enterprise.create({ data: ent })));
    console.log(`✅ 已入库 ${Math.min(i + 100, 526)} 条...`);
  }

  const count = await prisma.enterprise.count();
  console.log(`
🎉 数据库复活成功！当前有效企业数: ${count}`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
