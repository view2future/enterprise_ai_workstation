
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
      const lat = city.coords[0] + (Math.random() - 0.5) * 0.15;
      const lng = city.coords[1] + (Math.random() - 0.5) * 0.15;
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

function getPaddleWenxinUsage() {
  const rand = Math.random();
  const val1 = Math.floor(Math.random() * 60) + 20; // 20-80%
  const val2 = Math.floor(Math.random() * 40) + 10; // 10-50%

  if (rand < 0.3) {
    return `飞桨 (${val1}%)`;
  } else if (rand < 0.6) {
    return `文心一言 (${val1}%)`;
  } else {
    return `飞桨 (${val1}%) / 文心 (${val2}%)`;
  }
}

async function main() {
  console.log('🚀 正在执行 V6.0 数据活性化重构...');

  const enterprises = await prisma.enterprise.findMany({
    where: { envScope: 'DEMO' }
  });

  console.log(`目标：${enterprises.length} 家演示企业。`);

  let count = 0;
  for (const ent of enterprises) {
    const cityData = getRandomCity();
    const createdAt = getRandomDate();
    const expiryDate = new Date(createdAt);
    expiryDate.setFullYear(expiryDate.getFullYear() + Math.floor(Math.random() * 2) + 1);

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
        certStatus: stage === 'POWERED_BY' || stage === 'CASE_STUDY' ? 'ISSUED' : 'PROCESSING',
        shippingStatus: stage === 'CASE_STUDY' ? 'DELIVERED' : (stage === 'POWERED_BY' ? 'SHIPPED' : 'NOT_SHIPPED'),
        trackingNumber: stage === 'CASE_STUDY' || stage === 'POWERED_BY' ? `SF${Math.floor(Math.random() * 900000000) + 100000000}CN` : null,
        feijiangWenxin: getPaddleWenxinUsage(),
        priority: Math.random() > 0.85 ? 'P0' : (Math.random() > 0.6 ? 'P1' : 'P2'),
        industry: ['人工智能', '智慧政务', '工业互联网', '智能制造', '数字医疗', '金融科技'][Math.floor(Math.random() * 6)],
        ecoAIProducts: (stage === 'ECO_PRODUCT' || stage === 'POWERED_BY' || stage === 'CASE_STUDY') 
          ? `基于文心一言的${ent.enterpriseName}行业大模型方案` : null,
        taskDirection: ['视觉识别', '自然语言处理', '预测性维护', '辅助决策', '自动化质检'][Math.floor(Math.random() * 5)],
        registeredCapital: Math.floor(Math.random() * 5000) + 100, // 100万 - 5100万
        employeeCount: Math.floor(Math.random() * 500) + 10,      // 10人 - 510人
      }
    });
    
    count++;
    if (count % 100 === 0) console.log(`进度：${count}/${enterprises.length}...`);
  }

  console.log('✅ V6.0 数据活性化重构完成！');
  console.log('1. 区域：60%成都，重庆西安紧随其后');
  console.log('2. 演化：2023-2025 繁荣入库曲线');
  console.log('3. 技术：飞桨/文心 交叉使用模型注入');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
