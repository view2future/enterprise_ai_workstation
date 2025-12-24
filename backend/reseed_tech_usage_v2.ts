import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🚀 正在模拟真实的飞桨/文心使用分布 (单一使用 vs 交叉使用)...');

  const enterprises = await prisma.enterprise.findMany({
    select: { id: true }
  });

  for (const ent of enterprises) {
    const rand = Math.random();
    let techValue = '';

    if (rand < 0.35) {
      techValue = '飞桨'; // 35% 仅使用飞桨
    } else if (rand < 0.70) {
      techValue = '文心'; // 35% 仅使用文心
    } else {
      techValue = '飞桨,文心'; // 30% 两者均在用
    }

    await prisma.enterprise.update({
      where: { id: ent.id },
      data: { feijiangWenxin: techValue }
    });
  }

  console.log(`✨ 数据更新完成，共处理 ${enterprises.length} 家企业。`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
