# 联图NEXUS-区域生态运营平台

一个专业的联图NEXUS-区域生态运营平台，专注于区域AI产业企业数据的存储、管理、分析和可视化。

## 项目特点

- **现代化技术栈**: 使用 React 18 + NestJS + PostgreSQL 构建
- **Neubrutalism UI风格**: 独特的视觉设计风格
- **高性能**: 支持10,000+企业数据的高效管理
- **完整的CRUD功能**: 企业数据的完整生命周期管理
- **高级搜索和筛选**: 多维度数据查询和过滤
- **数据导入导出**: 支持Excel/CSV格式的数据导入导出
- **报告生成**: 灵活的报告生成和可视化功能
- **用户权限管理**: 基于角色的访问控制
- **仪表板**: 实时数据可视化和关键指标展示
- **自动登录**: 启动时自动使用演示账户登录，免去手动登录步骤

## 技术架构

### 前端技术栈
- **框架**: React 18 + TypeScript
- **状态管理**: Zustand
- **路由**: React Router v6
- **API客户端**: React Query (TanStack Query)
- **UI组件**: 自定义Neubrutalism风格组件
- **图表库**: Recharts
- **构建工具**: Vite

### 后端技术栈
- **框架**: NestJS (TypeScript)
- **数据库**: PostgreSQL 14+
- **ORM**: TypeORM
- **认证**: JWT + Redis Session
- **文件处理**: Papa Parse, Excel4node
- **后台任务**: BullMQ
- **日志**: Winston

## 项目结构

```
enterprise-management-system/
├── backend/                    # 后端服务
│   ├── src/
│   │   ├── app/               # 应用根模块
│   │   ├── modules/           # 功能模块
│   │   │   ├── auth/          # 认证模块
│   │   │   ├── enterprises/   # 企业管理模块
│   │   │   ├── import-export/ # 导入导出模块
│   │   │   ├── dashboard/     # 仪表板模块
│   │   │   ├── reports/       # 报告模块
│   │   │   └── users/         # 用户模块
│   │   ├── entities/          # 数据实体
│   │   ├── services/          # 业务服务
│   │   └── dto/               # 数据传输对象
├── frontend/                   # 前端应用
│   ├── src/
│   │   ├── components/        # UI组件
│   │   ├── pages/             # 页面组件
│   │   ├── services/          # API服务
│   │   ├── hooks/             # 自定义Hook
│   │   └── contexts/          # React上下文
├── docs/                       # 文档
└── docker/                     # Docker配置
```

## 快速开始

### 环境要求
- Node.js 18+
- PostgreSQL 14+
- Docker (可选)

### 后端设置

1. 安装依赖：
```bash
cd backend
npm install
```

2. 配置环境变量：
```bash
cp .env.example .env
# 编辑 .env 文件，配置数据库连接信息
```

3. 启动数据库（如果使用Docker）：
```bash
docker-compose up -d
```

4. 同步数据库结构：
```bash
npm run db:push
```

5. 启动后端服务：
```bash
npm run start:dev
```

### 前端设置

1. 安装依赖：
```bash
cd frontend
npm install
```

2. 启动前端服务：
```bash
npm run dev
```

## 功能模块

### 1. 仪表板
- 企业数据总览
- 关键指标展示（总数、P0优先级、AI采用率等）
- 数据可视化图表（饼图、柱状图、折线图）
- 最近活动追踪

### 2. 企业管理
- 企业数据CRUD操作
- 高级搜索和筛选
- 批量操作
- 详细信息查看

### 3. 数据导入导出
- Excel/CSV格式数据导入
- 智能字段映射
- 数据验证和错误处理
- 模板下载

### 4. 报告生成
- 多种报告类型（概览、趋势、优先级等）
- 自定义筛选条件
- 多格式导出（PDF、Excel、CSV、JSON）
- 历史报告管理

### 5. 用户管理
- 用户认证和授权
- 基于角色的权限控制
- 个人资料管理
- 安全设置

## API端点

### 认证
- `POST /api/auth/login` - 用户登录
- `POST /api/auth/register` - 用户注册

### 企业数据
- `GET /api/enterprises` - 获取企业列表
- `POST /api/enterprises` - 创建企业
- `GET /api/enterprises/:id` - 获取企业详情
- `PUT /api/enterprises/:id` - 更新企业
- `DELETE /api/enterprises/:id` - 删除企业

### 仪表板
- `GET /api/dashboard/stats` - 获取统计指标
- `GET /api/dashboard/charts` - 获取图表数据
- `GET /api/dashboard/recent-activities` - 获取最近活动

### 导入导出
- `POST /api/import-export/import` - 导入数据
- `GET /api/import-export/export` - 导出数据
- `GET /api/import-export/template` - 获取导入模板

## 部署

### Docker部署
```bash
# 构建并启动所有服务
docker-compose up -d

# 构建生产镜像
docker-compose -f docker-compose.prod.yml up -d
```

### 环境变量配置

后端环境变量：
```
PORT=3001
NODE_ENV=production
DB_HOST=localhost
DB_PORT=5432
DB_NAME=enterprise_db
DB_USER=your_username
DB_PASSWORD=your_password
JWT_SECRET=your_jwt_secret
REDIS_URL=redis://localhost:6379
```

## 开发规范

### 代码规范
- 使用TypeScript进行类型安全编程
- 遵循ESLint和Prettier代码规范
- 使用JSDoc注释公共API
- 组件和函数保持单一职责

### Git工作流
- 使用Git Flow分支模型
- 提交信息遵循约定式提交规范
- 代码审查后合并

### 测试
- 单元测试覆盖率>80%
- 集成测试覆盖核心功能
- E2E测试覆盖关键用户路径

## 性能优化

- 数据库查询优化（索引、分页）
- API响应缓存
- 前端组件懒加载
- 图片和资源压缩
- 代码分割

## 安全措施

- JWT认证和授权
- SQL注入防护
- XSS防护
- 输入验证和清理
- 密码加密存储

## 维护和监控

- 系统日志记录
- 性能监控
- 错误追踪
- 数据备份策略

## 贡献

欢迎提交Issue和Pull Request来改进项目。

## 许可证

MIT License