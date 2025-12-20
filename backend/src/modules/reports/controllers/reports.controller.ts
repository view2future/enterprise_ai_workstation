
import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpStatus,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { ReportsService } from '../services/reports.service';
import * as path from 'path';
import * as fs from 'fs';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async generateReport(@Body() createReportDto: any) {
    // 确保调用 Service 中存在的方法名
    return this.reportsService.generateReport(createReportDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll() {
    return this.reportsService.findAll();
  }

  @Get('stats/summary')
  @HttpCode(HttpStatus.OK)
  async getReportStats() {
    return this.reportsService.getStatsSummary();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: string) {
    return this.reportsService.findOne(+id);
  }

  @Get(':id/download')
  async downloadReport(@Param('id') id: string, @Res() res: Response): Promise<void> {
    const report = await this.reportsService.findOne(+id);
    
    if (!report.filePath) {
      res.status(HttpStatus.NOT_FOUND).send('Report file not generated yet');
      return;
    }
    
    const filePath = path.join(process.cwd(), 'uploads', 'reports', report.filePath);
    
    if (!fs.existsSync(filePath)) {
      res.status(HttpStatus.NOT_FOUND).send('Physical file not found');
      return;
    }

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(report.title)}.xlsx"`);
    
    return res.sendFile(filePath);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async deleteReport(@Param('id') id: string) {
    return this.reportsService.remove(+id);
  }
}
