import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  private getStartDate(timeRange: string = 'all'): Date | null {
    const now = new Date();
    switch (timeRange) {
      case 'week':
        return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      case 'two_weeks':
        return new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
      case 'month':
        return new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
      case 'two_months':
        return new Date(now.getFullYear(), now.getMonth() - 2, now.getDate());
      case 'three_months':
        return new Date(now.getFullYear(), now.getMonth() - 3, now.getDate());
      case 'half_year':
        return new Date(now.getFullYear(), now.getMonth() - 6, now.getDate());
      case 'year':
        return new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
      case 'all':
      default:
        return null;
    }
  }

  async getStats(timeRange: string = 'all') {
    const where: any = { status: 'active' };
    const startDate = this.getStartDate(timeRange);
    if (startDate) where.createdAt = { gte: startDate };

    // 核心大盘指标
    const [total, p0, feijiang, wenxin] = await Promise.all([
      this.prisma.enterprise.count({ where }),
      this.prisma.enterprise.count({ where: { ...where, priority: 'P0' } }),
      this.prisma.enterprise.count({ where: { ...where, feijiangWenxin: '飞桨' } }),
      this.prisma.enterprise.count({ where: { ...where, feijiangWenxin: '文心' } }),
    ]);

    // 区域分布
    const regionStats = await this.prisma.enterprise.groupBy({
      by: ['base'],
      where,
      _count: { _all: true },
    });

    // 伙伴等级分布
    const partnerLevelStats = await this.prisma.enterprise.groupBy({
      by: ['partnerLevel'],
      where,
      _count: { _all: true },
    });

    // 优先级分布
    const priorityStats = await this.prisma.enterprise.groupBy({
      by: ['priority'],
      where,
      _count: { _all: true },
    });

    return {
      totalEnterprises: total,
      p0Enterprises: p0,
      feijiangEnterprises: feijiang,
      wenxinEnterprises: wenxin,
      regionStats: regionStats.map(r => ({ name: r.base || '未知', value: r._count._all })),
      partnerLevelStats: partnerLevelStats.map(p => ({ name: p.partnerLevel || '未定级', value: p._count._all })),
      priorityStats: priorityStats.map(p => ({ name: p.priority || 'P2', value: p._count._all })),
      overallGrowthRate: '12.5%'
    };
  }

  async getChartData(timeRange: string = 'all') {
    const where: any = { status: 'active' };
    const startDate = this.getStartDate(timeRange);
    if (startDate) where.createdAt = { gte: startDate };
    
    // 技术占比 (飞桨 vs 文心)
    const techStats = await this.prisma.enterprise.groupBy({
      by: ['feijiangWenxin'],
      where,
      _count: { _all: true }
    });

    return {
      techDistribution: techStats.map(t => ({ name: t.feijiangWenxin || '其他', value: t._count._all })),
      monthlyTrendData: await this.prisma.$queryRawUnsafe<any[]>(`
        SELECT to_char("createdAt", 'YYYY-MM') as month, COUNT(*) as count 
        FROM "enterprises" 
        WHERE "status" = 'active' 
        GROUP BY 1 ORDER BY 1
      `)
    };
  }

  async getRecentActivities(timeRange: string = 'all') {
    // ... 原有逻辑保持不变
    const startDate = this.getStartDate(timeRange);
    const where: any = { status: 'active' };
    if (startDate) {
      where.createdAt = { gte: startDate };
    }

    const recentEnterprises = await this.prisma.enterprise.findMany({
      where,
      select: {
        id: true,
        enterpriseName: true,
        updatedAt: true,
        priority: true,
        feijiangWenxin: true,
      },
      orderBy: { updatedAt: 'desc' },
      take: 10,
    });

    return recentEnterprises.map(enterprise => ({
      id: enterprise.id,
      name: enterprise.enterpriseName,
      updatedAt: enterprise.updatedAt,
      priority: enterprise.priority,
      feijiangWenxin: enterprise.feijiangWenxin,
      activityType: '企业信息更新',
      description: `更新了${enterprise.enterpriseName}的信息`,
    }));
  }

  // 二级专题页接口：技术应用雷达
  async getTechRadarData() {
    const where = { status: 'active' };
    
    const [ernieModels, paddleLevels, computeTypes, stages] = await Promise.all([
      this.prisma.enterprise.groupBy({ by: ['ernieModelType'], where: { ...where, ernieModelType: { not: null } }, _count: { _all: true } }),
      this.prisma.enterprise.groupBy({ by: ['paddleUsageLevel'], where: { ...where, paddleUsageLevel: { not: null } }, _count: { _all: true } }),
      this.prisma.enterprise.groupBy({ by: ['inferenceComputeType'], where: { ...where, inferenceComputeType: { not: null } }, _count: { _all: true } }),
      this.prisma.enterprise.groupBy({ by: ['aiImplementationStage'], where: { ...where, aiImplementationStage: { not: null } }, _count: { _all: true } })
    ]);

    // API 调用阶梯：使用模型字段映射后的物理列名或模型名
    const apiTiers = await this.prisma.$queryRawUnsafe<any[]>(`
      SELECT
        CASE
          WHEN "月均API调用量" < 10000 THEN '入门级 (<1万)'
          WHEN "月均API调用量" BETWEEN 10000 AND 100000 THEN '中型规模 (1-10万)'
          WHEN "月均API调用量" BETWEEN 100000 AND 1000000 THEN '规模化 (10-100万)'
          ELSE '海量级 (>100万)'
        END as tier,
        COUNT(*) as count
      FROM "enterprises"
      WHERE "status" = 'active'
      GROUP BY 1
    `);

    return { 
      ernieModels, 
      paddleLevels, 
      computeTypes, 
      stages, 
      apiTiers: apiTiers.map(t => ({ tier: t.tier, count: Number(t.count) })) 
    };
  }

  // 二级专题页接口：生态合作健康
  async getEcosystemHealthData() {
    const where = { status: 'active' };
    
    const [partnerTypes, ventureStats] = await Promise.all([
      this.prisma.enterprise.groupBy({ by: ['partnerProgramType'], where: { ...where, partnerProgramType: { not: null } }, _count: { _all: true } }),
      this.prisma.enterprise.groupBy({ by: ['isBaiduVenture'], where, _count: { _all: true } })
    ]);

    // 统计各类型的总数 (证书, 活动, 方案)
    const rawData = await this.prisma.enterprise.findMany({
      where,
      select: { baiduCertificates: true, eventParticipation: true, jointSolutions: true }
    });

    const counts = { certificates: 0, events: 0, solutions: 0 };
    rawData.forEach(item => {
      if (Array.isArray(item.baiduCertificates)) counts.certificates += item.baiduCertificates.length;
      if (Array.isArray(item.eventParticipation)) counts.events += item.eventParticipation.length;
      if (Array.isArray(item.jointSolutions)) counts.solutions += item.jointSolutions.length;
    });

    return { partnerTypes, ventureStats, topLevelMetrics: counts };
  }

  async getMapData() {
    return this.prisma.enterprise.findMany({
      where: { status: 'active' },
      take: 1000
    });
  }
}