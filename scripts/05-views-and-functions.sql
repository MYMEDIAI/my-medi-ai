-- View for user dashboard summary
CREATE VIEW user_dashboard_summary AS
SELECT 
    u.id,
    u.first_name,
    u.last_name,
    u.email,
    hp.chronic_conditions,
    hp.current_medications,
    (
        SELECT COUNT(*) 
        FROM health_records hr 
        WHERE hr.user_id = u.id 
        AND hr.created_at > NOW() - INTERVAL '30 days'
    ) as recent_records_count,
    (
        SELECT COUNT(*) 
        FROM vitals_data vd 
        WHERE vd.user_id = u.id 
        AND vd.measured_at > NOW() - INTERVAL '7 days'
    ) as recent_vitals_count,
    (
        SELECT COUNT(*) 
        FROM ai_interactions ai 
        WHERE ai.user_id = u.id 
        AND ai.created_at > NOW() - INTERVAL '30 days'
    ) as recent_ai_interactions_count,
    (
        SELECT COUNT(*) 
        FROM family_connections fc 
        WHERE (fc.user_id = u.id OR fc.connected_user_id = u.id)
        AND fc.connection_status = 'accepted'
    ) as family_connections_count
FROM users u
LEFT JOIN health_profiles hp ON u.id = hp.user_id
WHERE u.status = 'active';

-- View for latest vitals per user
CREATE VIEW latest_vitals AS
SELECT DISTINCT ON (user_id)
    user_id,
    systolic_bp,
    diastolic_bp,
    heart_rate,
    temperature,
    weight,
    height,
    bmi,
    blood_glucose,
    oxygen_saturation,
    measured_at
FROM vitals_data
ORDER BY user_id, measured_at DESC;

-- View for active health insights
CREATE VIEW active_health_insights AS
SELECT 
    hi.*,
    u.first_name,
    u.last_name
FROM health_insights hi
JOIN users u ON hi.user_id = u.id
WHERE hi.is_active = true
AND (hi.valid_until IS NULL OR hi.valid_until > NOW());

-- Function to get family members with permissions
CREATE OR REPLACE FUNCTION get_family_members_with_permissions(target_user_id UUID)
RETURNS TABLE (
    family_member_id UUID,
    first_name VARCHAR,
    last_name VARCHAR,
    relationship_type relationship_type,
    can_view_health_records BOOLEAN,
    can_view_vitals BOOLEAN,
    can_view_ai_insights BOOLEAN,
    can_emergency_access BOOLEAN
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        u.id,
        u.first_name,
        u.last_name,
        fc.relationship_type,
        fc.can_view_health_records,
        fc.can_view_vitals,
        fc.can_view_ai_insights,
        fc.can_emergency_access
    FROM family_connections fc
    JOIN users u ON fc.connected_user_id = u.id
    WHERE fc.user_id = target_user_id
    AND fc.connection_status = 'accepted'
    ORDER BY fc.emergency_contact_priority NULLS LAST;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to calculate health score
CREATE OR REPLACE FUNCTION calculate_health_score(target_user_id UUID)
RETURNS DECIMAL(3,2) AS $$
DECLARE
    score DECIMAL(3,2) := 0;
    vitals_score DECIMAL(3,2) := 0;
    records_score DECIMAL(3,2) := 0;
    engagement_score DECIMAL(3,2) := 0;
BEGIN
    -- Calculate vitals score (30% of total)
    SELECT 
        CASE 
            WHEN COUNT(*) = 0 THEN 0
            ELSE LEAST(1.0, COUNT(*) / 30.0) * 0.3
        END INTO vitals_score
    FROM vitals_data 
    WHERE user_id = target_user_id 
    AND measured_at > NOW() - INTERVAL '30 days';
    
    -- Calculate records score (40% of total)
    SELECT 
        CASE 
            WHEN COUNT(*) = 0 THEN 0
            ELSE LEAST(1.0, COUNT(*) / 10.0) * 0.4
        END INTO records_score
    FROM health_records 
    WHERE user_id = target_user_id 
    AND created_at > NOW() - INTERVAL '90 days';
    
    -- Calculate engagement score (30% of total)
    SELECT 
        CASE 
            WHEN COUNT(*) = 0 THEN 0
            ELSE LEAST(1.0, COUNT(*) / 20.0) * 0.3
        END INTO engagement_score
    FROM ai_interactions 
    WHERE user_id = target_user_id 
    AND created_at > NOW() - INTERVAL '30 days';
    
    score := vitals_score + records_score + engagement_score;
    
    RETURN score;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get health trends
CREATE OR REPLACE FUNCTION get_health_trends(
    target_user_id UUID,
    metric_name VARCHAR,
    days_back INTEGER DEFAULT 30
)
RETURNS TABLE (
    date_measured DATE,
    avg_value DECIMAL,
    min_value DECIMAL,
    max_value DECIMAL,
    count_measurements INTEGER
) AS $$
BEGIN
    RETURN QUERY
    EXECUTE format('
        SELECT 
            DATE(measured_at) as date_measured,
            AVG(%I) as avg_value,
            MIN(%I) as min_value,
            MAX(%I) as max_value,
            COUNT(*)::INTEGER as count_measurements
        FROM vitals_data 
        WHERE user_id = $1 
        AND %I IS NOT NULL
        AND measured_at > NOW() - INTERVAL ''%s days''
        GROUP BY DATE(measured_at)
        ORDER BY date_measured DESC',
        metric_name, metric_name, metric_name, metric_name, days_back
    ) USING target_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create materialized view for analytics (refresh periodically)
CREATE MATERIALIZED VIEW health_analytics_summary AS
SELECT 
    DATE_TRUNC('day', created_at) as date,
    COUNT(DISTINCT user_id) as active_users,
    COUNT(*) as total_records,
    AVG(CASE WHEN category = 'lab_results' THEN 1 ELSE 0 END) as lab_results_ratio,
    AVG(CASE WHEN category = 'prescription' THEN 1 ELSE 0 END) as prescription_ratio
FROM health_records
WHERE created_at > NOW() - INTERVAL '90 days'
GROUP BY DATE_TRUNC('day', created_at)
ORDER BY date DESC;

-- Create index on materialized view
CREATE INDEX idx_health_analytics_summary_date ON health_analytics_summary(date);

-- Function to refresh analytics (call this periodically)
CREATE OR REPLACE FUNCTION refresh_health_analytics()
RETURNS VOID AS $$
BEGIN
    REFRESH MATERIALIZED VIEW CONCURRENTLY health_analytics_summary;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
