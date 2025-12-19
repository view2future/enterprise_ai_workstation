-- 企业管理系统数据库初始化脚本
-- 包含所有必需字段和功能

-- 创建企业主表
CREATE TABLE enterprises (
    id BIGSERIAL PRIMARY KEY,
    企业名称 VARCHAR(255) UNIQUE NOT NULL,
    飞桨_文心 VARCHAR(20),
    线索入库时间 VARCHAR(10),
    线索更新时间 TIMESTAMP WITH TIME ZONE,
    伙伴等级 VARCHAR(20),
    生态AI产品 TEXT,
    优先级 VARCHAR(10),
    base TEXT,
    注册资本 BIGINT,
    参保人数 INTEGER,
    企业背景 TEXT,
    行业 JSONB,
    任务方向 TEXT,
    联系人信息 TEXT,
    使用场景 TEXT,
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(100),
    updated_by VARCHAR(100)
);

-- 创建进展记录表
CREATE TABLE enterprise_progress (
    id BIGSERIAL PRIMARY KEY,
    enterprise_id BIGINT REFERENCES enterprises(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    update_time TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    progress_type VARCHAR(20) DEFAULT '本周进展',
    created_by VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 创建审计日志表
CREATE TABLE audit_logs (
    id BIGSERIAL PRIMARY KEY,
    table_name VARCHAR(100) NOT NULL,
    record_id BIGINT NOT NULL,
    operation VARCHAR(10) CHECK (operation IN ('INSERT', 'UPDATE', 'DELETE')),
    old_values JSONB,
    new_values JSONB,
    changed_by VARCHAR(100),
    changed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    ip_address INET
);

-- 创建索引
CREATE INDEX idx_enterprises_企业名称 ON enterprises(企业名称);
CREATE INDEX idx_enterprises_飞桨文心 ON enterprises(飞桨_文心);
CREATE INDEX idx_enterprises_线索入库时间 ON enterprises(线索入库时间);
CREATE INDEX idx_enterprises_线索更新时间 ON enterprises(线索更新时间);
CREATE INDEX idx_enterprises_优先级 ON enterprises(优先级);
CREATE INDEX idx_enterprises_注册资本 ON enterprises(注册资本);
CREATE INDEX idx_enterprises_参保人数 ON enterprises(参保人数);
CREATE INDEX idx_enterprises_任务方向 ON enterprises(任务方向);
CREATE INDEX idx_enterprises_企业背景_trgm ON enterprises USING gin(企业背景 gin_trgm_ops);
CREATE INDEX idx_enterprises_使用场景_trgm ON enterprises USING gin(使用场景 gin_trgm_ops);
CREATE INDEX idx_enterprises_生态AI产品_trgm ON enterprises USING gin(生态AI产品 gin_trgm_ops);
CREATE INDEX idx_enterprises_联系人信息_trgm ON enterprises USING gin(联系人信息 gin_trgm_ops);
CREATE INDEX idx_enterprises_企业名称_trgm ON enterprises USING gin(企业名称 gin_trgm_ops);
CREATE INDEX idx_enterprise_progress_enterprise_id ON enterprise_progress(enterprise_id);
CREATE INDEX idx_enterprise_progress_update_time ON enterprise_progress(update_time DESC);

-- 添加数据验证约束
ALTER TABLE enterprises 
ADD CONSTRAINT chk_飞桨文心 CHECK (飞桨_文心 IN ('飞桨', '文心')),
ADD CONSTRAINT chk_伙伴等级 CHECK (伙伴等级 IN ('认证级', '优选级', '无')),
ADD CONSTRAINT chk_优先级 CHECK (优先级 IN ('P0', 'P1', 'P2')),
ADD CONSTRAINT chk_注册资本 CHECK (注册资本 >= 0),
ADD CONSTRAINT chk_参保人数 CHECK (参保人数 >= 0),
ADD CONSTRAINT chk_线索入库时间_format CHECK (线索入库时间 ~ '^\d{4}Q[1-4]$'),
ADD CONSTRAINT chk_企业背景_length CHECK (CHAR_LENGTH(企业背景) BETWEEN 50 AND 200);

-- 创建自动更新线索更新时间的触发器函数
CREATE OR REPLACE FUNCTION update_线索更新时间()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_TABLE_NAME = 'enterprise_progress' AND TG_OP = 'INSERT' THEN
        UPDATE enterprises 
        SET 线索更新时间 = CURRENT_TIMESTAMP
        WHERE id = NEW.enterprise_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

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
            INSERT INTO audit_logs (table_name, record_id, operation, new_values, changed_by, changed_at)
            VALUES (TG_TABLE_NAME, NEW.id, 'INSERT', new_data, NEW.updated_by, NOW());
        WHEN 'UPDATE' THEN
            old_data := to_jsonb(OLD) - excluded_fields;
            new_data := to_jsonb(NEW) - excluded_fields;
            
            INSERT INTO audit_logs (table_name, record_id, operation, old_values, new_values, changed_by, changed_at)
            VALUES (TG_TABLE_NAME, NEW.id, 'UPDATE', old_data, new_data, NEW.updated_by, NOW());
        WHEN 'DELETE' THEN
            old_data := to_jsonb(OLD) - excluded_fields;
            INSERT INTO audit_logs (table_name, record_id, operation, old_values, changed_by, changed_at)
            VALUES (TG_TABLE_NAME, OLD.id, 'DELETE', old_data, OLD.updated_by, NOW());
    END CASE;
    
    RETURN CASE TG_OP 
        WHEN 'DELETE' THEN OLD 
        ELSE NEW 
    END;
END;
$$ LANGUAGE plpgsql;

-- 创建验证企业数据的函数
CREATE OR REPLACE FUNCTION validate_enterprise_data()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.线索入库时间 IS NOT NULL AND NEW.线索入库时间 !~ '^\d{4}Q[1-4]$' THEN
        RAISE EXCEPTION '线索入库时间格式不正确，应为YYYYQ[1-4]格式，如2025Q4';
    END IF;

    IF NEW.企业背景 IS NOT NULL AND CHAR_LENGTH(NEW.企业背景) < 50 THEN
        RAISE EXCEPTION '企业背景长度至少需要50个字符';
    END IF;

    IF NEW.企业背景 IS NOT NULL AND CHAR_LENGTH(NEW.企业背景) > 200 THEN
        RAISE EXCEPTION '企业背景长度不能超过200个字符';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 安装触发器
CREATE TRIGGER trigger_update_线索更新时间
    AFTER INSERT ON enterprise_progress
    FOR EACH ROW
    EXECUTE FUNCTION update_线索更新时间();

CREATE TRIGGER validate_enterprise_trigger
    BEFORE INSERT OR UPDATE ON enterprises
    FOR EACH ROW EXECUTE FUNCTION validate_enterprise_data();

CREATE TRIGGER enterprises_audit_trigger
    AFTER INSERT OR UPDATE OR DELETE ON enterprises
    FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

-- 创建搜索函数
CREATE OR REPLACE FUNCTION search_enterprises_fulltext(
    search_term TEXT DEFAULT '',
    飞桨文心_filter TEXT DEFAULT '',
    线索入库时间_filter TEXT DEFAULT '',
    伙伴等级_filter TEXT DEFAULT '',
    优先级_filter TEXT DEFAULT '',
    行业_filter TEXT DEFAULT '',
    任务方向_filter TEXT DEFAULT '',
    注册资本_min BIGINT DEFAULT 0,
    注册资本_max BIGINT DEFAULT 9999999999,
    参保人数_min INTEGER DEFAULT 0,
    参保人数_max INTEGER DEFAULT 999999,
    sort_field TEXT DEFAULT '线索更新时间',
    sort_direction TEXT DEFAULT 'DESC',
    page_offset INTEGER DEFAULT 0,
    page_limit INTEGER DEFAULT 50
)
RETURNS TABLE(
    id BIGINT,
    企业名称 VARCHAR,
    飞桨_文心 VARCHAR,
    线索入库时间 VARCHAR,
    线索更新时间 TIMESTAMP WITH TIME ZONE,
    伙伴等级 VARCHAR,
    生态AI产品 TEXT,
    优先级 VARCHAR,
    base TEXT,
    注册资本 BIGINT,
    参保人数 INTEGER,
    企业背景 TEXT,
    行业 JSONB,
    任务方向 TEXT,
    联系人信息 TEXT,
    使用场景 TEXT,
    total_count BIGINT
) AS $$
DECLARE
    query_sql TEXT;
    filter_conditions TEXT := '';
BEGIN
    IF search_term != '' THEN
        filter_conditions := filter_conditions || 
            ' AND (企业名称 ILIKE ''%' || search_term || '%'' OR ' ||
            '企业背景 ILIKE ''%' || search_term || '%'' OR ' ||
            '使用场景 ILIKE ''%' || search_term || '%'' OR ' ||
            '生态AI产品 ILIKE ''%' || search_term || '%'' OR ' ||
            '联系人信息 ILIKE ''%' || search_term || '%'')';
    END IF;
    
    IF 飞桨文心_filter != '' THEN
        filter_conditions := filter_conditions || ' AND 飞桨_文心 = $1';
    END IF;
    
    IF 线索入库时间_filter != '' THEN
        filter_conditions := filter_conditions || ' AND 线索入库时间 = $2';
    END IF;
    
    IF 伙伴等级_filter != '' THEN
        filter_conditions := filter_conditions || ' AND 伙伴等级 = $3';
    END IF;
    
    IF 优先级_filter != '' THEN
        filter_conditions := filter_conditions || ' AND 优先级 = $4';
    END IF;
    
    IF 行业_filter != '' THEN
        filter_conditions := filter_conditions || ' AND industry ? $5';
    END IF;
    
    IF 任务方向_filter != '' THEN
        filter_conditions := filter_conditions || ' AND 任务方向 ILIKE ''%'' || $6 || ''%''';
    END IF;
    
    IF 注册资本_min > 0 THEN
        filter_conditions := filter_conditions || ' AND 注册资本 >= $7';
    END IF;
    
    IF 注册资本_max < 9999999999 THEN
        filter_conditions := filter_conditions || ' AND 注册资本 <= $8';
    END IF;
    
    IF 参保人数_min > 0 THEN
        filter_conditions := filter_conditions || ' AND 参保人数 >= $9';
    END IF;
    
    IF 参保人数_max < 999999 THEN
        filter_conditions := filter_conditions || ' AND 参保人数 <= $10';
    END IF;

    query_sql := '
        SELECT 
            id, 企业名称, 飞桨_文心, 线索入库时间, 线索更新时间, 伙伴等级, 
            生态AI产品, 优先级, base, 注册资本, 参保人数, 企业背景, 
            行业, 任务方向, 联系人信息, 使用场景,
            COUNT(*) OVER() AS total_count
        FROM enterprises
        WHERE 1=1 ' || filter_conditions || '
        ORDER BY ' || quote_ident(sort_field) || ' ' || sort_direction || '
        LIMIT $11 OFFSET $12';

    RETURN QUERY EXECUTE query_sql
        USING 飞桨文心_filter, 线索入库时间_filter, 伙伴等级_filter, 
              优先级_filter, 行业_filter, 任务方向_filter,
              注册资本_min, 注册资本_max, 参保人数_min, 参保人数_max,
              page_limit, page_offset;
END;
$$ LANGUAGE plpgsql;

-- 创建进展管理函数
CREATE OR REPLACE FUNCTION get_latest_progress(enterprise_id_param BIGINT)
RETURNS TABLE(
    content TEXT,
    update_time TIMESTAMP WITH TIME ZONE,
    progress_type VARCHAR
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        ep.content,
        ep.update_time,
        ep.progress_type
    FROM enterprise_progress ep
    WHERE ep.enterprise_id = enterprise_id_param
    ORDER BY ep.update_time DESC
    LIMIT 2;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION get_progress_timeline(enterprise_id_param BIGINT)
RETURNS TABLE(
    id BIGINT,
    content TEXT,
    update_time TIMESTAMP WITH TIME ZONE,
    progress_type VARCHAR,
    created_by VARCHAR
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        ep.id,
        ep.content,
        ep.update_time,
        ep.progress_type,
        ep.created_by
    FROM enterprise_progress ep
    WHERE ep.enterprise_id = enterprise_id_param
    ORDER BY ep.update_time DESC;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION add_enterprise_progress(
    enterprise_id_param BIGINT,
    content_param TEXT,
    progress_type_param VARCHAR DEFAULT '本周进展',
    created_by_param VARCHAR DEFAULT 'SYSTEM'
)
RETURNS BIGINT AS $$
DECLARE
    new_progress_id BIGINT;
BEGIN
    INSERT INTO enterprise_progress (enterprise_id, content, progress_type, created_by)
    VALUES (enterprise_id_param, content_param, progress_type_param, created_by_param)
    RETURNING id INTO new_progress_id;
    
    UPDATE enterprises 
    SET 线索更新时间 = CURRENT_TIMESTAMP,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = enterprise_id_param;
    
    RETURN new_progress_id;
END;
$$ LANGUAGE plpgsql;

-- 创建统计函数
CREATE OR REPLACE FUNCTION get_priority_statistics()
RETURNS TABLE(
    优先级 VARCHAR,
    count BIGINT,
    percentage DECIMAL(5,2)
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        e.优先级,
        COUNT(*) as count,
        ROUND((COUNT(*) * 100.0 / (SELECT COUNT(*) FROM enterprises WHERE 优先级 IS NOT NULL)), 2) as percentage
    FROM enterprises e
    WHERE e.优先级 IS NOT NULL
    GROUP BY e.优先级
    ORDER BY e.优先级;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION get_飞桨文心_statistics()
RETURNS TABLE(
    飞桨_文心 VARCHAR,
    count BIGINT,
    percentage DECIMAL(5,2)
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        e.飞桨_文心,
        COUNT(*) as count,
        ROUND((COUNT(*) * 100.0 / (SELECT COUNT(*) FROM enterprises WHERE 飞桨_文心 IS NOT NULL)), 2) as percentage
    FROM enterprises e
    WHERE e.飞桨_文心 IS NOT NULL
    GROUP BY e.飞桨_文心
    ORDER BY COUNT(*) DESC;
END;
$$ LANGUAGE plpgsql;

-- 创建物化视图
CREATE MATERIALIZED VIEW enterprise_summary_mv AS
SELECT 
    e.id,
    e.企业名称,
    e.飞桨_文心,
    e.线索入库时间,
    e.线索更新时间,
    e.伙伴等级,
    e.优先级,
    e.base,
    e.注册资本,
    e.参保人数,
    LEFT(e.企业背景, 50) as 企业背景_preview,
    e.行业,
    e.任务方向,
    CASE 
        WHEN e.注册资本 >= 10000000 THEN 'Large'
        WHEN e.注册资本 >= 1000000 THEN 'Medium'
        ELSE 'Small'
    END as size_category
FROM enterprises e;

-- 为物化视图创建索引
CREATE INDEX idx_enterprise_summary_priority ON enterprise_summary_mv(优先级, 线索更新时间 DESC);
CREATE INDEX idx_enterprise_summary_region ON enterprise_summary_mv(飞桨_文心, base);
CREATE INDEX idx_enterprise_summary_size ON enterprise_summary_mv(size_category, 优先级);

-- 更新触发器
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_enterprises_updated_at 
    BEFORE UPDATE ON enterprises 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();