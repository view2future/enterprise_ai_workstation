import { Controller, Get, Post, Body, UseGuards, Query } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { PolicyService } from './services/policy.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('dashboard')
@UseGuards(JwtAuthGuard, RolesGuard)
export class DashboardController {
  constructor(
    private readonly dashboardService: DashboardService,
    private readonly policyService: PolicyService,
  ) {}

  @Get('stats')
  async getStats() {
    return this.dashboardService.getStats();
  }

  @Get('usage')
  @Roles('SUPER_ADMIN')
  async getUsage() {
    return this.dashboardService.getFeatureUsage();
  }

  @Post('policies/analyze-url')
  @Roles('ADMIN', 'SUPER_ADMIN')
  async analyzePolicyUrl(@Body('url') url: string) {
    return this.policyService.analyzePolicy(url);
  }

  @Get('policies/mindmap')
  async getPolicyMindMap(@Query('id') id: string) {
    return this.policyService.getPolicyMindMap(parseInt(id));
  }
}
