import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// 洗牌算法
function shuffle(array: any[]) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// 生成符合年份分布的随机日期
function getRandomDate(year: number) {
  const start = new Date(year, 0, 1);
  const end = new Date(year, 11, 31);
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

async function main() {
  console.log('--- 正在执行 V2.0 战术数据重塑 ---');

  // 1. 获取所有演示环境企业
  const allEnterprises = await prisma.enterprise.findMany({
    where: { env: 'DEMO' },
    select: { id: true }
  });

  const total = allEnterprises.length;
  console.log(`检测到演示资产总数: ${total}`);

  const shuffledIds = shuffle(allEnterprises.map(e => e.id));

  // 2. 准备分配逻辑
  const p0Count = 150;
  const paddleCount = Math.floor(total * 0.4);
  
  console.log(`目标配置: P0(${p0Count}) | 飞桨(${paddleCount}) | 文心(${total - paddleCount})`);

  // 3. 逐条更新以确保随机性与精确性
  for (let i = 0; i < total; i++) {
    const id = shuffledIds[i];
    
    // 分配优先级
    let priority = 'P2';
    if (i < 150) priority = 'P0';
    else if (i < 300) priority = 'P1';

    // 分配技术栈
    const tech = (i % 10 < 4) ? '飞桨' : '文心';

    // 分配年份 (模拟增长：2020(5%), 2021(10%), 2022(15%), 2023(20%), 2024(25%), 2025(25%))
    let year = 2025;
    const rand = Math.random();
    if (rand < 0.05) year = 2020;
    else if (rand < 0.15) year = 2021;
    else if (rand < 0.30) year = 2022;
    else if (rand < 0.50) year = 2023;
    else if (rand < 0.75) year = 2024;

    await prisma.enterprise.update({
      where: { id },
      data: {
        priority,
        feijiangWenxin: tech,
        createdAt: getRandomDate(year),
        updatedAt: new Date()
      }
    });

    if (i % 100 === 0) console.log(`已处理 ${i} 条记录...`);
  }

  console.log('✅ 数据重塑完成。时空演进特征已注入。');
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
