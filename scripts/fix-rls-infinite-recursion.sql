-- Fix infinite recursion in RLS policies by removing circular references
-- This script completely rewrites the problematic policies

-- First, drop all existing policies on the users table
DROP POLICY IF EXISTS "Users can view their own profile" ON users;
DROP POLICY IF EXISTS "Users can update their own profile" ON users;
DROP POLICY IF EXISTS "Doctors can view patient profiles" ON users;
DROP POLICY IF EXISTS "Admins can view all users" ON users;
DROP POLICY IF EXISTS "Allow user registration" ON users;

-- Create new, non-recursive policies for the users table
-- These policies avoid querying the users table within the policy itself

-- 1. Allow users to view their own profile (using auth.uid() directly)
CREATE POLICY "users_select_own" ON users
    FOR SELECT USING (auth.uid() = id);

-- 2. Allow users to update their own profile (using auth.uid() directly)
CREATE POLICY "users_update_own" ON users
    FOR UPDATE USING (auth.uid() = id);

-- 3. Allow new user registration (for INSERT operations)
CREATE POLICY "users_insert_new" ON users
    FOR INSERT WITH CHECK (true);

-- 4. Allow service role to perform all operations (for admin tasks)
CREATE POLICY "users_service_role_all" ON users
    FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- Update other table policies to avoid referencing users table in problematic ways

-- Health Profiles policies (simplified to avoid user table joins)
DROP POLICY IF EXISTS "Doctors can view patient health profiles" ON health_profiles;
CREATE POLICY "health_profiles_select_own" ON health_profiles
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "health_profiles_all_own" ON health_profiles
    FOR ALL USING (auth.uid() = user_id);

-- Health Records policies (simplified)
DROP POLICY IF EXISTS "Doctors can view patient health records" ON health_records;
CREATE POLICY "health_records_select_own" ON health_records
    FOR SELECT USING (
        auth.uid() = user_id OR
        privacy_level IN ('public') OR
        auth.uid() = ANY(SELECT jsonb_array_elements_text(shared_with)::uuid)
    );

CREATE POLICY "health_records_all_own" ON health_records
    FOR ALL USING (auth.uid() = user_id);

-- Vitals Data policies (simplified)
DROP POLICY IF EXISTS "Doctors can view patient vitals" ON vitals_data;
CREATE POLICY "vitals_data_select_own" ON vitals_data
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "vitals_data_all_own" ON vitals_data
    FOR ALL USING (auth.uid() = user_id);

-- AI Interactions policies (simplified)
DROP POLICY IF EXISTS "Doctors can view patient AI interactions" ON ai_interactions;
CREATE POLICY "ai_interactions_select_own" ON ai_interactions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "ai_interactions_all_own" ON ai_interactions
    FOR ALL USING (auth.uid() = user_id);

-- Health Insights policies (simplified)
DROP POLICY IF EXISTS "Doctors can view patient insights" ON health_insights;
CREATE POLICY "health_insights_select_own" ON health_insights
    FOR SELECT USING (auth.uid() = user_id);

-- Keep system policies for health insights
CREATE POLICY "health_insights_system_all" ON health_insights
    FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- Create a function to safely get user role without causing recursion
CREATE OR REPLACE FUNCTION auth.get_user_role()
RETURNS TEXT
LANGUAGE SQL
SECURITY DEFINER
STABLE
AS $$
  SELECT COALESCE(
    auth.jwt() ->> 'user_metadata' ->> 'role',
    auth.jwt() ->> 'app_metadata' ->> 'role',
    'patient'
  );
$$;

-- Create policies that can safely check roles without recursion
CREATE POLICY "users_admin_all" ON users
    FOR ALL USING (auth.get_user_role() = 'admin');

-- Optional: Add back doctor-patient relationship policies using family_connections
-- These are safe because they don't query the users table directly
CREATE POLICY "health_records_family_access" ON health_records
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM family_connections fc 
            WHERE fc.user_id = health_records.user_id 
            AND fc.connected_user_id = auth.uid() 
            AND fc.connection_status = 'accepted'
            AND fc.can_view_health_records = true
        )
    );

CREATE POLICY "vitals_data_family_access" ON vitals_data
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM family_connections fc 
            WHERE fc.user_id = vitals_data.user_id 
            AND fc.connected_user_id = auth.uid() 
            AND fc.connection_status = 'accepted'
            AND fc.can_view_vitals = true
        )
    );

CREATE POLICY "health_insights_family_access" ON health_insights
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM family_connections fc 
            WHERE fc.user_id = health_insights.user_id 
            AND fc.connected_user_id = auth.uid() 
            AND fc.connection_status = 'accepted'
            AND fc.can_view_ai_insights = true
        )
    );

-- Grant necessary permissions
GRANT USAGE ON SCHEMA auth TO anon, authenticated;
GRANT EXECUTE ON FUNCTION auth.get_user_role() TO anon, authenticated;
