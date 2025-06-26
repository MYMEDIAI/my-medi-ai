-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE health_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE health_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE vitals_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE family_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE health_insights ENABLE ROW LEVEL SECURITY;

-- Users table policies
CREATE POLICY "Users can view their own profile" ON users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON users
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Doctors can view patient profiles they have access to" ON users
    FOR SELECT USING (
        role = 'doctor' AND 
        EXISTS (
            SELECT 1 FROM family_connections fc 
            WHERE fc.connected_user_id = auth.uid() 
            AND fc.user_id = users.id 
            AND fc.connection_status = 'accepted'
        )
    );

CREATE POLICY "Admins can view all users" ON users
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users u 
            WHERE u.id = auth.uid() 
            AND u.role = 'admin'
        )
    );

-- Health Profiles policies
CREATE POLICY "Users can manage their own health profile" ON health_profiles
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Family members can view health profiles with permission" ON health_profiles
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM family_connections fc 
            WHERE fc.user_id = health_profiles.user_id 
            AND fc.connected_user_id = auth.uid() 
            AND fc.connection_status = 'accepted'
            AND fc.can_view_health_records = true
        )
    );

CREATE POLICY "Doctors can view patient health profiles" ON health_profiles
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users u 
            WHERE u.id = auth.uid() 
            AND u.role = 'doctor'
        ) AND
        EXISTS (
            SELECT 1 FROM family_connections fc 
            WHERE fc.user_id = health_profiles.user_id 
            AND fc.connected_user_id = auth.uid() 
            AND fc.connection_status = 'accepted'
        )
    );

-- Health Records policies
CREATE POLICY "Users can manage their own health records" ON health_records
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Family members can view health records with permission" ON health_records
    FOR SELECT USING (
        privacy_level IN ('family', 'public') OR
        auth.uid() = ANY(SELECT jsonb_array_elements_text(shared_with)::uuid) OR
        EXISTS (
            SELECT 1 FROM family_connections fc 
            WHERE fc.user_id = health_records.user_id 
            AND fc.connected_user_id = auth.uid() 
            AND fc.connection_status = 'accepted'
            AND fc.can_view_health_records = true
        )
    );

CREATE POLICY "Doctors can view patient health records" ON health_records
    FOR SELECT USING (
        privacy_level IN ('doctors', 'public') OR
        auth.uid() = ANY(SELECT jsonb_array_elements_text(shared_with)::uuid) OR
        EXISTS (
            SELECT 1 FROM users u 
            WHERE u.id = auth.uid() 
            AND u.role = 'doctor'
        ) AND
        EXISTS (
            SELECT 1 FROM family_connections fc 
            WHERE fc.user_id = health_records.user_id 
            AND fc.connected_user_id = auth.uid() 
            AND fc.connection_status = 'accepted'
        )
    );

-- Vitals Data policies
CREATE POLICY "Users can manage their own vitals data" ON vitals_data
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Family members can view vitals with permission" ON vitals_data
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM family_connections fc 
            WHERE fc.user_id = vitals_data.user_id 
            AND fc.connected_user_id = auth.uid() 
            AND fc.connection_status = 'accepted'
            AND fc.can_view_vitals = true
        )
    );

CREATE POLICY "Doctors can view patient vitals" ON vitals_data
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users u 
            WHERE u.id = auth.uid() 
            AND u.role = 'doctor'
        ) AND
        EXISTS (
            SELECT 1 FROM family_connections fc 
            WHERE fc.user_id = vitals_data.user_id 
            AND fc.connected_user_id = auth.uid() 
            AND fc.connection_status = 'accepted'
        )
    );

-- AI Interactions policies
CREATE POLICY "Users can manage their own AI interactions" ON ai_interactions
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Doctors can view patient AI interactions" ON ai_interactions
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users u 
            WHERE u.id = auth.uid() 
            AND u.role = 'doctor'
        ) AND
        EXISTS (
            SELECT 1 FROM family_connections fc 
            WHERE fc.user_id = ai_interactions.user_id 
            AND fc.connected_user_id = auth.uid() 
            AND fc.connection_status = 'accepted'
        )
    );

-- Family Connections policies
CREATE POLICY "Users can view their own family connections" ON family_connections
    FOR SELECT USING (auth.uid() = user_id OR auth.uid() = connected_user_id);

CREATE POLICY "Users can create family connection requests" ON family_connections
    FOR INSERT WITH CHECK (auth.uid() = user_id OR auth.uid() = requested_by);

CREATE POLICY "Users can update their family connections" ON family_connections
    FOR UPDATE USING (auth.uid() = user_id OR auth.uid() = connected_user_id);

CREATE POLICY "Users can delete their family connections" ON family_connections
    FOR DELETE USING (auth.uid() = user_id OR auth.uid() = connected_user_id);

-- Health Insights policies
CREATE POLICY "Users can view their own health insights" ON health_insights
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "System can create health insights" ON health_insights
    FOR INSERT WITH CHECK (true); -- This should be restricted to service role in production

CREATE POLICY "System can update health insights" ON health_insights
    FOR UPDATE USING (true); -- This should be restricted to service role in production

CREATE POLICY "Family members can view insights with permission" ON health_insights
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM family_connections fc 
            WHERE fc.user_id = health_insights.user_id 
            AND fc.connected_user_id = auth.uid() 
            AND fc.connection_status = 'accepted'
            AND fc.can_view_ai_insights = true
        )
    );

CREATE POLICY "Doctors can view patient insights" ON health_insights
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users u 
            WHERE u.id = auth.uid() 
            AND u.role = 'doctor'
        ) AND
        EXISTS (
            SELECT 1 FROM family_connections fc 
            WHERE fc.user_id = health_insights.user_id 
            AND fc.connected_user_id = auth.uid() 
            AND fc.connection_status = 'accepted'
        )
    );
