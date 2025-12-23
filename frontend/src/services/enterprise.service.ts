import apiClient from './api';

export interface Enterprise {
  id: number;
  enterpriseName: string;
  feijiangWenxin?: string;
  clueInTime?: string;
  clueUpdateTime?: string;
  partnerLevel?: string;
  ecoAIProducts?: string;
  priority?: string;
  base?: string;
  registeredCapital?: number;
  employeeCount?: number;
  enterpriseBackground?: string;
  industry?: any;
  taskDirection?: string;
  contactInfo?: string;
  usageScenario?: string;
  status: string;
  created_at: string;
  updated_at: string;
  created_by?: string;
  updated_by?: string;

  // 企业自身信息完善
  unifiedSocialCreditCode?: string;
  legalRepresentative?: string;
  establishmentDate?: string;
  enterpriseType?: string;
  annualRevenue?: string;
  techStaffCount?: number;
  isHighTech?: boolean;
  isSpecialized?: boolean;
  website?: string;
  officeAddress?: string;

  // 百度AI技术应用
  paddleUsageLevel?: string;
  paddleModels?: any;
  paddleTrainingType?: string;
  ernieModelType?: string;
  ernieAppScenarios?: any;
  promptTemplateCount?: number;
  avgMonthlyApiCalls?: string | number;
  peakApiCalls?: number;
  inferenceComputeType?: string;
  aiImplementationStage?: string;

  // 生态合作
  partnerProgramType?: string;
  baiduCertificates?: any;
  eventParticipation?: any;
  jointSolutions?: any;
  isBaiduVenture?: boolean;
  trainingRecord?: any;
  awardsReceived?: any;
  lastContactDept?: string;
}

export interface EnterpriseFilter {
  search?: string;
  feijiangWenxin?: string;
  clueInTime?: string;
  partnerLevel?: string;
  priority?: string;
  industry?: string;
  taskDirection?: string;
  base?: string;
  registeredCapitalMin?: number;
  registeredCapitalMax?: number;
  employeeCountMin?: number;
  employeeCountMax?: number;
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
    return apiClient.get<PaginatedResponse<Enterprise>>('/enterprises', { params: filters });
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
  },

  // 获取全量地图数据 (V2.0 - Final Stability)
  getMapData: () => {
    return apiClient.get<PaginatedResponse<Enterprise>>('/enterprises/action/map-data-full');
  },

  // 智研闪录：解析文本
  quickParse: (text: string) => {
    return apiClient.post('/enterprises/action/parse-unstructured', { text });
  }
};