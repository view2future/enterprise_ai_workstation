import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding Super Admins for V5 Nexus Commander...');

  const passwordHash = await bcrypt.hash('Nexus2025!', 10);

  const admins = [
    {
      username: 'wangyu',
      email: 'wangyu@nexus.ai',
      firstName: 'Wang',
      lastName: 'Yu',
      role: 'SUPER_ADMIN',
      department: 'HEADQUARTERS',
      password: passwordHash,
    },
    {
      username: 'superadmin',
      email: 'admin@nexus.ai',
      firstName: 'System',
      lastName: 'Admin',
      role: 'SUPER_ADMIN',
      department: 'HEADQUARTERS',
      password: passwordHash,
    },
  ];

  for (const admin of admins) {
    const user = await prisma.user.upsert({
      where: { username: admin.username },
      update: {
        role: admin.role,
        department: admin.department,
      },
      create: admin,
    });
    console.log(`✅ Super Admin configured: ${user.username}`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
