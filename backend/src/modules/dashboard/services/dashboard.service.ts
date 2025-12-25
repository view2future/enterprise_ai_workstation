import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class DashboardService {
  private readonly logger = new Logger(DashboardService.name);

  constructor(private prisma: PrismaService) {}

  async getStats(userEnv: string = 'PROD') {
    try {
      const enterprises = await this.prisma.enterprise.findMany({
        where: { envScope: userEnv, status: 'active' },
        select: {
          clueStage: true,
          region: true,
          base: true,
          partnerLevel: true,
          priority: true,
          certExpiryDate: true
        }
      });

      const totalEnterprises = enterprises.length;
      
      // 按阶段统计
      const clueStageStats = [
        'LEAD', 'EMPOWERING', 'ADOPTED', 'ECO_PRODUCT', 'POWERED_BY', 'CASE_STUDY'
      ].map(stage => ({
        stage,
        value: enterprises.filter(e => e.clueStage === stage).length
      }));

      // 按等级统计
      const levels = ['认证级', '优选级', '重点级', '核心级'];
      const partnerLevelStats = levels.map(level => ({
        name: level,
        value: enterprises.filter(e => e.partnerLevel === level).length
      }));

      // 按城市分布统计 (使用 base 字段)
      const cityGroups = [...new Set(enterprises.map(e => e.base || '成都市'))];
      const regionStats = cityGroups.map(city => ({
        name: city,
        value: enterprises.filter(e => e.base === city).length
      }));

      // P0 级异动统计
      const p0Enterprises = enterprises.filter(e => e.priority === 'P0').length;

      // 效期预警 (90天内过期)
      const now = new Date();
      const ninetyDaysFromNow = new Date();
      ninetyDaysFromNow.setDate(now.getDate() + 90);
      const expiryWarnings = enterprises.filter(e => 
        e.certExpiryDate && new Date(e.certExpiryDate) <= ninetyDaysFromNow && new Date(e.certExpiryDate) >= now
      ).length;

      return {
        totalEnterprises,
        totalPolicies: 0,
        totalUsers: 20,
        totalReports: 0,
        p0Enterprises,
        expiryWarnings,
        activeCities: Array.from(new Set(enterprises.map(e => e.base || '成都市'))),
        overallGrowthRate: '15.4%',
        partnerLevelStats,
        regionStats,
        clueStageStats
      };
    } catch (e) {
      this.logger.error(`STATS CRASH: ${e.message}`);
      return { totalEnterprises: 0, partnerLevelStats: [], regionStats: [], clueStageStats: [], expiryWarnings: 0 };
    }
  }

  async getOverview(timeRange: string, env: string) {
    const stats = await this.getStats(env);
    
    // 获取全量数据进行深度多维分析
    const enterprises = await this.prisma.enterprise.findMany({
      where: { envScope: env, status: 'active' },
      select: { 
        id: true,
        enterpriseName: true,
        feijiangWenxin: true, 
        createdAt: true,
        industry: true,
        taskDirection: true,
        registeredCapital: true,
        employeeCount: true,
        priority: true
      }
    });

    // 1. 技术生态结构统计 (飞桨 vs 文心)
    const techDistribution = [
      { name: '飞桨', value: enterprises.filter(e => e.feijiangWenxin?.includes('飞桨')).length },
      { name: '文心', value: enterprises.filter(e => e.feijiangWenxin?.includes('文心')).length }
    ];

    // 2. 伙伴入库趋势统计 (按月演化)
    const months = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];
    const monthlyTrendData = months.map((m, idx) => {
      const count = enterprises.filter(e => {
        const date = new Date(e.createdAt);
        return date.getFullYear() === 2025 && date.getMonth() === idx;
      }).length;
      return { month: m, count };
    });

    // 3. AI 产业垂直赛道统计 (TreeMap)
    const industries = [...new Set(enterprises.map(e => e.industry || '未分类'))];
    const industryVerticals = industries.map(ind => ({
      name: ind,
      size: enterprises.filter(e => e.industry === ind).length
    })).sort((a, b) => b.size - a.size);

    // 4. 技术任务领域统计 (Scenario Radar)
    const directions = ['视觉识别', '自然语言处理', '预测性维护', '辅助决策', '自动化质检'];
    const scenarioTasks = directions.map(dir => ({
      subject: dir,
      value: enterprises.filter(e => e.taskDirection === dir).length,
      fullMark: Math.max(stats.totalEnterprises / 3, 50)
    }));

    // 5. 资本与规模能级统计 (Bubble Chart / Scatter)
    // 过滤掉脏数据，仅取有规模数据的进行聚类
    const scaleMatrix = enterprises
      .filter(e => e.registeredCapital && e.employeeCount)
      .map(e => ({
        name: e.enterpriseName,
        x: e.registeredCapital || 0, // 资本
        y: e.employeeCount || 0,    // 人数
        z: e.priority === 'P0' ? 40 : (e.priority === 'P1' ? 25 : 15), // 优先级气泡大小
        priority: e.priority,
        id: e.id
      }))
      .slice(0, 150); // 选取前 150 个样本点以防渲染过载

    return {
      stats,
      chartData: {
        monthlyTrendData,
        industryDistribution: industryVerticals,
        techDistribution,
        scenarioTasks,
        scaleMatrix
      },
      recentActivities: [],
      timestamp: new Date().toISOString()
    };
  }

  async getAdvancedStats(env: string) { return this.getStats(env); }
  async getChartData(tr: string, env: string) { return (await this.getOverview(tr, env)).chartData; }
  async getMapData(env: string) {
    try {
      const enterprises = await this.prisma.enterprise.findMany({
        where: { envScope: env, status: 'active' },
        select: {
          id: true,
          enterpriseName: true,
          base: true,
          city: true,
          industry: true,
          priority: true,
          latitude: true,
          longitude: true,
          createdAt: true,
          clueStage: true
        }
      });
      return enterprises;
    } catch (e) {
      this.logger.error(`getMapData Failed: ${e.message}`);
      return [];
    }
  }
  async getTechRadarData(env: string) { return { nodes: [], links: [] }; }
  async getEcosystemHealthData(env: string) { return { score: 85, status: 'Healthy' }; }
  async getRecentActivities(tr: string, env: string) { return []; }
  async getFeatureUsage() { return { topEndpoints: [], policyProcessing: [] }; }
}