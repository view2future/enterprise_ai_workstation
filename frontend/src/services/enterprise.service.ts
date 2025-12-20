import apiClient from './api';

export interface Enterprise {
  id: number;
  企业名称: string;
  飞桨_文心?: string;
  线索入库时间?: string;
  线索更新时间?: string;
  伙伴等级?: string;
  生态AI产品?: string;
  优先级?: string;
  base?: string;
  注册资本?: number;
  参保人数?: number;
  企业背景?: string;
  行业?: any;
  任务方向?: string;
  联系人信息?: string;
  使用场景?: string;
  status: string;
  created_at: string;
  updated_at: string;
  created_by?: string;
  updated_by?: string;
}

export interface EnterpriseFilter {
  search?: string;
  飞桨_文心?: string;
  线索入库时间?: string;
  伙伴等级?: string;
  优先级?: string;
  行业?: string;
  任务方向?: string;
  注册资本_min?: number;
  注册资本_max?: number;
  参保人数_min?: number;
  参保人数_max?: number;
  sort_field?: string;
  sort_direction?: string;
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

export const enterpriseApi = {
  // 获取企业列表
  getEnterprises: (filters?: EnterpriseFilter) => {
    // Map frontend filters (Chinese) to backend params (English)
    const params: any = {
      page: filters?.page,
      limit: filters?.limit,
      sort_field: filters?.sort_field,
      sort_direction: filters?.sort_direction,
      search: filters?.search,
    };

    if (filters?.飞桨_文心) params.feijiangWenxin = filters.飞桨_文心;
    if (filters?.线索入库时间) params.clueInTime = filters.线索入库时间;
    if (filters?.伙伴等级) params.partnerLevel = filters.伙伴等级;
    if (filters?.优先级) params.priority = filters.优先级;
    if (filters?.行业) params.industry = filters.行业;
    if (filters?.任务方向) params.taskDirection = filters.任务方向;
    if (filters?.注册资本_min) params.registeredCapitalMin = filters.注册资本_min;
    if (filters?.注册资本_max) params.registeredCapitalMax = filters.注册资本_max;
    if (filters?.参保人数_min) params.employeeCountMin = filters.参保人数_min;
    if (filters?.参保人数_max) params.employeeCountMax = filters.参保人数_max;

    return apiClient.get<PaginatedResponse<Enterprise>>('/enterprises', { params });
  },

  // 获取单个企业
  getEnterprise: (id: number) => {
    return apiClient.get<Enterprise>(`/enterprises/${id}`);
  },

  // 创建企业
  createEnterprise: (data: Partial<Enterprise>) => {
    return apiClient.post<Enterprise>('/enterprises', data);
  },

  // 更新企业
  updateEnterprise: (id: number, data: Partial<Enterprise>) => {
    return apiClient.put<Enterprise>(`/enterprises/${id}`, data);
  },

  // 删除企业
  deleteEnterprise: (id: number) => {
    return apiClient.delete(`/enterprises/${id}`);
  },

  // 获取企业统计
  getEnterpriseStats: () => {
    return apiClient.get('/enterprises/stats/summary');
  }
};