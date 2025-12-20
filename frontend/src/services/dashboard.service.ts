import apiClient from './api';

export interface DashboardStats {
  totalEnterprises: number;
  p0Enterprises: number;
  feijiangEnterprises: number;
  wenxinEnterprises: number;
  newEnterprisesLast30Days: number;
  priorityStats: Array<{ 优先级: string; count: number }>;
  feijiangWenxinStats: Array<{ 飞桨_文心: string; count: number }>;
  regionStats: Array<{ base: string; count: number }>;
  partnerLevelStats: Array<{ 伙伴等级: string; count: number }>;
  overallGrowthRate: string;
}

export interface ChartData {
  industryDistribution: Array<{ name: string; value: number }>;
  capitalDistribution: Array<{ category: string; count: number }>;
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
  getStats: () => {
    return apiClient.get<DashboardStats>('/dashboard/stats');
  },

  // 获取图表数据
  getChartData: () => {
    return apiClient.get<ChartData>('/dashboard/charts');
  },

  // 获取最近活动
  getRecentActivities: () => {
    return apiClient.get<Activity[]>('/dashboard/recent-activities');
  },

  // 获取仪表板概览
  getOverview: () => {
    return apiClient.get<{ 
      stats: DashboardStats; 
      chartData: ChartData; 
      recentActivities: Activity[]; 
      timestamp: string 
    }>('/dashboard/overview');
  }
};