import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getStats() {
    // Get overall statistics
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

    // Get priority stats
    const priorityStats = await this.prisma.enterprise.groupBy({
      by: ['priority'],
      where: { priority: { not: null }, status: 'active' },
      _count: { _all: true },
    });

    // Get 飞桨_文心 stats
    const feijiangWenxinStats = await this.prisma.enterprise.groupBy({
      by: ['feijiangWenxin'],
      where: { feijiangWenxin: { not: null }, status: 'active' },
      _count: { _all: true },
    });

    // Get region stats (base field)
    const regionStats = await this.prisma.enterprise.groupBy({
      by: ['base'],
      where: { base: { not: null }, status: 'active' },
      _count: { _all: true },
    });

    // Get partner level stats
    const partnerLevelStats = await this.prisma.enterprise.groupBy({
      by: ['partnerLevel'],
      where: { partnerLevel: { not: null }, status: 'active' },
      _count: { _all: true },
    });

    // Calculate growth rate (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const newEnterprisesLast30Days = await this.prisma.enterprise.count({
      where: {
        status: 'active',
        createdAt: { gte: thirtyDaysAgo },
      },
    });

    return {
      totalEnterprises,
      p0Enterprises,
      feijiangEnterprises,
      wenxinEnterprises,
      newEnterprisesLast30Days,
      priorityStats,
      feijiangWenxinStats,
      regionStats,
      partnerLevelStats,
      overallGrowthRate: totalEnterprises > 0 
        ? ((newEnterprisesLast30Days / totalEnterprises) * 100).toFixed(2) + '%' 
        : '0%',
    };
  }

  async getChartData() {
    // Get industry distribution (from industry JSON field)
    const industryRawData = await this.prisma.enterprise.findMany({
      where: { industry: { not: null }, status: 'active' },
      select: { industry: true },
    });

    // Process industry data
    const industryDistribution = {};
    industryRawData.forEach(item => {
      if (item.industry) {
        // Assuming industry field contains a name property
        const industryName = typeof item.industry === 'object' 
          ? (item.industry as any).name || item.industry 
          : item.industry;
        
        if (industryName) {
          industryDistribution[industryName as string] = (industryDistribution[industryName as string] || 0) + 1;
        }
      }
    });

    // Capital distribution
    const capitalDistribution = await this.prisma.enterprise.groupBy({
      by: ['registeredCapital'],
      where: { registeredCapital: { not: null }, status: 'active' },
      _count: { _all: true },
    });

    // Monthly trend data
    const monthlyTrendData = await this.prisma.$queryRawUnsafe<Array<{month: string; count: number}>>(
      `SELECT 
        to_char("createdAt", 'YYYY-MM') as month,
        COUNT(*) as count
      FROM "enterprises"
      WHERE "status" = 'active'
      GROUP BY to_char("createdAt", 'YYYY-MM')
      ORDER BY to_char("createdAt", 'YYYY-MM')`
    );

    return {
      industryDistribution: Object.entries(industryDistribution).map(([name, value]) => ({
        name,
        value: value as number,
      })),
      capitalDistribution,
      monthlyTrendData,
    };
  }

  async getRecentActivities() {
    // Get recently updated enterprises
    const recentEnterprises = await this.prisma.enterprise.findMany({
      where: { status: 'active' },
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
}