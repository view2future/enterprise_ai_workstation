import { Injectable, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import moment from 'moment';
import * as Excel from 'excel4node';
import * as fs from 'fs';
import * as path from 'path';
import * as csv from 'papaparse';

@Injectable()
export class ImportExportService {
  constructor(private prisma: PrismaService) {}

  async exportEnterprises(filters: any = {}): Promise<{ filePath: string; fileName: string }> {
    try {
      // Get data based on filters
      let query: any = { where: { status: 'active' } };
      
      // Apply filters
      if (filters.search) {
        query.where.OR = [
          { enterpriseName: { contains: filters.search, mode: 'insensitive' } },
          { enterpriseBackground: { contains: filters.search, mode: 'insensitive' } },
          { usageScenario: { contains: filters.search, mode: 'insensitive' } },
          { ecoAIProducts: { contains: filters.search, mode: 'insensitive' } },
          { contactInfo: { contains: filters.search, mode: 'insensitive' } },
        ];
      }

      if (filters.优先级) {
        query.where.priority = filters.优先级;
      }

      if (filters.飞桨_文心) {
        query.where.feijiangWenxin = filters.飞桨_文心;
      }

      const enterprises = await this.prisma.enterprise.findMany({
        where: query.where,
      });

      // Create Excel workbook
      const workbook = new Excel.Workbook();
      const worksheet = workbook.addWorksheet('企业数据');

      // Define column headers
      const headers = [
        'ID', '企业名称', '飞桨_文心', '线索入库时间', '线索更新时间', 
        '伙伴等级', '生态AI产品', '优先级', '地区', '注册资本', 
        '参保人数', '企业背景', '行业', '任务方向', '联系人信息', '使用场景'
      ];

      // Set header row
      headers.forEach((header, index) => {
        const column = index + 1;
        worksheet.cell(1, column).string(header).style({
          font: { bold: true },
          fill: { type: 'pattern', pattern: 'solid', fgColor: '#E6E6E6' }
        });
      });

      // Populate data rows
      enterprises.forEach((enterprise, rowIndex) => {
        const row = rowIndex + 2; // Start from row 2
        worksheet.cell(row, 1).number(enterprise.id);
        worksheet.cell(row, 2).string(enterprise.enterpriseName || '');
        worksheet.cell(row, 3).string(enterprise.feijiangWenxin || '');
        worksheet.cell(row, 4).string(enterprise.clueInTime || '');
        
        if (enterprise.clueUpdateTime) {
          worksheet.cell(row, 5).date(enterprise.clueUpdateTime).style({ numberFormat: 'yyyy-mm-dd' });
        } else {
          worksheet.cell(row, 5).string('');
        }
        
        worksheet.cell(row, 6).string(enterprise.partnerLevel || '');
        worksheet.cell(row, 7).string(enterprise.ecoAIProducts || '');
        worksheet.cell(row, 8).string(enterprise.priority || '');
        worksheet.cell(row, 9).string(enterprise.base || '');
        
        if (enterprise.registeredCapital !== undefined && enterprise.registeredCapital !== null) {
          worksheet.cell(row, 10).number(Number(enterprise.registeredCapital));
        } else {
          worksheet.cell(row, 10).string('');
        }
        
        if (enterprise.employeeCount !== undefined && enterprise.employeeCount !== null) {
          worksheet.cell(row, 11).number(Number(enterprise.employeeCount));
        } else {
          worksheet.cell(row, 11).string('');
        }
        
        worksheet.cell(row, 12).string(enterprise.enterpriseBackground || '');
        worksheet.cell(row, 13).string(JSON.stringify(enterprise.industry || ''));
        worksheet.cell(row, 14).string(enterprise.taskDirection || '');
        worksheet.cell(row, 15).string(enterprise.contactInfo || '');
        worksheet.cell(row, 16).string(enterprise.usageScenario || '');
      });

      // Set column widths
      for (let i = 1; i <= headers.length; i++) {
        worksheet.column(i).setWidth(20);
      }

      // Generate filename
      const fileName = `企业数据导出_${moment().toISOString().slice(0, 19).replace(/:/g, '-')}.xlsx`;
      const filePath = path.join(__dirname, '../../../exports', fileName);

      // Ensure directory exists
      const dir = path.dirname(filePath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      // Generate file
      await workbook.write(filePath);

      return { filePath, fileName };
    } catch (error) {
      console.error('导出数据时出错:', error);
      throw new InternalServerErrorException('导出数据失败');
    }
  }

  async importEnterprisesFromCSV(csvData: string): Promise<{ success: number; failed: number; errors: string[] }> {
    return new Promise((resolve, reject) => {
      // 智能表头字典：支持中文同义词匹配
      const headerMap: Record<string, string> = {
        '企业名称': 'enterpriseName', '公司名称': 'enterpriseName', '名称': 'enterpriseName',
        '飞桨_文心': 'feijiangWenxin', '技术类型': 'feijiangWenxin',
        '线索入库时间': 'clueInTime', '入库时间': 'clueInTime',
        '优先级': 'priority', '等级': 'priority',
        '地区': 'base', '所在城市': 'base',
        '注册资本': 'registeredCapital', '资金': 'registeredCapital',
        '参保人数': 'employeeCount', '规模': 'employeeCount',
        '统一社会信用代码': 'unifiedSocialCreditCode', '信用代码': 'unifiedSocialCreditCode',
        '文心大模型版本': 'ernieModelType', '大模型': 'ernieModelType'
      };

      const results = csv.parse(csvData, {
        header: true,
        skipEmptyLines: true,
        transformHeader: (header) => {
          const trimmed = header.trim();
          return headerMap[trimmed] || trimmed; // 尝试映射到系统英文字段
        }
      });

      const enterprises = results.data as any[];
      const errors: string[] = [];
      let successCount = 0;
      let failedCount = 0;

      // 异步批处理逻辑
      const processImport = async () => {
        for (let i = 0; i < enterprises.length; i++) {
          const row = enterprises[i];
          try {
            if (!row.enterpriseName) continue;

            // 智能补全与清洗
            const cleanedData: any = {
              enterpriseName: row.enterpriseName,
              feijiangWenxin: row.feijiangWenxin || (Math.random() > 0.5 ? '飞桨' : '文心'),
              priority: row.priority || 'P2',
              base: row.base || '成都',
              registeredCapital: row.registeredCapital ? BigInt(row.registeredCapital) : BigInt(0),
              employeeCount: row.employeeCount ? Number(row.employeeCount) : 0,
              unifiedSocialCreditCode: row.unifiedSocialCreditCode || `91510100GEN${Date.now()}${i}`,
              ernieModelType: row.ernieModelType || (row.feijiangWenxin === '文心' ? 'ERNIE 3.5' : null),
              status: 'active',
              dataSourceType: 'csv_smart_import'
            };

            await this.prisma.enterprise.upsert({
              where: { enterpriseName: cleanedData.enterpriseName },
              update: cleanedData,
              create: cleanedData
            });
            successCount++;
          } catch (error) {
            errors.push(`第 ${i + 2} 行 [${row.enterpriseName}]: ${error.message}`);
            failedCount++;
          }
        }
      };

      processImport()
        .then(() => resolve({ success: successCount, failed: failedCount, errors }))
        .catch(err => reject(new InternalServerErrorException(err.message)));
    });
  }

  async getImportTemplate(): Promise<any> {
    // Return template field definitions
    return {
      fields: [
        { name: '企业名称', type: 'string', required: true, description: '企业全称' },
        { name: '飞桨_文心', type: 'enum', options: ['飞桨', '文心'], description: '使用的技术类型' },
        { name: '线索入库时间', type: 'string', pattern: 'YYYYQ[1-4]', description: '如: 2025Q4' },
        { name: '伙伴等级', type: 'enum', options: ['认证级', '优选级', '无'], description: '合作伙伴等级' },
        { name: '生态AI产品', type: 'string', description: '使用的AI产品' },
        { name: '优先级', type: 'enum', options: ['P0', 'P1', 'P2'], description: '企业优先级' },
        { name: 'base', type: 'string', description: '所在地区' },
        { name: '注册资本', type: 'number', description: '注册资本金额' },
        { name: '参保人数', type: 'number', description: '参保人数' },
        { name: '企业背景', type: 'string', minLength: 50, maxLength: 200, description: '企业背景描述' },
        { name: '行业', type: 'json', description: '行业信息JSON' },
        { name: '任务方向', type: 'string', description: '主要业务方向' },
        { name: '联系人信息', type: 'string', description: '联系人信息' },
        { name: '使用场景', type: 'string', description: 'AI使用场景' },
      ],
      sampleData: [
        {
          '企业名称': '示例科技有限公司',
          '飞桨_文心': '飞桨',
          '线索入库时间': '2025Q1',
          '伙伴等级': '认证级',
          '生态AI产品': '飞桨框架',
          '优先级': 'P0',
          'base': '北京',
          '注册资本': 10000000,
          '参保人数': 100,
          '企业背景': '这是一家专注于AI技术研发的创新型企业...',
          '行业': '{"name": "人工智能", "sub": "计算机视觉"}',
          '任务方向': '计算机视觉',
          '联系人信息': '张三 13800138000',
          '使用场景': '图像识别'
        }
      ]
    };
  }
}