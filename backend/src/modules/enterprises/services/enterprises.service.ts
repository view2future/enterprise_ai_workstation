import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateEnterpriseDto, UpdateEnterpriseDto, EnterpriseFilterDto } from '../dto/enterprise.dto';

@Injectable()
export class EnterprisesService {
  private readonly logger = new Logger(EnterprisesService.name);

  constructor(private prisma: PrismaService) {}

  async findAll(filters: EnterpriseFilterDto = {}, userEnvScope: string) {
    const { search, base, priority, feijiangWenxin, page = 0, limit = 50 } = filters;
    
    // 强制过滤环境，不设默认值以防隐性泄露
    const whereClause: any = { 
      status: 'active', 
      envScope: userEnvScope 
    };

    if (search) whereClause.enterpriseName = { contains: search, mode: 'insensitive' };
    if (base) whereClause.base = base;
    if (priority) whereClause.priority = priority;
    if (feijiangWenxin) whereClause.feijiangWenxin = feijiangWenxin;

    const total = await this.prisma.enterprise.count({ where: whereClause });
    const items = await this.prisma.enterprise.findMany({
      where: whereClause,
      skip: page * limit,
      take: limit,
      orderBy: { updatedAt: 'desc' }
    });

    return { items, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findOne(id: number, userEnvScope: string) {
    const ent = await this.prisma.enterprise.findFirst({
      where: { id, status: 'active', envScope: userEnvScope }
    });
    if (!ent) throw new NotFoundException(`资产 #${id} 在 ${userEnvScope} 环境中不存在`);
    return ent;
  }

  async create(dto: CreateEnterpriseDto, userEnvScope: string) {
    return this.prisma.enterprise.create({
      data: {
        enterpriseName: dto.企业名称,
        envScope: userEnvScope,
        base: dto.base,
        priority: dto.优先级,
        feijiangWenxin: dto.飞桨_文心,
        status: 'active'
      }
    });
  }

  async update(id: number, dto: UpdateEnterpriseDto, userEnvScope: string) {
    const ent = await this.findOne(id, userEnvScope);
    return this.prisma.enterprise.update({
      where: { id: ent.id },
      data: { ...dto, updatedAt: new Date() }
    });
  }

  async remove(id: number, userEnvScope: string) {
    const ent = await this.findOne(id, userEnvScope);
    return this.prisma.enterprise.update({
      where: { id: ent.id },
      data: { status: 'deleted' }
    });
  }

  async getStatistics(userEnvScope: string) {
    const where = { status: 'active', envScope: userEnvScope };
    const [total, p0, feijiang, wenxin] = await Promise.all([
      this.prisma.enterprise.count({ where }),
      this.prisma.enterprise.count({ where: { ...where, priority: 'P0' } }),
      this.prisma.enterprise.count({ where: { ...where, feijiangWenxin: '飞桨' } }),
      this.prisma.enterprise.count({ where: { ...where, feijiangWenxin: '文心' } }),
    ]);
    return { total, p0, feijiang, wenxin };
  }
}