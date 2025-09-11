-- Supabase Database Schema for Zephy Anonymous Student Wellness Hub

-- Enable Row Level Security
ALTER DATABASE postgres SET "app.jwt_secret" TO 'your-jwt-secret';

-- Create user profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    nickname VARCHAR(50) NOT NULL,
    avatar VARCHAR(10) NOT NULL,
    academic_year VARCHAR(20) NOT NULL,
    email VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id)
);

-- Create communities table
CREATE TABLE IF NOT EXISTS communities (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    icon VARCHAR(10),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Insert default communities
INSERT INTO communities (name, slug, description, icon) VALUES
('All Posts', 'all', 'General community for all students', '🌍'),
('Exam Stress Circle', 'exam-stress', 'Support for exam anxiety and stress', '📚'),
('Homesick Freshers', 'homesick', 'Help for new students feeling homesick', '🏠'),
('Final-Year Anxiety', 'final-year', 'Support for graduating students', '🎓'),
('Social Connections', 'social', 'Making friends and social activities', '🤝')
ON CONFLICT (slug) DO NOTHING;

-- Create posts table
CREATE TABLE IF NOT EXISTS posts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    community_id UUID REFERENCES communities(id) ON DELETE CASCADE,
    title VARCHAR(200),
    content TEXT NOT NULL,
    anonymous_author VARCHAR(60) NOT NULL, -- nickname + avatar
    upvotes INTEGER DEFAULT 0,
    downvotes INTEGER DEFAULT 0,
    replies_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create post votes table
CREATE TABLE IF NOT EXISTS post_votes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
    vote_type VARCHAR(10) CHECK (vote_type IN ('upvote', 'downvote')) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id, post_id)
);

-- Create replies table
CREATE TABLE IF NOT EXISTS replies (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    anonymous_author VARCHAR(60) NOT NULL,
    upvotes INTEGER DEFAULT 0,
    downvotes INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create reply votes table
CREATE TABLE IF NOT EXISTS reply_votes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    reply_id UUID REFERENCES replies(id) ON DELETE CASCADE,
    vote_type VARCHAR(10) CHECK (vote_type IN ('upvote', 'downvote')) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id, reply_id)
);

-- Create polls table
CREATE TABLE IF NOT EXISTS polls (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    poll_type VARCHAR(20) CHECK (poll_type IN ('emoji', 'multiple_choice', 'scale', 'yes_no')) NOT NULL,
    options JSONB, -- Store poll options as JSON
    total_votes INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    anonymous_author VARCHAR(60) NOT NULL
);

-- Create poll votes table
CREATE TABLE IF NOT EXISTS poll_votes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    poll_id UUID REFERENCES polls(id) ON DELETE CASCADE,
    selected_option VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id, poll_id)
);

-- Create wellness assessments table
CREATE TABLE IF NOT EXISTS wellness_assessments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    stress_level INTEGER CHECK (stress_level BETWEEN 1 AND 5),
    sleep_quality INTEGER CHECK (sleep_quality BETWEEN 1 AND 5),
    mood_level INTEGER CHECK (mood_level BETWEEN 1 AND 5),
    academic_pressure INTEGER CHECK (academic_pressure BETWEEN 1 AND 5),
    overall_score INTEGER,
    recommendations TEXT,
    badges JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Row Level Security Policies

-- User profiles - users can only see/edit their own profile
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own profile" ON user_profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON user_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON user_profiles FOR UPDATE USING (auth.uid() = user_id);

-- Communities - everyone can read
ALTER TABLE communities ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Communities are viewable by everyone" ON communities FOR SELECT USING (true);

-- Posts - users can create, everyone can read
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Posts are viewable by everyone" ON posts FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert posts" ON posts FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Users can update own posts" ON posts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own posts" ON posts FOR DELETE USING (auth.uid() = user_id);

-- Post votes - users can vote once per post
ALTER TABLE post_votes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Post votes are viewable by everyone" ON post_votes FOR SELECT USING (true);
CREATE POLICY "Authenticated users can vote" ON post_votes FOR INSERT WITH CHECK (auth.role() = 'authenticated' AND auth.uid() = user_id);
CREATE POLICY "Users can update own votes" ON post_votes FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own votes" ON post_votes FOR DELETE USING (auth.uid() = user_id);

-- Replies - users can create, everyone can read
ALTER TABLE replies ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Replies are viewable by everyone" ON replies FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert replies" ON replies FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Users can update own replies" ON replies FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own replies" ON replies FOR DELETE USING (auth.uid() = user_id);

-- Reply votes
ALTER TABLE reply_votes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Reply votes are viewable by everyone" ON reply_votes FOR SELECT USING (true);
CREATE POLICY "Authenticated users can vote on replies" ON reply_votes FOR INSERT WITH CHECK (auth.role() = 'authenticated' AND auth.uid() = user_id);
CREATE POLICY "Users can update own reply votes" ON reply_votes FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own reply votes" ON reply_votes FOR DELETE USING (auth.uid() = user_id);

-- Polls
ALTER TABLE polls ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Polls are viewable by everyone" ON polls FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create polls" ON polls FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Users can update own polls" ON polls FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own polls" ON polls FOR DELETE USING (auth.uid() = user_id);

-- Poll votes
ALTER TABLE poll_votes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Poll votes are viewable by everyone" ON poll_votes FOR SELECT USING (true);
CREATE POLICY "Authenticated users can vote on polls" ON poll_votes FOR INSERT WITH CHECK (auth.role() = 'authenticated' AND auth.uid() = user_id);
CREATE POLICY "Users can update own poll votes" ON poll_votes FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own poll votes" ON poll_votes FOR DELETE USING (auth.uid() = user_id);

-- Wellness assessments - private to user
ALTER TABLE wellness_assessments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own assessments" ON wellness_assessments FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own assessments" ON wellness_assessments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own assessments" ON wellness_assessments FOR UPDATE USING (auth.uid() = user_id);

-- Functions to update updated_at timestamp
CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers
CREATE TRIGGER set_timestamp_user_profiles BEFORE UPDATE ON user_profiles FOR EACH ROW EXECUTE PROCEDURE trigger_set_timestamp();
CREATE TRIGGER set_timestamp_posts BEFORE UPDATE ON posts FOR EACH ROW EXECUTE PROCEDURE trigger_set_timestamp();

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_posts_community_id ON posts(community_id);
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_post_votes_post_id ON post_votes(post_id);
CREATE INDEX IF NOT EXISTS idx_replies_post_id ON replies(post_id);
CREATE INDEX IF NOT EXISTS idx_polls_created_at ON polls(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_poll_votes_poll_id ON poll_votes(poll_id);
CREATE INDEX IF NOT EXISTS idx_wellness_assessments_user_id ON wellness_assessments(user_id);
CREATE INDEX IF NOT EXISTS idx_wellness_assessments_created_at ON wellness_assessments(created_at DESC);
