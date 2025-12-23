
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('demo123', 10);
  
  const user = await prisma.user.upsert({
    where: { username: 'demo' },
    update: {
      password: hashedPassword,
      status: 'active',
      role: 'analyst',
      envScope: 'DEMO'
    },
    create: {
      username: 'demo',
      email: 'demo@nexus.ai',
      password: hashedPassword,
      role: 'analyst',
      status: 'active',
      envScope: 'DEMO',
      firstName: 'Demo',
      lastName: 'User'
    },
  });

  console.log('✅ 演示用户 "demo" 已就绪。');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
