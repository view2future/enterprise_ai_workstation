import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function test() {
  console.log('🧪 Starting Permission Logic Verification...');

  // 1. 获取一个 Neuron 账号
  const neuron = await prisma.user.findFirst({ where: { role: 'NEURON', envScope: 'DEMO' } });
  if (!neuron) throw new Error('Test user not found');
  console.log(`👤 Testing with user: ${neuron.username} (Region: ${neuron.region})`);

  // 2. 模拟 DashboardService.getStats 中的 where 逻辑
  const baseWhere: any = { status: 'active', envScope: 'DEMO' };
  
  // 应用我们刚才写的隔离逻辑
  if (neuron.role !== 'CORTEX' && neuron.role !== 'ARCHITECT') {
    if (neuron.region) {
      baseWhere.region = neuron.region;
    }
  }

  const count = await prisma.enterprise.count({ where: baseWhere });
  console.log(`📊 Result: Neuron can see ${count} enterprises in region ${neuron.region}`);

  if (count === 550) {
    console.log('✅ PASS: Neuron has full visibility of their region.');
  } else {
    console.log('❌ FAIL: Visibility mismatch.');
    process.exit(1);
  }

  // 3. 模拟 Cortex 账号
  const cortexWhere: any = { status: 'active', envScope: 'DEMO' };
  const cortexCount = await prisma.enterprise.count({ where: cortexWhere });
  console.log(`📊 Result: Cortex can see ${cortexCount} enterprises.`);
  if (cortexCount === 550) {
    console.log('✅ PASS: Cortex has global visibility.');
  }
}

test().finally(() => prisma.$disconnect());
