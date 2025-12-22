-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "firstName" TEXT,
    "lastName" TEXT,
    "role" TEXT NOT NULL DEFAULT 'analyst',
    "status" TEXT NOT NULL DEFAULT 'active',
    "envScope" TEXT NOT NULL DEFAULT 'PROD',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "enterprises" (
    "id" SERIAL NOT NULL,
    "企业名称" TEXT NOT NULL,
    "env" TEXT NOT NULL DEFAULT 'PROD',
    "飞桨_文心" TEXT,
    "线索入库时间" TEXT,
    "线索更新时间" TIMESTAMP(3),
    "伙伴等级" TEXT,
    "生态AI产品" TEXT,
    "优先级" TEXT,
    "base" TEXT,
    "注册资本" BIGINT,
    "参保人数" INTEGER,
    "企业背景" TEXT,
    "行业" JSONB,
    "任务方向" TEXT,
    "联系人信息" TEXT,
    "使用场景" TEXT,
    "status" TEXT NOT NULL DEFAULT 'active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdBy" TEXT,
    "updatedBy" TEXT,
    "统一社会信用代码" TEXT,
    "法定代表人" TEXT,
    "成立日期" TIMESTAMP(3),
    "企业类型" TEXT,
    "年度营收规模" TEXT,
    "技术研发人数" INTEGER,
    "是否高新企业" BOOLEAN DEFAULT false,
    "是否专精特新" BOOLEAN DEFAULT false,
    "公司官网" TEXT,
    "详细办公地址" TEXT,
    "飞桨应用深度" TEXT,
    "飞桨具体模型" JSONB,
    "飞桨训练模式" TEXT,
    "文心大模型版本" TEXT,
    "文心应用场景" JSONB,
    "提示词模板数" INTEGER DEFAULT 0,
    "月均API调用量" BIGINT DEFAULT 0,
    "峰值并发量" INTEGER DEFAULT 0,
    "推理算力类型" TEXT,
    "AI落地阶段" TEXT,
    "生态项目类别" TEXT,
    "百度AI认证证书" JSONB,
    "参与活动记录" JSONB,
    "联合解决方案" JSONB,
    "百度是否投资" BOOLEAN DEFAULT false,
    "技术培训记录" JSONB,
    "获奖记录" JSONB,
    "百度最近对接部门" TEXT,
    "数据完整性哈希" TEXT,
    "最后审计时间" TIMESTAMP(3),
    "是否已归档" BOOLEAN NOT NULL DEFAULT false,
    "数据来源" TEXT DEFAULT 'manual',

    CONSTRAINT "enterprises_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "action" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" INTEGER,
    "details" TEXT,
    "oldValue" JSONB,
    "newValue" JSONB,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ipAddress" TEXT,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reports" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "format" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "description" TEXT,
    "filters" JSONB,
    "configuration" JSONB,
    "filePath" TEXT,
    "fileName" TEXT,
    "dataCount" INTEGER NOT NULL DEFAULT 0,
    "progress" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "completedAt" TIMESTAMP(3),
    "createdBy" TEXT,
    "errorMessage" TEXT,

    CONSTRAINT "reports_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "enterprises_企业名称_key" ON "enterprises"("企业名称");

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
