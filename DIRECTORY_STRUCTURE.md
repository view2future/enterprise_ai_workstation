# 企业数据管理平台目录结构与代码组织

## 1. 项目根目录结构

```
enterprise-management-system/
├── README.md                    # 项目说明文档
├── LICENSE                      # 许可证文件
├── .gitignore                   # Git忽略文件配置
├── .env.example                 # 环境变量示例
├── docker/                      # Docker相关配置
│   ├── docker-compose.yml       # Docker Compose配置
│   ├── frontend.Dockerfile      # 前端Dockerfile
│   └── backend.Dockerfile       # 后端Dockerfile
├── docs/                        # 项目文档
│   ├── api/                     # API文档
│   ├── architecture/            # 架构文档
│   ├── user-guide/              # 用户指南
│   └── deployment/              # 部署文档
├── backend/                     # 后端服务
│   ├── package.json             # 后端依赖配置
│   ├── tsconfig.json            # TypeScript配置
│   ├── nest-cli.json            # Nest CLI配置
│   ├── src/                     # 后端源代码
│   │   ├── app.module.ts        # 应用根模块
│   │   ├── main.ts              # 应用入口
│   │   ├── config/              # 配置文件
│   │   │   ├── database.config.ts
│   │   │   ├── redis.config.ts
│   │   │   └── app.config.ts
│   │   ├── modules/             # 功能模块
│   │   │   ├── auth/            # 认证模块
│   │   │   │   ├── auth.module.ts
│   │   │   │   ├── auth.controller.ts
│   │   │   │   ├── auth.service.ts
│   │   │   │   ├── auth.guard.ts
│   │   │   │   └── dto/
│   │   │   │       ├── login.dto.ts
│   │   │   │       └── register.dto.ts
│   │   │   ├── enterprises/     # 企业模块
│   │   │   │   ├── enterprises.module.ts
│   │   │   │   ├── enterprises.controller.ts
│   │   │   │   ├── enterprises.service.ts
│   │   │   │   ├── enterprises.repository.ts
│   │   │   │   └── dto/
│   │   │   │       ├── create-enterprise.dto.ts
│   │   │   │       ├── update-enterprise.dto.ts
│   │   │   │       └── enterprise-filter.dto.ts
│   │   │   ├── import-export/   # 导入导出模块
│   │   │   │   ├── import-export.module.ts
│   │   │   │   ├── import-export.controller.ts
│   │   │   │   ├── import-export.service.ts
│   │   │   │   └── dto/
│   │   │   │       ├── import.dto.ts
│   │   │   │       └── export.dto.ts
│   │   │   ├── dashboard/       # 仪表板模块
│   │   │   │   ├── dashboard.module.ts
│   │   │   │   ├── dashboard.controller.ts
│   │   │   │   └── dashboard.service.ts
│   │   │   ├── reports/         # 报告模块
│   │   │   │   ├── reports.module.ts
│   │   │   │   ├── reports.controller.ts
│   │   │   │   └── reports.service.ts
│   │   │   └── users/           # 用户模块
│   │   │       ├── users.module.ts
│   │   │       ├── users.controller.ts
│   │   │       ├── users.service.ts
│   │   │       └── dto/
│   │   │           ├── create-user.dto.ts
│   │   │           └── update-user.dto.ts
│   │   ├── common/              # 公共组件
│   │   │   ├── decorators/      # 装饰器
│   │   │   │   ├── roles.decorator.ts
│   │   │   │   └── current-user.decorator.ts
│   │   │   ├── guards/          # 守卫
│   │   │   │   ├── roles.guard.ts
│   │   │   │   └── auth.guard.ts
│   │   │   ├── interceptors/    # 拦截器
│   │   │   │   ├── logging.interceptor.ts
│   │   │   │   └── transform.interceptor.ts
│   │   │   ├── filters/         # 过滤器
│   │   │   │   └── http-exception.filter.ts
│   │   │   ├── pipes/           # 管道
│   │   │   │   └── validation.pipe.ts
│   │   │   └── middleware/      # 中间件
│   │   │       └── logger.middleware.ts
│   │   ├── entities/            # 实体类
│   │   │   ├── enterprise.entity.ts
│   │   │   ├── user.entity.ts
│   │   │   ├── funding-round.entity.ts
│   │   │   ├── ai-application.entity.ts
│   │   │   └── baidu-ai-usage.entity.ts
│   │   ├── dto/                 # 数据传输对象
│   │   │   └── base.dto.ts
│   │   ├── services/            # 业务服务
│   │   │   ├── file.service.ts
│   │   │   ├── email.service.ts
│   │   │   └── cache.service.ts
│   │   ├── repositories/        # 数据访问层
│   │   │   ├── base.repository.ts
│   │   │   └── enterprise.repository.ts
│   │   ├── utils/               # 工具函数
│   │   │   ├── helpers.ts
│   │   │   ├── validators.ts
│   │   │   └── constants.ts
│   │   └── types/               # 类型定义
│   │       └── index.ts
│   ├── prisma/                  # Prisma配置
│   │   ├── schema.prisma        # 数据库模式
│   │   ├── migrations/          # 数据库迁移
│   │   └── seed.ts              # 种子数据
│   ├── test/                    # 测试文件
│   │   ├── jest.config.js       # Jest配置
│   │   ├── unit/                # 单元测试
│   │   ├── integration/         # 集成测试
│   │   └── e2e/                 # 端到端测试
│   └── dist/                    # 编译输出目录
├── frontend/                    # 前端应用
│   ├── package.json             # 前端依赖配置
│   ├── tsconfig.json            # TypeScript配置
│   ├── vite.config.ts           # Vite配置
│   ├── tailwind.config.js       # Tailwind配置
│   ├── postcss.config.js        # PostCSS配置
│   ├── public/                  # 静态资源
│   │   ├── favicon.ico
│   │   ├── index.html
│   │   └── manifest.json
│   ├── src/                     # 前端源代码
│   │   ├── App.tsx              # 应用根组件
│   │   ├── main.tsx             # 应用入口
│   │   ├── index.css            # 全局样式
│   │   ├── components/          # 可复用组件
│   │   │   ├── common/          # 通用组件
│   │   │   │   ├── Button.tsx
│   │   │   │   ├── Input.tsx
│   │   │   │   ├── Card.tsx
│   │   │   │   ├── Modal.tsx
│   │   │   │   ├── Table.tsx
│   │   │   │   └── LoadingSpinner.tsx
│   │   │   ├── layout/          # 布局组件
│   │   │   │   ├── Header.tsx
│   │   │   │   ├── Sidebar.tsx
│   │   │   │   ├── Footer.tsx
│   │   │   │   └── Layout.tsx
│   │   │   ├── dashboard/       # 仪表板组件
│   │   │   │   ├── StatCard.tsx
│   │   │   │   ├── ChartCard.tsx
│   │   │   │   ├── KpiCard.tsx
│   │   │   │   └── ActivityFeed.tsx
│   │   │   ├── enterprises/     # 企业相关组件
│   │   │   │   ├── EnterpriseCard.tsx
│   │   │   │   ├── EnterpriseList.tsx
│   │   │   │   ├── EnterpriseForm.tsx
│   │   │   │   ├── EnterpriseDetail.tsx
│   │   │   │   └── EnterpriseFilter.tsx
│   │   │   ├── charts/          # 图表组件
│   │   │   │   ├── BarChart.tsx
│   │   │   │   ├── PieChart.tsx
│   │   │   │   ├── LineChart.tsx
│   │   │   │   └── ResponsiveChart.tsx
│   │   │   ├── import-export/   # 导入导出组件
│   │   │   │   ├── ImportModal.tsx
│   │   │   │   ├── ExportModal.tsx
│   │   │   │   └── FileUpload.tsx
│   │   │   ├── reports/         # 报告组件
│   │   │   │   ├── ReportCard.tsx
│   │   │   │   ├── ReportGenerator.tsx
│   │   │   │   └── ReportPreview.tsx
│   │   │   └── ui/              # UI组件库
│   │   │       ├── neubrutalism/ # Neubrutalism风格组件
│   │   │       │   ├── NeubrutalCard.tsx
│   │   │       │   ├── NeubrutalButton.tsx
│   │   │       │   └── NeubrutalInput.tsx
│   │   │       └── shadcn/      # Shadcn组件封装
│   │   │           ├── DataTable.tsx
│   │   │           └── ...
│   │   ├── pages/               # 页面组件
│   │   │   ├── DashboardPage.tsx
│   │   │   ├── EnterprisesPage.tsx
│   │   │   ├── EnterpriseDetailPage.tsx
│   │   │   ├── ImportExportPage.tsx
│   │   │   ├── ReportsPage.tsx
│   │   │   ├── SettingsPage.tsx
│   │   │   └── LoginPage.tsx
│   │   ├── hooks/               # 自定义React hooks
│   │   │   ├── useApi.ts
│   │   │   ├── useAuth.ts
│   │   │   ├── useLocalStorage.ts
│   │   │   └── useDebounce.ts
│   │   ├── services/            # API服务
│   │   │   ├── api.ts
│   │   │   ├── enterprise.service.ts
│   │   │   ├── auth.service.ts
│   │   │   └── report.service.ts
│   │   ├── store/               # 状态管理 (Zustand)
│   │   │   ├── enterprise.store.ts
│   │   │   ├── auth.store.ts
│   │   │   └── ui.store.ts
│   │   ├── types/               # TypeScript类型定义
│   │   │   ├── enterprise.types.ts
│   │   │   ├── user.types.ts
│   │   │   ├── api.types.ts
│   │   │   └── chart.types.ts
│   │   ├── utils/               # 工具函数
│   │   │   ├── helpers.ts
│   │   │   ├── validators.ts
│   │   │   ├── formatters.ts
│   │   │   └── constants.ts
│   │   ├── contexts/            # React上下文
│   │   │   ├── AuthContext.tsx
│   │   │   ├── ThemeContext.tsx
│   │   │   └── LoadingContext.tsx
│   │   ├── assets/              # 静态资源
│   │   │   ├── images/
│   │   │   ├── icons/
│   │   │   └── styles/
│   │   └── styles/              # 全局样式
│   │       ├── globals.css
│   │       ├── neubrutalism.css
│   │       └── components.css
│   ├── tests/                   # 前端测试
│   │   ├── setup.ts
│   │   ├── unit/
│   │   └── e2e/
│   └── dist/                    # 构建输出目录
├── scripts/                     # 脚本文件
│   ├── setup.sh                 # 环境设置脚本
│   ├── migrate.sh               # 数据库迁移脚本
│   ├── seed.sh                  # 数据填充脚本
│   └── deploy.sh                # 部署脚本
├── .github/                     # GitHub配置
│   └── workflows/               # CI/CD工作流
│       ├── test.yml
│       ├── build.yml
│       └── deploy.yml
└── database_init.sql            # 数据库初始化脚本
```

## 2. 代码组织原则

### 2.1 模块化设计
- 按功能垂直切分模块
- 每个模块包含完整的功能组件
- 模块间保持低耦合

### 2.2 分层架构
- **表示层**: React组件负责UI展示
- **服务层**: API调用和数据处理
- **业务逻辑层**: 核心业务逻辑
- **数据访问层**: 数据库操作

### 2.3 关注点分离
- UI逻辑与业务逻辑分离
- 数据验证与业务验证分离
- 状态管理与组件逻辑分离

## 3. 命名规范

### 3.1 文件命名
- **组件文件**: PascalCase (e.g., `EnterpriseCard.tsx`)
- **服务文件**: camelCase (e.g., `enterprise.service.ts`)
- **类型定义**: PascalCase (e.g., `Enterprise.types.ts`)
- **配置文件**: kebab-case (e.g., `tailwind.config.js`)

### 3.2 变量命名
- **常量**: UPPER_SNAKE_CASE (e.g., `MAX_FILE_SIZE`)
- **函数**: camelCase (e.g., `calculateTotal`)
- **组件**: PascalCase (e.g., `EnterpriseCard`)
- **类**: PascalCase (e.g., `EnterpriseService`)

## 4. 代码质量标准

### 4.1 TypeScript使用
- 严格模式开启
- 所有函数参数和返回值类型注解
- 接口和类型定义明确
- 避免any类型使用

### 4.2 测试覆盖率
- 单元测试覆盖率>80%
- 集成测试覆盖核心功能
- E2E测试覆盖关键用户路径

### 4.3 文档要求
- 每个公共函数和类有JSDoc注释
- 复杂逻辑有内联注释
- API端点有详细文档

## 5. 开发工具配置

### 5.1 代码格式化
- Prettier配置统一代码风格
- ESLint规则强制执行
- Git hooks自动格式化

### 5.2 构建工具
- Vite用于前端快速开发
- Nest CLI用于后端开发
- Docker用于环境隔离

### 5.3 调试工具
- React DevTools
- NestJS调试配置
- 数据库管理工具

## 6. 部署目录结构

```
deploy/
├── production/                  # 生产环境
│   ├── docker-compose.prod.yml
│   ├── nginx.conf
│   └── ssl/
├── staging/                     # 预发布环境
│   ├── docker-compose.staging.yml
│   └── monitoring/
└── backup/                      # 备份文件
    ├── database/
    └── application/
```

## 7. 环境管理

### 7.1 环境文件
- `.env.development` - 开发环境
- `.env.test` - 测试环境
- `.env.production` - 生产环境

### 7.2 环境变量分类
- **数据库配置**: `DATABASE_URL`
- **认证配置**: `JWT_SECRET`
- **第三方服务**: `REDIS_URL`
- **应用配置**: `PORT`, `NODE_ENV`

## 8. 测试目录结构

### 8.1 后端测试
```
backend/test/
├── jest.config.js
├── unit/
│   ├── services/
│   ├── controllers/
│   └── utils/
├── integration/
│   ├── auth/
│   ├── enterprises/
│   └── import-export/
└── e2e/
    ├── auth.e2e-spec.ts
    └── enterprises.e2e-spec.ts
```

### 8.2 前端测试
```
frontend/tests/
├── setup.ts
├── unit/
│   ├── components/
│   ├── hooks/
│   └── services/
└── e2e/
    ├── dashboard.spec.ts
    └── enterprises.spec.ts
```

## 9. 文档目录结构

```
docs/
├── getting-started/
│   ├── installation.md
│   ├── configuration.md
│   └── quick-start.md
├── api-reference/
│   ├── auth.md
│   ├── enterprises.md
│   └── reports.md
├── architecture/
│   ├── overview.md
│   ├── database.md
│   └── security.md
├── user-guide/
│   ├── dashboard.md
│   ├── enterprises.md
│   └── import-export.md
└── deployment/
    ├── local.md
    ├── docker.md
    └── production.md
```

## 10. 配置文件模板

### 10.1 .env.example
```env
# 应用配置
PORT=3001
NODE_ENV=development
API_VERSION=v1

# 数据库配置
DATABASE_URL="postgresql://user:password@localhost:5432/enterprise_db"

# 认证配置
JWT_SECRET="your-jwt-secret-key"
JWT_EXPIRES_IN="24h"
REFRESH_JWT_SECRET="your-refresh-jwt-secret"
REFRESH_JWT_EXPIRES_IN="7d"

# Redis配置
REDIS_URL="redis://localhost:6379"
REDIS_TTL=3600

# 文件上传配置
MAX_FILE_SIZE=10485760  # 10MB
UPLOAD_DIR="./uploads"

# 第三方服务
BAIDU_AI_API_KEY=""
BAIDU_AI_SECRET_KEY=""

# 邮件配置
SMTP_HOST=""
SMTP_PORT=587
SMTP_USER=""
SMTP_PASS=""
```

### 10.2 package.json模板
```json
{
  "name": "enterprise-management-system",
  "version": "1.0.0",
  "description": "企业数据管理平台",
  "scripts": {
    "dev": "nest start --watch",
    "build": "nest build",
    "start": "node dist/main",
    "start:prod": "NODE_ENV=production node dist/main",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:cov": "jest --coverage",
    "lint": "eslint \"{src,apps,libs,test}/**/*.ts\" --fix",
    "format": "prettier --write \"src/**/*.ts\" \"test/**/*.ts\"",
    "migrate": "prisma migrate dev",
    "seed": "prisma db seed"
  },
  "dependencies": {
    "@nestjs/common": "^10.0.0",
    "@nestjs/core": "^10.0.0",
    "@nestjs/platform-express": "^10.0.0",
    "prisma": "^5.0.0",
    "pg": "^8.0.0",
    "class-validator": "^0.14.0",
    "class-transformer": "^0.5.0",
    "reflect-metadata": "^0.1.13",
    "rxjs": "^7.8.1"
  },
  "devDependencies": {
    "@nestjs/cli": "^10.0.0",
    "@nestjs/schematics": "^10.0.0",
    "@nestjs/testing": "^10.0.0",
    "@types/express": "^4.17.17",
    "@types/jest": "^29.5.2",
    "@types/node": "^20.3.1",
    "@types/supertest": "^2.0.12",
    "jest": "^29.5.0",
    "prettier": "^2.8.8",
    "supertest": "^6.3.3",
    "ts-jest": "^29.1.0",
    "ts-loader": "^9.4.3",
    "ts-node": "^10.9.1",
    "tsconfig-paths": "^4.2.0",
    "typescript": "^5.1.3"
  }
}
```

这个目录结构设计遵循了现代软件工程的最佳实践，确保了代码的可维护性、可扩展性和可测试性。