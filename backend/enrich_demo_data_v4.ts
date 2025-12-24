
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const clueStages = ['LEAD', 'EMPOWERING', 'ADOPTED', 'ECO_PRODUCT', 'POWERED_BY', 'CASE_STUDY'];
const clueSources = ['PHONE', 'EVENT', 'ASSOCIATION', 'PARTNER', 'GOV'];
const partnerLevels = ['尚未认证', '初级认证', '中级认证', '高级认证'];
const awardStatuses = ['已授牌', '未授牌'];
const sourceDetails = {
  'PHONE': ['2025Q4电话回访库', '寒冬攻坚拨测'],
  'EVENT': ['2025飞桨成都峰会', 'AI巡展-西安站', 'WAVE SUMMIT 2025'],
  'ASSOCIATION': ['成都市软件行业协会', '陕西省AI产业联盟'],
  'PARTNER': ['诺比侃推荐', '考拉悠然引荐'],
  'GOV': ['高新区经信局对接', '天府办介绍']
};

function getRandomDate(monthsOffset: number) {
  const date = new Date();
  date.setMonth(date.getMonth() + monthsOffset);
  // 增加一些随机天数偏移
  date.setDate(date.getDate() + Math.floor(Math.random() * 30));
  return date;
}

async function main() {
  console.log('📡 正在执行全量数据战术重构并切换至 DEMO 域...');

  // 获取所有企业
  const enterprises = await prisma.enterprise.findMany();

  console.log(`🔍 找到 ${enterprises.length} 家企业，开始注入随机画像并激活 DEMO 域...`);

  for (const ent of enterprises) {
    const randomStage = clueStages[Math.floor(Math.random() * clueStages.length)];
    const randomSource = clueSources[Math.floor(Math.random() * clueSources.length)];
    const randomLevel = partnerLevels[Math.floor(Math.random() * partnerLevels.length)];
    
    const expiryChoices = [-1, 1, 2, 8, 12];
    const randomExpiry = getRandomDate(expiryChoices[Math.floor(Math.random() * expiryChoices.length)]);

    await prisma.enterprise.update({
      where: { id: ent.id },
      data: {
        envScope: 'DEMO', // 强制切换到 DEMO 域以便首页显示
        clueStage: randomStage,
        clueSource: randomSource,
        clueSourceDetail: (sourceDetails as any)[randomSource][Math.floor(Math.random() * (sourceDetails as any)[randomSource].length)],
        partnerLevel: randomLevel,
        awardStatus: awardStatuses[Math.floor(Math.random() * awardStatuses.length)],
        isPoweredBy: randomStage === 'POWERED_BY',
        certExpiryDate: randomLevel !== '尚未认证' ? randomExpiry : null,
        avgMonthlyApiCalls: BigInt(Math.floor(Math.random() * 5000000)),
        priority: Math.random() > 0.8 ? 'P0' : (Math.random() > 0.5 ? 'P1' : 'P2')
      }
    });
  }

  console.log('✅ DEMO 数据随机化增强完成！现在的系统看起来将非常丰富。');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
