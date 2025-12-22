import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateEnterpriseDto, UpdateEnterpriseDto, EnterpriseFilterDto } from '../dto/enterprise.dto';

@Injectable()
export class EnterprisesService {
  constructor(private prisma: PrismaService) {}

  /**
   * 带环境隔离的列表查询
   */
  async findAll(filters: EnterpriseFilterDto = {}, userEnv: string = 'PROD') {
    const {
      search,
      feijiangWenxin,
      priority,
      base,
      sort_field = 'updatedAt',
      sort_direction = 'desc',
      page = 0,
      limit = 50,
    } = filters;

    // 强制追加环境过滤
    const whereClause: any = { 
      status: 'active',
      env: userEnv // 核心隔离逻辑
    };

    if (search) {
      whereClause.enterpriseName = { contains: search, mode: 'insensitive' };
    }

    if (priority) whereClause.priority = priority;
    if (feijiangWenxin) whereClause.feijiangWenxin = feijiangWenxin;
    if (base) whereClause.base = { contains: base, mode: 'insensitive' };

    const total = await this.prisma.enterprise.count({ where: whereClause });
    const items = await this.prisma.enterprise.findMany({
      where: whereClause,
      skip: page * limit,
      take: limit,
      orderBy: { [sort_field]: sort_direction.toLowerCase() as 'asc' | 'desc' },
    });

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: number, userEnv: string = 'PROD') {
    const enterprise = await this.prisma.enterprise.findFirst({
      where: { id, status: 'active', env: userEnv },
    });

    if (!enterprise) throw new NotFoundException(`资产 #${id} 未能在当前环境解密`);
    return enterprise;
  }

  async create(createEnterpriseDto: CreateEnterpriseDto, userEnv: string = 'PROD') {
    // 检查名称唯一性 (在当前环境下)
    const existing = await this.prisma.enterprise.findFirst({
      where: { enterpriseName: createEnterpriseDto.企业名称, env: userEnv },
    });

    if (existing) throw new BadRequestException('该资产名称已在当前环境注册');

    // 转换 DTO 为 Prisma Data
    const data: any = {
      enterpriseName: createEnterpriseDto.企业名称,
      env: userEnv,
      feijiangWenxin: createEnterpriseDto.飞桨_文心,
      priority: createEnterpriseDto.优先级,
      base: createEnterpriseDto.base,
      registeredCapital: createEnterpriseDto.注册资本,
      employeeCount: createEnterpriseDto.参保人数,
      status: 'active',
      // ... 其他字段映射
      unifiedSocialCreditCode: createEnterpriseDto.unifiedSocialCreditCode,
      legalRepresentative: createEnterpriseDto.legalRepresentative,
      aiImplementationStage: createEnterpriseDto.aiImplementationStage,
      industry: createEnterpriseDto.行业
    };

    return this.prisma.enterprise.create({ data });
  }

  async update(id: number, updateDto: UpdateEnterpriseDto, userEnv: string = 'PROD') {
    const enterprise = await this.findOne(id, userEnv);

    const updateData: any = { ...updateDto };
    if (updateDto.企业名称) {
        updateData.enterpriseName = updateDto.企业名称;
        delete updateData.企业名称;
    }

    return this.prisma.enterprise.update({
      where: { id: enterprise.id },
      data: { ...updateData, updatedAt: new Date() },
    });
  }

  async remove(id: number, userEnv: string = 'PROD') {
    const enterprise = await this.findOne(id, userEnv);
    return this.prisma.enterprise.update({
      where: { id: enterprise.id },
      data: { status: 'deleted', updatedAt: new Date() },
    });
  }

  /**
   * 获取环境特定的统计数据
   */
  async getStatistics(userEnv: string = 'PROD') {
    const where = { status: 'active', env: userEnv };
    const [total, p0, feijiang, wenxin] = await Promise.all([
      this.prisma.enterprise.count({ where }),
      this.prisma.enterprise.count({ where: { ...where, priority: 'P0' } }),
      this.prisma.enterprise.count({ where: { ...where, feijiangWenxin: '飞桨' } }),
      this.prisma.enterprise.count({ where: { ...where, feijiangWenxin: '文心' } }),
    ]);

    return { total, p0, feijiang, wenxin };
  }
}
