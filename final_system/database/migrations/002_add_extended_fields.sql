-- 添加扩展字段到企业表
ALTER TABLE enterprises 
ADD COLUMN IF NOT EXISTS 统一社会信用代码 VARCHAR(18),
ADD COLUMN IF NOT EXISTS 法定代表人 VARCHAR(100),
ADD COLUMN IF NOT EXISTS 成立日期 DATE,
ADD COLUMN IF NOT EXISTS 企业性质 VARCHAR(50),
ADD COLUMN IF NOT EXISTS 经营状态 VARCHAR(20) DEFAULT '存续',
ADD COLUMN IF NOT EXISTS 技术接入类型 VARCHAR(50) CHECK (技术接入类型 IN ('基础接入', '深度合作', '定制开发')),
ADD COLUMN IF NOT EXISTS AI产品应用场景 JSONB,
ADD COLUMN IF NOT EXISTS 技术难度评级 VARCHAR(20) CHECK (技术难度评级 IN ('简单', '中等', '复杂', '极复杂')),
ADD COLUMN IF NOT EXISTS 项目阶段 VARCHAR(20) CHECK (项目阶段 IN ('接触阶段', '意向阶段', '签约阶段', '实施阶段', '完成阶段')),
ADD COLUMN IF NOT EXISTS 所在区域 VARCHAR(20) CHECK (所在区域 IN ('西南', '华南', '华北', '华中', '华东', '西北')),
ADD COLUMN IF NOT EXISTS 详细地址 TEXT,
ADD COLUMN IF NOT EXISTS 实缴资本 BIGINT CHECK (实缴资本 >= 0),
ADD COLUMN IF NOT EXISTS 技术人员数量 INTEGER CHECK (技术人员数量 >= 0),
ADD COLUMN IF NOT EXISTS AI技术人员数量 INTEGER CHECK (AI技术人员数量 >= 0),
ADD COLUMN IF NOT EXISTS 研发投入占比 DECIMAL(5,2) CHECK (研发投入占比 >= 0 AND 研发投入占比 <= 100),
ADD COLUMN IF NOT EXISTS 年度营收 NUMERIC(15,2),
ADD COLUMN IF NOT EXISTS 净利润 NUMERIC(15,2),
ADD COLUMN IF NOT EXISTS 资产总额 NUMERIC(15,2),
ADD COLUMN IF NOT EXISTS 净资产 NUMERIC(15,2),
ADD COLUMN IF NOT EXISTS 负债总额 NUMERIC(15,2),
ADD COLUMN IF NOT EXISTS 专利数量 INTEGER CHECK (专利数量 >= 0),
ADD COLUMN IF NOT EXISTS 软件著作权数量 INTEGER CHECK (软件著作权数量 >= 0),
ADD COLUMN IF NOT EXISTS 技术认证 JSONB,
ADD COLUMN IF NOT EXISTS 技术栈 JSONB,
ADD COLUMN IF NOT EXISTS 主营业务 TEXT,
ADD COLUMN IF NOT EXISTS 服务客户数量 INTEGER CHECK (服务客户数量 >= 0),
ADD COLUMN IF NOT EXISTS 服务行业数量 INTEGER CHECK (服务行业数量 >= 0),
ADD COLUMN IF NOT EXISTS 市场占有率 DECIMAL(5,2),
ADD COLUMN IF NOT EXISTS 年增长率 DECIMAL(5,2),
ADD COLUMN IF NOT EXISTS 客户满意度 DECIMAL(5,2),
ADD COLUMN IF NOT EXISTS 合作起始时间 DATE,
ADD COLUMN IF NOT EXISTS 合作年限 INTEGER CHECK (合作年限 >= 0),
ADD COLUMN IF NOT EXISTS 年度预算 NUMERIC(15,2),
ADD COLUMN IF NOT EXISTS 合作类型 VARCHAR(50) CHECK (合作类型 IN ('技术合作', '产品合作', '服务合作', '生态合作')),
ADD COLUMN IF NOT EXISTS 合作状态 VARCHAR(20) CHECK (合作状态 IN ('洽谈中', '已签约', '执行中', '已完成', '已终止')),
ADD COLUMN IF NOT EXISTS 合同金额 NUMERIC(15,2),
ADD COLUMN IF NOT EXISTS 项目ROI DECIMAL(5,2),
ADD COLUMN IF NOT EXISTS 百度对接人 JSONB,
ADD COLUMN IF NOT EXISTS 企业对接人 JSONB,
ADD COLUMN IF NOT EXISTS 技术团队规模 INTEGER,
ADD COLUMN IF NOT EXISTS 算法工程师数 INTEGER,
ADD COLUMN IF NOT EXISTS 数据科学家数 INTEGER,
ADD COLUMN IF NOT EXISTS AI项目经验 VARCHAR(20) CHECK (AI项目经验 IN ('0-1年', '1-3年', '3-5年', '5年以上')),
ADD COLUMN IF NOT EXISTS 开发能力等级 VARCHAR(20) CHECK (开发能力等级 IN ('初级', '中级', '高级', '专家')),
ADD COLUMN IF NOT EXISTS 技术栈深度 VARCHAR(20) CHECK (技术栈深度 IN ('浅层', '中等', '深度', '专精')),
ADD COLUMN IF NOT EXISTS 技术痛点 TEXT,
ADD COLUMN IF NOT EXISTS 技术需求 JSONB,
ADD COLUMN IF NOT EXISTS 百度AI产品集成 JSONB,
ADD COLUMN IF NOT EXISTS 文心接入等级 VARCHAR(20) CHECK (文心接入等级 IN ('基础版', '专业版', '企业版')),
ADD COLUMN IF NOT EXISTS 飞桨定制化程度 VARCHAR(20) CHECK (飞桨定制化程度 IN ('标准版', '定制化', '深度定制')),
ADD COLUMN IF NOT EXISTS API调用量 BIGINT,
ADD COLUMN IF NOT EXISTS 服务使用频次 VARCHAR(20) CHECK (服务使用频次 IN ('高频', '中频', '低频')),
ADD COLUMN IF NOT EXISTS 技术反馈满意度 DECIMAL(5,2),
ADD COLUMN IF NOT EXISTS 服务使用周期 INTEGER,
ADD COLUMN IF NOT EXISTS 技术培训次数 INTEGER,
ADD COLUMN IF NOT EXISTS 技术支持记录 JSONB,
ADD COLUMN IF NOT EXISTS 合作项目数量 INTEGER,
ADD COLUMN IF NOT EXISTS BMO互动活动 JSONB,
ADD COLUMN IF NOT EXISTS 最近BMO活动 JSONB,
ADD COLUMN IF NOT EXISTS 活动参与频次 VARCHAR(20) CHECK (活动参与频次 IN ('高', '中', '低')),
ADD COLUMN IF NOT EXISTS 活动偏好 JSONB,
ADD COLUMN IF NOT EXISTS 合作满意度 DECIMAL(5,2),
ADD COLUMN IF NOT EXISTS 历史合作项目 JSONB,
ADD COLUMN IF NOT EXISTS 技术负责人 JSONB,
ADD COLUMN IF NOT EXISTS 业务负责人 JSONB,
ADD COLUMN IF NOT EXISTS 项目负责人 JSONB,
ADD COLUMN IF NOT EXISTS 决策人 JSONB,
ADD COLUMN IF NOT EXISTS 采购联系人 JSONB,
ADD COLUMN IF NOT EXISTS 业务场景 JSONB,
ADD COLUMN IF NOT EXISTS 部署场景 VARCHAR(20) CHECK (部署场景 IN ('云端部署', '本地部署', '混合部署')),
ADD COLUMN IF NOT EXISTS 业务规模 VARCHAR(20) CHECK (业务规模 IN ('小规模', '中规模', '大规模', '超大规模')),
ADD COLUMN IF NOT EXISTS 数据敏感度 VARCHAR(20) CHECK (数据敏感度 IN ('低', '中', '高', '极高')),
ADD COLUMN IF NOT EXISTS 行业影响力 VARCHAR(20) CHECK (行业影响力 IN ('一般', '重要', '重要标杆', '行业领袖')),
ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'active',
ADD COLUMN IF NOT EXISTS created_by VARCHAR(100),
ADD COLUMN IF NOT EXISTS updated_by VARCHAR(100),
ADD COLUMN IF NOT EXISTS 负责销售 VARCHAR(100),
ADD COLUMN IF NOT EXISTS 所属区域_销售 VARCHAR(50),
ADD COLUMN IF NOT EXISTS 销售渠道 VARCHAR(100),
ADD COLUMN IF NOT EXISTS 客户等级 VARCHAR(20) CHECK (客户等级 IN ('普通客户', '重要客户', '战略客户')),
ADD COLUMN IF NOT EXISTS 备注信息 TEXT,
ADD COLUMN IF NOT EXISTS 标签 JSONB;

-- 添加索引
CREATE INDEX IF NOT EXISTS idx_enterprises_region ON enterprises(所在区域);
CREATE INDEX IF NOT EXISTS idx_enterprises_business_scenarios ON enterprises USING gin(业务场景);
CREATE INDEX IF NOT EXISTS idx_enterprises_updated_at ON enterprises(updated_at DESC);

-- 添加检查约束
ALTER TABLE enterprises ADD CONSTRAINT chk_企业背景_length CHECK (CHAR_LENGTH(企业背景) >= 50 AND CHAR_LENGTH(企业背景) <= 200);
ALTER TABLE enterprises ADD CONSTRAINT chk_线索入库时间_format CHECK (线索入库时间 ~ '^\d{4}Q[1-4]$');
ALTER TABLE enterprises ADD CONSTRAINT chk_注册资本 CHECK (注册资本 >= 0);
ALTER TABLE enterprises ADD CONSTRAINT chk_参保人数 CHECK (参保人数 >= 0);

-- 为BMO互动活动添加全文搜索索引
CREATE INDEX IF NOT EXISTS idx_enterprises_bmo_activities_trgm ON enterprises USING gin(to_jsonb(BMO互动活动) gin_trgm_ops);

-- 更新表结构说明
COMMENT ON COLUMN enterprises.所在区域 IS '企业所在区域，枚举值：西南、华南、华北、华中、华东、西北';
COMMENT ON COLUMN enterprises.BMO互动活动 IS '记录企业与百度BMO部门的互动活动，如参加活动、比赛、演讲等';
COMMENT ON COLUMN enterprises.活动参与频次 IS '企业参与BMO活动的频率，枚举值：高、中、低';
COMMENT ON COLUMN enterprises.合作满意度 IS '企业对与百度合作的满意度评分，百分制';

-- 验证字段是否添加成功
SELECT 
    column_name, 
    data_type, 
    is_nullable, 
    column_default
FROM information_schema.columns 
WHERE table_name = 'enterprises' 
    AND column_name IN ('所在区域', 'BMO互动活动', '活动参与频次', '合作满意度', '历史合作项目')
ORDER BY ordinal_position;