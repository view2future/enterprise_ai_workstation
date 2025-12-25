-- CreateTable
CREATE TABLE "users" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "firstName" TEXT,
    "lastName" TEXT,
    "role" TEXT NOT NULL DEFAULT 'analyst',
    "department" TEXT NOT NULL DEFAULT 'SW_REGION',
    "status" TEXT NOT NULL DEFAULT 'active',
    "envScope" TEXT NOT NULL DEFAULT 'PROD',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "enterprises" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "企业名称" TEXT NOT NULL,
    "环境域" TEXT NOT NULL DEFAULT 'PROD',
    "飞桨_文心" TEXT,
    "线索阶段" TEXT NOT NULL DEFAULT 'LEAD',
    "线索来源" TEXT,
    "来源详情" TEXT,
    "线索入库时间" TEXT,
    "线索更新时间" DATETIME,
    "是否品牌授权" BOOLEAN NOT NULL DEFAULT false,
    "PB授权详情" TEXT,
    "伙伴等级" TEXT,
    "授牌状态" TEXT DEFAULT '未授牌',
    "授牌时间" DATETIME,
    "授牌地点" TEXT,
    "证书有效期至" DATETIME,
    "寄送状态" TEXT DEFAULT 'PENDING',
    "快递单号" TEXT,
    "物流备注" TEXT,
    "查收状态" TEXT DEFAULT 'NOT_RECEIVED',
    "最近更新日期" DATETIME,
    "生态AI产品" TEXT,
    "优先级" TEXT,
    "base" TEXT,
    "注册资本" BIGINT,
    "参保人数" INTEGER,
    "企业背景" TEXT,
    "行业" TEXT,
    "任务方向" TEXT,
    "联系人信息" TEXT,
    "使用场景" TEXT,
    "status" TEXT NOT NULL DEFAULT 'active',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "createdBy" TEXT,
    "updatedBy" TEXT,
    "统一社会信用代码" TEXT,
    "法定代表人" TEXT,
    "成立日期" DATETIME,
    "企业类型" TEXT,
    "年度营收规模" TEXT,
    "技术研发人数" INTEGER,
    "是否高新企业" BOOLEAN DEFAULT false,
    "是否专精特新" BOOLEAN DEFAULT false,
    "公司官网" TEXT,
    "详细办公地址" TEXT,
    "飞桨应用深度" TEXT,
    "飞桨具体模型" TEXT,
    "飞桨训练模式" TEXT,
    "文心大模型版本" TEXT,
    "文心应用场景" TEXT,
    "提示词模板数" INTEGER DEFAULT 0,
    "月均API调用量" BIGINT DEFAULT 0,
    "峰值并发量" INTEGER DEFAULT 0,
    "推理算力类型" TEXT,
    "AI落地阶段" TEXT,
    "百度AI认证证书" TEXT,
    "参与活动记录" TEXT,
    "联合解决方案" TEXT,
    "百度是否投资" BOOLEAN DEFAULT false,
    "技术培训记录" TEXT,
    "获奖记录" TEXT,
    "百度最近对接部门" TEXT,
    "数据完整性哈希" TEXT,
    "最后审计时间" DATETIME,
    "是否已归档" BOOLEAN NOT NULL DEFAULT false,
    "数据来源" TEXT DEFAULT 'manual',
    "是否已真值校验" BOOLEAN NOT NULL DEFAULT false,
    "真值置信度" INTEGER NOT NULL DEFAULT 0,
    "最后校验时间" DATETIME,
    "证据链数据" TEXT
);

-- CreateTable
CREATE TABLE "policies" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "政策标题" TEXT NOT NULL,
    "发文号" TEXT,
    "政策类别" TEXT,
    "原文链接" TEXT,
    "政策原文" TEXT,
    "AI结构化解析" TEXT,
    "扶持力度" TEXT,
    "申报开始时间" DATETIME,
    "申报截止时间" DATETIME,
    "面向行业" TEXT,
    "发布城市" TEXT,
    "发布年份" INTEGER,
    "行业标签" TEXT,
    "AI摘要" TEXT,
    "脑图JSON" TEXT,
    "清洗后全文" TEXT,
    "来源URL" TEXT,
    "processStatus" TEXT NOT NULL DEFAULT 'PENDING',
    "status" TEXT NOT NULL DEFAULT 'active',
    "环境域" TEXT NOT NULL DEFAULT 'PROD',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "action" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" INTEGER,
    "details" TEXT,
    "oldValue" TEXT,
    "newValue" TEXT,
    "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ipAddress" TEXT,
    CONSTRAINT "audit_logs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "veracity_tasks" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "targetName" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "progress" INTEGER NOT NULL DEFAULT 0,
    "step" TEXT,
    "resultData" TEXT,
    "envScope" TEXT NOT NULL DEFAULT 'PROD',
    "userId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "veracity_tasks_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "reports" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "format" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "description" TEXT,
    "filters" TEXT,
    "configuration" TEXT,
    "filePath" TEXT,
    "fileName" TEXT,
    "dataCount" INTEGER NOT NULL DEFAULT 0,
    "progress" INTEGER NOT NULL DEFAULT 0,
    "password" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "completedAt" DATETIME,
    "createdBy" TEXT,
    "errorMessage" TEXT,
    "环境域" TEXT NOT NULL DEFAULT 'PROD'
);

-- CreateTable
CREATE TABLE "system_usage_logs" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "endpoint" TEXT NOT NULL,
    "method" TEXT NOT NULL,
    "userId" INTEGER,
    "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "comments" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "content" TEXT NOT NULL,
    "authorId" INTEGER NOT NULL,
    "targetType" TEXT NOT NULL,
    "enterpriseId" INTEGER,
    "policyId" INTEGER,
    "mentionedIds" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "comments_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "comments_enterpriseId_fkey" FOREIGN KEY ("enterpriseId") REFERENCES "enterprises" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "comments_policyId_fkey" FOREIGN KEY ("policyId") REFERENCES "policies" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "enterprises_企业名称_key" ON "enterprises"("企业名称");

-- CreateIndex
CREATE UNIQUE INDEX "policies_发文号_key" ON "policies"("发文号");
