import api from './api';

export interface Enterprise {
  id: number;
  enterpriseName: string;
  envScope: string;
  region: string;
  clueStage: string;
  industry?: string;
  city?: string;
  status?: string;
  base?: string;
  aiImplementationStage?: string;
  shippingStatus?: string;
  created_at: string;
  createdAt: string;
  [key: string]: any;
}

export interface EnterpriseFilter {
  page?: number;
  limit?: number;
  searchTerm?: string;
  region?: string;
  clueStage?: string;
  expiry?: string;
  [key: string]: any;
}

export const enterpriseApi = {
  // 获取企业列表
  getEnterprises: (params?: any) => api.get('/enterprises', { params }),
  
  // 获取单个企业
  getOne: (id: number) => api.get(`/enterprises/${id}`),
  getEnterprise: (id: number) => api.get(`/enterprises/${id}`),
  
  // 获取企业统计数据
  getEnterpriseStats: () => api.get('/dashboard/stats'),
  
  // 创建企业
  create: (data: any) => api.post('/enterprises', data),
  createEnterprise: (data: any) => api.post('/enterprises', data),
  
  // 更新企业
  update: (id: number, data: any) => api.put(`/enterprises/${id}`, data),
  updateEnterprise: (id: number, data: any) => api.put(`/enterprises/${id}`, data),
  
  // 删除企业
  delete: (id: number) => api.delete(`/enterprises/${id}`),
  deleteEnterprise: (id: number) => api.delete(`/enterprises/${id}`),
  
  // 智能解析
  quickParse: (content: string) => api.post('/enterprises/quick-parse', { content }),
  
  // 兼容别名
  getAll: (params?: any) => api.get('/enterprises', { params }),
};