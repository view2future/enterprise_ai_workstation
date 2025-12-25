import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SystemUsageInterceptor implements NestInterceptor {
  private readonly logger = new Logger(SystemUsageInterceptor.name);

  constructor(private prisma: PrismaService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, originalUrl, user } = request;

    return next.handle().pipe(
      tap(async () => {
        try {
          // 忽略一些高频但非业务的接口，比如健康检查或静态资源
          if (originalUrl.startsWith('/health') || originalUrl.startsWith('/static')) {
            return;
          }

          await this.prisma.systemUsageLog.create({
            data: {
              endpoint: originalUrl,
              method: method,
              userId: user ? user.userId : null, // 假设 JWT 策略将 userId 放入 request.user
            },
          });
        } catch (error) {
          this.logger.error(`Failed to log system usage: ${error.message}`);
        }
      }),
    );
  }
}
