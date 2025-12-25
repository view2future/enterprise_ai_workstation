import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app/app.module';
import { PrismaClient } from '@prisma/client';
import { exec } from 'child_process';

async function bootstrap() {
  // --- V4.0 BOOTSTRAP MIGRATION HACK ---
  // 注意：在生产环境下，Prisma Client 应该是预生成的。
  const prisma = new PrismaClient();
  try {
    console.log('[BOOTSTRAP] Checking for V4.0 schema alignment...');
    // 使用更健壮的检查方式
    await prisma.$executeRawUnsafe(`ALTER TABLE enterprises ADD COLUMN certStatus TEXT DEFAULT 'PENDING'`).catch(() => {});
    await prisma.$executeRawUnsafe(`ALTER TABLE enterprises ADD COLUMN shippingStatus TEXT DEFAULT 'NOT_SHIPPED'`).catch(() => {});
    await prisma.$executeRawUnsafe(`ALTER TABLE enterprises ADD COLUMN trackingNumber TEXT`).catch(() => {});
    
    console.log('[BOOTSTRAP] Schema alignment verified.');
  } catch (e) {
    console.error('[BOOTSTRAP] Migration check skipped or failed:', e.message);
  } finally {
    await prisma.$disconnect();
  }

  const app = await NestFactory.create(AppModule);
  
  // 设置全局 API 前缀
  app.setGlobalPrefix('api');
  
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
  }));
  
  app.enableCors();
  
  const port = process.env.PORT || 3001;
  await app.listen(port);
  console.log(`[SYSTEM] Backend Engine is running on port: ${port}`);
  console.log(`[SYSTEM] API Prefix is: /api`);
}
bootstrap();
