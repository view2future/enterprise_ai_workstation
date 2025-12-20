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

  // 下载报告
  downloadReport: (id: number, title: string) => {
    return apiClient.get(`/reports/${id}/download`, {
      responseType: 'blob'
    }).then((response) => {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${title}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    });
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
