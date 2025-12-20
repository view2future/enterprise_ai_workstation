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

  // CORS配置 - 必须在其他中间件之前
  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
    allowedHeaders: 'Content-Type, Accept, Authorization',
  });

  // 安全中间件 - 针对开发环境进行降级，防止拦截本地资源
  app.use(helmet({
    crossOriginResourcePolicy: false,
    contentSecurityPolicy: false,
  }));

  // 全局验证管道
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const configService = app.get(ConfigService);
  // 强制使用 3001 端口，避免与前端 3000 端口冲突
  const port = 3001; 

  await app.listen(port);
  console.log(`🚀 企业数据管理平台API服务器强制运行在端口 ${port}`);
  console.log(`📊 API文档: http://localhost:${port}/api`);
  console.log(`🏥 健康检查: http://localhost:${port}/health`);
}
bootstrap();