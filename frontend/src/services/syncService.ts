import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const syncService = {
  /**
   * 从服务器获取待同步的数据
   */
  async fetchExportData(since?: string) {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_URL}/sync/export`, {
      params: { since },
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  /**
   * 将数据同步到服务器
   */
  async importData(payload: any[]) {
    const token = localStorage.getItem('token');
    const response = await axios.post(`${API_URL}/sync/import`, 
      { payload },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  },

  /**
   * 验证同步包内容（获取冲突预览）
   */
  async validatePackage(payload: any[]) {
    const token = localStorage.getItem('token');
    const response = await axios.post(`${API_URL}/sync/validate`, 
      { payload },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  }
};
