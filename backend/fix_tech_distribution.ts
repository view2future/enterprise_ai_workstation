import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🚀 正在优化企业技术分布数据...');

  const enterprises = await prisma.enterprise.findMany({
    select: { id: true, feijiangWenxin: true }
  });

  for (const ent of enterprises) {
    let newValue = ent.feijiangWenxin;
    if (ent.feijiangWenxin && ent.feijiangWenxin.includes('|')) {
      // 从 "飞桨:45% | 文心:55%" 中提取较大占比的一个，或者随机选一个
      const parts = ent.feijiangWenxin.split('|');
      const p1 = parseInt(parts[0].split(':')[1]);
      const p2 = parseInt(parts[1].split(':')[1]);
      newValue = p1 >= p2 ? '飞桨' : '文心';
    } else if (!ent.feijiangWenxin || ent.feijiangWenxin === '其他') {
      newValue = Math.random() > 0.5 ? '飞桨' : '文心';
    }

    await prisma.enterprise.update({
      where: { id: ent.id },
      data: { feijiangWenxin: newValue }
    });
  }

  console.log('✨ 技术分布数据优化完成！');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
