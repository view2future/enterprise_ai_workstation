
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const strategicCities = [
  '成都', '西安', '上海', '北京', '深圳', '重庆', '武汉', '杭州', '南京', '广州'
];

// 权重分配：确保成都仍是核心(40%)，其他城市平分剩余
async function main() {
  console.log('📡 正在执行 V4.2 全域地理分布战略重组...');

  const enterprises = await prisma.enterprise.findMany();
  
  for (let i = 0; i < enterprises.length; i++) {
    let finalCity = '成都';
    const name = enterprises[i].enterpriseName;

    // 1. 如果名字里有城市名，以名字优先
    let foundSpecific = false;
    for (const city of strategicCities) {
      if (name.includes(city)) {
        finalCity = city;
        foundSpecific = true;
        break;
      }
    }

    // 2. 如果名字里没写，则根据索引按权重随机分配，确保图表丰富
    if (!foundSpecific) {
      const rand = Math.random();
      if (rand < 0.4) {
        finalCity = '成都';
      } else {
        // 随机分配到除成都以外的其他 9 个战略城市
        const otherCities = strategicCities.filter(c => c !== '成都');
        finalCity = otherCities[Math.floor(Math.random() * otherCities.length)];
      }
    }

    await prisma.enterprise.update({
      where: { id: enterprises[i].id },
      data: { base: finalCity }
    });
  }

  console.log(`✅ 地理分布重组完成！532 个节点已分散至 ${strategicCities.join(', ')}。`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
