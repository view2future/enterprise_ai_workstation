import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  private getStartDate(timeRange: string = 'all'): Date | null {
    const now = new Date();
    switch (timeRange) {
      case 'week': return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      case 'two_weeks': return new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
      case 'month': return new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
      case 'three_months': return new Date(now.getFullYear(), now.getMonth() - 3, now.getDate());
      case 'half_year': return new Date(now.getFullYear(), now.getMonth() - 6, now.getDate());
      case 'year': return new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
      case 'three_years': return new Date(now.getFullYear() - 3, now.getMonth(), now.getDate());
      default: return null;
    }
  }

  async getStats(timeRange: string = 'all', userEnv: string = 'PROD') {
    const where: any = { status: 'active', envScope: userEnv };
    const globalWhere: any = { status: 'active', envScope: userEnv }; // 全局基础过滤
    const startDate = this.getStartDate(timeRange);
    if (startDate) where.createdAt = { gte: startDate };

    const [total, p0, feijiang, wenxin, expiryWarnings] = await Promise.all([
      this.prisma.enterprise.count({ where }),
      this.prisma.enterprise.count({ where: { ...where, priority: 'P0' } }),
      this.prisma.enterprise.count({ where: { ...where, feijiangWenxin: '飞桨' } }),
      this.prisma.enterprise.count({ where: { ...where, feijiangWenxin: '文心' } }),
      // 核心修复：效期预警永远扫描全库（globalWhere），不受 timeRange 限制
      this.prisma.enterprise.count({
        where: {
          ...globalWhere,
          certExpiryDate: {
            lte: new Date(new Date().getTime() + 90 * 24 * 60 * 60 * 1000),
            gte: new Date()
          }
        }
      })
    ]);

    const regionStatsRaw = await (this.prisma.enterprise as any).groupBy({
      by: ['base'],
      where: where,
      _count: { _all: true },
    });

    const partnerLevelStatsRaw = await (this.prisma.enterprise as any).groupBy({
      by: ['partnerLevel'],
      where: where,
      _count: { _all: true },
    });

    const priorityStatsRaw = await (this.prisma.enterprise as any).groupBy({
      by: ['priority'],
      where: where,
      _count: { _all: true },
    });

    // V4.0 线索漏斗分布
    const clueStageStatsRaw = await (this.prisma.enterprise as any).groupBy({
      by: ['clueStage'],
      where: where,
      _count: { _all: true }
    });

    // 动态获取库内存在的城市
    const citiesRaw = await this.prisma.enterprise.findMany({
      where: { status: 'active', envScope: userEnv },
      select: { base: true },
      distinct: ['base']
    });

    return {
      totalEnterprises: total,
      p0Enterprises: p0,
      feijiangEnterprises: feijiang,
      wenxinEnterprises: wenxin,
      expiryWarnings,
      regionStats: regionStatsRaw.map((r: any) => ({ name: r.base || '未知', value: r._count._all })),
      partnerLevelStats: partnerLevelStatsRaw.map((p: any) => ({ name: p.partnerLevel || '未定级', value: p._count._all })),
      priorityStats: priorityStatsRaw.map((p: any) => ({ name: p.priority || 'P2', value: p._count._all })),
      clueStageStats: clueStageStatsRaw.map((c: any) => ({ stage: c.clueStage, value: c._count._all })),
      activeCities: citiesRaw.map(c => c.base).filter(Boolean)
    };
  }

  async getChartData(timeRange: string = 'all', userEnv: string = 'PROD') {
    try {
      const where: any = { status: 'active', envScope: userEnv };
      const techStats = await (this.prisma.enterprise as any).groupBy({
        by: ['feijiangWenxin'],
        where: where,
        _count: { _all: true }
      });

      const monthlyTrendData = await this.prisma.$queryRawUnsafe<any[]>(`
        SELECT strftime('%Y-%m', datetime("createdAt"/1000, 'unixepoch')) as month, COUNT(*) as count 
        FROM "enterprises" 
        WHERE "status" = 'active' AND "环境域" = ?
        GROUP BY 1 ORDER BY 1
      `, userEnv).catch((err) => {
        console.error('Trend SQL Error:', err);
        return [];
      });

      // 解析逻辑：分别统计使用飞桨和文心的总企业数（包含交叉使用的企业）
      let paddleTotal = 0;
      let ernieTotal = 0;
      
      const enterprises = await this.prisma.enterprise.findMany({
        where: { status: 'active', envScope: userEnv },
        select: { feijiangWenxin: true }
      });

      enterprises.forEach(ent => {
        const val = ent.feijiangWenxin || '';
        if (val.includes('飞桨')) paddleTotal++;
        if (val.includes('文心')) ernieTotal++;
      });

      return {
        techDistribution: [
          { name: '飞桨', value: paddleTotal },
          { name: '文心', value: ernieTotal }
        ],
        monthlyTrendData: monthlyTrendData.map(m => ({ 
          month: m.month || new Date().toISOString().slice(0, 7), 
          count: Number(m.count || 0) 
        }))
      };
    } catch (error) {
      return { techDistribution: [], monthlyTrendData: [] };
    }
  }

  async getRecentActivities(timeRange: string = 'all', userEnv: string = 'PROD') {
    try {
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
    } catch (error) {
      return [];
    }
  }

  async getTechRadarData(userEnv: string = 'PROD') {
    const where: any = { status: 'active', envScope: userEnv };
    const stages = await (this.prisma.enterprise as any).groupBy({ 
      by: ['aiImplementationStage'], 
      where: where, 
      _count: { _all: true } 
    });
    return { stages };
  }

  async getEcosystemHealthData(userEnv: string = 'PROD') {
    const where: any = { status: 'active', envScope: userEnv };
    const partnerTypes = await (this.prisma.enterprise as any).groupBy({ 
      by: ['partnerProgramType'], 
      where: where, 
      _count: { _all: true } 
    });
    return { partnerTypes };
  }

  async getMapData(userEnv: string = 'PROD', city?: string) {
    const where: any = { status: 'active', envScope: userEnv };
    if (city) where.base = city;
    
    return this.prisma.enterprise.findMany({
      where,
      take: 1000
    });
  }
}
