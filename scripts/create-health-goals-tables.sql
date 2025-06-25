-- Create health goals table
CREATE TABLE IF NOT EXISTS health_goals (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(50) NOT NULL CHECK (category IN ('weight_management', 'fitness', 'nutrition', 'mental_health', 'chronic_condition', 'preventive_care', 'medication_adherence', 'custom')),
    type VARCHAR(20) DEFAULT 'individual' CHECK (type IN ('individual', 'family', 'challenge')),
    target_value DECIMAL(10,2) NOT NULL,
    current_value DECIMAL(10,2) DEFAULT 0,
    unit VARCHAR(50),
    start_date DATE DEFAULT CURRENT_DATE,
    target_date DATE NOT NULL,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'completed', 'paused', 'cancelled')),
    priority VARCHAR(10) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
    is_family_goal BOOLEAN DEFAULT FALSE,
    family_participants UUID[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create milestones table
CREATE TABLE IF NOT EXISTS goal_milestones (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    goal_id UUID REFERENCES health_goals(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    target_value DECIMAL(10,2) NOT NULL,
    achieved BOOLEAN DEFAULT FALSE,
    achieved_date TIMESTAMP WITH TIME ZONE,
    reward_badge VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create progress entries table
CREATE TABLE IF NOT EXISTS goal_progress_entries (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    goal_id UUID REFERENCES health_goals(id) ON DELETE CASCADE,
    value DECIMAL(10,2) NOT NULL,
    notes TEXT,
    photo_url TEXT,
    mood_rating INTEGER CHECK (mood_rating >= 1 AND mood_rating <= 5),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create achievements table
CREATE TABLE IF NOT EXISTS user_achievements (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    badge_type VARCHAR(50) NOT NULL CHECK (badge_type IN ('first_goal', 'streak_7', 'streak_30', 'milestone_achieved', 'goal_completed', 'family_champion', 'consistency_king', 'improvement_star')),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    icon VARCHAR(10),
    earned_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    goal_id UUID REFERENCES health_goals(id) ON DELETE SET NULL
);

-- Create family challenges table
CREATE TABLE IF NOT EXISTS family_challenges (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    family_id UUID REFERENCES family_groups(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    participants UUID[] NOT NULL,
    status VARCHAR(20) DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'active', 'completed')),
    prize_description TEXT,
    created_by UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create challenge scores table
CREATE TABLE IF NOT EXISTS challenge_scores (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    challenge_id UUID REFERENCES family_challenges(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    score DECIMAL(10,2) DEFAULT 0,
    rank INTEGER,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_health_goals_user_id ON health_goals(user_id);
CREATE INDEX IF NOT EXISTS idx_health_goals_status ON health_goals(status);
CREATE INDEX IF NOT EXISTS idx_health_goals_category ON health_goals(category);
CREATE INDEX IF NOT EXISTS idx_goal_milestones_goal_id ON goal_milestones(goal_id);
CREATE INDEX IF NOT EXISTS idx_goal_progress_entries_goal_id ON goal_progress_entries(goal_id);
CREATE INDEX IF NOT EXISTS idx_user_achievements_user_id ON user_achievements(user_id);
CREATE INDEX IF NOT EXISTS idx_family_challenges_family_id ON family_challenges(family_id);
CREATE INDEX IF NOT EXISTS idx_challenge_scores_challenge_id ON challenge_scores(challenge_id);

-- Enable RLS (Row Level Security)
ALTER TABLE health_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE goal_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE goal_progress_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE family_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE challenge_scores ENABLE ROW LEVEL SECURITY;

-- RLS Policies for health_goals
CREATE POLICY "Users can view their own goals and family goals they participate in" ON health_goals
    FOR SELECT USING (
        user_id = auth.uid() OR
        (is_family_goal = TRUE AND auth.uid() = ANY(family_participants))
    );

CREATE POLICY "Users can create their own goals" ON health_goals
    FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own goals and family goals they participate in" ON health_goals
    FOR UPDATE USING (
        user_id = auth.uid() OR
        (is_family_goal = TRUE AND auth.uid() = ANY(family_participants))
    );

-- RLS Policies for goal_milestones
CREATE POLICY "Users can view milestones for goals they can access" ON goal_milestones
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM health_goals hg
            WHERE hg.id = goal_id
            AND (hg.user_id = auth.uid() OR (hg.is_family_goal = TRUE AND auth.uid() = ANY(hg.family_participants)))
        )
    );

CREATE POLICY "Users can create milestones for their goals" ON goal_milestones
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM health_goals hg
            WHERE hg.id = goal_id
            AND hg.user_id = auth.uid()
        )
    );

-- RLS Policies for goal_progress_entries
CREATE POLICY "Users can view progress for goals they can access" ON goal_progress_entries
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM health_goals hg
            WHERE hg.id = goal_id
            AND (hg.user_id = auth.uid() OR (hg.is_family_goal = TRUE AND auth.uid() = ANY(hg.family_participants)))
        )
    );

CREATE POLICY "Users can add progress to goals they can access" ON goal_progress_entries
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM health_goals hg
            WHERE hg.id = goal_id
            AND (hg.user_id = auth.uid() OR (hg.is_family_goal = TRUE AND auth.uid() = ANY(hg.family_participants)))
        )
    );

-- RLS Policies for user_achievements
CREATE POLICY "Users can view their own achievements" ON user_achievements
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "System can create achievements for users" ON user_achievements
    FOR INSERT WITH CHECK (user_id = auth.uid());

-- RLS Policies for family_challenges
CREATE POLICY "Users can view challenges they participate in" ON family_challenges
    FOR SELECT USING (auth.uid() = ANY(participants));

CREATE POLICY "Users can create challenges for their family" ON family_challenges
    FOR INSERT WITH CHECK (created_by = auth.uid());

-- RLS Policies for challenge_scores
CREATE POLICY "Users can view scores for challenges they participate in" ON challenge_scores
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM family_challenges fc
            WHERE fc.id = challenge_id
            AND auth.uid() = ANY(fc.participants)
        )
    );

CREATE POLICY "Users can update their own challenge scores" ON challenge_scores
    FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own challenge scores" ON challenge_scores
    FOR UPDATE USING (user_id = auth.uid());

-- Add updated_at triggers
DROP TRIGGER IF EXISTS update_health_goals_updated_at ON health_goals;
CREATE TRIGGER update_health_goals_updated_at
    BEFORE UPDATE ON health_goals
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_family_challenges_updated_at ON family_challenges;
CREATE TRIGGER update_family_challenges_updated_at
    BEFORE UPDATE ON family_challenges
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_challenge_scores_updated_at ON challenge_scores;
CREATE TRIGGER update_challenge_scores_updated_at
    BEFORE UPDATE ON challenge_scores
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
