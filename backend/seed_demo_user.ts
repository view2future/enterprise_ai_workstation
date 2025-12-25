import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const hash = await bcrypt.hash('Demo1234!', 10);
  
  await prisma.user.upsert({
    where: { username: 'demo_user' },
    update: {
      role: 'NEURON',
      department: 'DEMO_REGION',
      envScope: 'DEMO',
      status: 'active'
    },
    create: {
      username: 'demo_user',
      email: 'demo@nexus.ai',
      password: hash,
      firstName: 'Demo',
      lastName: 'User',
      role: 'NEURON',
      department: 'DEMO_REGION',
      envScope: 'DEMO',
      status: 'active'
    },
  });

  console.log('✅ Demo User (envScope: DEMO) Created');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
