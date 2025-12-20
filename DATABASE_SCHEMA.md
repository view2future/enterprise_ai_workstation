# 企业数据管理平台数据库设计文档

## 1. 数据库设计概述

### 1.1 设计目标
- 支持10,000+企业数据的高效存储和查询
- 灵活的动态字段支持，便于业务扩展
- 高性能的统计分析和报告生成
- 完整的数据安全和审计功能

### 1.2 数据库选择
- **主数据库**: PostgreSQL 14+ (关系型数据库)
- **缓存数据库**: Redis 7+ (键值存储)
- **设计理念**: 结合传统关系模型和JSONB动态字段

## 2. 核心数据表设计

### 2.1 企业主表 (enterprises)

```sql
-- 企业基本信息表
CREATE TABLE enterprises (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- 基本信息
    name VARCHAR(255) NOT NULL,
    unified_social_credit_code VARCHAR(18) UNIQUE,
    registration_number VARCHAR(50),
    legal_representative VARCHAR(100),
    registered_capital DECIMAL(15,2),
    registration_date DATE,
    business_status VARCHAR(50),
    
    -- 行业和地区信息
    industry_type VARCHAR(100),
    sub_industry VARCHAR(100),
    region VARCHAR(100),
    city VARCHAR(100),
    district VARCHAR(100),
    address TEXT,
    
    -- 业务信息
    employee_count INTEGER,
    annual_revenue BIGINT, -- 以百万人民币为单位
    website VARCHAR(255),
    
    -- 联系信息
    contact_person VARCHAR(100),
    contact_phone VARCHAR(50),
    contact_email VARCHAR(255),
    
    -- 备注和动态字段
    remarks TEXT,
    dynamic_attributes JSONB DEFAULT '{}',
    
    -- 审计字段
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES users(id),
    updated_by UUID REFERENCES users(id),
    
    -- 索引
    INDEX idx_enterprise_name (name),
    INDEX idx_enterprise_industry (industry_type),
    INDEX idx_enterprise_region (region),
    INDEX idx_enterprise_created_at (created_at),
    INDEX idx_enterprise_updated_at (updated_at),
    GIN (dynamic_attributes)
);

-- 创建全文搜索索引
CREATE INDEX idx_enterprise_fulltext ON enterprises 
USING gin(to_tsvector('chinese', name || ' ' || COALESCE(industry_type, '') || ' ' || COALESCE(sub_industry, '') || ' ' || COALESCE(region, '') || ' ' || COALESCE(city, '') || ' ' || COALESCE(district, '') || ' ' || COALESCE(address, '') || ' ' || COALESCE(remarks, '')));
```

### 2.2 用户表 (users)

```sql
-- 用户表
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    role VARCHAR(50) DEFAULT 'analyst', -- analyst, operator, admin
    status VARCHAR(20) DEFAULT 'active', -- active, inactive, suspended
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- 索引
    INDEX idx_user_email (email),
    INDEX idx_user_username (username),
    INDEX idx_user_role (role)
);
```

### 2.3 融资信息表 (funding_rounds)

```sql
-- 企业融资轮次表
CREATE TABLE funding_rounds (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    enterprise_id UUID NOT NULL REFERENCES enterprises(id) ON DELETE CASCADE,
    round_type VARCHAR(50), -- seed, series_a, series_b, etc.
    amount DECIMAL(15,2),
    currency VARCHAR(3) DEFAULT 'CNY',
    funding_date DATE,
    investor_names TEXT,
    valuation DECIMAL(15,2),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES users(id),
    updated_by UUID REFERENCES users(id),
    
    -- 索引
    INDEX idx_funding_enterprise (enterprise_id),
    INDEX idx_funding_date (funding_date),
    INDEX idx_funding_round_type (round_type)
);
```

### 2.4 AI应用信息表 (ai_applications)

```sql
-- AI应用信息表
CREATE TABLE ai_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    enterprise_id UUID NOT NULL REFERENCES enterprises(id) ON DELETE CASCADE,
    application_name VARCHAR(255),
    ai_scenario VARCHAR(100), -- computer_vision, nlp, speech_recognition, etc.
    implementation_stage VARCHAR(50), -- exploring, piloting, deploying, scaling
    business_impact TEXT,
    roi_metrics JSONB, -- ROI相关指标
    implementation_date DATE,
    maturity_level VARCHAR(20), -- exploring, piloting, deploying, scaling
    priority_level VARCHAR(10) DEFAULT 'P3', -- P0, P1, P2, P3
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES users(id),
    updated_by UUID REFERENCES users(id),
    
    -- 索引
    INDEX idx_ai_enterprise (enterprise_id),
    INDEX idx_ai_scenario (ai_scenario),
    INDEX idx_ai_maturity (maturity_level),
    INDEX idx_ai_priority (priority_level)
);
```

### 2.5 百度AI使用信息表 (baidu_ai_usage)

```sql
-- 百度AI产品使用信息表
CREATE TABLE baidu_ai_usage (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    enterprise_id UUID NOT NULL REFERENCES enterprises(id) ON DELETE CASCADE,
    product_name VARCHAR(100), -- 如: 百度文心一言, 百度飞桨, 百度智能云等
    usage_level VARCHAR(20), -- none, low, medium, high, strategic
    implementation_date DATE,
    usage_frequency VARCHAR(50), -- daily, weekly, monthly
    api_call_count BIGINT,
    usage_duration_months INTEGER,
    satisfaction_rating INTEGER CHECK (satisfaction_rating >= 1 AND satisfaction_rating <= 5),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES users(id),
    updated_by UUID REFERENCES users(id),
    
    -- 索引
    INDEX idx_baidu_ai_enterprise (enterprise_id),
    INDEX idx_baidu_ai_product (product_name),
    INDEX idx_baidu_ai_usage_level (usage_level)
);
```

### 2.6 运营标签表 (operational_tags)

```sql
-- 企业运营标签表
CREATE TABLE operational_tags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    enterprise_id UUID NOT NULL REFERENCES enterprises(id) ON DELETE CASCADE,
    tag_name VARCHAR(100),
    tag_category VARCHAR(50), -- priority, status, cooperation_level
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES users(id),
    
    -- 确保同一企业同一标签不重复
    UNIQUE(enterprise_id, tag_name),
    
    -- 索引
    INDEX idx_operational_tags_enterprise (enterprise_id),
    INDEX idx_operational_tags_name (tag_name),
    INDEX idx_operational_tags_category (tag_category)
);
```

### 2.7 数据变更日志表 (change_logs)

```sql
-- 数据变更日志表
CREATE TABLE change_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    table_name VARCHAR(100) NOT NULL,
    record_id UUID NOT NULL,
    operation VARCHAR(10) NOT NULL, -- INSERT, UPDATE, DELETE
    old_values JSONB,
    new_values JSONB,
    changed_by UUID REFERENCES users(id),
    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    description TEXT,
    
    -- 索引
    INDEX idx_change_logs_table_record (table_name, record_id),
    INDEX idx_change_logs_changed_by (changed_by),
    INDEX idx_change_logs_changed_at (changed_at)
);
```

### 2.8 文件导入任务表 (import_jobs)

```sql
-- 文件导入任务表
CREATE TABLE import_jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    file_name VARCHAR(255),
    file_path VARCHAR(500),
    status VARCHAR(20) DEFAULT 'pending', -- pending, processing, completed, failed
    total_records INTEGER,
    processed_records INTEGER DEFAULT 0,
    success_records INTEGER DEFAULT 0,
    failed_records INTEGER DEFAULT 0,
    error_details JSONB,
    started_at TIMESTAMP,
    completed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- 索引
    INDEX idx_import_jobs_user (user_id),
    INDEX idx_import_jobs_status (status),
    INDEX idx_import_jobs_created_at (created_at)
);
```

### 2.9 筛选模板表 (filter_templates)

```sql
-- 用户筛选模板表
CREATE TABLE filter_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    template_name VARCHAR(255),
    template_type VARCHAR(50) DEFAULT 'enterprise', -- enterprise, report, etc.
    filter_criteria JSONB NOT NULL, -- 筛选条件
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- 索引
    INDEX idx_filter_templates_user (user_id),
    INDEX idx_filter_templates_type (template_type)
);
```

### 2.10 系统配置表 (system_configs)

```sql
-- 系统配置表
CREATE TABLE system_configs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    config_key VARCHAR(255) UNIQUE NOT NULL,
    config_value TEXT,
    config_type VARCHAR(50) DEFAULT 'string', -- string, number, json, boolean
    description TEXT,
    is_public BOOLEAN DEFAULT FALSE, -- 是否对所有用户可见
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- 索引
    INDEX idx_system_configs_key (config_key)
);
```

### 2.11 自定义字段定义表 (custom_field_definitions)

```sql
-- 自定义字段定义表
CREATE TABLE custom_field_definitions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    field_name VARCHAR(100) UNIQUE NOT NULL,
    field_label VARCHAR(255) NOT NULL,
    field_type VARCHAR(50) NOT NULL CHECK (field_type IN ('text', 'number', 'date', 'boolean', 'select', 'multiselect', 'textarea', 'file')),
    field_group VARCHAR(100), -- 逻辑分组字段
    is_required BOOLEAN DEFAULT FALSE,
    is_visible BOOLEAN DEFAULT TRUE,
    validation_rules JSONB, -- 存储验证规则
    select_options TEXT[], -- 用于选择字段的选项
    sort_order INTEGER DEFAULT 0,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 2.12 激活的自定义字段表 (active_custom_fields)

```sql
-- 激活的自定义字段表
CREATE TABLE active_custom_fields (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    field_definition_id UUID REFERENCES custom_field_definitions(id) ON DELETE CASCADE,
    entity_type VARCHAR(50) DEFAULT 'enterprise',
    is_active BOOLEAN DEFAULT TRUE,
    required_for_import BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 2.13 报告模板表 (report_templates)

```sql
-- 报告模板表
CREATE TABLE report_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    template_name VARCHAR(255),
    template_type VARCHAR(100), -- dashboard_report, enterprise_summary, trend_analysis, etc.
    template_config JSONB, -- 报告配置
    is_default BOOLEAN DEFAULT FALSE,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- 索引
    INDEX idx_report_templates_type (template_type)
);
```

### 2.14 生成的报告表 (generated_reports)

```sql
-- 生成的报告表
CREATE TABLE generated_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    template_id UUID REFERENCES report_templates(id),
    report_title VARCHAR(255),
    report_data JSONB, -- 报告数据
    file_path VARCHAR(500), -- 生成的文件路径
    file_format VARCHAR(20), -- pdf, excel, csv, html
    status VARCHAR(20) DEFAULT 'pending', -- pending, processing, completed, failed
    generated_by UUID REFERENCES users(id),
    generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP, -- 报告过期时间
    
    -- 索引
    INDEX idx_generated_reports_template (template_id),
    INDEX idx_generated_reports_user (generated_by),
    INDEX idx_generated_reports_status (status)
);
```

## 3. 数据库约束和关系

### 3.1 外键约束
- `enterprises.created_by` → `users.id`
- `enterprises.updated_by` → `users.id`
- `funding_rounds.enterprise_id` → `enterprises.id`
- `ai_applications.enterprise_id` → `enterprises.id`
- `baidu_ai_usage.enterprise_id` → `enterprises.id`
- `operational_tags.enterprise_id` → `enterprises.id`
- `change_logs.changed_by` → `users.id`

### 3.2 唯一约束
- `enterprises.unified_social_credit_code` - 统一社会信用代码唯一
- `users.email` - 邮箱唯一
- `users.username` - 用户名唯一
- `operational_tags(enterprise_id, tag_name)` - 企业标签组合唯一
- `system_configs.config_key` - 配置键唯一

## 4. 索引策略

### 4.1 主要查询索引
```sql
-- 企业表索引
CREATE INDEX idx_enterprise_name ON enterprises (name);
CREATE INDEX idx_enterprise_industry ON enterprises (industry_type);
CREATE INDEX idx_enterprise_region ON enterprises (region);
CREATE INDEX idx_enterprise_created_at ON enterprises (created_at);
CREATE INDEX idx_enterprise_updated_at ON enterprises (updated_at);

-- 全文搜索索引
CREATE INDEX idx_enterprise_fulltext ON enterprises 
USING gin(to_tsvector('chinese', name || ' ' || COALESCE(industry_type, '') || ' ' || COALESCE(sub_industry, '') || ' ' || COALESCE(region, '') || ' ' || COALESCE(city, '') || ' ' || COALESCE(district, '') || ' ' || COALESCE(address, '') || ' ' || COALESCE(remarks, '')));

-- JSONB索引
CREATE INDEX idx_enterprise_dynamic_attrs ON enterprises USING GIN (dynamic_attributes);
CREATE INDEX idx_ai_roi_metrics ON ai_applications USING GIN (roi_metrics);
```

### 4.2 性能优化索引
```sql
-- 常用组合查询索引
CREATE INDEX idx_enterprise_industry_region ON enterprises (industry_type, region);
CREATE INDEX idx_enterprise_status_created ON enterprises (business_status, created_at);

-- 日期范围查询索引
CREATE INDEX idx_funding_date ON funding_rounds (funding_date DESC);
CREATE INDEX idx_ai_implementation_date ON ai_applications (implementation_date DESC);
```

## 5. 数据分区策略

### 5.1 按时间分区的表
```sql
-- 变更日志表按月分区
CREATE TABLE change_logs_y2025m01 PARTITION OF change_logs
    FOR VALUES FROM ('2025-01-01') TO ('2025-02-01');

CREATE TABLE change_logs_y2025m02 PARTITION OF change_logs
    FOR VALUES FROM ('2025-02-01') TO ('2025-03-01');
-- ... 更多月份分区
```

### 5.2 按业务类型分区
```sql
-- 报告表按类型分区
CREATE TABLE generated_reports_dashboard PARTITION OF generated_reports
    FOR VALUES IN ('dashboard_report');

CREATE TABLE generated_reports_enterprise PARTITION OF generated_reports
    FOR VALUES IN ('enterprise_summary');
-- ... 更多类型分区
```

## 6. 数据安全设计

### 6.1 敏感数据加密
```sql
-- 使用pgcrypto扩展进行数据加密
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 企业敏感信息加密存储示例
ALTER TABLE enterprises ADD COLUMN encrypted_contact_info BYTEA;
```

### 6.2 行级安全
```sql
-- 启用行级安全
ALTER TABLE enterprises ENABLE ROW LEVEL SECURITY;
ALTER TABLE change_logs ENABLE ROW LEVEL SECURITY;

-- 创建策略
CREATE POLICY enterprise_access_policy ON enterprises
    FOR ALL TO app_user
    USING (created_by = current_user_id() OR current_user_role() = 'admin');
```

## 7. 数据备份和恢复策略

### 7.1 自动备份配置
```sql
-- 配置自动备份任务（通过外部脚本或pg_cron）
-- 每日备份非工作时间执行
-- 增量备份每小时执行
-- 远程备份存储
```

### 7.2 数据归档策略
```sql
-- 老旧数据归档到历史表
-- 企业数据超过5年自动归档
-- 变更日志超过2年归档
```

## 8. 数据库性能优化

### 8.1 查询优化
- 使用EXPLAIN ANALYZE分析慢查询
- 定期更新表统计信息
- 合理使用连接池
- 避免SELECT *

### 8.2 配置优化
```sql
-- PostgreSQL配置优化示例
-- shared_buffers = 25% of RAM
-- effective_cache_size = 75% of RAM
-- work_mem = 16MB
-- maintenance_work_mem = 256MB
-- checkpoint_completion_target = 0.9
-- wal_buffers = 16MB
-- default_statistics_target = 100
```

## 9. 数据迁移脚本示例

### 9.1 创建数据库结构
```sql
-- 创建数据库
CREATE DATABASE enterprise_management_db 
    WITH ENCODING 'UTF8' 
    LC_COLLATE = 'en_US.UTF-8' 
    LC_CTYPE = 'en_US.UTF-8';

-- 连接到数据库并创建扩展
\c enterprise_management_db
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE EXTENSION IF NOT EXISTS btree_gin;
```

### 9.2 初始化基础数据
```sql
-- 插入系统配置
INSERT INTO system_configs (config_key, config_value, config_type, description) VALUES
('max_import_file_size', '10485760', 'number', '最大导入文件大小（字节）'),
('default_page_size', '50', 'number', '默认页面大小'),
('enable_ai_analysis', 'true', 'boolean', '启用AI分析功能');

-- 插入默认用户角色
INSERT INTO system_configs (config_key, config_value, config_type, description) VALUES
('user_roles', '["analyst", "operator", "admin"]', 'json', '可用用户角色');
```

这个数据库设计充分考虑了企业数据管理平台的复杂需求，支持大规模数据存储、灵活的业务扩展、高性能查询和完整的数据安全。