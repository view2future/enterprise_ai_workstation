import { Injectable, Logger } from '@nestjs/common';
import { ClueStage, ClueSource } from '../dto/enterprise.dto';

@Injectable()
export class NlpParserService {
  private readonly logger = new Logger(NlpParserService.name);

  /**
   * 本地 NLP 解析引擎：基于规则与关键词提取
   * 针对电话回访文本进行深度识别
   */
  async parseFollowUpText(text: string) {
    this.logger.log('Executing local NLP extraction sequence...');

    const result: any = {
      enterpriseName: this.extractEnterpriseName(text),
      industry: this.extractIndustry(text),
      base: this.extractBase(text),
      clueStage: this.determineStage(text),
      clueSource: ClueSource.PHONE, // 默认为电话回访
      techStack: this.extractTechStack(text),
      hardwareContext: this.extractHardware(text),
      background: this.extractSection(text, '企业背景'),
      scenario: this.extractSection(text, '需求场景'),
      progress: this.extractSection(text, '进展'),
    };

    return result;
  }

  private extractEnterpriseName(text: string): string {
    // 匹配类似 "卓望集团【智慧教育】" 或 "上海云赜数据技术有限公司"
    const match = text.match(/^([\u4e00-\u9fa5a-zA-Z0-9]+集团|[\u4e00-\u9fa5a-zA-Z0-9]+有限公司)/);
    return match ? match[1] : '未知主体';
  }

  private extractIndustry(text: string): string {
    const match = text.match(/【(.*?)】/);
    return match ? match[1] : '通用行业';
  }

  private extractBase(text: string): string {
    const match = text.match(/base[：: ]\s*(\S+)/i);
    return match ? match[1] : '成都'; // 默认成都
  }

  private determineStage(text: string): ClueStage {
    const progress = this.extractSection(text, '进展');
    if (progress.includes('测试') || progress.includes('调研') || progress.includes('环境搭载')) {
      return ClueStage.EMPOWERING;
    }
    if (progress.includes('合同') || progress.includes('采购') || progress.includes('正式使用')) {
      return ClueStage.ADOPTED;
    }
    if (progress.includes('推广') || progress.includes('推荐')) {
      return ClueStage.POWERED_BY;
    }
    return ClueStage.LEAD;
  }

  private extractTechStack(text: string): string[] {
    const keywords = ['PaddleOCR', 'pp-ocrv5', '文心', 'ERNIE', '混元'];
    return keywords.filter(k => text.includes(k));
  }

  private extractHardware(text: string): string {
    const keywords = ['昇腾', '910B', 'CPU', 'GPU', '显卡'];
    const found = keywords.filter(k => text.includes(k));
    return found.join(', ');
  }

  private extractSection(text: string, sectionName: string): string {
    const regex = new RegExp(`${sectionName}[：:]([\s\S]*?)(?=\n\n|\n[\u4e00-\u9fa5]+[：:]|$)`);
    const match = text.match(regex);
    return match ? match[1].trim() : '';
  }
}
