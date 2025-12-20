import apiClient from './api';

export interface DashboardStats {
  totalEnterprises: number;
  p0Enterprises: number;
  totalApiCalls: number;
  feijiangEnterprises: number;
  wenxinEnterprises: number;
  newEnterprisesLast30Days: number;
  priorityStats: Array<{ priority: string; _count: { _all: number } }>;
  feijiangWenxinStats: Array<{ feijiangWenxin: string; _count: { _all: number } }>;
  regionStats: Array<{ base: string; _count: { _all: number } }>;
  partnerLevelStats: Array<{ partnerLevel: string; _count: { _all: number } }>;
  stageStats: Array<{ aiImplementationStage: string; _count: { _all: number } }>;
  overallGrowthRate: string;
}

export interface ChartData {
  industryDistribution: Array<{ name: string; value: number }>;
  capitalDistribution: Array<{ registeredCapital: string; _count: { _all: number } }>;
  monthlyTrendData: Array<{ month: string; count: number }>;
}

export interface Activity {
  id: number;
  name: string;
  updatedAt: string;
  priority?: string;
  feijiangWenxin?: string;
  activityType: string;
  description: string;
}

export const dashboardApi = {
  // 获取仪表板统计
  getStats: (timeRange?: string) => {
    return apiClient.get<DashboardStats>('/dashboard/stats', { params: { timeRange } });
  },

  // 获取图表数据
  getChartData: (timeRange?: string) => {
    return apiClient.get<ChartData>('/dashboard/charts', { params: { timeRange } });
  },

  // 获取最近活动
  getRecentActivities: (timeRange?: string) => {
    return apiClient.get<Activity[]>('/dashboard/recent-activities', { params: { timeRange } });
  },

  // 获取仪表板概览
  getOverview: (timeRange: string = 'all') => {
    return apiClient.get<{ 
      stats: DashboardStats; 
      chartData: ChartData; 
      recentActivities: Activity[]; 
      timestamp: string 
    }>('/dashboard/overview', { params: { timeRange } });
  },

  // 获取技术雷达深度分析数据
  getTechRadar: () => {
    return apiClient.get<any>('/dashboard/tech-radar');
  },

  // 获取生态合作健康分析数据
  getEcosystem: () => {
    return apiClient.get<any>('/dashboard/ecosystem');
  }
};