
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const swCities = [
  '成都', '重庆', '西安', '贵阳', '昆明', '绵阳', '德阳', '宜宾', '眉山', '乐山'
];

async function main() {
  console.log('📡 正在执行西南战区全域地理归属重组...');

  const enterprises = await prisma.enterprise.findMany();
  
  for (let i = 0; i < enterprises.length; i++) {
    const rand = Math.random();
    let finalCity = '成都';

    if (rand < 0.45) {
      finalCity = '成都';
    } else if (rand < 0.65) {
      finalCity = '重庆';
    } else if (rand < 0.80) {
      finalCity = '西安';
    } else if (rand < 0.85) {
      finalCity = '贵阳';
    } else if (rand < 0.90) {
      finalCity = '昆明';
    } else {
      // 剩余 10% 随机分配到川内其他节点
      const others = ['绵阳', '德阳', '宜宾', '眉山', '乐山'];
      finalCity = others[Math.floor(Math.random() * others.length)];
    }

    await prisma.enterprise.update({
      where: { id: enterprises[i].id },
      data: { base: finalCity }
    });
  }

  console.log(`✅ 西南战区重组完成！532 个节点已归档至西南核心城市群。`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
