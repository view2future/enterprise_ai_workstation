import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { ConfigService } from '@nestjs/config';

// 解决 BigInt 序列化问题
(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 设置全局路由前缀
  app.setGlobalPrefix('api');

  // 安全中间件
  app.use(helmet());

  // 速率限制
  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000, // 15分钟
      max: 100, // 限制每个IP 15分钟内最多100个请求
    }),
  );

  // CORS配置
  app.enableCors({
    origin: process.env.NODE_ENV === 'production'
      ? [process.env.FRONTEND_URL || '']
      : ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:8080', 'http://localhost:5173'],
    credentials: true,
  });

  // 全局验证管道
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT') || 3001;

  await app.listen(port);
  console.log(`🚀 企业数据管理平台API服务器运行在端口 ${port}`);
  console.log(`📊 API文档: http://localhost:${port}/api`);
  console.log(`🏥 健康检查: http://localhost:${port}/health`);
}
bootstrap();