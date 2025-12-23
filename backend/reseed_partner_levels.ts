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

async function main() {
  console.log('--- 正在重塑合作伙伴能级分布 [DEMO] ---');

  const allEnterprises = await prisma.enterprise.findMany({
    where: { env: 'DEMO' },
    select: { id: true }
  });

  const total = allEnterprises.length;
  const shuffledIds = shuffle(allEnterprises.map(e => e.id));

  // 比例计算
  const coreLimit = Math.floor(total * 0.15); // 15% 认证级
  const preferredLimit = coreLimit + Math.floor(total * 0.25); // 25% 优选级

  for (let i = 0; i < total; i++) {
    const id = shuffledIds[i];
    let level = '无'; // 标准级/无

    if (i < coreLimit) {
      level = '认证级';
    } else if (i < preferredLimit) {
      level = '优选级';
    }

    await prisma.enterprise.update({
      where: { id },
      data: { partnerLevel: level }
    });

    if (i % 100 === 0) console.log(`已分配 ${i} 条能级数据...`);
  }

  console.log(`✅ 能级重塑完成：认证级(15%) | 优选级(25%) | 标准级(60%)`);
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
