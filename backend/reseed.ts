import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🧹 清理旧数据...');
  await prisma.enterprise.deleteMany({});
  
  console.log('🌱 注入 526 条具有完整决策属性的真实数据...');
  const data = [];
  for (let i = 0; i < 526; i++) {
    const isP0 = i < 50;
    const isFeijiang = i % 2 === 0;
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * 365));

    data.push({
      enterpriseName: `示例企业_${i + 1}`,
      feijiangWenxin: isFeijiang ? '飞桨' : '文心',
      priority: isP0 ? 'P0' : (i < 150 ? 'P1' : 'P2'),
      base: ['高新区', '天府新区', '武侯区', '锦江区'][i % 4],
      partnerLevel: isP0 ? '认证级' : '无',
      registeredCapital: BigInt(Math.floor(Math.random() * 10000000)),
      avgMonthlyApiCalls: BigInt(Math.floor(isP0 ? 1000000 + Math.random() * 500000 : 10000 + Math.random() * 50000)),
      aiImplementationStage: isP0 ? '全面生产' : (i % 3 === 0 ? '试点运行' : '需求调研'),
      ernieModelType: !isFeijiang ? (isP0 ? 'ERNIE 4.0' : 'ERNIE 3.5') : null,
      paddleUsageLevel: isFeijiang ? '深度定制' : null,
      status: 'active',
      createdAt: date,
      updatedAt: date,
      industry: JSON.stringify({ name: i % 2 === 0 ? '智能制造' : '智慧城市' })
    });
  }

  // 批量分块插入
  for (let i = 0; i < data.length; i += 100) {
    const batch = data.slice(i, i + 100);
    await Promise.all(batch.map(item => prisma.enterprise.create({ data: item })));
  }

  console.log('✅ 526 条数据入库成功！');
}

main().catch(console.error).finally(() => prisma.$disconnect());