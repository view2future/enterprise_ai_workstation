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
  regionStats: Array<{ name: string; value: number }>; // Updated to match backend response
  partnerLevelStats: Array<{ name: string; value: number }>; // Updated to match backend response
  clueStageStats: Array<{ stage: string; value: number }>;
  stageStats: Array<{ aiImplementationStage: string; _count: { _all: number } }>;
  overallGrowthRate: string;
  expiryWarnings: number;
  activeCities: string[];
}

export interface ChartData {
  industryDistribution?: Array<{ name: string; value: number }>;
  techDistribution?: Array<{ name: string; value: number }>;
  starPartners?: Array<any>;
  capitalDistribution?: Array<{ registeredCapital: string; _count: { _all: number } }>;
  monthlyTrendData: Array<{ month: string; count: number }>;
  scenarioTasks?: Array<{ subject: string; value: number }>;
  scaleMatrix?: Array<{ x: number; y: number; z: number; name: string; id: number; priority: string }>;
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
    return apiClient.get('/dashboard/ecosystem');
  },

  getMapData: () => {
    return apiClient.get('/dashboard/map-data');
  }
};