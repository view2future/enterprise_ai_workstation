import { Controller, Get, HttpCode, HttpStatus, Query, UseGuards, Request } from '@nestjs/common';
import { DashboardService } from '../services/dashboard.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@Controller('dashboard')
@UseGuards(JwtAuthGuard)
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('map-data')
  @HttpCode(HttpStatus.OK)
  async getMapData(@Request() req) {
    return this.dashboardService.getMapData(req.user.envScope);
  }

  @Get('stats')
  @HttpCode(HttpStatus.OK)
  async getStats(@Query('timeRange') timeRange: string, @Request() req) {
    return this.dashboardService.getStats(timeRange, req.user.envScope);
  }

  @Get('charts')
  @HttpCode(HttpStatus.OK)
  async getChartData(@Query('timeRange') timeRange: string, @Request() req) {
    return this.dashboardService.getChartData(timeRange, req.user.envScope);
  }

  @Get('overview')
  @HttpCode(HttpStatus.OK)
  async getOverview(@Query('timeRange') timeRange: string, @Request() req) {
    const [stats, chartData, recentActivities] = await Promise.all([
      this.dashboardService.getStats(timeRange, req.user.envScope),
      this.dashboardService.getChartData(timeRange, req.user.envScope),
      this.dashboardService.getRecentActivities(timeRange, req.user.envScope),
    ]);

    return { stats, chartData, recentActivities, timestamp: new Date().toISOString() };
  }

  @Get('tech-radar')
  @HttpCode(HttpStatus.OK)
  async getTechRadar(@Request() req) {
    return this.dashboardService.getTechRadarData(req.user.envScope);
  }

  @Get('ecosystem')
  @HttpCode(HttpStatus.OK)
  async getEcosystem(@Request() req) {
    return this.dashboardService.getEcosystemHealthData(req.user.envScope);
  }
}
