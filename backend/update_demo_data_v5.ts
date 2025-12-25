import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🚀 开始更新企业数据 (V5 活力化更新)...');

  const enterprises = await prisma.enterprise.findMany({
    orderBy: { id: 'asc' }
  });

  const total = enterprises.length;
  console.log(`📊 找到 ${total} 家企业，准备处理...`);

  const cities = ['成都市', '重庆市', '西安市', '昆明市', '贵阳市'];
  const partnerLevels = ['核心伙伴', '领军伙伴', '战略伙伴', '创新伙伴', '普通伙伴'];
  const clueStages = ['LEAD', 'EMPOWERING', 'ADOPTED', 'ECO_PRODUCT', 'POWERED_BY', 'CASE_STUDY'];
  const industries = ['人工智能', '大数据', '云计算', '智能制造', '智慧城市', '金融科技', '医疗健康'];

  // 时间范围：过去3年
  const now = new Date();
  const threeYearsAgo = new Date();
  threeYearsAgo.setFullYear(now.getFullYear() - 3);

  for (let i = 0; i < total; i++) {
    const enterprise = enterprises[i];
    
    // 1. 归属地分配
    let base = '';
    const rand = Math.random();
    if (rand < 0.6) {
      base = '成都市';
    } else if (rand < 0.8) {
      base = '重庆市';
    } else if (rand < 0.9) {
      base = '西安市';
    } else if (rand < 0.95) {
      base = '昆明市';
    } else {
      base = '贵阳市';
    }

    // 2. 伙伴级别与到期日
    const partnerLevel = partnerLevels[Math.floor(Math.random() * partnerLevels.length)];
    const certExpiryDate = new Date();
    certExpiryDate.setMonth(now.getMonth() + Math.floor(Math.random() * 24)); // 未来0-24个月到期

    // 3. 飞桨文心占比 (0-100%)
    const paddleRatio = Math.floor(Math.random() * 101);
    const ernieRatio = 100 - paddleRatio;
    const feijiangWenxin = `飞桨:${paddleRatio}% | 文心:${ernieRatio}%`;

    // 4. 线索阶段
    const clueStage = clueStages[Math.floor(Math.random() * clueStages.length)];
    const isPoweredBy = clueStage === 'POWERED_BY' || Math.random() < 0.2;

    // 5. 入库时间 (逐年递增逻辑)
    // 我们让时间随着索引 i 增加而向现在靠近，模拟生态逐渐繁荣
    const progress = i / total;
    // 使用一点随机抖动
    const jitter = (Math.random() - 0.5) * (1 / 12); // ±0.5个月的抖动
    const timeProgress = Math.min(1, Math.max(0, progress + jitter));
    
    const createdAt = new Date(threeYearsAgo.getTime() + (now.getTime() - threeYearsAgo.getTime()) * timeProgress);
    const clueInTime = createdAt.toISOString().split('T')[0];

    await prisma.enterprise.update({
      where: { id: enterprise.id },
      data: {
        base,
        partnerLevel,
        certExpiryDate,
        feijiangWenxin,
        clueStage,
        createdAt,
        clueInTime,
        industry: industries[Math.floor(Math.random() * industries.length)],
        priority: Math.random() > 0.7 ? 'P0' : (Math.random() > 0.5 ? 'P1' : 'P2'),
        status: 'active'
      }
    });

    if ((i + 1) % 50 === 0) {
      console.log(`✅ 已处理 ${i + 1}/${total} 家企业...`);
    }
  }

  console.log('✨ 企业数据更新完成！');
}

main()
  .catch((e) => {
    console.error('❌ 更新失败:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
