import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  UsePipes,
  ValidationPipe,
  Res,
  StreamableFile,
} from '@nestjs/common';
import { Response } from 'express';
import { ReportsService } from '../services/reports.service';
import { Report, ReportType, ReportFormat, ReportStatus } from '../../../entities/report.entity';

export class CreateReportDto {
  title: string;
  type: ReportType;
  format: ReportFormat;
  description?: string;
  filters?: any;
  configuration?: any;
}

export class ReportFilterDto {
  type?: ReportType;
  status?: ReportStatus;
  created_by?: string;
  page?: number;
  limit?: number;
}

@Controller('reports')
@UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createReport(@Body() createReportDto: CreateReportDto) {
    return this.reportsService.createReport(createReportDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAllReports(@Query() filters: ReportFilterDto) {
    return this.reportsService.findAllReports(filters);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOneReport(@Param('id') id: number) {
    return this.reportsService.findOneReport(id);
  }

  @Get(':id/download')
  async downloadReport(@Param('id') id: number, @Res() res: Response): Promise<void> {
    const report = await this.reportsService.findOneReport(id);
    
    if (!report.filePath) {
      throw new Error('Report file not found');
    }
    
    if (!report.fileName) {
      throw new Error('Report file name not found');
    }
    
    res.setHeader('Content-Type', this.getContentType(report.format as ReportFormat));
    res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(report.fileName)}"`);
    
    return res.sendFile(report.filePath);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async deleteReport(@Param('id') id: number) {
    return this.reportsService.deleteReport(id);
  }

  @Get('stats/summary')
  @HttpCode(HttpStatus.OK)
  async getReportStats() {
    return this.reportsService.getReportStats();
  }

  private getContentType(format: ReportFormat): string {
    switch (format) {
      case ReportFormat.PDF:
        return 'application/pdf';
      case ReportFormat.EXCEL:
        return 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
      case ReportFormat.CSV:
        return 'text/csv';
      case ReportFormat.JSON:
        return 'application/json';
      default:
        return 'application/octet-stream';
    }
  }
}