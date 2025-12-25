import { Controller, Get, Post, Body, UseGuards, Query, Request, HttpCode, HttpStatus } from '@nestjs/common';
import { DashboardService } from '../services/dashboard.service';
import { PolicyService } from '../services/policy.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';

@Controller('dashboard')
@UseGuards(JwtAuthGuard, RolesGuard)
export class DashboardController {
  constructor(
    private readonly dashboardService: DashboardService,
    private readonly policyService: PolicyService,
  ) {}

  @Get('stats')
  async getStats(@Request() req) {
    const envScope = req.user.envScope || 'PROD';
    return this.dashboardService.getStats(envScope);
  }

  @Get('advanced-stats')
  async getAdvancedStats(@Request() req) {
    const envScope = req.user.envScope || 'PROD';
    return this.dashboardService.getAdvancedStats(envScope);
  }

  @Get('overview')
  async getOverview(@Query('timeRange') timeRange: string, @Request() req) {
    const envScope = req.user.envScope || 'PROD';
    const [stats, chartData, recentActivities] = await Promise.all([
      this.dashboardService.getStats(envScope),
      this.dashboardService.getChartData(timeRange, envScope),
      this.dashboardService.getRecentActivities(timeRange, envScope),
    ]);
    return { stats, chartData, recentActivities, timestamp: new Date().toISOString() };
  }

  @Get('charts')
  async getCharts(@Query('timeRange') timeRange: string, @Request() req) {
    const envScope = req.user.envScope || 'PROD';
    return this.dashboardService.getChartData(timeRange, envScope);
  }

  @Get('map-data')
  async getMapData(@Request() req) {
    const envScope = req.user.envScope || 'PROD';
    return this.dashboardService.getMapData(envScope);
  }

  @Get('tech-radar')
  async getTechRadar(@Request() req) {
    const envScope = req.user.envScope || 'PROD';
    return this.dashboardService.getTechRadarData(envScope);
  }

  @Get('ecosystem')
  async getEcosystem(@Request() req) {
    const envScope = req.user.envScope || 'PROD';
    return this.dashboardService.getEcosystemHealthData(envScope);
  }

  @Get('usage')
  @Roles('SUPER_ADMIN')
  async getUsage() {
    return this.dashboardService.getFeatureUsage();
  }

  @Post('policies/analyze-url')
  @Roles('ADMIN', 'SUPER_ADMIN')
  @HttpCode(HttpStatus.OK)
  async analyzePolicyUrl(@Body('url') url: string, @Request() req) {
    const envScope = req.user.envScope || 'PROD';
    const userId = req.user.id || req.user.userId || req.user.sub;
    return this.policyService.analyzePolicyFromUrl(url, envScope, userId);
  }

  @Get('policies/mindmap')
  async getPolicyMindMap(@Query('id') id: string) {
    return this.policyService.getPolicyMindMap(parseInt(id));
  }
}
