-- Composite indexes for common query patterns
CREATE INDEX idx_health_records_user_category_date ON health_records(user_id, category, date_of_service DESC);
CREATE INDEX idx_vitals_data_user_measured ON vitals_data(user_id, measured_at DESC);
CREATE INDEX idx_ai_interactions_user_type_created ON ai_interactions(user_id, interaction_type, created_at DESC);
CREATE INDEX idx_family_connections_status ON family_connections(connection_status) WHERE connection_status = 'accepted';
CREATE INDEX idx_health_insights_user_active_type ON health_insights(user_id, is_active, insight_type) WHERE is_active = true;

-- Partial indexes for better performance
CREATE INDEX idx_users_active_patients ON users(id) WHERE role = 'patient' AND status = 'active';
CREATE INDEX idx_users_active_doctors ON users(id) WHERE role = 'doctor' AND status = 'active';
CREATE INDEX idx_health_records_recent ON health_records(user_id, created_at DESC) WHERE created_at > NOW() - INTERVAL '1 year';
CREATE INDEX idx_vitals_data_recent ON vitals_data(user_id, measured_at DESC) WHERE measured_at > NOW() - INTERVAL '6 months';

-- GIN indexes for JSONB columns
CREATE INDEX idx_users_emergency_contacts_gin ON users USING GIN (emergency_contacts);
CREATE INDEX idx_health_profiles_allergies_gin ON health_profiles USING GIN (allergies);
CREATE INDEX idx_health_profiles_medications_gin ON health_profiles USING GIN (current_medications);
CREATE INDEX idx_health_profiles_conditions_gin ON health_profiles USING GIN (chronic_conditions);
CREATE INDEX idx_health_records_tags_gin ON health_records USING GIN (tags);
CREATE INDEX idx_health_records_extracted_data_gin ON health_records USING GIN (extracted_data);
CREATE INDEX idx_ai_interactions_results_gin ON ai_interactions USING GIN (analysis_results);
CREATE INDEX idx_health_insights_recommendations_gin ON health_insights USING GIN (recommendations);

-- Text search indexes
CREATE INDEX idx_health_records_title_text ON health_records USING GIN (to_tsvector('english', title));
CREATE INDEX idx_health_records_ocr_text ON health_records USING GIN (to_tsvector('english', ocr_text));
CREATE INDEX idx_ai_interactions_input_text ON ai_interactions USING GIN (to_tsvector('english', user_input));

-- Unique constraints
ALTER TABLE health_profiles ADD CONSTRAINT unique_user_health_profile UNIQUE (user_id);
