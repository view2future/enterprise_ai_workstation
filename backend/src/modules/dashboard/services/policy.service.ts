import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../../prisma/prisma.service';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class PolicyService {
  private readonly logger = new Logger(PolicyService.name);
  private readonly MOONSHOT_API_URL = 'https://api.moonshot.cn/v1/chat/completions';

  constructor(
    private prisma: PrismaService,
    private httpService: HttpService,
    private configService: ConfigService,
  ) {}

  async createPolicy(data: any, userEnv: string) {
    // Legacy method support
    const analysis = data.analysis ? JSON.parse(data.analysis) : this.generateBrainMap(data.content || '');
    return this.prisma.policy.create({
      data: {
        ...data,
        analysis: JSON.stringify(analysis),
        envScope: userEnv,
      },
    });
  }

  async getPolicies(userEnv: string) {
    return this.prisma.policy.findMany({
      where: { envScope: userEnv, status: 'active' },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getPolicyDetail(id: number, userEnv: string) {
    const policy = await this.prisma.policy.findFirst({
      where: { id, envScope: userEnv },
    });
    if (policy && policy.analysis) {
      try {
        policy.analysis = JSON.parse(policy.analysis);
      } catch (e) {
        // ignore parse error
      }
    }
    if (policy && policy.mindMapJson) {
      try {
        const mindMap = JSON.parse(policy.mindMapJson);
        // Merge or prefer mindMapJson over analysis if available
        (policy as any).mindMap = mindMap;
      } catch (e) {
        // ignore
      }
    }
    return policy;
  }

  /**
   * V5.0 Nexus Commander: Intelligent Policy Analysis via LLM
   */
  async analyzePolicyFromUrl(url: string, userEnv: string, userId?: number) {
    this.logger.log(`Starting policy analysis for URL: ${url}`);
    
    // 1. Fetch Content (Simple simulation/stripping for now)
    let rawContent = '';
    try {
      const response = await lastValueFrom(this.httpService.get(url));
      rawContent = this.stripHtml(response.data);
      if (rawContent.length > 8000) rawContent = rawContent.substring(0, 8000) + '...[truncated]';
    } catch (error) {
      this.logger.warn(`Failed to fetch URL directly, using placeholder. Error: ${error.message}`);
      rawContent = `Unable to crawl content from ${url}. Please paste content manually.`;
    }

    // 2. Call LLM for Analysis
    let aiResult = await this.callMoonshotLLM(rawContent);
    
    // 3. Save to DB
    const newPolicy = await this.prisma.policy.create({
      data: {
        title: aiResult.title || 'Untitled Policy',
        sourceUrl: url,
        content: rawContent,
        summary: aiResult.summary,
        publishCity: aiResult.publishCity,
        publishYear: aiResult.publishYear ? parseInt(aiResult.publishYear) : new Date().getFullYear(),
        industryTags: aiResult.industryTags,
        mindMapJson: JSON.stringify(aiResult.mindMap),
        analysis: JSON.stringify(aiResult.mindMap), // Backward compatibility
        envScope: userEnv,
        processStatus: 'COMPLETED',
      },
    });

    return newPolicy;
  }

  private stripHtml(html: string): string {
    if (!html) return '';
    return html.replace(/<[^>]*>?/gm, '');
  }

  private async callMoonshotLLM(content: string): Promise<any> {
    const apiKey = this.configService.get<String>('MOONSHOT_API_KEY');
    if (!apiKey) {
      this.logger.error('MOONSHOT_API_KEY not found');
      return this.generateMockResult();
    }

    const prompt = `
      You are a Policy Analysis Expert. Analyze the following policy text (which may be raw scraped text) and extract key information.
      
      Return a STRICT JSON object (no markdown formatting) with the following structure:
      {
        "title": "Policy Title",
        "summary": "A concise summary of the policy (max 200 words)",
        "publishCity": "City or Region name (e.g., Beijing)",
        "publishYear": "YYYY",
        "industryTags": "Comma separated tags (e.g., AI, Manufacturing)",
        "mindMap": {
          "nodes": [{"id": "root", "label": "Title", "color": "#3b82f6"}],
          "links": [{"source": "root", "target": "child"}]
        }
      }

      For the mindMap, create a simple tree structure showing: Target Audience, Support Measures (Money/Resources), Qualifications, and Timeline.
      
      Text to analyze:
      ${content.substring(0, 5000)}
    `;

    try {
      const payload = {
        model: 'moonshot-v1-8k',
        messages: [
            { role: "system", content: "You are a helpful assistant that outputs only JSON." },
            { role: "user", content: prompt }
        ],
        temperature: 0.3,
      };

      const response = await lastValueFrom(
        this.httpService.post(this.MOONSHOT_API_URL, payload, {
          headers: {
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
        })
      );

      const contentStr = response.data.choices[0].message.content;
      // Clean up markdown code blocks if present
      const jsonStr = contentStr.replace(/```json/g, '').replace(/```/g, '').trim();
      return JSON.parse(jsonStr);

    } catch (error) {
      this.logger.error('LLM Call failed', error.response?.data || error.message);
      return this.generateMockResult();
    }
  }

  private generateMockResult() {
    return {
      title: 'AI Policy Analysis (Mock)',
      summary: 'LLM analysis failed or key missing. This is a placeholder.',
      publishCity: 'Unknown',
      publishYear: new Date().getFullYear(),
      industryTags: 'General',
      mindMap: this.generateBrainMap(''),
    };
  }

  private generateBrainMap(content: string) {
    return {
      nodes: [
        { id: 'root', label: 'Policy Core', color: '#3b82f6', size: 40 },
        { id: 'target', label: 'Target', color: '#f59e0b', size: 30 },
      ],
      links: [
        { source: 'root', target: 'target' },
      ]
    };
  }
}