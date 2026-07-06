-- =====================================================
-- PitchFlow Database Schema
-- Version: 1.0.0
-- Created: 2026-07-05
-- Description: Database schema for PitchFlow sponsorship proposal management
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- USERS TABLE
-- Stores user information for authentication and team management
-- =====================================================
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'Sales' CHECK (role IN ('Supervisor', 'ACS', 'Sales')),
  avatar_url TEXT,
  email_verified TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- CLIENTS TABLE
-- Stores client/brand information
-- =====================================================
CREATE TABLE IF NOT EXISTS clients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  brand_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  company TEXT,
  industry TEXT,
  address TEXT,
  notes TEXT,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- BRIEFS TABLE
-- Stores sponsorship briefs from sales team
-- =====================================================
CREATE TABLE IF NOT EXISTS briefs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  brand_name TEXT NOT NULL,
  industry_category TEXT,
  pic_sales TEXT,
  pic_contact TEXT,
  program TEXT,
  sponsorship_type TEXT,
  objective TEXT,
  target_audience TEXT,
  period TEXT,
  deadline DATE,
  budget_range TEXT,
  budget_note TEXT,
  notes TEXT,
  attachments JSONB DEFAULT '[]'::jsonb,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'in_review', 'in_progress', 'completed')),
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- PROPOSALS TABLE
-- Stores generated sponsorship proposals
-- =====================================================
CREATE TABLE IF NOT EXISTS proposals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  brief_id UUID REFERENCES briefs(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  brand_name TEXT NOT NULL,
  program TEXT,
  industry TEXT,
  sponsorship_type TEXT,
  year INTEGER DEFAULT EXTRACT(YEAR FROM NOW()),
  status TEXT DEFAULT 'new_brief' CHECK (status IN ('new_brief', 'drafting', 'need_input', 'revised', 'ready')),
  result TEXT CHECK (result IN ('won', 'pitched', 'lost', 'template')),
  pic_sales TEXT,
  deadline DATE,
  last_activity TIMESTAMPTZ DEFAULT NOW(),
  slides_count INTEGER DEFAULT 0,
  content JSONB DEFAULT '{}'::jsonb,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- SALES COMMENTS TABLE
-- Stores comments and feedback from sales team
-- =====================================================
CREATE TABLE IF NOT EXISTS sales_comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  proposal_id UUID REFERENCES proposals(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id),
  content TEXT NOT NULL,
  parent_id UUID REFERENCES sales_comments(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- EVENTS TABLE
-- Stores calendar events and deadlines
-- =====================================================
CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  event_date DATE NOT NULL,
  event_time TIME,
  event_type TEXT CHECK (event_type IN ('deadline', 'meeting', 'milestone', 'presentation', 'other')),
  proposal_id UUID REFERENCES proposals(id) ON DELETE CASCADE,
  brief_id UUID REFERENCES briefs(id) ON DELETE CASCADE,
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
  reminder BOOLEAN DEFAULT true,
  reminder_days_before INTEGER DEFAULT 1,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- BRAND EXPLORATIONS TABLE
-- Stores AI-generated brand analysis and insights
-- =====================================================
CREATE TABLE IF NOT EXISTS brand_explorations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  brand_name TEXT NOT NULL,
  category TEXT,
  objective TEXT,
  target_audience TEXT,
  program TEXT,
  sponsorship_type TEXT,
  budget_range TEXT,
  notes TEXT,
  brand_summary JSONB,
  insights JSONB,
  program_fits JSONB,
  integration_ideas JSONB,
  package_recommendation JSONB,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_briefs_status ON briefs(status);
CREATE INDEX IF NOT EXISTS idx_briefs_created_at ON briefs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_briefs_brand_name ON briefs(brand_name);
CREATE INDEX IF NOT EXISTS idx_proposals_status ON proposals(status);
CREATE INDEX IF NOT EXISTS idx_proposals_brand_name ON proposals(brand_name);
CREATE INDEX IF NOT EXISTS idx_proposals_created_at ON proposals(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_sales_comments_proposal_id ON sales_comments(proposal_id);
CREATE INDEX IF NOT EXISTS idx_events_event_date ON events(event_date);
CREATE INDEX IF NOT EXISTS idx_events_client_id ON events(client_id);
CREATE INDEX IF NOT EXISTS idx_brand_explorations_brand_name ON brand_explorations(brand_name);

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE briefs ENABLE ROW LEVEL SECURITY;
ALTER TABLE proposals ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE brand_explorations ENABLE ROW LEVEL SECURITY;

-- Policies for authenticated users (adjust based on your auth setup)
CREATE POLICY "Users can view all users" ON users FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (true);

CREATE POLICY "Authenticated users can manage clients" ON clients FOR ALL USING (true);
CREATE POLICY "Authenticated users can manage briefs" ON briefs FOR ALL USING (true);
CREATE POLICY "Authenticated users can manage proposals" ON proposals FOR ALL USING (true);
CREATE POLICY "Authenticated users can manage comments" ON sales_comments FOR ALL USING (true);
CREATE POLICY "Authenticated users can manage events" ON events FOR ALL USING (true);
CREATE POLICY "Authenticated users can manage brand explorations" ON brand_explorations FOR ALL USING (true);

-- =====================================================
-- TRIGGERS FOR UPDATED_AT
-- =====================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for all tables
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_clients_updated_at BEFORE UPDATE ON clients
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_briefs_updated_at BEFORE UPDATE ON briefs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_proposals_updated_at BEFORE UPDATE ON proposals
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_sales_comments_updated_at BEFORE UPDATE ON sales_comments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON events
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_brand_explorations_updated_at BEFORE UPDATE ON brand_explorations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- USER SESSIONS TABLE
-- Stores session data for PitchFlow 3-user-types system (demo/new/existing)
-- =====================================================
CREATE TABLE IF NOT EXISTS user_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_token TEXT UNIQUE NOT NULL,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  user_type TEXT NOT NULL DEFAULT 'existing' CHECK (user_type IN ('demo', 'new', 'existing')),
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_user_sessions_token ON user_sessions(session_token);

-- =====================================================
-- SEED DATA (Optional - for development)
-- =====================================================
-- Uncomment the following to add seed data

-- INSERT INTO users (id, email, name, role) VALUES
--   ('00000000-0000-0000-0000-000000000001', 'admin@rectoverso.com', 'Admin User', 'Supervisor'),
--   ('00000000-0000-0000-0000-000000000002', 'sales@rectoverso.com', 'Sales User', 'Sales');

-- RLS for user_sessions
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "User sessions can be managed" ON user_sessions FOR ALL USING (true);

-- Create trigger for user_sessions
CREATE TRIGGER update_user_sessions_updated_at BEFORE UPDATE ON user_sessions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

COMMENT ON TABLE users IS 'User accounts and team members';
COMMENT ON TABLE clients IS 'Client and brand information';
COMMENT ON TABLE briefs IS 'Sponsorship briefs submitted by sales team';
COMMENT ON TABLE proposals IS 'Generated sponsorship proposals';
COMMENT ON TABLE sales_comments IS 'Comments and feedback from sales team';
COMMENT ON TABLE events IS 'Calendar events and deadlines';
COMMENT ON TABLE brand_explorations IS 'AI-generated brand analysis and insights';
COMMENT ON TABLE user_sessions IS 'Session data for PitchFlow 3-user-types system';
