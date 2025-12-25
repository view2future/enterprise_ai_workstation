import { Controller, Get, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { AdminDashboardService } from '../services/admin-dashboard.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../../guards/roles.guard';
import { Roles } from '../../../decorators/roles.decorator';

@Controller('admin/dashboard')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AdminDashboardController {
  constructor(private readonly adminDashboardService: AdminDashboardService) {}

  @Get('god-view')
  @Roles('CORTEX', 'ARCHITECT') // 两者皆可看大盘
  @HttpCode(HttpStatus.OK)
  async getGodView() {
    return this.adminDashboardService.getGodViewStats();
  }

  @Get('users')
  @Roles('ARCHITECT') // 仅限架构师管理用户
  @HttpCode(HttpStatus.OK)
  async getUsers() {
    return this.adminDashboardService.getAllUsers();
  }

  @Get('usage-trends')
  @Roles('ARCHITECT') // 仅限架构师监控系统趋势
  @HttpCode(HttpStatus.OK)
  async getUsageTrends() {
    return this.adminDashboardService.getGlobalTrends();
  }
}
