
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const swCities = ['成都', '重庆', '西安', '贵阳', '昆明', '绵阳', '德阳', '宜宾', '眉山', '乐山'];
const clueStages = ['LEAD', 'EMPOWERING', 'ADOPTED', 'ECO_PRODUCT', 'POWERED_BY', 'CASE_STUDY'];
const clueSources = ['PHONE', 'EVENT', 'ASSOCIATION', 'PARTNER', 'GOV'];
const partnerLevels = ['尚未认证', '初级认证', '中级认证', '高级认证'];
const techStacks = ['飞桨', '文心', '飞桨+文心'];

const sourceDetails = {
  'PHONE': ['2025Q4电话回访库', '寒冬攻坚拨测'],
  'EVENT': ['2025飞桨成都峰会', 'AI巡展-西安站', 'WAVE SUMMIT 2025'],
  'ASSOCIATION': ['成都市软件行业协会', '陕西省AI产业联盟'],
  'PARTNER': ['诺比侃推荐', '考拉悠然引荐'],
  'GOV': ['高新区经信局对接', '天府办介绍']
};

function getRandomDate(daysOffset: number) {
  const date = new Date();
  date.setDate(date.getDate() + daysOffset);
  return date;
}

async function main() {
  console.log('🚀 启动 V4.0 高级数据重构程序...');

  const enterprises = await prisma.enterprise.findMany({
    where: { envScope: 'DEMO' }
  });

  console.log(`📊 正在对 ${enterprises.length} 个节点执行战术重分配...`);

  // 打乱顺序以保证随机性
  const shuffled = enterprises.sort(() => Math.random() - 0.5);

  for (let i = 0; i < shuffled.length; i++) {
    const ent = shuffled[i];
    const progress = i / shuffled.length;

    // 1. 地理归属逻辑
    let city = '成都';
    if (progress < 0.60) {
      city = '成都';
    } else if (progress < 0.75) {
      city = '重庆';
    } else if (progress < 0.85) {
      city = '西安';
    } else {
      const otherSw = swCities.filter(c => !['成都', '重庆', '西安'].includes(c));
      city = otherSw[Math.floor(Math.random() * otherSw.length)];
    }

    // 2. 业务字段逻辑
    const stage = clueStages[Math.floor(Math.random() * clueStages.length)];
    const source = clueSources[Math.floor(Math.random() * clueSources.length)];
    const level = partnerLevels[Math.floor(Math.random() * partnerLevels.length)];
    const tech = techStacks[Math.floor(Math.random() * techStacks.length)];

    // 3. 效期预警模拟 (-20天到 400天)
    const expiryDays = Math.floor(Math.random() * 420) - 20; 
    const expiryDate = level !== '尚未认证' ? getRandomDate(expiryDays) : null;

    // 4. 创建时间模拟 (过去 36 个月内，模拟三年的发展路径)
    // 使用非线性分布：越靠近现在的月份权重越高
    const monthsAgo = Math.floor(Math.pow(Math.random(), 2.5) * 36); 
    const createdAt = new Date();
    createdAt.setMonth(createdAt.getMonth() - monthsAgo);
    createdAt.setDate(Math.floor(Math.random() * 28) + 1);

    await prisma.enterprise.update({
      where: { id: ent.id },
      data: {
        base: city,
        clueStage: stage,
        clueSource: source,
        clueSourceDetail: (sourceDetails as any)[source][Math.floor(Math.random() * (sourceDetails as any)[source].length)],
        partnerLevel: level,
        feijiangWenxin: tech,
        isPoweredBy: stage === 'POWERED_BY',
        certExpiryDate: expiryDate,
        awardStatus: level !== '尚未认证' && Math.random() > 0.3 ? '已授牌' : '未授牌',
        priority: Math.random() > 0.8 ? 'P0' : (Math.random() > 0.5 ? 'P1' : 'P2'),
        avgMonthlyApiCalls: BigInt(Math.floor(Math.random() * 8000000)),
        createdAt: createdAt,
        updatedAt: new Date()
      }
    });

    if (i % 100 === 0) console.log(`已处理 ${i} 个节点...`);
  }

  console.log('✅ V4.0 高级数据重构完成！');
  console.log('🎯 核心战术指标：');
  console.log('- 区域分布：成都(60%) 稳居核心，渝陕紧随其后。');
  console.log('- 业务深度：线索/PB/案例全量覆盖。');
  console.log('- 效期压力：已生成多量 90 天内到期预警节点。');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
