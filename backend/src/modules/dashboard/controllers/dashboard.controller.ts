import { Controller, Get, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { DashboardService } from '../services/dashboard.service';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('stats')
  @HttpCode(HttpStatus.OK)
  async getStats(@Query('timeRange') timeRange: string) {
    return this.dashboardService.getStats(timeRange);
  }

  @Get('charts')
  @HttpCode(HttpStatus.OK)
  async getChartData(@Query('timeRange') timeRange: string) {
    return this.dashboardService.getChartData(timeRange);
  }

  @Get('recent-activities')
  @HttpCode(HttpStatus.OK)
  async getRecentActivities(@Query('timeRange') timeRange: string) {
    return this.dashboardService.getRecentActivities(timeRange);
  }

  @Get('overview')
  @HttpCode(HttpStatus.OK)
  async getOverview(@Query('timeRange') timeRange: string) {
    const [stats, chartData, recentActivities] = await Promise.all([
      this.dashboardService.getStats(timeRange),
      this.dashboardService.getChartData(timeRange),
      this.dashboardService.getRecentActivities(timeRange),
    ]);

    return {
      stats,
      chartData,
      recentActivities,
      timestamp: new Date().toISOString(),
    };
  }

  @Get('tech-radar')
  @HttpCode(HttpStatus.OK)
  async getTechRadar() {
    return this.dashboardService.getTechRadarData();
  }

  @Get('ecosystem')
  @HttpCode(HttpStatus.OK)
  async getEcosystem() {
    return this.dashboardService.getEcosystemHealthData();
  }
}