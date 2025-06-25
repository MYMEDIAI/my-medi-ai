-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create ENUM types for better data integrity
CREATE TYPE user_role AS ENUM ('patient', 'doctor', 'admin');
CREATE TYPE user_status AS ENUM ('active', 'inactive', 'suspended', 'pending_verification');
CREATE TYPE privacy_level AS ENUM ('private', 'family', 'doctors', 'public');
CREATE TYPE record_category AS ENUM ('lab_results', 'prescription', 'imaging', 'consultation', 'vaccination', 'other');
CREATE TYPE relationship_type AS ENUM ('parent', 'child', 'spouse', 'sibling', 'guardian', 'emergency_contact');
CREATE TYPE interaction_type AS ENUM ('chat', 'voice_analysis', 'image_analysis', 'health_assessment');
CREATE TYPE insight_type AS ENUM ('risk_prediction', 'recommendation', 'progress_tracking', 'goal_achievement');

-- 1. Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role user_role NOT NULL DEFAULT 'patient',
    status user_status NOT NULL DEFAULT 'pending_verification',
    
    -- Basic Information
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    date_of_birth DATE,
    gender VARCHAR(20),
    phone VARCHAR(20),
    address JSONB,
    
    -- Professional Information (for doctors)
    license_number VARCHAR(100),
    specialization VARCHAR(100),
    hospital_affiliation VARCHAR(200),
    
    -- Preferences
    language VARCHAR(10) DEFAULT 'en',
    timezone VARCHAR(50) DEFAULT 'UTC',
    notification_preferences JSONB DEFAULT '{"email": true, "sms": false, "push": true}',
    
    -- Privacy Settings
    profile_visibility privacy_level DEFAULT 'private',
    data_sharing_consent BOOLEAN DEFAULT false,
    research_participation_consent BOOLEAN DEFAULT false,
    
    -- Emergency Contacts
    emergency_contacts JSONB DEFAULT '[]',
    
    -- Metadata
    email_verified BOOLEAN DEFAULT false,
    last_login TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Health Profiles table
CREATE TABLE health_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Medical History
    medical_history TEXT,
    allergies JSONB DEFAULT '[]', -- Array of allergy objects
    current_medications JSONB DEFAULT '[]', -- Array of medication objects
    past_medications JSONB DEFAULT '[]',
    
    -- Family History
    family_medical_history JSONB DEFAULT '{}', -- Keyed by condition
    genetic_predispositions JSONB DEFAULT '[]',
    
    -- Lifestyle Factors
    smoking_status VARCHAR(20),
    alcohol_consumption VARCHAR(20),
    exercise_frequency VARCHAR(20),
    diet_type VARCHAR(50),
    sleep_hours_avg INTEGER,
    stress_level INTEGER CHECK (stress_level >= 1 AND stress_level <= 10),
    
    -- Chronic Conditions
    chronic_conditions JSONB DEFAULT '[]',
    disability_status VARCHAR(100),
    
    -- Health Goals
    health_goals JSONB DEFAULT '[]',
    target_weight DECIMAL(5,2),
    target_bmi DECIMAL(4,2),
    fitness_goals TEXT,
    
    -- Insurance Information
    insurance_provider VARCHAR(100),
    insurance_policy_number VARCHAR(100),
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Health Records table
CREATE TABLE health_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Document Information
    title VARCHAR(200) NOT NULL,
    description TEXT,
    category record_category NOT NULL,
    tags JSONB DEFAULT '[]',
    
    -- File Information
    file_url VARCHAR(500),
    file_name VARCHAR(255),
    file_size INTEGER,
    file_type VARCHAR(50),
    
    -- OCR and Processing
    ocr_text TEXT,
    extracted_data JSONB, -- Structured data extracted from documents
    processing_status VARCHAR(20) DEFAULT 'pending',
    
    -- Privacy and Sharing
    privacy_level privacy_level DEFAULT 'private',
    shared_with JSONB DEFAULT '[]', -- Array of user IDs
    
    -- Medical Context
    date_of_service DATE,
    healthcare_provider VARCHAR(200),
    doctor_notes TEXT,
    
    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Vitals Data table
CREATE TABLE vitals_data (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Vital Signs
    systolic_bp INTEGER,
    diastolic_bp INTEGER,
    heart_rate INTEGER,
    temperature DECIMAL(4,2),
    weight DECIMAL(5,2),
    height DECIMAL(5,2),
    bmi DECIMAL(4,2),
    blood_glucose INTEGER,
    oxygen_saturation INTEGER,
    respiratory_rate INTEGER,
    
    -- Additional Metrics
    body_fat_percentage DECIMAL(4,2),
    muscle_mass DECIMAL(5,2),
    hydration_level DECIMAL(4,2),
    
    -- Device and Context
    device_name VARCHAR(100),
    device_model VARCHAR(100),
    measurement_method VARCHAR(50),
    accuracy_rating INTEGER CHECK (accuracy_rating >= 1 AND accuracy_rating <= 5),
    
    -- Location and Context
    location VARCHAR(100),
    notes TEXT,
    
    -- Metadata
    measured_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. AI Interactions table
CREATE TABLE ai_interactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Interaction Details
    interaction_type interaction_type NOT NULL,
    session_id UUID,
    
    -- Content
    user_input TEXT,
    ai_response TEXT,
    confidence_score DECIMAL(3,2),
    
    -- Analysis Results
    analysis_results JSONB,
    health_assessment JSONB,
    recommendations JSONB DEFAULT '[]',
    
    -- Media
    audio_url VARCHAR(500),
    image_url VARCHAR(500),
    
    -- Feedback
    user_rating INTEGER CHECK (user_rating >= 1 AND user_rating <= 5),
    user_feedback TEXT,
    accuracy_confirmed BOOLEAN,
    
    -- Processing
    processing_time_ms INTEGER,
    model_version VARCHAR(50),
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Family Connections table
CREATE TABLE family_connections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    connected_user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    
    -- Relationship
    relationship_type relationship_type NOT NULL,
    relationship_description VARCHAR(100),
    
    -- Permissions
    can_view_health_records BOOLEAN DEFAULT false,
    can_view_vitals BOOLEAN DEFAULT false,
    can_view_ai_insights BOOLEAN DEFAULT false,
    can_emergency_access BOOLEAN DEFAULT false,
    
    -- Emergency Access
    emergency_contact_priority INTEGER,
    emergency_phone VARCHAR(20),
    
    -- Status
    connection_status VARCHAR(20) DEFAULT 'pending', -- pending, accepted, blocked
    requested_by UUID REFERENCES users(id),
    
    -- Metadata
    connected_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Ensure no self-connections and unique relationships
    CONSTRAINT no_self_connection CHECK (user_id != connected_user_id),
    CONSTRAINT unique_family_connection UNIQUE (user_id, connected_user_id)
);

-- 7. Health Insights table
CREATE TABLE health_insights (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Insight Details
    insight_type insight_type NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    
    -- Predictions and Scores
    risk_score DECIMAL(3,2), -- 0.00 to 1.00
    confidence_level DECIMAL(3,2), -- 0.00 to 1.00
    prediction_timeframe VARCHAR(50), -- "next_30_days", "next_year", etc.
    
    -- Recommendations
    recommendations JSONB DEFAULT '[]',
    action_items JSONB DEFAULT '[]',
    
    -- Progress Tracking
    baseline_value DECIMAL(10,2),
    current_value DECIMAL(10,2),
    target_value DECIMAL(10,2),
    progress_percentage DECIMAL(5,2),
    
    -- Goals and Achievements
    related_goal_id UUID,
    achievement_date DATE,
    milestone_reached BOOLEAN DEFAULT false,
    
    -- Data Sources
    source_data_types JSONB DEFAULT '[]', -- vitals, records, interactions, etc.
    calculation_method TEXT,
    
    -- Validity
    valid_until TIMESTAMPTZ,
    is_active BOOLEAN DEFAULT true,
    
    -- AI Model Information
    model_version VARCHAR(50),
    generated_by VARCHAR(100),
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_status ON users(status);
CREATE INDEX idx_health_profiles_user_id ON health_profiles(user_id);
CREATE INDEX idx_health_records_user_id ON health_records(user_id);
CREATE INDEX idx_health_records_category ON health_records(category);
CREATE INDEX idx_health_records_date_service ON health_records(date_of_service);
CREATE INDEX idx_vitals_data_user_id ON vitals_data(user_id);
CREATE INDEX idx_vitals_data_measured_at ON vitals_data(measured_at);
CREATE INDEX idx_ai_interactions_user_id ON ai_interactions(user_id);
CREATE INDEX idx_ai_interactions_type ON ai_interactions(interaction_type);
CREATE INDEX idx_ai_interactions_session ON ai_interactions(session_id);
CREATE INDEX idx_family_connections_user_id ON family_connections(user_id);
CREATE INDEX idx_family_connections_connected_user ON family_connections(connected_user_id);
CREATE INDEX idx_health_insights_user_id ON health_insights(user_id);
CREATE INDEX idx_health_insights_type ON health_insights(insight_type);
CREATE INDEX idx_health_insights_active ON health_insights(is_active);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at triggers
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_health_profiles_updated_at BEFORE UPDATE ON health_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_health_records_updated_at BEFORE UPDATE ON health_records FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_family_connections_updated_at BEFORE UPDATE ON family_connections FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_health_insights_updated_at BEFORE UPDATE ON health_insights FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
