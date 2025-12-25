import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getStats() {
    const [enterpriseCount, policyCount, userCount, logCount] = await Promise.all([
      this.prisma.enterprise.count(),
      this.prisma.policy.count(),
      this.prisma.user.count(),
      this.prisma.auditLog.count(),
    ]);

    return {
      enterprises: enterpriseCount,
      policies: policyCount,
      users: userCount,
      logs: logCount,
    };
  }

  async getFeatureUsage() {
    const logs = await this.prisma.systemUsageLog.groupBy({
      by: ['endpoint', 'method'],
      _count: {
        _all: true,
      },
      orderBy: {
        _count: {
          endpoint: 'desc',
        },
      },
      take: 20,
    });

    const policyStats = await this.prisma.policy.groupBy({
      by: ['processStatus'],
      _count: {
        _all: true,
      }
    });

    return {
      topEndpoints: logs.map(l => ({
        endpoint: l.endpoint,
        method: l.method,
        count: l._count._all,
      })),
      policyProcessing: policyStats.map(s => ({
        status: s.processStatus,
        count: s._count._all,
      })),
    };
  }
}
