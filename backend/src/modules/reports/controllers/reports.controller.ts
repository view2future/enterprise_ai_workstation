import {
  Controller, Get, Post, Delete, Body, Param, HttpCode, HttpStatus, Res, UseGuards, Request
} from '@nestjs/common';
import { ReportsService } from '../services/reports.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@Controller('reports')
@UseGuards(JwtAuthGuard)
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async generateReport(@Body() createReportDto: any, @Request() req) {
    return this.reportsService.generateReport(createReportDto, req.user.envScope);
  }

  @Post(':id/build')
  @HttpCode(HttpStatus.OK)
  async buildReport(@Param('id') id: string, @Request() req) {
    return this.reportsService.buildReportFile(+id, req.user.envScope);
  }

  @Get()
  async findAll(@Request() req) {
    return this.reportsService.findAll(req.user.envScope);
  }

  @Get('stats/summary')
  @HttpCode(HttpStatus.OK)
  async getReportStats(@Request() req) {
    return this.reportsService.getStatsSummary(req.user.envScope);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: string, @Request() req) {
    return this.reportsService.findOne(+id, req.user.envScope);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async deleteReport(@Param('id') id: string, @Request() req) {
    return this.reportsService.remove(+id, req.user.envScope);
  }
}