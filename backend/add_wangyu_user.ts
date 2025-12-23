
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('wangyu123', 10);
  
  const user = await prisma.user.upsert({
    where: { username: 'wangyu' },
    update: {
      password: hashedPassword,
      status: 'active',
      role: 'admin',
      envScope: 'PROD'
    },
    create: {
      username: 'wangyu',
      email: 'wangyu@nexus.ai',
      password: hashedPassword,
      role: 'admin',
      status: 'active',
      envScope: 'PROD',
      firstName: 'Yu',
      lastName: 'Wang'
    },
  });

  console.log('✅ 用户 "wangyu" 已就绪。');
  console.log('账号: wangyu');
  console.log('密码: wangyu123');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
