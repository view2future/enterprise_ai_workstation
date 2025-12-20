import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { DashboardService } from '../services/dashboard.service';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('stats')
  @HttpCode(HttpStatus.OK)
  async getStats() {
    return this.dashboardService.getStats();
  }

  @Get('charts')
  @HttpCode(HttpStatus.OK)
  async getChartData() {
    return this.dashboardService.getChartData();
  }

  @Get('recent-activities')
  @HttpCode(HttpStatus.OK)
  async getRecentActivities() {
    return this.dashboardService.getRecentActivities();
  }

  @Get('overview')
  @HttpCode(HttpStatus.OK)
  async getOverview() {
    const [stats, chartData, recentActivities] = await Promise.all([
      this.dashboardService.getStats(),
      this.dashboardService.getChartData(),
      this.dashboardService.getRecentActivities(),
    ]);

    return {
      stats,
      chartData,
      recentActivities,
      timestamp: new Date().toISOString(),
    };
  }
}