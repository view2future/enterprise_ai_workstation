import { Controller, Get, HttpCode, HttpStatus, Query, UseGuards } from '@nestjs/common';
import { DashboardService } from '../services/dashboard.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@Controller('dashboard')
@UseGuards(JwtAuthGuard)
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('map-data')
  @HttpCode(HttpStatus.OK)
  async getMapData() {
    return this.dashboardService.getMapData();
  }

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

  @Get('overview')
  @HttpCode(HttpStatus.OK)
  async getOverview(@Query('timeRange') timeRange: string) {
    const [stats, chartData] = await Promise.all([
      this.dashboardService.getStats(timeRange),
      this.dashboardService.getChartData(timeRange),
    ]);

    return {
      stats,
      chartData,
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
