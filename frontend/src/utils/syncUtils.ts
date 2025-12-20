/**
 * 离线数据同步工具类 (精简版)
 * 处理数据的编码、简单校验以及 .eap 文件的生成
 * 无需外部依赖，解决 500 模块引用错误
 */

const SYNC_VERSION = '1.0';

export interface EapPackage {
  metadata: {
    version: string;
    exportTimestamp: string;
    recordCount: number;
    checksum: string;
  };
  payload: any[];
}

export const syncUtils = {
  /**
   * 将数据打包为 .eap 格式
   */
  pack: async (data: any[]): Promise<Blob> => {
    const pkg: EapPackage = {
      metadata: {
        version: SYNC_VERSION,
        exportTimestamp: new Date().toISOString(),
        recordCount: data.length,
        checksum: btoa(unescape(encodeURIComponent(JSON.stringify(data.slice(0, 1))))), // 简单摘要
      },
      payload: data,
    };

    // 转换为字符串
    const jsonStr = JSON.stringify(pkg);
    
    // 使用 Base64 模拟加密包装
    const encoded = btoa(unescape(encodeURIComponent(jsonStr)));
    
    return new Blob([encoded], { type: 'application/octet-stream' });
  },

  /**
   * 解码 .eap 文件
   */
  unpack: async (blob: Blob): Promise<EapPackage> => {
    const text = await blob.text();
    
    try {
      // Base64 解码
      const decoded = decodeURIComponent(escape(atob(text)));
      return JSON.parse(decoded);
    } catch (e) {
      throw new Error('解析失败：数据包格式不正确或已损坏');
    }
  },

  /**
   * 下载文件
   */
  downloadEap: (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
};