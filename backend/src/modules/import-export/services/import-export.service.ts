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
      const results = csv.parse(csvData, {
        header: true,
        skipEmptyLines: true,
        transform: (value) => {
          // Trim whitespace
          return typeof value === 'string' ? value.trim() : value;
        }
      });

      const enterprises = results.data as any[];
      const errors: string[] = [];
      let successCount = 0;
      let failedCount = 0;

      // Process and validate data
      const processedEnterprises = enterprises.map((row, index) => {
        try {
          // Validate required fields
          if (!row['企业名称']) {
            throw new Error(`第${index + 2}行: 企业名称是必需的`);
          }

          // Validate 飞桨_文心 field
          if (row['飞桨_文心'] && !['飞桨', '文心', ''].includes(row['飞桨_文心'])) {
            throw new Error(`第${index + 2}行: 飞桨_文心字段值无效`);
          }

          // Validate 优先级 field
          if (row['优先级'] && !['P0', 'P1', 'P2', ''].includes(row['优先级'])) {
            throw new Error(`第${index + 2}行: 优先级字段值无效`);
          }

          // Validate 伙伴等级 field
          if (row['伙伴等级'] && !['认证级', '优选级', '无', ''].includes(row['伙伴等级'])) {
            throw new Error(`第${index + 2}行: 伙伴等级字段值无效`);
          }

          // Convert data types
          const enterprise: any = {
            enterpriseName: row['企业名称'],
            feijiangWenxin: row['飞桨_文心'] || null,
            clueInTime: row['线索入库时间'] || null,
            partnerLevel: row['伙伴等级'] || null,
            ecoAIProducts: row['生态AI产品'] || null,
            priority: row['优先级'] || null,
            base: row['base'] || row['地区'] || null,
            registeredCapital: row['注册资本'] ? BigInt(row['注册资本']) : null,
            employeeCount: row['参保人数'] ? Number(row['参保人数']) : null,
            enterpriseBackground: row['企业背景'] || null,
            industry: row['行业'] ? JSON.parse(row['行业']) : null,
            taskDirection: row['任务方向'] || null,
            contactInfo: row['联系人信息'] || null,
            usageScenario: row['使用场景'] || null,
          };

          return enterprise;
        } catch (error) {
          errors.push(`${error.message} - 原始数据: ${JSON.stringify(row)}`);
          failedCount++;
          return null;
        }
      }).filter(Boolean) as any[];

      // Batch insert or update enterprises
      const processBatch = async (batch: any[], batchSize = 100) => {
        for (let i = 0; i < batch.length; i += batchSize) {
          const batchChunk = batch.slice(i, i + batchSize);
          for (const enterprise of batchChunk) {
            try {
              // Check if enterprise name already exists
              const existing = await this.prisma.enterprise.findUnique({
                where: { enterpriseName: enterprise.enterpriseName },
              });

              if (existing) {
                // Update existing enterprise
                await this.prisma.enterprise.update({
                  where: { id: existing.id },
                  data: enterprise,
                });
              } else {
                // Create new enterprise
                await this.prisma.enterprise.create({
                  data: { ...enterprise, status: 'active' },
                });
              }
              successCount++;
            } catch (error) {
              errors.push(`处理企业 "${enterprise.enterpriseName}" 时出错: ${error.message}`);
              failedCount++;
            }
          }
        }
      };

      processBatch(processedEnterprises)
        .then(() => {
          resolve({ success: successCount, failed: failedCount, errors });
        })
        .catch(error => {
          reject(new InternalServerErrorException(`导入数据时出错: ${error.message}`));
        });
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