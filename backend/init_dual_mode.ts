import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('--- 双模态系统初始化 ---');

  // 1. 创建专用的演示用户 (Demo User)
  const demoPassword = await bcrypt.hash('demo123456', 10);
  const demoUser = await prisma.user.upsert({
    where: { username: 'demo_analyst' },
    update: { envScope: 'DEMO' },
    create: {
      username: 'demo_analyst',
      email: 'demo@ecosystem.ai',
      password: demoPassword,
      role: 'analyst',
      envScope: 'DEMO',
      status: 'active'
    }
  });
  console.log(`演示用户 [${demoUser.username}] 已就绪，密码: demo123456, 权限范围: ${demoUser.envScope}`);

  // 2. 创建真实的生产用户 (管理员)
  const prodPassword = await bcrypt.hash('admin123456', 10);
  const prodUser = await prisma.user.upsert({
    where: { username: 'admin' },
    update: { envScope: 'PROD' },
    create: {
      username: 'admin',
      email: 'admin@ecosystem.ai',
      password: prodPassword,
      role: 'admin',
      envScope: 'PROD',
      status: 'active'
    }
  });
  console.log(`生产管理员 [${prodUser.username}] 已就绪，密码: admin123456, 权限范围: ${prodUser.envScope}`);
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());