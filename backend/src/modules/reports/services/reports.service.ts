import { Injectable, NotFoundException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import * as Excel from 'excel4node';
import * as fs from 'fs';
import * as path from 'path';
import moment from 'moment';
import { Report, ReportStatus, ReportFormat, ReportType } from '../../../entities/report.entity';

@Injectable()
export class ReportsService {
  constructor(private prisma: PrismaService) {}

  async createReport(createReportDto: {
    title: string;
    type: ReportType;
    format: ReportFormat;
    description?: string;
    filters?: any;
    configuration?: any;
    created_by?: string;
  }): Promise<Report> {
    const reportData = await this.prisma.report.create({
      data: {
        title: createReportDto.title,
        type: createReportDto.type,
        format: createReportDto.format,
        description: createReportDto.description,
        filters: createReportDto.filters,
        configuration: createReportDto.configuration,
        createdBy: createReportDto.created_by,
        status: ReportStatus.PENDING,
        dataCount: 0,
        progress: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    const report: Report = {
      ...reportData,
      created_at: reportData.createdAt,
      updated_at: reportData.updatedAt,
      completed_at: reportData.completedAt,
      errorMessage: reportData.errorMessage,
      dataCount: reportData.dataCount,
    } as any;

    // Process the report asynchronously
    this.processReport(report.id).catch(error => {
      console.error(`Error processing report ${report.id}:`, error);
    });

    return report;
  }

  async processReport(reportId: number) {
    try {
      const report = await this.prisma.report.findUnique({ where: { id: reportId } });
      if (!report) {
        throw new NotFoundException(`Report with ID ${reportId} not found`);
      }

      // Update status to processing
      await this.prisma.report.update({
        where: { id: reportId },
        data: { 
          status: ReportStatus.PROCESSING,
          progress: 5,
          updatedAt: new Date(),
        },
      });

      // Fetch data based on report type and filters
      let query: any = { where: { status: 'active' } };
      
      // Apply filters if provided
      if (report.filters) {
        const { 
          search, 
          飞桨_文心, 
          优先级, 
          伙伴等级, 
          线索入库时间,
          注册资本_min,
          注册资本_max,
          参保人数_min,
          参保人数_max,
          base
        } = report.filters as any;

        if (search) {
          query.where.OR = [
            { 企业名称: { contains: search, mode: 'insensitive' } },
            { 企业背景: { contains: search, mode: 'insensitive' } },
            { 使用场景: { contains: search, mode: 'insensitive' } },
            { 生态AI产品: { contains: search, mode: 'insensitive' } },
            { 联系人信息: { contains: search, mode: 'insensitive' } },
          ];
        }

        if (飞桨_文心) {
          query.where.飞桨_文心 = 飞桨_文心;
        }

        if (优先级) {
          query.where.优先级 = 优先级;
        }

        if (伙伴等级) {
          query.where.伙伴等级 = 伙伴等级;
        }

        if (线索入库时间) {
          query.where.线索入库时间 = 线索入库时间;
        }

        if (base) {
          query.where.base = base;
        }

        if (注册资本_min !== undefined) {
          query.where.注册资本 = { gte: 注册资本_min };
        }

        if (注册资本_max !== undefined) {
          const rcFilter = query.where.注册资本 || {};
          rcFilter.lte = 注册资本_max;
          query.where.注册资本 = rcFilter;
        }

        if (参保人数_min !== undefined) {
          query.where.参保人数 = { gte: 参保人数_min };
        }

        if (参保人数_max !== undefined) {
          const ecFilter = query.where.参保人数 || {};
          ecFilter.lte = 参保人数_max;
          query.where.参保人数 = ecFilter;
        }
      }

      const enterprises = await this.prisma.enterprise.findMany(query);
      const dataCount = enterprises.length;

      await this.prisma.report.update({
        where: { id: reportId },
        data: { 
          progress: 25,
          dataCount,
          updatedAt: new Date(),
        },
      });

      // Generate report based on format
      let filePath: string;
      let fileName: string;

      switch (report.format) {
        case ReportFormat.EXCEL:
          const excelResult = await this.generateExcelReport(report, enterprises);
          filePath = excelResult.filePath;
          fileName = excelResult.fileName;
          break;
        case ReportFormat.CSV:
          const csvResult = await this.generateCsvReport(report, enterprises);
          filePath = csvResult.filePath;
          fileName = csvResult.fileName;
          break;
        case ReportFormat.PDF:
          const pdfResult = await this.generatePdfReport(report, enterprises);
          filePath = pdfResult.filePath;
          fileName = pdfResult.fileName;
          break;
        case ReportFormat.JSON:
          const jsonResult = await this.generateJsonReport(report, enterprises);
          filePath = jsonResult.filePath;
          fileName = jsonResult.fileName;
          break;
        default:
          throw new BadRequestException(`Unsupported report format: ${report.format}`);
      }

      await this.prisma.report.update({
        where: { id: reportId },
        data: {
          status: ReportStatus.COMPLETED,
          progress: 100,
          filePath,
          fileName,
          completedAt: new Date(),
          updatedAt: new Date(),
        },
      });
    } catch (error) {
      console.error(`Error processing report ${reportId}:`, error);
      await this.prisma.report.update({
        where: { id: reportId },
        data: {
          status: ReportStatus.FAILED,
          progress: 100,
          errorMessage: error.message,
          completedAt: new Date(),
          updatedAt: new Date(),
        },
      });
      throw error;
    }
  }

  private async generateExcelReport(report: any, enterprises: any[]): Promise<{ filePath: string; fileName: string }> {
    const workbook = new Excel.Workbook();
    const worksheet = workbook.addWorksheet('企业数据报告');

    // Define headers based on report type
    let headers: string[];
    switch (report.type) {
      case ReportType.SUMMARY:
        headers = ['ID', '企业名称', '飞桨_文心', '优先级', '伙伴等级', '注册资本(万)', '参保人数', '地区'];
        break;
      case ReportType.DETAILED:
        headers = ['ID', '企业名称', '飞桨_文心', '线索入库时间', '伙伴等级', '生态AI产品', '优先级', '地区', '注册资本', '参保人数', '企业背景', '行业', '任务方向', '联系人信息', '使用场景'];
        break;
      case ReportType.PRIORITY:
        headers = ['ID', '企业名称', '优先级', '飞桨_文心', '伙伴等级', '注册资本(万)', '参保人数'];
        break;
      case ReportType.AI_USAGE:
        headers = ['ID', '企业名称', '飞桨_文心', '生态AI产品', '使用场景', '优先级', '伙伴等级'];
        break;
      case ReportType.REGIONAL:
        headers = ['ID', '企业名称', '地区', '飞桨_文心', '优先级', '注册资本(万)', '参保人数'];
        break;
      case ReportType.PARTNER:
        headers = ['ID', '企业名称', '伙伴等级', '飞桨_文心', '优先级', '注册资本(万)', '参保人数'];
        break;
      default:
        headers = ['ID', '企业名称', '飞桨_文心', '优先级', '伙伴等级', '注册资本', '参保人数', '地区'];
    }

    // Set headers
    headers.forEach((header, index) => {
      const column = index + 1;
      worksheet.cell(1, column).string(header).style({
        font: { bold: true },
        fill: { type: 'pattern', pattern: 'solid', fgColor: '#E6E6E6' }
      });
    });

    // Fill data rows
    enterprises.forEach((enterprise, rowIndex) => {
      const row = rowIndex + 2; // Start from row 2
      worksheet.cell(row, 1).number(enterprise.id);
      worksheet.cell(row, 2).string(enterprise.企业名称 || '');
      worksheet.cell(row, 3).string(enterprise.飞桨_文心 || '');
      
      switch (report.type) {
        case ReportType.SUMMARY:
        case ReportType.DETAILED:
        case ReportType.PRIORITY:
        case ReportType.AI_USAGE:
        case ReportType.REGIONAL:
        case ReportType.PARTNER:
          // Add appropriate columns based on report type
          worksheet.cell(row, 4).string(enterprise.优先级 || '');
          worksheet.cell(row, 5).string(enterprise.伙伴等级 || '');
          if (enterprise.注册资本 !== undefined && enterprise.注册资本 !== null) {
            worksheet.cell(row, 6).number(Number(enterprise.注册资本) / 10000); // Convert to 万
          } else {
            worksheet.cell(row, 6).string('');
          }
          if (enterprise.参保人数 !== undefined && enterprise.参保人数 !== null) {
            worksheet.cell(row, 7).number(Number(enterprise.参保人数));
          } else {
            worksheet.cell(row, 7).string('');
          }
          worksheet.cell(row, 8).string(enterprise.base || '');
          break;
        default:
          worksheet.cell(row, 4).string(enterprise.优先级 || '');
          worksheet.cell(row, 5).string(enterprise.伙伴等级 || '');
          if (enterprise.注册资本 !== undefined && enterprise.注册资本 !== null) {
            worksheet.cell(row, 6).number(Number(enterprise.注册资本));
          } else {
            worksheet.cell(row, 6).string('');
          }
          if (enterprise.参保人数 !== undefined && enterprise.参保人数 !== null) {
            worksheet.cell(row, 7).number(Number(enterprise.参保人数));
          } else {
            worksheet.cell(row, 7).string('');
          }
          worksheet.cell(row, 8).string(enterprise.base || '');
      }
    });

    // Set column widths
    for (let i = 1; i <= headers.length; i++) {
      worksheet.column(i).setWidth(20);
    }

    // Generate file name
    const timestamp = moment().format('YYYYMMDD_HHmmss');
    const fileName = `${report.title.replace(/\s+/g, '_')}_${timestamp}.xlsx`;
    const filePath = path.join(__dirname, '../../../reports', fileName);

    // Ensure directory exists
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    // Generate file
    await workbook.write(filePath);

    return { filePath, fileName };
  }

  private async generateCsvReport(report: any, enterprises: any[]): Promise<{ filePath: string; fileName: string }> {
    // Create CSV content
    let headers: string[];
    switch (report.type) {
      case ReportType.SUMMARY:
        headers = ['ID', '企业名称', '飞桨_文心', '优先级', '伙伴等级', '注册资本(万)', '参保人数', '地区'];
        break;
      case ReportType.DETAILED:
        headers = ['ID', '企业名称', '飞桨_文心', '线索入库时间', '伙伴等级', '生态AI产品', '优先级', '地区', '注册资本', '参保人数', '企业背景', '行业', '任务方向', '联系人信息', '使用场景'];
        break;
      case ReportType.PRIORITY:
        headers = ['ID', '企业名称', '优先级', '飞桨_文心', '伙伴等级', '注册资本(万)', '参保人数'];
        break;
      case ReportType.AI_USAGE:
        headers = ['ID', '企业名称', '飞桨_文心', '生态AI产品', '使用场景', '优先级', '伙伴等级'];
        break;
      case ReportType.REGIONAL:
        headers = ['ID', '企业名称', '地区', '飞桨_文心', '优先级', '注册资本(万)', '参保人数'];
        break;
      case ReportType.PARTNER:
        headers = ['ID', '企业名称', '伙伴等级', '飞桨_文心', '优先级', '注册资本(万)', '参保人数'];
        break;
      default:
        headers = ['ID', '企业名称', '飞桨_文心', '优先级', '伙伴等级', '注册资本', '参保人数', '地区'];
    }

    let csvContent = headers.join(',') + '\n';

    enterprises.forEach(enterprise => {
      const row = [
        enterprise.id,
        `"${enterprise.企业名称 || ''}"`,
        `"${enterprise.飞桨_文心 || ''}"`,
        `"${enterprise.优先级 || ''}"`,
        `"${enterprise.伙伴等级 || ''}"`,
        enterprise.注册资本 ? (Number(enterprise.注册资本) / 10000).toFixed(2) : '',
        enterprise.参保人数 || '',
        `"${enterprise.base || ''}"`
      ].join(',');
      csvContent += row + '\n';
    });

    // Generate file name
    const timestamp = moment().format('YYYYMMDD_HHmmss');
    const fileName = `${report.title.replace(/\s+/g, '_')}_${timestamp}.csv`;
    const filePath = path.join(__dirname, '../../../reports', fileName);

    // Ensure directory exists
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    // Write file
    fs.writeFileSync(filePath, csvContent);

    return { filePath, fileName };
  }

  private async generateJsonReport(report: any, enterprises: any[]): Promise<{ filePath: string; fileName: string }> {
    const reportData = {
      title: report.title,
      type: report.type,
      format: report.format,
      description: report.description,
      filters: report.filters,
      configuration: report.configuration,
      generatedAt: new Date().toISOString(),
      dataCount: enterprises.length,
      data: enterprises
    };

    // Generate file name
    const timestamp = moment().format('YYYYMMDD_HHmmss');
    const fileName = `${report.title.replace(/\s+/g, '_')}_${timestamp}.json`;
    const filePath = path.join(__dirname, '../../../reports', fileName);

    // Ensure directory exists
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    // Write file
    fs.writeFileSync(filePath, JSON.stringify(reportData, null, 2));

    return { filePath, fileName };
  }

  private async generatePdfReport(report: any, enterprises: any[]): Promise<{ filePath: string; fileName: string }> {
    // For now, we'll just create a simple placeholder PDF
    // In a real implementation, you'd want to use a proper PDF generation library
    
    // Generate file name
    const timestamp = moment().format('YYYYMMDD_HHmmss');
    const fileName = `${report.title.replace(/\s+/g, '_')}_${timestamp}.pdf`;
    const filePath = path.join(__dirname, '../../../reports', fileName);

    // Ensure directory exists
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    // Create a simple placeholder
    fs.writeFileSync(filePath, 'PDF placeholder content');

    return { filePath, fileName };
  }

  async findAllReports(filters: { 
    type?: ReportType; 
    status?: ReportStatus; 
    created_by?: string;
    page?: number;
    limit?: number;
  } = {}) {
    const { type, status, created_by, page = 0, limit = 20 } = filters;
    
    const whereClause: any = {};
    
    if (type) {
      whereClause.type = type;
    }
    
    if (status) {
      whereClause.status = status;
    }
    
    if (created_by) {
      whereClause.createdBy = created_by;
    }
    
    const [items, total] = await this.prisma.$transaction([
      this.prisma.report.findMany({
        where: whereClause,
        skip: page * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.report.count({ where: whereClause }),
    ]);

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOneReport(id: number) {
    const report = await this.prisma.report.findUnique({ where: { id } });
    
    if (!report) {
      throw new NotFoundException(`Report with ID ${id} not found`);
    }
    
    return report;
  }

  async deleteReport(id: number) {
    const report = await this.prisma.report.findUnique({ where: { id } });
    
    if (!report) {
      throw new NotFoundException(`Report with ID ${id} not found`);
    }
    
    // Delete the report file if it exists
    if (report.filePath && fs.existsSync(report.filePath)) {
      fs.unlinkSync(report.filePath);
    }
    
    await this.prisma.report.delete({ where: { id } });
    return { message: 'Report deleted successfully' };
  }

  async getReportStats() {
    const totalReports = await this.prisma.report.count();
    const completedReports = await this.prisma.report.count({
      where: { status: ReportStatus.COMPLETED }
    });
    const pendingReports = await this.prisma.report.count({
      where: { status: ReportStatus.PENDING }
    });
    const failedReports = await this.prisma.report.count({
      where: { status: ReportStatus.FAILED }
    });

    return {
      total: totalReports,
      completed: completedReports,
      pending: pendingReports,
      failed: failedReports,
      successRate: totalReports > 0 ? (completedReports / totalReports * 100).toFixed(2) + '%' : '0%',
    };
  }
}