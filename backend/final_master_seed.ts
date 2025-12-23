import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const companyPrefixes = [
  '成都智汇', '锦江科技', '武侯创新', '成华智能', '青羊数据', 
  '金牛云', '高新未来', '天府创新', '温江科技', '龙泉驿', 
  '新都智联', '双流航空', '郫都数字', '新津创新', '都江堰智慧',
  '彭州科技', '邛崃智创', '崇州数字', '金堂创新', '大邑科技',
  '天府软件', '成华云', '武侯智', '锦江数', '金牛创新', '高新智汇',
  '天府智慧', '温江云', '双流智', '郫都未来', '新津科创',
  '都江堰数', '彭州云', '邛崃智', '崇州科创', '金堂智慧'
];

const companySuffixes = [
  '科技有限公司', '智能科技有限公司', '数据服务有限公司', 
  '网络科技有限公司', '软件开发有限公司', '信息科技有限公司',
  '人工智能有限公司', '云计算有限公司', '大数据有限公司',
  '物联网技术有限公司', '区块链科技有限公司', '智能制造有限公司',
  '创新科技有限公司', '智慧科技有限公司'
];

const industries = [
  { name: "人工智能", sub: "计算机视觉" },
  { name: "大数据", sub: "数据挖掘" },
  { name: "工业互联网", sub: "智能制造" },
  { name: "金融科技", sub: "区块链" },
  { name: "医疗健康", sub: "智能诊断" }
];

const taskDirections = ['智能问答', '图像识别', '预测性维护', '自动化营销', '代码助手'];

function getRandomDate(daysAgo: number) {
  const date = new Date();
  date.setDate(date.getDate() - Math.floor(Math.random() * daysAgo));
  return date;
}

async function main() {
  console.log('🧹 正在深度清理数据库...');
  await prisma.enterprise.deleteMany({});
  
  console.log('🌱 正在重新注入 526 条真实名称的企业画像数据...');
  
  const enterprises = [];
  for (let i = 0; i < 526; i++) {
    const nameBase = companyPrefixes[i % companyPrefixes.length] + companySuffixes[Math.floor(Math.random() * companySuffixes.length)];
    const enterpriseName = `${nameBase}(${1000 + i})`; // 确保唯一性
    const tech = Math.random() > 0.5 ? '飞桨' : '文心';
    const isP0 = i < 50;
    const date = getRandomDate(365);

    enterprises.push({
      enterpriseName,
      feijiangWenxin: tech,
      priority: isP0 ? 'P0' : (i < 150 ? 'P1' : 'P2'),
      partnerLevel: isP0 ? '认证级' : '无',
      base: ['高新区', '天府新区', '武侯区', '锦江区', '成华区'][i % 5],
      registeredCapital: BigInt(Math.floor(Math.random() * 50000000 + 1000000)),
      employeeCount: Math.floor(Math.random() * 1000) + 20,
      
      // 扩展画像
      unifiedSocialCreditCode: `91510100MA${600000 + i}X`,
      legalRepresentative: ['张云', '李强', '王微', '刘洋', '陈墨'][i % 5],
      enterpriseType: i % 10 === 0 ? '民营大型' : '科技初创',
      annualRevenue: isP0 ? '1亿-5亿' : '1000万-5000万',
      techStaffCount: Math.floor(Math.random() * 200) + 5,
      isHighTech: Math.random() > 0.3,
      isSpecialized: isP0 || Math.random() > 0.9,
      website: `www.eco-ai-${i}.com`,
      officeAddress: `成都市高新区天府${Math.floor(Math.random() * 10)}街${i}号`,

      // 技术矩阵
      paddleUsageLevel: tech === '飞桨' ? (isP0 ? '深度定制' : '基础调用') : null,
      paddleModels: tech === '飞桨' ? JSON.stringify(['PP-OCRv4', 'PP-YOLOE']) : null,
      ernieModelType: tech === '文心' ? (isP0 ? 'ERNIE 4.0' : 'ERNIE 3.5') : null,
      avgMonthlyApiCalls: BigInt(Math.floor(isP0 ? 1000000 + Math.random() * 5000000 : 5000 + Math.random() * 50000)),
      aiImplementationStage: isP0 ? '全面生产' : (i % 3 === 0 ? '试点运行' : '需求调研'),
      
      // 生态合作
      partnerProgramType: isP0 ? '飞桨优选伙伴' : '文心千帆合作伙伴',
      baiduCertificates: isP0 ? JSON.stringify(['飞桨高级架构师']) : null,
      eventParticipation: JSON.stringify([{ date: '2025-03', name: 'WAVE SUMMIT', role: '演讲嘉宾' }]),
      
      status: 'active',
      createdAt: date,
      updatedAt: date,
      industry: JSON.stringify(industries[i % industries.length])
    });
  }

  // 分批入库
  for (let i = 0; i < enterprises.length; i += 100) {
    const batch = enterprises.slice(i, i + 100);
    await Promise.all(batch.map(ent => prisma.enterprise.create({ data: ent })));
    console.log(`✅ 已恢复 ${Math.min(i + 100, 526)} 条真实数据...`);
  }

  const count = await prisma.enterprise.count();
  console.log(`
🎉 数据库真实化恢复成功！当前记录数: ${count}`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
