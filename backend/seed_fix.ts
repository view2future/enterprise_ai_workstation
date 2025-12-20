
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const companyPrefixes = [
  '成都智汇', '锦江科技', '武侯创新', '成华智能', '青羊数据', 
  '金牛云', '高新未来', '天府创新', '温江科技', '龙泉驿', 
  '新都智联', '双流航空', '郫都数字', '新津创新', '都江堰智慧',
  '彭州科技', '邛崃智创', '崇州数字', '金堂创新', '大邑科技',
  '蒲江智联', '简阳未来', '东部新区', '青白江科创', '天府软件',
  '成华云', '武侯智', '锦江数', '金牛创新', '高新智汇',
  '天府智慧', '温江云', '双流智', '郫都未来', '新津科创',
  '都江堰数', '彭州云', '邛崃智', '崇州科创', '金堂智慧',
  '大邑云', '蒲江智', '简阳科创', '龙泉驿云', '新都智汇',
  '青白江数', '温江科创', '郫都云', '双流数', '武侯科创',
  '锦江云', '金牛智', '高新科创', '天府数', '成华科创',
  '青羊云', '新津智', '都江堰科创', '彭州数', '邛崃科创',
  '崇州云', '金堂智', '大邑科创', '蒲江数', '简阳云',
  '东部智', '龙泉驿科创', '新都数', '青白江云', '温江智',
  '郫都科创', '双流科创', '武侯数', '锦江科创', '金牛数',
  '高新云', '天府智', '成华数', '青羊科创', '新津云',
  '都江堰智', '彭州科创', '邛崃数', '崇州科创', '金堂云',
  '大邑智', '蒲江科创', '简阳数', '东部科创', '龙泉驿数',
  '新都云', '青白江智', '温江数', '郫都数', '双流云'
];

const companySuffixes = [
  '科技有限公司', '智能科技有限公司', '数据服务有限公司', 
  '网络科技有限公司', '软件开发有限公司', '信息科技有限公司',
  '人工智能有限公司', '云计算有限公司', '大数据有限公司',
  '物联网科技有限公司', '区块链科技有限公司', '智能制造有限公司',
  '创新科技有限公司', '智慧科技有限公司', '科创有限公司',
  '信息技术有限公司', '科技发展有限公司', '智能系统有限公司',
  '数字科技有限公司', '软件科技有限公司', '科技服务有限公司',
  '智能解决方案有限公司', '数据智能有限公司', '云端科技有限公司',
  '智慧数据有限公司', '智能创新有限公司', '科技研发有限公司'
];

const industries = [
  ['人工智能', '软件开发'], ['云计算', '大数据'], ['物联网', '智能硬件'],
  ['金融科技', '区块链'], ['生物医药', '健康科技'], ['智能制造', '工业互联网']
];

const taskDirections = [
  '智能问答系统', '计算机视觉', 'OCR识别', '语音识别', '自然语言处理', '智能推荐系统'
];

function getRandomElement(array: any[]) {
  return array[Math.floor(Math.random() * array.length)];
}

async function main() {
  console.log('🚀 开始通过 Prisma 补全 521 条企业数据...');
  
  let successCount = 0;
  
  for (let i = 0; i < 521; i++) {
    const enterpriseName = getRandomElement(companyPrefixes) + getRandomElement(companySuffixes) + (i + 1);
    const techType = Math.random() > 0.5 ? '飞桨' : '文心';
    const priority = Math.random() > 0.8 ? 'P0' : Math.random() > 0.5 ? 'P1' : 'P2';
    const taskDirection = getRandomElement(taskDirections);

    try {
      await prisma.enterprise.upsert({
        where: { enterpriseName },
        update: {},
        create: {
          enterpriseName,
          feijiangWenxin: techType,
          clueInTime: `2025Q${Math.floor(Math.random() * 4) + 1}`,
          partnerLevel: Math.random() > 0.7 ? '认证级' : '无',
          ecoAIProducts: `${taskDirection} Pro`,
          priority,
          base: '成都',
          registeredCapital: BigInt(Math.floor(Math.random() * 50000) + 100),
          employeeCount: Math.floor(Math.random() * 2000) + 10,
          enterpriseBackground: '专注于人工智能领域的创新研发...',
          industry: JSON.stringify(getRandomElement(industries)),
          taskDirection,
          contactInfo: '张经理 13800000000',
          usageScenario: '智能制造与数字化转型',
          status: 'active'
        }
      });
      successCount++;
      if (successCount % 100 === 0) console.log(`✅ 已完成 ${successCount} 条...`);
    } catch (e) {
      // 忽略重名错误
    }
  }

  const finalCount = await prisma.enterprise.count();
  console.log(`
🎉 数据补全完成！`);
  console.log(`📊 当前数据库总企业数: ${finalCount}`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
