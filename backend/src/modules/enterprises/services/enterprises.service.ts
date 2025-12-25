import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class EnterprisesService {
  private readonly logger = new Logger(EnterprisesService.name);

  constructor(private prisma: PrismaService) {}

  async findAll(filters: any = {}, userEnvScope: string) {
    const { searchTerm, keyword, region, base, clueStage, expiry, page = 0, limit = 10 } = filters;
    const currentScope = userEnvScope || 'PROD';

    const search = searchTerm || keyword;
    const finalBase = region || base;

    const whereClause: any = { 
      envScope: currentScope,
      status: 'active'
    };

    if (search) {
      whereClause.OR = [
        { enterpriseName: { contains: search } },
        { industry: { contains: search } },
        { taskDirection: { contains: search } },
        { feijiangWenxin: { contains: search } },
      ];
    }
    if (finalBase) {
      whereClause.base = finalBase;
    }
    if (clueStage && clueStage !== '') {
      whereClause.clueStage = clueStage;
    }

    // 处理效期预警逻辑 (90天内过期)
    if (expiry === 'soon') {
      const now = new Date();
      const ninetyDaysLater = new Date();
      ninetyDaysLater.setDate(now.getDate() + 90);
      
      whereClause.certExpiryDate = {
        gte: now,
        lte: ninetyDaysLater
      };
    }

    try {
      const [total, items] = await Promise.all([
        this.prisma.enterprise.count({ where: whereClause }),
        this.prisma.enterprise.findMany({
          where: whereClause,
          skip: Number(page) * Number(limit),
          take: Number(limit),
          orderBy: expiry === 'soon' 
            ? { certExpiryDate: 'asc' } // 最快到期的排在最前面
            : { updatedAt: 'desc' }
        })
      ]);

      return { items, total, page, limit };
    } catch (error) {
      this.logger.error(`findAll Failed: ${error.message}`);
      return { items: [], total: 0, page, limit };
    }
  }

  async findOne(id: number, userEnvScope: string) {
    const ent = await this.prisma.enterprise.findFirst({
      where: { id, envScope: userEnvScope, status: 'active' }
    });
    if (!ent) throw new NotFoundException('Enterprise not found');
    return ent;
  }

  async create(dto: any, userEnvScope: string) {
    return this.prisma.enterprise.create({
      data: {
        ...dto,
        envScope: userEnvScope,
        status: 'active'
      }
    });
  }

  async update(id: number, dto: any, userEnvScope: string) {
    // 验证归属
    await this.findOne(id, userEnvScope);
    return this.prisma.enterprise.update({
      where: { id },
      data: { ...dto, updatedAt: new Date() }
    });
  }

  async remove(id: number, userEnvScope: string) {
    // 验证归属
    await this.findOne(id, userEnvScope);
    return this.prisma.enterprise.update({
      where: { id },
      data: { status: 'deleted' }
    });
  }

  async getStatistics(userEnvScope: string) {
    const where = { envScope: userEnvScope, status: 'active' };
    try {
      const [total, p0, clueStats] = await Promise.all([
        this.prisma.enterprise.count({ where }),
        this.prisma.enterprise.count({ where: { ...where, priority: 'P0' } }),
        this.prisma.enterprise.groupBy({
          by: ['clueStage'],
          where,
          _count: { id: true }
        })
      ]);
      return { total, p0, clueStats };
    } catch (error) {
      this.logger.error(`getStatistics Failed: ${error.message}`);
      return { total: 0, p0: 0, clueStats: [] };
    }
  }

  async parseUnstructured(text: string) {
    // 暂时返回 Mock，防止编译报错
    return {
      enterpriseName: 'Parsed Enterprise',
      confidence: 0.8
    };
  }
}