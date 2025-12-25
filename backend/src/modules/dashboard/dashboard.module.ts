import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { DashboardController } from './controllers/dashboard.controller';
import { PolicyController } from './controllers/policy.controller';
import { AdminDashboardController } from './controllers/admin-dashboard.controller'; // Import AdminDashboardController
import { DashboardService } from './services/dashboard.service';
import { PolicyService } from './services/policy.service';
import { AdminDashboardService } from './services/admin-dashboard.service'; // Import AdminDashboardService
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  imports: [HttpModule],
  controllers: [DashboardController, PolicyController, AdminDashboardController],
  providers: [DashboardService, PolicyService, AdminDashboardService, PrismaService],
  exports: [DashboardService, PolicyService, AdminDashboardService],
})
export class DashboardModule {}