-- 数据库迁移脚本 - 企业AI技术生态合作伙伴管理系统

-- 创建扩展
CREATE EXTENSION IF NOT EXISTS pg_trgm; -- 用于全文搜索
CREATE EXTENSION IF NOT EXISTS hstore;  -- 用于键值对存储

-- 创建企业主表
CREATE TABLE IF NOT EXISTS enterprises (
    id BIGSERIAL PRIMARY KEY,
    企业名称 VARCHAR(255) UNIQUE NOT NULL,
    统一社会信用代码 VARCHAR(18),
    法定代表人 VARCHAR(100),
    成立日期 DATE,
    企业性质 VARCHAR(50),
    经营状态 VARCHAR(20) DEFAULT '存续',
    
    -- AI技术生态字段
    飞桨_文心 VARCHAR(20) CHECK (飞桨_文心 IN ('飞桨', '文心')),
    线索入库时间 VARCHAR(10) CHECK (线索入库时间 ~ '^\d{4}Q[1-4]$'),
    线索更新时间 TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    伙伴等级 VARCHAR(20) CHECK (伙伴等级 IN ('认证级', '优选级', '无')),
    生态AI产品 TEXT,
    优先级 VARCHAR(10) CHECK (优先级 IN ('P0', 'P1', 'P2')),
    技术接入类型 VARCHAR(50) CHECK (技术接入类型 IN ('基础接入', '深度合作', '定制开发')),
    AI产品应用场景 JSONB,
    技术难度评级 VARCHAR(20) CHECK (技术难度评级 IN ('简单', '中等', '复杂', '极复杂')),
    项目阶段 VARCHAR(20) CHECK (项目阶段 IN ('接触阶段', '意向阶段', '签约阶段', '实施阶段', '完成阶段')),
    
    -- 企业实力字段
    base TEXT,
    所在区域 VARCHAR(20) CHECK (所在区域 IN ('西南', '华南', '华北', '华中', '华东', '西北')),
    详细地址 TEXT,
    注册资本 BIGINT CHECK (注册资本 >= 0),
    实缴资本 BIGINT CHECK (实缴资本 >= 0),
    参保人数 INTEGER CHECK (参保人数 >= 0),
    技术人员数量 INTEGER CHECK (技术人员数量 >= 0),
    AI技术人员数量 INTEGER CHECK (AI技术人员数量 >= 0),
    研发投入占比 DECIMAL(5,2) CHECK (研发投入占比 >= 0 AND 研发投入占比 <= 100),
    年度营收 NUMERIC(15,2),
    净利润 NUMERIC(15,2),
    资产总额 NUMERIC(15,2),
    净资产 NUMERIC(15,2),
    负债总额 NUMERIC(15,2),
    专利数量 INTEGER CHECK (专利数量 >= 0),
    软件著作权数量 INTEGER CHECK (软件著作权数量 >= 0),
    技术认证 JSONB,
    技术栈 JSONB,
    
    -- 业务信息字段
    企业背景 TEXT CHECK (CHAR_LENGTH(企业背景) >= 50 AND CHAR_LENGTH(企业背景) <= 200),
    行业 JSONB,
    细分领域 JSONB,
    主营业务 TEXT,
    服务客户数量 INTEGER CHECK (服务客户数量 >= 0),
    服务行业数量 INTEGER CHECK (服务行业数量 >= 0),
    市场占有率 DECIMAL(5,2),
    年增长率 DECIMAL(5,2),
    客户满意度 DECIMAL(5,2),
    
    -- 合作信息字段
    合作起始时间 DATE,
    合作年限 INTEGER CHECK (合作年限 >= 0),
    年度预算 NUMERIC(15,2),
    合作类型 VARCHAR(50) CHECK (合作类型 IN ('技术合作', '产品合作', '服务合作', '生态合作')),
    合作状态 VARCHAR(20) CHECK (合作状态 IN ('洽谈中', '已签约', '执行中', '已完成', '已终止')),
    合同金额 NUMERIC(15,2),
    项目ROI DECIMAL(5,2),
    百度对接人 JSONB,
    企业对接人 JSONB,
    
    -- 技术能力字段
    技术团队规模 INTEGER,
    算法工程师数 INTEGER,
    数据科学家数 INTEGER,
    AI项目经验 VARCHAR(20) CHECK (AI项目经验 IN ('0-1年', '1-3年', '3-5年', '5年以上')),
    开发能力等级 VARCHAR(20) CHECK (开发能力等级 IN ('初级', '中级', '高级', '专家')),
    技术栈深度 VARCHAR(20) CHECK (技术栈深度 IN ('浅层', '中等', '深度', '专精')),
    技术痛点 TEXT,
    技术需求 JSONB,
    
    -- 百度AI生态字段
    百度AI产品集成 JSONB,
    文心接入等级 VARCHAR(20) CHECK (文心接入等级 IN ('基础版', '专业版', '企业版')),
    飞桨定制化程度 VARCHAR(20) CHECK (飞桨定制化程度 IN ('标准版', '定制化', '深度定制')),
    API调用量 BIGINT,
    服务使用频次 VARCHAR(20) CHECK (服务使用频次 IN ('高频', '中频', '低频')),
    技术反馈满意度 DECIMAL(5,2),
    服务使用周期 INTEGER,
    技术培训次数 INTEGER,
    技术支持记录 JSONB,
    合作项目数量 INTEGER,
    
    -- 百度BMO互动经历字段
    BMO互动活动 JSONB,
    最近BMO活动 JSONB,
    活动参与频次 VARCHAR(20) CHECK (活动参与频次 IN ('高', '中', '低')),
    活动偏好 JSONB,
    合作满意度 DECIMAL(5,2),
    历史合作项目 JSONB,
    
    -- 联系人信息字段
    联系人信息 TEXT,
    技术负责人 JSONB,
    业务负责人 JSONB,
    项目负责人 JSONB,
    决策人 JSONB,
    采购联系人 JSONB,
    
    -- 使用场景字段
    使用场景 TEXT,
    业务场景 JSONB,
    部署场景 VARCHAR(20) CHECK (部署场景 IN ('云端部署', '本地部署', '混合部署')),
    业务规模 VARCHAR(20) CHECK (业务规模 IN ('小规模', '中规模', '大规模', '超大规模')),
    数据敏感度 VARCHAR(20) CHECK (数据敏感度 IN ('低', '中', '高', '极高')),
    行业影响力 VARCHAR(20) CHECK (行业影响力 IN ('一般', '重要', '重要标杆', '行业领袖')),
    
    -- 管理字段
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(100),
    updated_by VARCHAR(100),
    负责销售 VARCHAR(100),
    所属区域_销售 VARCHAR(50),
    销售渠道 VARCHAR(100),
    客户等级 VARCHAR(20) CHECK (客户等级 IN ('普通客户', '重要客户', '战略客户')),
    备注信息 TEXT,
    标签 JSONB
);

-- 创建企业进展表
CREATE TABLE IF NOT EXISTS enterprise_progress (
    id BIGSERIAL PRIMARY KEY,
    enterprise_id BIGINT REFERENCES enterprises(id) ON DELETE CASCADE,
    进展类型 VARCHAR(20) DEFAULT '本周进展' CHECK (进展类型 IN ('本周进展', '上周进展', '月度进展', '季度总结')),
    进展内容 TEXT NOT NULL,
    关键成果 JSONB,
    当前挑战 JSONB,
    解决方案 JSONB,
    下一步计划 JSONB,
    参与人员 JSONB,
    重要决策 TEXT,
    资源投入 JSONB,
    关键里程碑 JSONB,
    风险识别 JSONB,
    风险应对 JSONB,
    客户需求变化 JSONB,
    竞品动态 JSONB,
    市场反馈 JSONB,
    技术难点 JSONB,
    合作协调 JSONB,
    创建时间 TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    更新时间 TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    创建人 VARCHAR(100),
    更新人 VARCHAR(100)
);

-- 创建AI项目表
CREATE TABLE IF NOT EXISTS ai_projects (
    id BIGSERIAL PRIMARY KEY,
    enterprise_id BIGINT REFERENCES enterprises(id) ON DELETE CASCADE,
    项目名称 VARCHAR(200) NOT NULL,
    项目类型 VARCHAR(50) CHECK (项目类型 IN ('智能客服', 'OCR识别', '图像处理', '语音识别', 'NLP应用', '数据分析', '预测模型', '目标检测', '自然语言处理')),
    项目阶段 VARCHAR(20) CHECK (项目阶段 IN ('需求分析', '开发中', '测试中', '已上线')),
    项目负责人 VARCHAR(100),
    预算金额 NUMERIC(12,2),
    实际花费 NUMERIC(12,2),
    开始时间 DATE,
    预计完成时间 DATE,
    实际完成时间 DATE,
    项目状态 VARCHAR(20) CHECK (项目状态 IN ('进行中', '已完成', '已暂停', '已取消')),
    技术难点 TEXT,
    项目成果 TEXT,
    ROI DECIMAL(5,2),
    项目评分 DECIMAL(3,2) CHECK (项目评分 >= 0 AND 项目评分 <= 10),
    创建时间 TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    更新时间 TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 创建企业文档表
CREATE TABLE IF NOT EXISTS enterprise_documents (
    id BIGSERIAL PRIMARY KEY,
    enterprise_id BIGINT REFERENCES enterprises(id) ON DELETE CASCADE,
    文档类型 VARCHAR(50) CHECK (文档类型 IN ('合作协议', '技术方案', '验收报告', '资质证书', '合同', '发票', '其他')),
    文档名称 VARCHAR(200) NOT NULL,
    文件路径 TEXT,
    文件大小 BIGINT,
    上传时间 TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    上传人 VARCHAR(100),
    版本号 VARCHAR(20),
    描述 TEXT,
    访问权限 JSONB,
    创建时间 TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    更新时间 TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 创建企业关系表
CREATE TABLE IF NOT EXISTS enterprise_relations (
    id BIGSERIAL PRIMARY KEY,
    enterprise_id BIGINT REFERENCES enterprises(id) ON DELETE CASCADE,
    关联企业_id BIGINT REFERENCES enterprises(id) ON DELETE CASCADE,
    关系类型 VARCHAR(50) CHECK (关系类型 IN ('供应商', '客户', '合作伙伴', '竞争对手', '投资方', '被投资方')),
    关系描述 TEXT,
    建立时间 DATE,
    状态 VARCHAR(20) CHECK (状态 IN ('合作中', '已终止', '洽谈中')) DEFAULT '合作中',
    创建时间 TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    更新时间 TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 创建审计日志表
CREATE TABLE IF NOT EXISTS audit_logs (
    id BIGSERIAL PRIMARY KEY,
    表名 VARCHAR(100) NOT NULL,
    记录ID BIGINT NOT NULL,
    操作类型 VARCHAR(10) CHECK (操作类型 IN ('INSERT', 'UPDATE', 'DELETE')),
    旧值 JSONB,
    新值 JSONB,
    操作人 VARCHAR(100),
    IP地址 INET,
    操作时间 TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_enterprises_name ON enterprises(企业名称);
CREATE INDEX IF NOT EXISTS idx_enterprises_tech_type ON enterprises(飞桨_文心);
CREATE INDEX IF NOT EXISTS idx_enterprises_priority ON enterprises(优先级);
CREATE INDEX IF NOT EXISTS idx_enterprises_partner_level ON enterprises(伙伴等级);
CREATE INDEX IF NOT EXISTS idx_enterprises_region ON enterprises(所在区域);
CREATE INDEX IF NOT EXISTS idx_enterprises_quarter ON enterprises(线索入库时间);
CREATE INDEX IF NOT EXISTS idx_enterprises_update_time ON enterprises(线索更新时间 DESC);
CREATE INDEX IF NOT EXISTS idx_enterprises_registered_capital ON enterprises(注册资本);
CREATE INDEX IF NOT EXISTS idx_enterprises_employee_count ON enterprises(参保人数);
CREATE INDEX IF NOT EXISTS idx_enterprises_task_direction ON enterprises(任务方向);
CREATE INDEX IF NOT EXISTS idx_enterprises_industry ON enterprises USING gin(行业);
CREATE INDEX IF NOT EXISTS idx_enterprises_business_scenarios ON enterprises USING gin(业务场景);

-- 全文搜索索引
CREATE INDEX IF NOT EXISTS idx_enterprises_name_trgm ON enterprises USING gin(企业名称 gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_enterprises_background_trgm ON enterprises USING gin(企业背景 gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_enterprises_scenario_trgm ON enterprises USING gin(使用场景 gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_enterprises_products_trgm ON enterprises USING gin(生态AI产品 gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_enterprises_contacts_trgm ON enterprises USING gin(联系人信息 gin_trgm_ops);

-- 进展表索引
CREATE INDEX IF NOT EXISTS idx_enterprise_progress_enterprise_id ON enterprise_progress(enterprise_id);
CREATE INDEX IF NOT EXISTS idx_enterprise_progress_update_time ON enterprise_progress(更新时间 DESC);

-- AI项目表索引
CREATE INDEX IF NOT EXISTS idx_ai_projects_enterprise_id ON ai_projects(enterprise_id);
CREATE INDEX IF NOT EXISTS idx_ai_projects_stage ON ai_projects(项目阶段);

-- 文档表索引
CREATE INDEX IF NOT EXISTS idx_enterprise_documents_enterprise_id ON enterprise_documents(enterprise_id);
CREATE INDEX IF NOT EXISTS idx_enterprise_documents_type ON enterprise_documents(文档类型);

-- 关系表索引
CREATE INDEX IF NOT EXISTS idx_enterprise_relations_enterprise_id ON enterprise_relations(enterprise_id);
CREATE INDEX IF NOT EXISTS idx_enterprise_relations_related_enterprise_id ON enterprise_relations(关联企业_id);

-- 创建更新触发器函数
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update线索更新时间()
RETURNS TRIGGER AS $$
BEGIN
    NEW.线索更新时间 = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 为企业表创建触发器
CREATE TRIGGER trigger_enterprises_线索更新时间
    BEFORE UPDATE ON enterprises
    FOR EACH ROW EXECUTE FUNCTION update_线索更新时间();

CREATE TRIGGER trigger_enterprises_updated_at
    BEFORE UPDATE ON enterprises
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 为进展表创建触发器
CREATE TRIGGER trigger_progress_updated_at
    BEFORE UPDATE ON enterprise_progress
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 为AI项目表创建触发器
CREATE TRIGGER trigger_ai_projects_updated_at
    BEFORE UPDATE ON ai_projects
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 为文档表创建触发器
CREATE TRIGGER trigger_documents_updated_at
    BEFORE UPDATE ON enterprise_documents
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 为关系表创建触发器
CREATE TRIGGER trigger_relations_updated_at
    BEFORE UPDATE ON enterprise_relations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 创建审计触发器函数
CREATE OR REPLACE FUNCTION audit_trigger_function()
RETURNS TRIGGER AS $$
DECLARE
    old_data JSONB;
    new_data JSONB;
    excluded_fields TEXT[] := ARRAY['updated_at', 'updated_by', '线索更新时间'];
BEGIN
    CASE TG_OP
        WHEN 'INSERT' THEN
            new_data := to_jsonb(NEW) - excluded_fields;
            INSERT INTO audit_logs (表名, 记录ID, 操作类型, 新值, 操作人, IP地址)
            VALUES (TG_TABLE_NAME, NEW.id, 'INSERT', new_data, NEW.updated_by, inet_client_addr());
        WHEN 'UPDATE' THEN
            old_data := to_jsonb(OLD) - excluded_fields;
            new_data := to_jsonb(NEW) - excluded_fields;
            INSERT INTO audit_logs (表名, 记录ID, 操作类型, 旧值, 新值, 操作人, IP地址)
            VALUES (TG_TABLE_NAME, NEW.id, 'UPDATE', old_data, new_data, NEW.updated_by, inet_client_addr());
        WHEN 'DELETE' THEN
            old_data := to_jsonb(OLD) - excluded_fields;
            INSERT INTO audit_logs (表名, 记录ID, 操作类型, 旧值, 操作人, IP地址)
            VALUES (TG_TABLE_NAME, OLD.id, 'DELETE', old_data, OLD.updated_by, inet_client_addr());
    END CASE;
    
    RETURN CASE TG_OP 
        WHEN 'DELETE' THEN OLD 
        ELSE NEW 
    END;
END;
$$ LANGUAGE plpgsql;

-- 为企业表创建审计触发器
CREATE TRIGGER trigger_enterprises_audit
    AFTER INSERT OR UPDATE OR DELETE ON enterprises
    FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

-- 插入示例数据（展示BMO互动经历的使用方式）
INSERT INTO enterprises (
    企业名称, 飞桨_文心, 线索入库时间, 伙伴等级, 生态AI产品, 优先级, 
    base, 所在区域, 注册资本, 参保人数, 企业背景,
    行业, 任务方向, 联系人信息, 使用场景,
    BMO互动活动, 最近BMO活动, 活动参与频次, 活动偏好, 合作满意度, 历史合作项目
) VALUES (
    '成都飞桨智能科技有限公司',
    '飞桨',
    '2025Q1',
    '认证级',
    '2025-01 飞桨企业版平台',
    'P0',
    '成都',
    '西南',
    5000,
    150,
    '专注于飞桨深度学习技术的专业服务商，致力于为各行业提供智能化解决方案。公司拥有一支高素质的技术团队，持续推动技术创新。',
    '["人工智能", "深度学习", "计算机视觉"]',
    '计算机视觉、目标检测',
    '张三（技术总监）13800138001',
    '智能图像识别系统，用于工业质检、安防监控等领域。',
    '[{"活动名称": "飞桨开发者大会2025", "时间": "2025-06-15", "类型": "会议", "参与人员": ["技术总监张三"], "收获": "了解最新技术发展方向"}]',
    '{"活动名称": "飞桨技术交流会", "时间": "2025-08-20", "类型": "交流会", "成效": "深入探讨产品合作"}',
    '高',
    '["技术交流会", "开发者大会", "产品发布会"]',
    95.5,
    '[{"项目名称": "智能质检系统", "开始时间": "2024-03-15", "完成时间": "2024-08-30", "成果": "提高质检效率30%"}]'
) ON CONFLICT (企业名称) DO NOTHING;

INSERT INTO enterprises (
    企业名称, 飞桨_文心, 线索入库时间, 伙伴等级, 生态AI产品, 优先级,
    base, 所在区域, 注册资本, 参保人数, 企业背景,
    行业, 任务方向, 联系人信息, 使用场景,
    BMO互动活动, 最近BMO活动, 活动参与频次, 活动偏好, 合作满意度, 历史合作项目
) VALUES (
    '成都文心智创科技有限公司',
    '文心',
    '2025Q2',
    '优选级',
    '2025-02 文心一言企业版',
    'P1',
    '成都',
    '西南',
    3000,
    80,
    '专注于文心大模型技术应用的创新企业，为金融、教育、政务等行业提供智能对话解决方案。',
    '["人工智能", "自然语言处理", "大模型应用"]',
    '智能对话、文本生成',
    '李四（产品总监）13800138002',
    '智能客服系统，提供多轮对话和智能问答能力。',
    '[{"活动名称": "文心一言技术研讨会", "时间": "2025-05-10", "类型": "研讨会", "参与人员": ["产品总监李四"], "收获": "了解产品路线图"}, {"活动名称": "BMO技术交流会", "时间": "2025-07-22", "类型": "交流会", "参与人员": ["技术团队"], "收获": "深度技术探讨"}]',
    '{"活动名称": "AI生态伙伴大会", "时间": "2025-09-15", "类型": "大会", "成效": "签署合作协议"}',
    '中',
    '["技术研讨会", "生态伙伴大会"]',
    92.0,
    '[{"项目名称": "智能客服平台", "开始时间": "2024-01-10", "完成时间": "2024-06-25", "成果": "为20+企业提供客服能力"}]'
) ON CONFLICT (企业名称) DO NOTHING;

-- 显示表结构信息
\d enterprises;