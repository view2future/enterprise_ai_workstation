import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export interface SearchResult {
  title: string;
  snippet: string;
  link: string;
  source: string;
  date?: string;
}

export interface ExtractedEntity {
  officialName?: string;
  unifiedCode?: string;
  legalRep?: string;
  registeredCapital?: string;
  establishmentDate?: string;
  address?: string;
  confidence: number;
  sources: { field: string; url: string }[];
}

@Injectable()
export class SearchService {
  private readonly logger = new Logger(SearchService.name);
  private readonly googleApiKey: string;
  private readonly googleCx: string;
  private readonly geminiApiKey: string;

  constructor(private configService: ConfigService) {
    this.googleApiKey = this.configService.get<string>('GOOGLE_API_KEY');
    this.googleCx = this.configService.get<string>('GOOGLE_SEARCH_CX');
    this.geminiApiKey = this.configService.get<string>('GEMINI_API_KEY');
  }

  /**
   * 执行全网深猎搜索 (Deep Truth Strategy)
   * 使用 Google Custom Search API 获取权威数据
   */
  async performDeepSearch(query: string): Promise<SearchResult[]> {
    this.logger.log(`Executing Deep Web Search (Google API) for: ${query}`);

    if (!this.googleApiKey || !this.googleCx) {
      this.logger.error('Google API Key or CX not configured');
      throw new Error('Search configuration missing');
    }

    // 构建结构化查询矩阵 (Precision Matrix)
    // 限制在权威站点或使用特定关键词
    const refinedQuery = `${query} (工商信息 OR 统一社会信用代码 OR 法人代表 OR 注册资本)`;
    
    try {
      const results = await this.executeGoogleSearch(refinedQuery);
      return results;
    } catch (error) {
      this.logger.error(`Google Search failed: ${error.message}`);
      // 生产环境应考虑重试或降级，这里直接抛出以便上层处理
      throw error;
    }
  }

  /**
   * LLM 认知提取层 (Gemini 1.5 Pro/Flash)
   * 使用 Gemini API 进行多源交叉验证 (Triangulation)
   */
  async extractInformationWithLLM(searchResults: SearchResult[]): Promise<ExtractedEntity> {
    this.logger.log('Invoking LLM Cognitive Layer (Gemini API)...');

    if (!this.geminiApiKey) {
       this.logger.error('Gemini API Key not configured');
       throw new Error('LLM configuration missing');
    }

    return this.executeGeminiExtraction(searchResults);
  }

  // --- 私有方法 (Private Methods) ---

    private async executeGoogleSearch(query: string): Promise<SearchResult[]> {
      const url = new URL('https://www.googleapis.com/customsearch/v1');
      url.searchParams.append('key', this.googleApiKey);
      url.searchParams.append('cx', this.googleCx);
      url.searchParams.append('q', query);
      url.searchParams.append('num', '10'); 
      url.searchParams.append('gl', 'cn'); 
  
      const maskedKey = this.googleApiKey ? `${this.googleApiKey.substring(0, 5)}...` : 'MISSING';
      this.logger.debug(`Sending Google Search Request (Key: ${maskedKey})`);
  
      try {
        // 设置 15 秒超时
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000);
  
        const response = await fetch(url.toString(), { 
          signal: controller.signal 
        });
        
        clearTimeout(timeoutId);
  
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Google API responded with ${response.status}: ${errorText.substring(0, 200)}`);
        }
  
        const data = await response.json();
  
        if (!data.items || data.items.length === 0) {
          this.logger.warn('No results found from Google Search');
          return [];
        }
  
        return data.items.map((item: any) => ({
          title: item.title,
          snippet: item.snippet,
          link: item.link,
          source: item.displayLink || 'Google Search',
          date: new Date().toISOString().split('T')[0] 
        }));
  
      } catch (error) {
        if (error.name === 'AbortError') {
          throw new Error('Google Search API 请求超时 (15s)。请检查网络连接。');
        }
        // 捕获底层网络错误 (如 DNS, Connection Refused)
        if (error.cause) {
           throw new Error(`网络层错误: ${error.cause.code || error.message}. 请确保服务器可以访问 googleapis.com`);
        }
        throw error;
      }
    }
  
    private async executeGeminiExtraction(searchResults: SearchResult[]): Promise<ExtractedEntity> {
      // 1. 构建 Prompt (保持不变)
      const context = searchResults.map((r, i) => `[Source ${i + 1}] Title: ${r.title}\nSnippet: ${r.snippet}\nLink: ${r.link}`).join('\n\n');
      
      const prompt = `
        You are an expert Enterprise Intelligence Analyst. Your task is to extract precise corporate information from the following search results.
        
        SEARCH RESULTS:
        ${context}
  
        INSTRUCTIONS:
        1. Extract the following fields: 
           - Official Company Name (full registered name)
           - Unified Social Credit Code (18-digit code)
           - Legal Representative (Name)
           - Registered Capital (Amount with currency)
           - Establishment Date (YYYY-MM-DD)
           - Address (Registered address)
        
        2. TRIANGULATION & CONFIDENCE:
           - Compare information across multiple sources.
           - Calculate a 'confidence' score (0-100) based on:
             - Consistency (do multiple sources say the same thing?)
             - Authority (are the sources like qcc.com, tianyancha.com, gsxt.gov.cn?)
           - If sources conflict, pick the most authoritative one or the most recent one.
        
        3. EVIDENCE LINKS:
           - For each field, identify the Source Index (e.g., Source 1) that best provides the evidence.
        
        OUTPUT FORMAT (Strict JSON):
        {
          "officialName": "string",
          "unifiedCode": "string",
          "legalRep": "string",
          "registeredCapital": "string",
          "establishmentDate": "string",
          "address": "string",
          "confidence": number,
          "sources": [
             { "field": "All", "url": "url_of_primary_source" }
          ]
        }
        
        If a field is not found, use null. Do NOT fabricate information.
      `;
  
      // 2. 调用 Gemini API
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${this.geminiApiKey}`;
      
      const payload = {
        contents: [{
          parts: [{ text: prompt }]
        }],
        generationConfig: {
          responseMimeType: "application/json"
        }
      };
  
      try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 20000); // LLM 可能慢一点，20s
  
          const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
            signal: controller.signal
          });
  
          clearTimeout(timeoutId);
  
          if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Gemini API Error: ${response.status} - ${errorText.substring(0, 200)}`);
          }
  
          const data = await response.json();
          
          try {
            const textResponse = data.candidates[0].content.parts[0].text;
            const parsed = JSON.parse(textResponse);
            
            return {
              officialName: parsed.officialName || '未找到',
              unifiedCode: parsed.unifiedCode || '未找到',
              legalRep: parsed.legalRep || '未找到',
              registeredCapital: parsed.registeredCapital || '未找到',
              establishmentDate: parsed.establishmentDate || '未找到',
              address: parsed.address || '未找到',
              confidence: parsed.confidence || 50,
              sources: searchResults.slice(0, 3).map(r => ({ field: '综合信息', url: r.link })) 
            };
          } catch (e) {
            this.logger.error('Failed to parse Gemini response', e);
            throw new Error('AI 返回的数据格式无法解析');
          }
      } catch (error) {
          if (error.name === 'AbortError') {
              throw new Error('Gemini AI 推理超时 (20s)。');
          }
          throw error;
      }
    }}