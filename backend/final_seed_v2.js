const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const cities = { '成都': 316, '重庆': 110, '西安': 60, '昆明': 30, '贵阳': 10 };
const sectors = ["人工智能", "大数据", "云计算", "半导体", "生物医药", "智能制造", "航空航天", "信息安全", "金融科技", "新材料", "电子商务"];
const prefixes = ["芯", "智", "云", "数", "精", "创", "高", "联", "众", "捷", "睿", "思", "拓", "泰", "奥", "德"];
const suffixes = ["科技有限公司", "股份公司", "科技有限责任公司", "信息技术有限公司"];

function getRandomDate(year) {
  const start = new Date(year, 0, 1);
  const end = new Date(year, 11, 31);
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

async function seed() {
    console.log('--- 正在重构 526 条 [DEMO] 环境数据 ---');
    await prisma.enterprise.deleteMany({ where: { envScope: 'DEMO' } });
    
    let totalCreated = 0;
    for (const city in cities) {
        const count = cities[city];
        for (let i = 0; i < count; i++) {
            const p1 = prefixes[Math.floor(Math.random() * prefixes.length)];
            const p2 = prefixes[Math.floor(Math.random() * prefixes.length)];
            const sector = sectors[Math.floor(Math.random() * sectors.length)];
            const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
            const name = `${city}${p1}${p2}${sector}${i}${suffix}`;

            let year = 2025;
            const rand = Math.random();
            if (rand < 0.05) year = 2020;
            else if (rand < 0.15) year = 2021;
            else if (rand < 0.30) year = 2022;
            else if (rand < 0.50) year = 2023;
            else if (rand < 0.75) year = 2024;

            await prisma.enterprise.create({
                data: {
                    enterpriseName: name,
                    envScope: 'DEMO',
                    base: city,
                    status: 'active',
                    priority: i < 150 ? 'P0' : (i < 300 ? 'P1' : 'P2'),
                    feijiangWenxin: (i % 10 < 4) ? '飞桨' : '文心',
                    createdAt: getRandomDate(year),
                    registeredCapital: BigInt(Math.floor(Math.random() * 5000 + 500) * 10000),
                    industry: { primary: sector, secondary: "高新技术" },
                    aiImplementationStage: ['需求调研', '试点运行', '全面生产', '持续优化'][Math.floor(Math.random()*4)]
                }
            });
            totalCreated++;
        }
    }
    console.log(`✅ 注入完成，共计 ${totalCreated} 条 DEMO 数据。`);
}

seed().catch(e => console.error(e)).finally(async () => await prisma.$disconnect());
