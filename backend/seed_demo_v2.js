const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const cities = { '成都': 316, '重庆': 110, '西安': 60, '昆明': 30, '贵阳': 10 };
const sectors = ["人工智能", "大数据", "云计算", "半导体", "生物医药", "智能制造", "航空航天", "信息安全", "金融科技", "新材料", "电子商务"];
const prefixes = ["芯", "智", "云", "数", "精", "创", "高", "联", "众", "捷", "睿", "思", "拓", "泰", "奥", "德"];
const suffixes = ["科技有限公司", "股份公司", "科技有限责任公司", "信息技术有限公司"];

function generateEnterpriseName(city, index) {
    const p1 = prefixes[Math.floor(Math.random() * prefixes.length)];
    const p2 = prefixes[Math.floor(Math.random() * prefixes.length)];
    const sector = sectors[Math.floor(Math.random() * sectors.length)];
    const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
    return `${city}${p1}${p2}${sector}${index}${suffix}`; // 加入index确保唯一
}

async function seed() {
    console.log('--- 正在注入 526 条 [DEMO] 环境数据 ---');
    let totalCreated = 0;

    for (const city in cities) {
        const count = cities[city];
        console.log(`Injecting ${count} for ${city}...`);
        for (let i = 0; i < count; i++) {
            await prisma.enterprise.create({
                data: {
                    enterpriseName: generateEnterpriseName(city, i),
                    env: 'DEMO',
                    base: city,
                    status: 'active',
                    registeredCapital: BigInt(Math.floor(Math.random() * 5000 + 500) * 10000),
                    employeeCount: Math.floor(Math.random() * 500 + 20),
                    unifiedSocialCreditCode: `91${Math.random().toString(36).substring(2, 18).toUpperCase()}`,
                    industry: { primary: sectors[Math.floor(Math.random() * sectors.length)], secondary: "高新技术" },
                    isHighTech: true,
                    aiImplementationStage: ['需求调研', '试点运行', '全面生产', '持续优化'][Math.floor(Math.random()*4)]
                }
            });
            totalCreated++;
        }
    }
    console.log(`✅ 注入完成，共计 ${totalCreated} 条 DEMO 数据。`);
}

seed()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
