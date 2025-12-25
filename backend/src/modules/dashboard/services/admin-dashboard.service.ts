import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class AdminDashboardService {
  private readonly logger = new Logger(AdminDashboardService.name);

  constructor(private prisma: PrismaService) {}

  /**
   * 上帝视角核心数据汇总
   */
  async getGodViewStats() {
    const [userCount, enterpriseCount, policyCount, usageTotal, recentLogs] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.enterprise.count(),
      this.prisma.policy.count(),
      this.prisma.systemUsageLog.count(),
      this.prisma.systemUsageLog.findMany({
        take: 10,
        orderBy: { timestamp: 'desc' },
      })
    ]);

    // 功能热度排名 (Top 10)
    const featureHeatmap = await (this.prisma.systemUsageLog as any).groupBy({
      by: ['endpoint', 'method'],
      _count: {
        _all: true
      },
      orderBy: {
        _count: {
          endpoint: 'desc'
        }
      },
      take: 10
    });

    // 用户活跃度分布
    const userActivity = await (this.prisma.systemUsageLog as any).groupBy({
      by: ['userId'],
      _count: {
        _all: true
      },
      orderBy: {
        _count: {
          userId: 'desc'
        }
      },
      take: 10
    });

    return {
      overview: {
        totalUsers: userCount,
        totalEnterprises: enterpriseCount,
        totalPolicies: policyCount,
        totalInteractions: usageTotal,
      },
      featureHeatmap: featureHeatmap.map((item: any) => ({
        endpoint: item.endpoint,
        method: item.method,
        count: item._count._all
      })),
      userActivity,
      recentLogs
    };
  }

  /**
   * 全局用户列表与状态
   */
  async getAllUsers() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        status: true,
        department: true,
        createdAt: true,
        _count: {
          select: { auditLogs: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  /**
   * 模拟全量数据纵观趋势 (按天)
   */
  async getGlobalTrends() {
    // SQLite 的时间处理
    const trends = await this.prisma.$queryRawUnsafe<any[]>(`
      SELECT date(timestamp/1000, 'unixepoch') as date, count(*) as count 
      FROM system_usage_logs 
      GROUP BY date 
      ORDER BY date DESC 
      LIMIT 30
    `);
    return trends;
  }
}
