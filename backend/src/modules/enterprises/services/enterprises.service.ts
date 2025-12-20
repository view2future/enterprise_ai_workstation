import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateEnterpriseDto, UpdateEnterpriseDto, EnterpriseFilterDto } from '../dto/enterprise.dto';

@Injectable()
export class EnterprisesService {
  constructor(private prisma: PrismaService) {}

  async findAll(filters: EnterpriseFilterDto = {}) {
    const {
      search,
      feijiangWenxin,
      clueInTime,
      partnerLevel,
      priority,
      industry,
      taskDirection,
      base,
      registeredCapitalMin,
      registeredCapitalMax,
      employeeCountMin,
      employeeCountMax,
      sort_field = 'updatedAt',
      sort_direction = 'desc',
      page = 0,
      limit = 50,
    } = filters;

    // Build where clause
    const whereClause: any = { status: 'active' };

    if (priority) {
      whereClause.priority = priority;
    }

    if (feijiangWenxin) {
      whereClause.feijiangWenxin = { contains: feijiangWenxin };
    }

    if (base) {
      whereClause.base = { contains: base, mode: 'insensitive' };
    }

    if (taskDirection) {
      whereClause.taskDirection = { contains: taskDirection, mode: 'insensitive' };
    }

    // Number range filters
    if (registeredCapitalMin !== undefined) {
      whereClause.registeredCapital = { gte: registeredCapitalMin };
    }
    if (registeredCapitalMax !== undefined) {
      const rcFilter = whereClause.registeredCapital || {};
      rcFilter.lte = registeredCapitalMax;
      whereClause.registeredCapital = rcFilter;
    }

    if (employeeCountMin !== undefined) {
      whereClause.employeeCount = { gte: employeeCountMin };
    }
    if (employeeCountMax !== undefined) {
      const ecFilter = whereClause.employeeCount || {};
      ecFilter.lte = employeeCountMax;
      whereClause.employeeCount = ecFilter;
    }

    // Count total for pagination
    const total = await this.prisma.enterprise.count({ where: whereClause });

    // Fetch data with pagination and sorting
    const items = await this.prisma.enterprise.findMany({
      where: whereClause,
      skip: page * limit,
      take: limit,
      orderBy: {
        [sort_field]: sort_direction.toLowerCase() as 'asc' | 'desc',
      },
    });

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: number) {
    const enterprise = await this.prisma.enterprise.findUnique({
      where: { id, status: 'active' },
    });

    if (!enterprise) {
      throw new NotFoundException(`企业ID ${id} 未找到`);
    }

    return enterprise;
  }

  async create(createEnterpriseDto: CreateEnterpriseDto) {
    // Check if enterprise name already exists
    const existingEnterprise = await this.prisma.enterprise.findUnique({
      where: { enterpriseName: createEnterpriseDto.企业名称 },
    });

    if (existingEnterprise) {
      throw new BadRequestException('企业名称已存在');
    }

    const enterpriseData: any = {
      enterpriseName: createEnterpriseDto.企业名称,
      feijiangWenxin: createEnterpriseDto.飞桨_文心,
      clueInTime: createEnterpriseDto.线索入库时间,
      partnerLevel: createEnterpriseDto.伙伴等级,
      ecoAIProducts: createEnterpriseDto.生态AI产品,
      priority: createEnterpriseDto.优先级,
      base: createEnterpriseDto.base,
      registeredCapital: createEnterpriseDto.注册资本,
      employeeCount: createEnterpriseDto.参保人数,
      enterpriseBackground: createEnterpriseDto.企业背景,
      industry: createEnterpriseDto.行业,
      taskDirection: createEnterpriseDto.任务方向,
      contactInfo: createEnterpriseDto.联系人信息,
      usageScenario: createEnterpriseDto.使用场景,
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date(),
      
      // 扩展字段
      unifiedSocialCreditCode: createEnterpriseDto.unifiedSocialCreditCode,
      legalRepresentative: createEnterpriseDto.legalRepresentative,
      enterpriseType: createEnterpriseDto.enterpriseType,
      annualRevenue: createEnterpriseDto.annualRevenue,
      techStaffCount: createEnterpriseDto.techStaffCount,
      isHighTech: createEnterpriseDto.isHighTech,
      isSpecialized: createEnterpriseDto.isSpecialized,
      website: createEnterpriseDto.website,
      officeAddress: createEnterpriseDto.officeAddress,
      paddleUsageLevel: createEnterpriseDto.paddleUsageLevel,
      paddleModels: createEnterpriseDto.paddleModels,
      paddleTrainingType: createEnterpriseDto.paddleTrainingType,
      ernieModelType: createEnterpriseDto.ernieModelType,
      ernieAppScenarios: createEnterpriseDto.ernieAppScenarios,
      promptTemplateCount: createEnterpriseDto.promptTemplateCount,
      avgMonthlyApiCalls: createEnterpriseDto.avgMonthlyApiCalls,
      peakApiCalls: createEnterpriseDto.peakApiCalls,
      inferenceComputeType: createEnterpriseDto.inferenceComputeType,
      aiImplementationStage: createEnterpriseDto.aiImplementationStage,
      partnerProgramType: createEnterpriseDto.partnerProgramType,
      baiduCertificates: createEnterpriseDto.baiduCertificates,
      eventParticipation: createEnterpriseDto.eventParticipation,
      jointSolutions: createEnterpriseDto.jointSolutions,
      isBaiduVenture: createEnterpriseDto.isBaiduVenture,
      trainingRecord: createEnterpriseDto.trainingRecord,
      awardsReceived: createEnterpriseDto.awardsReceived,
      lastContactDept: createEnterpriseDto.lastContactDept
    };

    const enterprise = await this.prisma.enterprise.create({
      data: enterpriseData,
    });

    return enterprise;
  }

  async update(id: number, updateEnterpriseDto: UpdateEnterpriseDto) {
    const enterprise = await this.prisma.enterprise.findUnique({
      where: { id, status: 'active' },
    });

    if (!enterprise) {
      throw new NotFoundException(`企业ID ${id} 未找到`);
    }

    // If updating name, check for duplicates
    if (updateEnterpriseDto.企业名称 && updateEnterpriseDto.企业名称 !== enterprise.enterpriseName) {
      const existingEnterprise = await this.prisma.enterprise.findUnique({
        where: { enterpriseName: updateEnterpriseDto.企业名称 },
      });

      if (existingEnterprise) {
        throw new BadRequestException('企业名称已存在');
      }
    }

    const updateData: any = {
      enterpriseName: updateEnterpriseDto.企业名称,
      feijiangWenxin: updateEnterpriseDto.飞桨_文心,
      priority: updateEnterpriseDto.优先级,
      registeredCapital: updateEnterpriseDto.注册资本,
      status: updateEnterpriseDto.status,
      updatedAt: new Date(),

      // 扩展字段
      unifiedSocialCreditCode: updateEnterpriseDto.unifiedSocialCreditCode,
      legalRepresentative: updateEnterpriseDto.legalRepresentative,
      enterpriseType: updateEnterpriseDto.enterpriseType,
      annualRevenue: updateEnterpriseDto.annualRevenue,
      techStaffCount: updateEnterpriseDto.techStaffCount,
      isHighTech: updateEnterpriseDto.isHighTech,
      isSpecialized: updateEnterpriseDto.isSpecialized,
      website: updateEnterpriseDto.website,
      officeAddress: updateEnterpriseDto.officeAddress,
      paddleUsageLevel: updateEnterpriseDto.paddleUsageLevel,
      paddleModels: updateEnterpriseDto.paddleModels,
      paddleTrainingType: updateEnterpriseDto.paddleTrainingType,
      ernieModelType: updateEnterpriseDto.ernieModelType,
      ernieAppScenarios: updateEnterpriseDto.ernieAppScenarios,
      promptTemplateCount: updateEnterpriseDto.promptTemplateCount,
      avgMonthlyApiCalls: updateEnterpriseDto.avgMonthlyApiCalls,
      peakApiCalls: updateEnterpriseDto.peakApiCalls,
      inferenceComputeType: updateEnterpriseDto.inferenceComputeType,
      aiImplementationStage: updateEnterpriseDto.aiImplementationStage,
      partnerProgramType: updateEnterpriseDto.partnerProgramType,
      baiduCertificates: updateEnterpriseDto.baiduCertificates,
      eventParticipation: updateEnterpriseDto.eventParticipation,
      jointSolutions: updateEnterpriseDto.jointSolutions,
      isBaiduVenture: updateEnterpriseDto.isBaiduVenture,
      trainingRecord: updateEnterpriseDto.trainingRecord,
      awardsReceived: updateEnterpriseDto.awardsReceived,
      lastContactDept: updateEnterpriseDto.lastContactDept
    };

    const updatedEnterprise = await this.prisma.enterprise.update({
      where: { id },
      data: updateData,
    });

    return updatedEnterprise;
  }

  async remove(id: number) {
    const enterprise = await this.prisma.enterprise.findUnique({
      where: { id, status: 'active' },
    });

    if (!enterprise) {
      throw new NotFoundException(`企业ID ${id} 未找到`);
    }

    const updatedEnterprise = await this.prisma.enterprise.update({
      where: { id },
      data: { status: 'deleted', updatedAt: new Date() },
    });

    return updatedEnterprise;
  }

  async getStatistics() {
    // Get priority statistics
    const priorityStats = await this.prisma.enterprise.groupBy({
      by: ['priority'],
      where: { priority: { not: null }, status: 'active' },
      _count: { _all: true },
    });

    // Get 飞桨_文心 statistics
    const feijiangWenxinStats = await this.prisma.enterprise.groupBy({
      by: ['feijiangWenxin'],
      where: { feijiangWenxin: { not: null }, status: 'active' },
      _count: { _all: true },
    });

    // Get total counts
    const totalEnterprises = await this.prisma.enterprise.count({
      where: { status: 'active' },
    });

    const p0Enterprises = await this.prisma.enterprise.count({
      where: { priority: 'P0', status: 'active' },
    });

    const feijiangEnterprises = await this.prisma.enterprise.count({
      where: { feijiangWenxin: '飞桨', status: 'active' },
    });

    const wenxinEnterprises = await this.prisma.enterprise.count({
      where: { feijiangWenxin: '文心', status: 'active' },
    });

    return {
      total: totalEnterprises,
      p0: p0Enterprises,
      feijiang: feijiangEnterprises,
      wenxin: wenxinEnterprises,
      priorityStats,
      feijiangWenxinStats,
    };
  }
}