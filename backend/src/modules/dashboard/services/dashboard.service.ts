import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  private getStartDate(timeRange: string = 'all'): Date | null {
    const now = new Date();
    switch (timeRange) {
      case 'week': return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      case 'month': return new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
      case 'three_months': return new Date(now.getFullYear(), now.getMonth() - 3, now.getDate());
      case 'year': return new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
      default: return null;
    }
  }

  async getStats(timeRange: string = 'all', userEnv: string = 'PROD') {
    const where: any = { status: 'active', envScope: userEnv };
    const startDate = this.getStartDate(timeRange);
    if (startDate) where.createdAt = { gte: startDate };

    const [total, p0, feijiang, wenxin] = await Promise.all([
      this.prisma.enterprise.count({ where }),
      this.prisma.enterprise.count({ where: { ...where, priority: 'P0' } }),
      this.prisma.enterprise.count({ where: { ...where, feijiangWenxin: '飞桨' } }),
      this.prisma.enterprise.count({ where: { ...where, feijiangWenxin: '文心' } }),
    ]);

    const regionStatsRaw = await this.prisma.enterprise.groupBy({
      by: ['base'],
      where,
      _count: { _all: true },
    });

    const partnerLevelStatsRaw = await this.prisma.enterprise.groupBy({
      by: ['partnerLevel'],
      where,
      _count: { _all: true },
    });

    const priorityStatsRaw = await this.prisma.enterprise.groupBy({
      by: ['priority'],
      where,
      _count: { _all: true },
    });

    return {
      totalEnterprises: total,
      p0Enterprises: p0,
      feijiangEnterprises: feijiang,
      wenxinEnterprises: wenxin,
      regionStats: regionStatsRaw.map(r => ({ name: r.base || '未知', value: r._count._all })),
      partnerLevelStats: partnerLevelStatsRaw.map(p => ({ name: p.partnerLevel || '未定级', value: p._count._all })),
      priorityStats: priorityStatsRaw.map(p => ({ name: p.priority || 'P2', value: p._count._all })),
    };
  }

  async getChartData(timeRange: string = 'all', userEnv: string = 'PROD') {
    const where: any = { status: 'active', envScope: userEnv };
    const techStats = await this.prisma.enterprise.groupBy({
      by: ['feijiangWenxin'],
      where,
      _count: { _all: true }
    });

    const monthlyTrendData = await this.prisma.$queryRawUnsafe<any[]>(`
      SELECT to_char("createdAt", 'YYYY-MM') as month, COUNT(*) as count 
      FROM "enterprises" 
      WHERE "status" = 'active' AND "环境域" = $1
      GROUP BY 1 ORDER BY 1
    `, userEnv);

    return {
      techDistribution: techStats.map(t => ({ name: t.feijiangWenxin || '其他', value: t._count._all })),
      monthlyTrendData: monthlyTrendData.map(m => ({ month: m.month, count: Number(m.count) }))
    };
  }

  async getRecentActivities(timeRange: string = 'all', userEnv: string = 'PROD') {
    const where: any = { status: 'active', envScope: userEnv };
    const recent = await this.prisma.enterprise.findMany({
      where,
      orderBy: { updatedAt: 'desc' },
      take: 10,
    });
    return recent.map(ent => ({
      id: ent.id,
      name: ent.enterpriseName,
      activityType: '更新',
      description: `捕获异动: ${ent.enterpriseName}`
    }));
  }

  async getTechRadarData(userEnv: string = 'PROD') {
    const where = { status: 'active', envScope: userEnv };
    const stages = await this.prisma.enterprise.groupBy({ by: ['aiImplementationStage'], where, _count: { _all: true } });
    return { stages };
  }

  async getEcosystemHealthData(userEnv: string = 'PROD') {
    const where = { status: 'active', envScope: userEnv };
    const partnerTypes = await this.prisma.enterprise.groupBy({ by: ['partnerProgramType'], where, _count: { _all: true } });
    return { partnerTypes };
  }

  async getMapData(userEnv: string = 'PROD') {
    return this.prisma.enterprise.findMany({
      where: { status: 'active', envScope: userEnv },
      take: 1000
    });
  }
}