import api from './api';

export const policyApi = {
  analyzeUrl: (url: string) => api.post('/dashboard/policies/analyze-url', { url }),
  getPolicies: () => api.get('/dashboard/stats'), // 暂时对应旧接口
  getPolicyDetail: (id: number) => api.get(`/dashboard/policies/detail?id=${id}`),
  getMindMap: (id: number) => api.get(`/dashboard/policies/mindmap?id=${id}`),
};
