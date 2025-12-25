import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from '../modules/auth/auth.module';
import { EnterprisesModule } from '../modules/enterprises/enterprises.module';
import { ImportExportModule } from '../modules/import-export/import-export.module';
import { DashboardModule } from '../modules/dashboard/dashboard.module';
import { ReportsModule } from '../modules/reports/reports.module';
import { UsersModule } from '../modules/users/users.module';
import { SyncModule } from '../modules/sync/sync.module';
import { VeracityModule } from '../modules/veracity/veracity.module';
import { CommentsModule } from '../modules/comments/comments.module';
import { PrismaModule } from '../prisma/prisma.module';
import { NotificationsModule } from '../modules/notifications/notifications.module';
import { SystemUsageInterceptor } from '../interceptors/system-usage.interceptor';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', 'static'),
      exclude: ['/api*'],
    }),
    PrismaModule,
    AuthModule,
    EnterprisesModule,
    ImportExportModule,
    DashboardModule,
    ReportsModule,
    UsersModule,
    SyncModule,
    VeracityModule,
    CommentsModule,
    NotificationsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: SystemUsageInterceptor,
    },
  ],
})
export class AppModule {}