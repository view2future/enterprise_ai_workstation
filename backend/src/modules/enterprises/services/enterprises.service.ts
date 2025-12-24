import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateEnterpriseDto, UpdateEnterpriseDto, EnterpriseFilterDto, ClueStage } from '../dto/enterprise.dto';
import { NlpParserService } from './nlp-parser.service';

@Injectable()
export class EnterprisesService {
  private readonly logger = new Logger(EnterprisesService.name);

  constructor(
    private prisma: PrismaService,
    private nlpService: NlpParserService
  ) {}

  async findAll(filters: EnterpriseFilterDto = {}, userEnvScope: string) {
    const { keyword, base, clueStage, partnerLevel, expiry, page = 0, limit = 50 } = filters as any;
    
    const whereClause: any = { 
      status: 'active', 
      envScope: userEnvScope 
    };

    if (keyword) {
      whereClause.OR = [
        { enterpriseName: { contains: keyword } },
        { enterpriseBackground: { contains: keyword } }
      ];
    }
    if (base) whereClause.base = base;
    if (clueStage) whereClause.clueStage = clueStage;
    if (partnerLevel) whereClause.partnerLevel = partnerLevel;

    // V4.0 效期预警过滤与排序
    let orderBy: any = { updatedAt: 'desc' };
    if (expiry === 'soon') {
      whereClause.certExpiryDate = {
        lte: new Date(new Date().getTime() + 90 * 24 * 60 * 60 * 1000),
        gte: new Date()
      };
      orderBy = { certExpiryDate: 'asc' }; // 越接近当前时间越靠前
    }

    const total = await this.prisma.enterprise.count({ where: whereClause });
    const items = await this.prisma.enterprise.findMany({
      where: whereClause,
      skip: page * limit,
      take: limit,
      orderBy: orderBy
    });

    // 适配 SQLite JSON 解析
    const jsonFields = ['industry', 'paddleModels', 'baiduCertificates', 'eventParticipation', 'jointSolutions'];
    const parsedItems = items.map(item => {
      jsonFields.forEach(field => {
        if (typeof item[field] === 'string') {
          try { item[field] = JSON.parse(item[field]); } catch (e) {}
        }
      });
      return item;
    });

    return { items: parsedItems, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findOne(id: number, userEnvScope: string) {
    const ent = await this.prisma.enterprise.findFirst({
      where: { id, status: 'active', envScope: userEnvScope }
    });
    if (!ent) throw new NotFoundException(`资产 #${id} 在 ${userEnvScope} 环境中不存在`);
    
    const jsonFields = ['industry', 'paddleModels', 'baiduCertificates', 'eventParticipation', 'jointSolutions'];
    jsonFields.forEach(field => {
      if (typeof ent[field] === 'string') {
        try { ent[field] = JSON.parse(ent[field]); } catch (e) {}
      }
    });

    return ent;
  }

  async create(dto: CreateEnterpriseDto, userEnvScope: string) {
    return this.prisma.enterprise.create({
      data: {
        ...dto,
        envScope: userEnvScope,
        status: 'active'
      } as any
    });
  }

  async update(id: number, dto: UpdateEnterpriseDto, userEnvScope: string) {
    const ent = await this.findOne(id, userEnvScope);
    return this.prisma.enterprise.update({
      where: { id: ent.id },
      data: { ...dto, updatedAt: new Date() } as any
    });
  }

  async remove(id: number, userEnvScope: string) {
    const ent = await this.findOne(id, userEnvScope);
    return this.prisma.enterprise.update({
      where: { id: ent.id },
      data: { status: 'deleted' }
    });
  }

  /**
   * V4.0 智研极速入库引擎：本地 NLP 提取
   */
  async parseUnstructured(text: string) {
    return this.nlpService.parseFollowUpText(text);
  }

  async getStatistics(userEnvScope: string) {
    const where = { status: 'active', envScope: userEnvScope };
    
    // V4.0 线索漏斗统计
    const [total, p0, clueStats, expiryWarnings] = await Promise.all([
      this.prisma.enterprise.count({ where }),
      this.prisma.enterprise.count({ where: { ...where, priority: 'P0' } }),
      this.prisma.enterprise.groupBy({
        by: ['clueStage'],
        where,
        _count: { _all: true }
      }),
      // 证书效期预警 (3个月内)
      this.prisma.enterprise.count({
        where: {
          ...where,
          certExpiryDate: {
            lte: new Date(new Date().getTime() + 90 * 24 * 60 * 60 * 1000),
            gte: new Date()
          }
        }
      })
    ]);

    return { total, p0, clueStats, expiryWarnings };
  }
}