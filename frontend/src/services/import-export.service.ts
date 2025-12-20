import apiClient from './api';

export interface ImportTemplate {
  fields: Array<{
    name: string;
    type: string;
    required?: boolean;
    options?: string[];
    description: string;
  }>;
  sampleData: any[];
}

export interface ImportResult {
  success: number;
  failed: number;
  errors: string[];
}

export const importExportApi = {
  // 导出企业数据
  exportEnterprises: (filters?: any) => {
    return apiClient.get('/import-export/export', { 
      params: filters,
      responseType: 'blob' // 用于文件下载
    });
  },

  // 导入企业数据
  importEnterprises: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    
    return apiClient.post<ImportResult>('/import-export/import', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // 获取导入模板
  getImportTemplate: () => {
    return apiClient.get<ImportTemplate>('/import-export/template');
  }
};