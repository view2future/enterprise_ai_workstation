import { PrismaClient } from '@prisma/client';

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
  await prisma.enterprise.deleteMany({});
  
  console.log('🌱 正在注入 526 条全量真实画像数据...');
  
  const enterprises = [];
  for (let i = 0; i < 526; i++) {
    const name = companyPrefixes[i % companyPrefixes.length] + companySuffixes[i % companySuffixes.length] + (i + 1);
    const tech = Math.random() > 0.5 ? '飞桨' : '文心';
    const isP0 = i % 10 === 0; // 10% P0
    const stage = i % 4 === 0 ? '全面生产' : (i % 3 === 0 ? '试点运行' : '需求调研');
    const createdAt = getRandomDate(365); // 覆盖过去一年

    enterprises.push({
      enterpriseName: name,
      feijiangWenxin: tech,
      priority: isP0 ? 'P0' : (i % 3 === 0 ? 'P1' : 'P2'),
      partnerLevel: isP0 ? '认证级' : '无',
      base: '成都',
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
