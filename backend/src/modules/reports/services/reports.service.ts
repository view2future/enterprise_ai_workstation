
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import * as xl from 'excel4node';
import * as path from 'path';
import * as fs from 'fs';

@Injectable()
export class ReportsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.report.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: number) {
    const report = await this.prisma.report.findUnique({
      where: { id },
    });
    if (!report) throw new NotFoundException('报告未找到');
    return report;
  }

  async generateReport(dto: any) {
    const { title, type, description, filters, modules = ['summary', 'details'] } = dto;

    const report = await this.prisma.report.create({
      data: {
        title: String(title),
        type: String(type),
        format: 'EXCEL',
        status: 'generating',
        description: description || '',
        filters: filters ? JSON.stringify(filters) : null,
        createdAt: new Date(),
      },
    });

    const enterprises = await this.prisma.enterprise.findMany({
      where: { status: 'active', ...(this.getPeriodFilter(type, filters)) }
    });

    this.assembleIntelligence(report.id, enterprises, modules);
    return report;
  }

  private getPeriodFilter(type: string, manualFilters: any) {
    if (manualFilters && Object.keys(manualFilters).length > 0) return manualFilters;
    const now = new Date();
    const start = new Date();
    switch (type) {
      case 'WEEKLY': start.setDate(now.getDate() - 7); break;
      case 'MONTHLY': start.setMonth(now.getMonth() - 1); break;
      case 'QUARTERLY': start.setMonth(now.getMonth() - 3); break;
      case 'YEARLY': start.setFullYear(now.getFullYear() - 1); break;
      default: return {};
    }
    return { createdAt: { gte: start } };
  }

  private async assembleIntelligence(reportId: number, enterprises: any[], modules: string[]) {
    try {
      const wb = new xl.Workbook();
      const ws = wb.addWorksheet('INTEL');
      
      const style = wb.createStyle({
        font: { color: '#000000', size: 12, bold: true },
      });

      ws.cell(1, 1).string('ID').style(style);
      ws.cell(1, 2).string('企业名称').style(style);
      ws.cell(1, 3).string('战力等级').style(style);
      ws.cell(1, 4).string('核心技术').style(style);
      ws.cell(1, 5).string('月均API').style(style);
      ws.cell(1, 6).string('所属地区').style(style);

      enterprises.forEach((e, i) => {
        const row = i + 2;
        ws.cell(row, 1).number(e.id);
        ws.cell(row, 2).string(e.enterpriseName || '-');
        ws.cell(row, 3).string(e.priority || '-');
        ws.cell(row, 4).string(e.feijiangWenxin || '-');
        ws.cell(row, 5).number(Number(e.avgMonthlyApiCalls || 0));
        ws.cell(row, 6).string(e.base || '-');
      });

      const fileName = `INTEL_${Date.now()}.xlsx`;
      const uploadDir = path.join(process.cwd(), 'uploads', 'reports');
      if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
      const filePath = path.join(uploadDir, fileName);

      wb.write(filePath, async (err, stats) => {
        if (err) {
          await this.prisma.report.update({ where: { id: reportId }, data: { status: 'failed' } });
        } else {
          await this.prisma.report.update({
            where: { id: reportId },
            data: { filePath: fileName, status: 'ready', updatedAt: new Date() },
          });
        }
      });
    } catch (error) {
      await this.prisma.report.update({ where: { id: reportId }, data: { status: 'failed' } });
    }
  }

  async remove(id: number) {
    return this.prisma.report.delete({ where: { id } });
  }

  async getStatsSummary() {
    const total = await this.prisma.report.count();
    const ready = await this.prisma.report.count({ where: { status: 'ready' } });
    return { total, ready };
  }
}
