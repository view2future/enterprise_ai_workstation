import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import axios from 'axios';
const cheerio = require('cheerio');

@Injectable()
export class PolicyService {
  private readonly logger = new Logger(PolicyService.name);
  private readonly MOONSHOT_API_KEY = process.env.MOONSHOT_API_KEY;

  constructor(private prisma: PrismaService) {}

  async analyzePolicyFromUrl(url: string, envScope: string, userId: number) {
    return this.analyzePolicy(url, envScope);
  }

  async getPolicies(envScope: string) {
    return this.prisma.policy.findMany({
      where: { envScope },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getPolicyDetail(id: number, envScope: string) {
    const policy = await this.prisma.policy.findFirst({
      where: { id, envScope },
    });
    if (!policy) throw new NotFoundException('Policy not found');
    return policy;
  }

  async analyzePolicy(url: string, envScope: string = 'PROD') {
    this.logger.log(`Analyzing policy from URL: ${url}`);
    
    const policy = await this.prisma.policy.create({
      data: {
        title: 'Pending Analysis...',
        content: '',
        type: 'GOVERNMENT',
        level: 'NATIONAL',
        originalUrl: url,
        processStatus: 'PROCESSING',
        envScope: envScope,
      }
    });

    this.runAnalysis(policy.id, url).catch(err => {
      this.logger.error(`Analysis failed for ${url}: ${err.message}`);
    });

    return {
      success: true,
      message: 'Policy analysis started in background',
      policyId: policy.id
    };
  }

  private async runAnalysis(policyId: number, url: string) {
    try {
      const response = await axios.get(url);
      const $ = cheerio.load(response.data);
      
      $('script').remove();
      $('style').remove();
      const content = $('body').text().replace(/\s+/g, ' ').trim().substring(0, 10000);
      const title = $('title').text() || 'Untitled Policy';

      const aiResult = await this.callKimiAI(content);

      await this.prisma.policy.update({
        where: { id: policyId },
        data: {
          title: aiResult.title || title,
          content: content,
          summary: aiResult.summary,
          publishCity: aiResult.city,
          publishYear: aiResult.year,
          industryTags: aiResult.tags,
          mindMapString: JSON.stringify(aiResult.mindMap),
          processStatus: 'COMPLETED',
        }
      });
      
      this.logger.log(`Analysis completed for policy ID: ${policyId}`);
    } catch (error) {
      await this.prisma.policy.update({
        where: { id: policyId },
        data: { processStatus: 'FAILED' }
      });
      throw error;
    }
  }

  private async callKimiAI(content: string) {
    const prompt = `
    请分析以下政策文件内容，提取关键信息。
    输出格式要求为 JSON，包含以下字段：
    - title: 政策完整标题
    - summary: 200字以内的核心摘要
    - city: 发布的城市（如果没有则填全国）
    - year: 发布年份（整数）
    - tags: 适用行业标签（逗号分隔）
    - mindMap: 脑图结构（包含 nodes 和 edges 的 JSON 对象，用于描述政策层级逻辑）

    内容如下：
    ${content}
    `;

    try {
      const response = await axios.post(
        'https://api.moonshot.cn/v1/chat/completions',
        {
          model: 'moonshot-v1-8k',
          messages: [
            { role: 'system', content: '你是一个专业的政策分析专家。' },
            { role: 'user', content: prompt }
          ],
          response_format: { type: 'json_object' }
        },
        {
          headers: {
            'Authorization': `Bearer ${this.MOONSHOT_API_KEY}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return JSON.parse(response.data.choices[0].message.content);
    } catch (error) {
      this.logger.error(`AI call failed: ${error.message}`);
      return {
        title: 'Analysis Failed',
        summary: 'Failed to analyze with AI',
        city: 'Unknown',
        year: null,
        tags: '',
        mindMap: {}
      };
    }
  }

  async getPolicyMindMap(id: number) {
    const policy = await this.prisma.policy.findUnique({
      where: { id }
    });
    return policy?.mindMapString ? JSON.parse(policy.mindMapString) : null;
  }
}
