import apiClient from './api';

export enum ReportType {
  SUMMARY = 'summary',
  DETAILED = 'detailed',
  TRENDS = 'trends',
  PRIORITY = 'priority',
  AI_USAGE = 'ai_usage',
  REGIONAL = 'regional',
  PARTNER = 'partner',
}

export enum ReportFormat {
  PDF = 'pdf',
  EXCEL = 'excel',
  CSV = 'csv',
  JSON = 'json',
}

export enum ReportStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed',
}

export interface Report {
  id: number;
  title: string;
  type: ReportType;
  format: ReportFormat;
  status: ReportStatus;
  description?: string;
  filters?: any;
  configuration?: any;
  filePath?: string;
  fileName?: string;
  dataCount: number;
  progress: number;
  created_at: string;
  updated_at: string;
  completed_at?: string;
  created_by?: string;
  errorMessage?: string;
}

export interface CreateReportDto {
  title: string;
  type: ReportType;
  format: ReportFormat;
  description?: string;
  filters?: any;
  configuration?: any;
}

export interface ReportFilter {
  type?: ReportType;
  status?: ReportStatus;
  created_by?: string;
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ReportStats {
  total: number;
  completed: number;
  pending: number;
  failed: number;
  successRate: string;
}

export const reportApi = {
  // 创建报告
  createReport: (data: CreateReportDto) => {
    return apiClient.post<Report>('/reports', data);
  },

  // 获取报告列表
  getReports: (filters?: ReportFilter) => {
    return apiClient.get<PaginatedResponse<Report>>('/reports', { params: filters });
  },

  // 获取单个报告
  getReport: (id: number) => {
    return apiClient.get<Report>(`/reports/${id}`);
  },

  // 下载报告
  downloadReport: (id: number) => {
    return apiClient.get(`/reports/${id}/download`, {
      responseType: 'blob'
    });
  },

  // 删除报告
  deleteReport: (id: number) => {
    return apiClient.delete(`/reports/${id}`);
  },

  // 获取报告统计
  getReportStats: () => {
    return apiClient.get<ReportStats>('/reports/stats/summary');
  }
};