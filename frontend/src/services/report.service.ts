import apiClient from './api';

export enum ReportType {
  SUMMARY = 'summary',
  DETAILED = 'detailed',
  TRENDS = 'trends',
  PRIORITY = 'priority',
  AI_USAGE = 'ai_usage',
  REGIONAL = 'regional',
  PARTNER = 'partner',
  WEEKLY = 'WEEKLY',
  MONTHLY = 'MONTHLY',
  QUARTERLY = 'QUARTERLY',
  YEARLY = 'YEARLY',
}

export interface Report {
  id: number;
  title: string;
  type: string;
  status: string;
  description?: string;
  filters?: any;
  filePath?: string;
  createdAt: string;
  updatedAt: string;
}

export const reportsApi = {
  // 获取报告列表
  getAllReports: () => {
    return apiClient.get<Report[]>('/reports');
  },

  // 生成报告
  generateReport: (data: any) => {
    return apiClient.post<Report>('/reports', data);
  },

  // 获取单个报告
  getReport: (id: number) => {
    return apiClient.get<Report>(`/reports/${id}`);
  },

  // 构建报告 (V2.0 - 物理编译模式)
  buildReport: (id: number) => {
    return apiClient.post<{ success: boolean; filePath: string; fileName: string }>(`/reports/${id}/build`);
  },

  // 删除报告
  deleteReport: (id: number) => {
    return apiClient.delete(`/reports/${id}`);
  },

  // 获取统计
  getStats: () => {
    return apiClient.get('/reports/stats/summary');
  }
};
