import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from '../modules/auth/auth.module';
import { EnterprisesModule } from '../modules/enterprises/enterprises.module';
import { ImportExportModule } from '../modules/import-export/import-export.module';
import { DashboardModule } from '../modules/dashboard/dashboard.module';
import { ReportsModule } from '../modules/reports/reports.module';
import { UsersModule } from '../modules/users/users.module';
import { SyncModule } from '../modules/sync/sync.module';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    PrismaModule,
    AuthModule,
    EnterprisesModule,
    ImportExportModule,
    DashboardModule,
    ReportsModule,
    UsersModule,
    SyncModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}