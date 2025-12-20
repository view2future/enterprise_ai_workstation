import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Create demo user
  const hashedPassword = await bcrypt.hash('password123', 10);
  
  const demoUser = await prisma.user.upsert({
    where: { email: 'demo@example.com' },
    update: {},
    create: {
      username: 'demo_user',
      email: 'demo@example.com',
      password: hashedPassword,
      firstName: 'Demo',
      lastName: 'User',
      role: 'admin',
      status: 'active',
    },
  });

  console.log('Created demo user:', demoUser);

  // Create sample enterprises
  const sampleEnterprises = [
    {
      enterpriseName: '成都人工智能科技有限公司',
      feijiangWenxin: '飞桨',
      clueInTime: '2025Q1',
      clueUpdateTime: new Date(),
      partnerLevel: '认证级',
      ecoAIProducts: '飞桨框架',
      priority: 'P0',
      base: '成都',
      registeredCapital: 10000000,
      employeeCount: 50,
      enterpriseBackground: '专注于计算机视觉技术研发的人工智能企业',
      industry: { name: '人工智能', sub: '计算机视觉' },
      taskDirection: '图像识别',
      contactInfo: '张经理 13800138000',
      usageScenario: '工业质检图像识别',
    },
    {
      enterpriseName: '绵阳智慧制造有限公司',
      feijiangWenxin: '文心',
      clueInTime: '2025Q1',
      clueUpdateTime: new Date(),
      partnerLevel: '优选级',
      ecoAIProducts: '文心一言',
      priority: 'P1',
      base: '绵阳',
      registeredCapital: 5000000,
      employeeCount: 30,
      enterpriseBackground: '智能制造和自然语言处理技术应用企业',
      industry: { name: '智能制造', sub: 'NLP' },
      taskDirection: '文本生成',
      contactInfo: '李经理 13900139000',
      usageScenario: '智能客服对话生成',
    },
    {
      enterpriseName: '泸州数字科技有限公司',
      feijiangWenxin: '飞桨',
      clueInTime: '2025Q1',
      clueUpdateTime: new Date(),
      partnerLevel: '认证级',
      ecoAIProducts: '飞桨Paddle.js',
      priority: 'P0',
      base: '泸州',
      registeredCapital: 8000000,
      employeeCount: 40,
      enterpriseBackground: '专注于边缘计算和AI推理优化的企业',
      industry: { name: '物联网', sub: '边缘计算' },
      taskDirection: '模型部署',
      contactInfo: '王经理 13700137000',
      usageScenario: '边缘设备AI推理',
    },
    {
      enterpriseName: '德阳机器人技术有限公司',
      feijiangWenxin: '飞桨',
      clueInTime: '2025Q1',
      clueUpdateTime: new Date(),
      partnerLevel: '无',
      ecoAIProducts: '飞桨框架',
      priority: 'P2',
      base: '德阳',
      registeredCapital: 3000000,
      employeeCount: 20,
      enterpriseBackground: '工业机器人和自动化解决方案提供商',
      industry: { name: '机器人', sub: '工业自动化' },
      taskDirection: '运动控制',
      contactInfo: '赵经理 13600136000',
      usageScenario: '机器人路径规划',
    },
    {
      enterpriseName: '攀枝花新材料科技有限公司',
      feijiangWenxin: '文心',
      clueInTime: '2025Q1',
      clueUpdateTime: new Date(),
      partnerLevel: '优选级',
      ecoAIProducts: '文心一言',
      priority: 'P1',
      base: '攀枝花',
      registeredCapital: 6000000,
      employeeCount: 25,
      enterpriseBackground: '新材料研发与智能检测技术企业',
      industry: { name: '新材料', sub: '智能检测' },
      taskDirection: '图像分析',
      contactInfo: '刘经理 13500135000',
      usageScenario: '材料缺陷检测',
    }
  ];

  for (const enterprise of sampleEnterprises) {
    const createdEnterprise = await prisma.enterprise.create({
      data: enterprise,
    });
    console.log(`Created enterprise: ${createdEnterprise.enterpriseName}`);
  }

  console.log('Sample data has been seeded!');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });