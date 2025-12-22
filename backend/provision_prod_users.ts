import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('--- 正在预置生产环境高级情报官账号 ---');

  const users = [
    { username: 'wangyu', email: 'wangyu@swai.ai', password: 'swaiwangyu', role: 'admin' },
    { username: 'huangziling', email: 'huangziling@swai.ai', password: 'swaihuangziling', role: 'admin' }
  ];

  for (const u of users) {
    const hashedPassword = await bcrypt.hash(u.password, 10);
    const user = await prisma.user.upsert({
      where: { username: u.username },
      update: {
        password: hashedPassword,
        envScope: 'PROD'
      },
      create: {
        username: u.username,
        email: u.email,
        password: hashedPassword,
        role: u.role,
        envScope: 'PROD',
        status: 'active'
      }
    });
    console.log(`✅ 情报官 [${user.username}] 已激活。所属环境: PROD`);
  }

  console.log('\n--- 正在清理生产环境冗余数据 ---');
  const deleteResult = await prisma.enterprise.deleteMany({
    where: { env: 'PROD' }
  });
  console.log(`✅ 已清理 ${deleteResult.count} 条旧有的生产数据。当前生产环境状态: [纯净]`);
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
