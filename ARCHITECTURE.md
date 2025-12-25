# 联图NEXUS-区域生态运营平台系统架构设计

## 1. 架构概述

### 1.1 系统目标
- 支持10,000+企业数据的高效管理
- 提供实时数据分析和可视化功能
- 保证系统高可用性和数据安全性
- 实现灵活的扩展能力和维护性

### 1.2 架构原则
- **分层架构**: 明确的职责分离，便于维护和扩展
- **微服务化**: 逐步向微服务架构演进
- **事件驱动**: 异步处理提高系统响应性
- **安全性**: 全流程安全防护
- **可扩展性**: 水平扩展支持业务增长

## 2. 技术栈架构

### 2.1 前端架构 (React + TypeScript)
```
┌─────────────────────────────────────────────────────────────┐
│                     前端架构层                              │
├─────────────────────────────────────────────────────────────┤
│  UI组件层: Shadcn/ui + Tailwind CSS + Lucide React        │
├─────────────────────────────────────────────────────────────┤
│  状态管理: Zustand (轻量级状态管理)                        │
├─────────────────────────────────────────────────────────────┤
│  数据获取: React Query (TanStack Query)                    │
├─────────────────────────────────────────────────────────────┤
│  路由管理: React Router v6                                  │
├─────────────────────────────────────────────────────────────┤
│  表单处理: React Hook Form + Zod                           │
├─────────────────────────────────────────────────────────────┤
│  构建工具: Vite + TypeScript                               │
└─────────────────────────────────────────────────────────────┘
```

### 2.2 后端架构 (NestJS + PostgreSQL)
```
┌─────────────────────────────────────────────────────────────┐
│                     后端架构层                              │
├─────────────────────────────────────────────────────────────┤
│  API网关: NestJS (TypeScript)                              │
├─────────────────────────────────────────────────────────────┤
│  业务逻辑: 服务层 + 控制器层                                │
├─────────────────────────────────────────────────────────────┤
│  数据访问: Prisma ORM (TypeScript)                         │
├─────────────────────────────────────────────────────────────┤
│  认证授权: JWT + Redis Session                             │
├─────────────────────────────────────────────────────────────┤
│  异步任务: BullMQ + Redis                                  │
├─────────────────────────────────────────────────────────────┤
│  数据库: PostgreSQL 14+                                    │
├─────────────────────────────────────────────────────────────┤
│  缓存: Redis                                               │
└─────────────────────────────────────────────────────────────┘
```

### 2.3 基础设施架构
```
┌─────────────────────────────────────────────────────────────┐
│                   基础设施层                                │
├─────────────────────────────────────────────────────────────┤
│  容器化: Docker + Docker Compose                           │
├─────────────────────────────────────────────────────────────┤
│  监控: Prometheus + Grafana                                │
├─────────────────────────────────────────────────────────────┤
│  日志: Winston + ELK Stack (可选)                          │
├─────────────────────────────────────────────────────────────┤
│  CI/CD: GitHub Actions                                     │
└─────────────────────────────────────────────────────────────┘
```

## 3. 应用架构设计

### 3.1 前端应用架构

#### 3.1.1 项目结构
```
frontend/
├── public/                 # 静态资源
├── src/
│   ├── components/         # 可复用UI组件
│   │   ├── common/         # 通用组件
│   │   ├── dashboard/      # 仪表板组件
│   │   ├── enterprises/    # 企业相关组件
│   │   ├── charts/         # 图表组件
│   │   └── ui/             # 基础UI组件
│   ├── pages/              # 页面组件
│   │   ├── Dashboard/      # 仪表板页面
│   │   ├── Enterprises/    # 企业列表页面
│   │   ├── EnterpriseDetail/ # 企业详情页面
│   │   ├── ImportExport/   # 导入导出页面
│   │   ├── Reports/        # 报告页面
│   │   └── Settings/       # 设置页面
│   ├── hooks/              # 自定义React hooks
│   ├── services/           # API服务
│   ├── store/              # 状态管理
│   ├── types/              # TypeScript类型定义
│   ├── utils/              # 工具函数
│   ├── contexts/           # React上下文
│   ├── assets/             # 静态资源
│   └── styles/             # 全局样式
├── tests/                  # 测试文件
├── package.json
├── tsconfig.json
├── vite.config.ts
└── tailwind.config.js
```

#### 3.1.2 核心依赖
```json
{
  "dependencies": {
    "@radix-ui/react-*": "^1.0.0",           // Shadcn/ui组件
    "@tanstack/react-query": "^4.0.0",       // 数据获取
    "recharts": "^2.0.0",                    // 图表库
    "zustand": "^4.0.0",                     // 状态管理
    "react-hook-form": "^7.0.0",             // 表单处理
    "zod": "^3.0.0",                         // 数据验证
    "lucide-react": "^0.200.0",              // 图标库
    "tailwindcss": "^3.0.0",                 // CSS框架
    "@vitejs/plugin-react": "^4.0.0",        // Vite插件
    "typescript": "^5.0.0"                   // 类型系统
  }
}
```

### 3.2 后端应用架构

#### 3.2.1 项目结构
```
backend/
├── src/
│   ├── app.module.ts       # 应用根模块
│   ├── main.ts            # 应用入口
│   ├── config/            # 配置文件
│   │   ├── database.config.ts
│   │   ├── redis.config.ts
│   │   └── app.config.ts
│   ├── modules/           # 功能模块
│   │   ├── auth/          # 认证模块
│   │   ├── enterprises/   # 企业模块
│   │   ├── import-export/ # 导入导出模块
│   │   ├── reports/       # 报告模块
│   │   ├── users/         # 用户模块
│   │   └── dashboard/     # 仪表板模块
│   ├── common/            # 公共组件
│   │   ├── decorators/    # 装饰器
│   │   ├── guards/        # 守卫
│   │   ├── interceptors/  # 拦截器
│   │   ├── filters/       # 过滤器
│   │   └── pipes/         # 管道
│   ├── dto/               # 数据传输对象
│   ├── entities/          # 实体类
│   ├── services/          # 业务服务
│   ├── repositories/      # 数据访问层
│   ├── controllers/       # 控制器
│   ├── middleware/        # 中间件
│   ├── utils/             # 工具函数
│   └── types/             # 类型定义
├── prisma/                # Prisma配置
│   ├── schema.prisma      # 数据库模式
│   └── migrations/        # 数据库迁移
├── test/                  # 测试文件
├── package.json
└── nest-cli.json
```

#### 3.2.2 核心依赖
```json
{
  "dependencies": {
    "@nestjs/core": "^10.0.0",               // NestJS核心
    "@nestjs/common": "^10.0.0",             // NestJS通用
    "@nestjs/platform-express": "^10.0.0",   // Express适配器
    "@nestjs/typeorm": "^10.0.0",            // TypeORM集成
    "@nestjs/jwt": "^10.0.0",                // JWT认证
    "@nestjs/passport": "^10.0.0",           // 认证策略
    "prisma": "^5.0.0",                      // ORM
    "pg": "^8.0.0",                          // PostgreSQL驱动
    "redis": "^4.0.0",                       // Redis客户端
    "bullmq": "^3.0.0",                      // 队列处理
    "class-validator": "^0.14.0",            // 数据验证
    "class-transformer": "^0.5.0",           // 数据转换
    "excel4node": "^1.0.0",                  // Excel处理
    "papaparse": "^5.0.0",                   // CSV处理
    "winston": "^3.0.0",                     // 日志
    "helmet": "^7.0.0",                      // 安全
    "bcryptjs": "^2.0.0"                     // 密码加密
  }
}
```

## 4. 数据库架构设计

### 4.1 数据库选择
- **主数据库**: PostgreSQL 14+ (关系型数据库)
- **缓存数据库**: Redis 7+ (键值存储)
- **消息队列**: Redis (BullMQ)

### 4.2 数据库表设计

#### 4.2.1 企业主表 (enterprises)
```sql
CREATE TABLE enterprises (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    unified_social_credit_code VARCHAR(18) UNIQUE,
    registration_number VARCHAR(50),
    legal_representative VARCHAR(100),
    registered_capital DECIMAL(15,2),
    registration_date DATE,
    business_status VARCHAR(50),
    industry_type VARCHAR(100),
    sub_industry VARCHAR(100),
    region VARCHAR(100),
    city VARCHAR(100),
    district VARCHAR(100),
    address TEXT,
    employee_count INTEGER,
    annual_revenue BIGINT,
    website VARCHAR(255),
    contact_person VARCHAR(100),
    contact_phone VARCHAR(50),
    contact_email VARCHAR(255),
    remarks TEXT,
    dynamic_attributes JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES users(id),
    updated_by UUID REFERENCES users(id),
    
    -- 索引
    INDEX idx_enterprise_name (name),
    INDEX idx_enterprise_industry (industry_type),
    INDEX idx_enterprise_region (region),
    INDEX idx_enterprise_created_at (created_at)
);
```

#### 4.2.2 融资信息表 (funding_rounds)
```sql
CREATE TABLE funding_rounds (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    enterprise_id UUID NOT NULL REFERENCES enterprises(id) ON DELETE CASCADE,
    round_type VARCHAR(50),
    amount DECIMAL(15,2),
    currency VARCHAR(3) DEFAULT 'CNY',
    funding_date DATE,
    investor_names TEXT,
    valuation DECIMAL(15,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- 索引
    INDEX idx_funding_enterprise (enterprise_id),
    INDEX idx_funding_date (funding_date)
);
```

#### 4.2.3 AI应用信息表 (ai_applications)
```sql
CREATE TABLE ai_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    enterprise_id UUID NOT NULL REFERENCES enterprises(id) ON DELETE CASCADE,
    application_name VARCHAR(255),
    ai_scenario VARCHAR(100),
    implementation_stage VARCHAR(50),
    business_impact TEXT,
    roi_metrics JSONB,
    implementation_date DATE,
    maturity_level VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- 索引
    INDEX idx_ai_enterprise (enterprise_id),
    INDEX idx_ai_scenario (ai_scenario),
    INDEX idx_ai_maturity (maturity_level)
);
```

#### 4.2.4 百度AI使用信息表 (baidu_ai_usage)
```sql
CREATE TABLE baidu_ai_usage (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    enterprise_id UUID NOT NULL REFERENCES enterprises(id) ON DELETE CASCADE,
    product_name VARCHAR(100),
    usage_level VARCHAR(20),
    implementation_date DATE,
    usage_frequency VARCHAR(50),
    api_call_count BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- 索引
    INDEX idx_baidu_ai_enterprise (enterprise_id),
    INDEX idx_baidu_ai_product (product_name)
);
```

### 4.3 数据库优化策略

#### 4.3.1 索引策略
- 在常用查询字段上创建索引
- 使用复合索引优化多字段查询
- 定期分析查询性能并调整索引

#### 4.3.2 分区策略
- 按时间对历史数据进行分区
- 对大数据量表进行水平分区
- 使用部分索引优化特定查询

#### 4.3.3 缓存策略
- 使用Redis缓存热点数据
- 实现读写分离提高性能
- 使用连接池管理数据库连接

## 5. API架构设计

### 5.1 RESTful API设计规范
- 使用标准HTTP方法 (GET, POST, PUT, DELETE)
- 采用RESTful URL设计
- 统一的错误响应格式
- 版本控制 (v1, v2)

### 5.2 API端点设计

#### 5.2.1 企业管理API
```
GET    /api/v1/enterprises                    # 获取企业列表
POST   /api/v1/enterprises                    # 创建企业
GET    /api/v1/enterprises/:id                # 获取企业详情
PUT    /api/v1/enterprises/:id                # 更新企业
DELETE /api/v1/enterprises/:id                # 删除企业
POST   /api/v1/enterprises/search             # 搜索企业
GET    /api/v1/enterprises/export             # 导出企业数据
POST   /api/v1/enterprises/import             # 导入企业数据
```

#### 5.2.2 仪表板API
```
GET    /api/v1/dashboard/stats                # 获取统计指标
GET    /api/v1/dashboard/charts               # 获取图表数据
GET    /api/v1/dashboard/trends               # 获取趋势数据
GET    /api/v1/dashboard/recent-activities    # 获取最近活动
```

#### 5.2.3 认证API
```
POST   /api/v1/auth/login                     # 用户登录
POST   /api/v1/auth/register                  # 用户注册
POST   /api/v1/auth/refresh                   # 刷新令牌
POST   /api/v1/auth/logout                    # 用户登出
```

### 5.3 API响应格式
```json
{
  "success": true,
  "data": {},
  "message": "操作成功",
  "timestamp": "2023-01-01T00:00:00.000Z",
  "requestId": "uuid"
}
```

## 6. 安全架构设计

### 6.1 认证授权
- JWT令牌认证
- 基于角色的访问控制 (RBAC)
- 会话管理
- 刷新令牌机制

### 6.2 数据安全
- 敏感数据加密存储
- API密钥管理
- 请求频率限制
- SQL注入防护

### 6.3 网络安全
- HTTPS强制使用
- CORS策略配置
- Helmet安全头配置
- 输入验证和清理

## 7. 部署架构

### 7.1 容器化部署
```yaml
# docker-compose.yml
version: '3.8'
services:
  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    depends_on:
      - backend
    environment:
      - REACT_APP_API_URL=http://backend:3001/api

  backend:
    build: ./backend
    ports:
      - "3001:3001"
    depends_on:
      - postgres
      - redis
    environment:
      - DATABASE_URL=postgresql://user:pass@postgres:5432/enterprise_db
      - REDIS_URL=redis://redis:6379

  postgres:
    image: postgres:14
    environment:
      - POSTGRES_DB=enterprise_db
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=pass
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

volumes:
  postgres_data:
  redis_data:
```

### 7.2 监控和日志
- Prometheus监控指标收集
- Grafana可视化仪表板
- 结构化日志记录
- 性能分析和告警

## 8. 性能优化策略

### 8.1 前端性能
- 代码分割和懒加载
- 图片优化和压缩
- 缓存策略
- 组件优化

### 8.2 后端性能
- 数据库查询优化
- 缓存策略
- 异步处理
- 连接池管理

### 8.3 系统性能
- 负载均衡
- CDN加速
- 数据库读写分离
- 水平扩展能力