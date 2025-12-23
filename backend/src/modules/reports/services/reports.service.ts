import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import * as path from 'path';
import * as fs from 'fs';
import { exec } from 'child_process';
import { promisify } from 'util';

const execPromise = promisify(exec);

@Injectable()
export class ReportsService {
  private readonly logger = new Logger(ReportsService.name);

  constructor(private prisma: PrismaService) {}

  async findAll(userEnv: string) {
    return this.prisma.report.findMany({
      where: { envScope: userEnv },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: number, userEnv: string) {
    const report = await this.prisma.report.findFirst({
      where: { id, envScope: userEnv },
    });
    if (!report) throw new NotFoundException('报告不存在');
    return report;
  }

  /**
   * V5 构建引擎：调用 Vite 进行生产级单文件编译 (Single-File Build)
   */
  async buildReportFile(id: number, userEnv: string): Promise<{ filePath: string; fileName: string }> {
    const report = await this.findOne(id, userEnv);
    const enterprises = await this.prisma.enterprise.findMany({
      where: { status: 'active', envScope: userEnv },
      orderBy: { priority: 'asc' }
    });

    const dateStr = new Date().toISOString().split('T')[0].replace(/-/g, '');
    const fileName = `西南AI_${report.title}_${dateStr}.html`;
    
    // 路径计算
    const rootDir = process.cwd().endsWith('backend') ? path.join(process.cwd(), '..') : process.cwd();
    const frontendDir = path.join(rootDir, 'frontend');
    const distReportsDir = path.join(rootDir, 'dist_reports');
    if (!fs.existsSync(distReportsDir)) fs.mkdirSync(distReportsDir);

    try {
      this.logger.log(`--- [COMPILER V5] 开始构建 ${report.type} 级全息报告 ---`);
      
      // 1. 调用前端 Vite 打包命令
      // 我们在命令行中注入数据占位符，Vite 会将其打包进 JS
      this.logger.log('正在执行 Vite 生产级编译...');
      await execPromise('npm run build:report', { cwd: frontendDir });

      // 2. 读取编译后的单 HTML 文件 (dist/report.html)
      const compiledPath = path.join(frontendDir, 'dist', 'report.html');
      let html = fs.readFileSync(compiledPath, 'utf-8');

      // 3. 核心：动态数据注入 (将数据嵌入 window.__REPORT_DATA__)
      // 在 HTML 中寻找并替换数据脚本标签
      const dataPayload = JSON.stringify({ report, enterprises });
      html = html.replace(
        '<div id="report-root"></div>',
        `<script>window.__REPORT_DATA__ = ${dataPayload};</script><div id="report-root"></div>`
      );

      // 4. 将生成的终极单文件写入归档目录
      const finalPath = path.join(distReportsDir, fileName);
      fs.writeFileSync(finalPath, html);

      this.logger.log(`✅ 全息构建成功: ${fileName}`);
      return { filePath: finalPath, fileName };

    } catch (error) {
      this.logger.error('构建流水线崩溃:', error);
      throw new Error(`编译失败: ${error.message}`);
    }
  }

  async generateReport(dto: any, userEnv: string) {
    return this.prisma.report.create({
      data: {
        title: dto.title,
        type: dto.type,
        format: 'V5_SINGLEFILE',
        envScope: userEnv,
        status: 'ready'
      }
    });
  }

  async remove(id: number, userEnv: string) {
    const report = await this.findOne(id, userEnv);
    return this.prisma.report.delete({ where: { id: report.id } });
  }

  async getStatsSummary(userEnv: string) {
    const total = await this.prisma.report.count({ where: { envScope: userEnv } });
    return { total, ready: total };
  }
}