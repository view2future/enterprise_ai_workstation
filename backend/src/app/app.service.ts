import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHealth() {
    return {
      status: 'OK',
      timestamp: new Date().toISOString(),
      service: 'Enterprise Data Management System API',
      version: '1.0.0',
      uptime: process.uptime(),
    };
  }

  getApiDocs() {
    return {
      message: '企业数据管理平台API文档',
      endpoints: [
        { method: 'GET', path: '/health', description: '健康检查' },
        { method: 'GET', path: '/api', description: 'API文档' },
        { method: 'POST', path: '/auth/login', description: '用户登录' },
        { method: 'GET', path: '/enterprises', description: '获取企业列表' },
        { method: 'GET', path: '/dashboard/stats', description: '获取仪表板统计' },
      ],
      documentation: '请参考API文档获取完整端点列表',
    };
  }
}