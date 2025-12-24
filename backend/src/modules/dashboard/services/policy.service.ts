import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class PolicyService {
  private readonly logger = new Logger(PolicyService.name);

  constructor(private prisma: PrismaService) {}

  async createPolicy(data: any, userEnv: string) {
    const analysis = this.generateBrainMap(data.content);
    return this.prisma.policy.create({
      data: {
        ...data,
        analysis: JSON.stringify(analysis),
        envScope: userEnv,
      }
    });
  }

  async getPolicies(userEnv: string) {
    return this.prisma.policy.findMany({
      where: { envScope: userEnv, status: 'active' },
      orderBy: { createdAt: 'desc' }
    });
  }

  async getPolicyDetail(id: number, userEnv: string) {
    const policy = await this.prisma.policy.findFirst({
      where: { id, envScope: userEnv }
    });
    if (policy && policy.analysis) {
      policy.analysis = JSON.parse(policy.analysis);
    }
    return policy;
  }

  /**
   * 模拟生成脑图拓扑数据 (V4.0 核心)
   */
  private generateBrainMap(content: string) {
    // 这里未来可以接入更复杂的本地 NLP 逻辑
    return {
      nodes: [
        { id: 'root', label: '政策核心', color: '#3b82f6', size: 40 },
        { id: 'target', label: '申报对象', color: '#f59e0b', size: 30 },
        { id: 'threshold', label: '技术门槛', color: '#ef4444', size: 30 },
        { id: 'reward', label: '扶持力度', color: '#10b981', size: 30 },
        { id: 'period', label: '申报周期', color: '#8b5cf6', size: 30 },
      ],
      links: [
        { source: 'root', target: 'target' },
        { source: 'root', target: 'threshold' },
        { source: 'root', target: 'reward' },
        { source: 'root', target: 'period' },
      ]
    };
  }
}
