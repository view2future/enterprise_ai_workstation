
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const CITIES = [
  { name: '成都市', coords: [30.657, 104.066], weight: 60 },
  { name: '重庆市', coords: [29.563, 106.551], weight: 20 },
  { name: '西安市', coords: [34.341, 108.939], weight: 10 },
  { name: '昆明市', coords: [25.045, 102.710], weight: 4 },
  { name: '贵阳市', coords: [26.578, 106.707], weight: 3 },
  { name: '绵阳市', coords: [31.467, 104.741], weight: 2 },
  { name: '德阳市', coords: [31.127, 104.398], weight: 1 },
];

const STAGES = ['LEAD', 'EMPOWERING', 'ADOPTED', 'ECO_PRODUCT', 'POWERED_BY', 'CASE_STUDY'];
const LEVELS = ['核心合作伙伴', '战略合作伙伴', '领先级合作伙伴', '普通级合作伙伴', '认证服务商'];

function getRandomCity() {
  const rand = Math.random() * 100;
  let cumulativeWeight = 0;
  for (const city of CITIES) {
    cumulativeWeight += city.weight;
    if (rand <= cumulativeWeight) {
      // 在中心坐标附近增加一点随机偏移，防止地图点位完全重叠
      const lat = city.coords[0] + (Math.random() - 0.5) * 0.1;
      const lng = city.coords[1] + (Math.random() - 0.5) * 0.1;
      return { name: city.name, lat, lng };
    }
  }
  return { name: '成都市', lat: 30.657, lng: 104.066 };
}

function getRandomDate() {
  const rand = Math.random();
  let year;
  if (rand < 0.15) year = 2023;
  else if (rand < 0.5) year = 2024;
  else year = 2025;

  const month = Math.floor(Math.random() * 12);
  const day = Math.floor(Math.random() * 28) + 1;
  return new Date(year, month, day);
}

async function main() {
  console.log('🚀 开始增强 DEMO 环境企业数据...');

  const enterprises = await prisma.enterprise.findMany({
    where: { envScope: 'DEMO' }
  });

  console.log(`找到 ${enterprises.length} 家企业，准备注入战术指标...`);

  let count = 0;
  for (const ent of enterprises) {
    const cityData = getRandomCity();
    const createdAt = getRandomDate();
    
    // 证书到期日通常在入库时间之后 1-3 年
    const expiryDate = new Date(createdAt);
    expiryDate.setFullYear(expiryDate.getFullYear() + Math.floor(Math.random() * 2) + 1);

    const feijiangUsage = Math.floor(Math.random() * 101);
    const stage = STAGES[Math.floor(Math.random() * STAGES.length)];
    const partnerLevel = LEVELS[Math.floor(Math.random() * LEVELS.length)];

    await prisma.enterprise.update({
      where: { id: ent.id },
      data: {
        city: cityData.name,
        base: cityData.name,
        latitude: cityData.lat,
        longitude: cityData.lng,
        createdAt: createdAt,
        updatedAt: new Date(),
        clueStage: stage,
        partnerLevel: partnerLevel,
        certExpiryDate: expiryDate,
        feijiangWenxin: `${feijiangUsage}%`,
        priority: Math.random() > 0.8 ? 'P0' : (Math.random() > 0.5 ? 'P1' : 'P2'),
        industry: ['人工智能', '智慧政务', '工业互联网', '智能制造', '数字医疗', '金融科技'][Math.floor(Math.random() * 6)],
        ecoAIProducts: stage === 'ECO_PRODUCT' || stage === 'POWERED_BY' || stage === 'CASE_STUDY' 
          ? `基于文心一言的${ent.enterpriseName}行业大模型方案` : null,
      }
    });
    
    count++;
    if (count % 50 === 0) console.log(`已处理 ${count} 家...`);
  }

  console.log('✅ DEMO 数据增强完成！');
  console.log('--- 统计信息 ---');
  console.log('1. 区域：60% 成都对齐');
  console.log('2. 时间：2023-2025 递增繁荣曲线');
  console.log('3. 坐标：已为战术地图注入动态经纬度');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
