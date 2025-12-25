import { Controller, Post, Body, UseGuards, Request, HttpCode, HttpStatus, Get, Param } from '@nestjs/common';
import { PolicyService } from '../services/policy.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@Controller('policies')
@UseGuards(JwtAuthGuard)
export class PolicyController {
  constructor(private readonly policyService: PolicyService) {}

  @Post('analyze-url')
  @HttpCode(HttpStatus.OK)
  async analyzeUrl(@Body('url') url: string, @Request() req) {
    return this.policyService.analyzePolicyFromUrl(url, req.user.envScope, req.user.userId);
  }

  @Get()
  async getPolicies(@Request() req) {
    return this.policyService.getPolicies(req.user.envScope);
  }

  @Get(':id')
  async getPolicyDetail(@Param('id') id: string, @Request() req) {
    return this.policyService.getPolicyDetail(+id, req.user.envScope);
  }
}
