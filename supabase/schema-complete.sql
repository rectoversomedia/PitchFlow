-- ============================================
-- PitchFlow Database Schema
-- Updated with password_hash field
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- USERS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  role TEXT DEFAULT 'ACS' CHECK (role IN ('Supervisor', 'ACS', 'Sales')),
  avatar_url TEXT,
  password_hash TEXT, -- For bcrypt password hashing
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- ============================================
-- BRIEFS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS briefs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  brand_name TEXT NOT NULL,
  industry_category TEXT,
  pic_sales TEXT NOT NULL,
  pic_contact TEXT,
  program TEXT NOT NULL,
  sponsorship_type TEXT,
  objective TEXT,
  target_audience TEXT,
  period TEXT,
  deadline TEXT,
  budget_range TEXT,
  budget_note TEXT,
  notes TEXT,
  attachments TEXT[],
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'in_review', 'in_progress', 'completed')),
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_briefs_created_by ON briefs(created_by);
CREATE INDEX IF NOT EXISTS idx_briefs_status ON briefs(status);
CREATE INDEX IF NOT EXISTS idx_briefs_brand ON briefs(brand_name);

-- ============================================
-- PROPOSALS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS proposals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  brief_id UUID REFERENCES briefs(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  brand_name TEXT NOT NULL,
  program TEXT,
  industry TEXT,
  sponsorship_type TEXT,
  year INTEGER DEFAULT EXTRACT(YEAR FROM CURRENT_DATE),
  status TEXT DEFAULT 'draft' CHECK (status IN ('new_brief', 'drafting', 'need_input', 'revised', 'ready')),
  result TEXT CHECK (result IN ('won', 'pitched', 'lost', 'template')),
  pic_sales TEXT NOT NULL,
  deadline TEXT,
  last_activity TIMESTAMPTZ,
  slides_count INTEGER DEFAULT 0,
  content JSONB DEFAULT '{}', -- Proposal content as JSON
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_proposals_created_by ON proposals(created_by);
CREATE INDEX IF NOT EXISTS idx_proposals_status ON proposals(status);
CREATE INDEX IF NOT EXISTS idx_proposals_brand ON proposals(brand_name);
CREATE INDEX IF NOT EXISTS idx_proposals_result ON proposals(result);

-- ============================================
-- CLIENTS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS clients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  brand_name TEXT,
  email TEXT,
  phone TEXT,
  company TEXT,
  industry TEXT,
  address TEXT,
  notes TEXT,
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_clients_created_by ON clients(created_by);
CREATE INDEX IF NOT EXISTS idx_clients_name ON clients(name);

-- ============================================
-- EVENTS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  event_date DATE NOT NULL,
  event_time TEXT,
  event_type TEXT DEFAULT 'meeting' CHECK (event_type IN ('deadline', 'meeting', 'milestone', 'presentation', 'other')),
  proposal_id UUID REFERENCES proposals(id) ON DELETE SET NULL,
  brief_id UUID REFERENCES briefs(id) ON DELETE SET NULL,
  client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
  reminder BOOLEAN DEFAULT false,
  reminder_days_before INTEGER DEFAULT 1,
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_events_created_by ON events(created_by);
CREATE INDEX IF NOT EXISTS idx_events_date ON events(event_date);
CREATE INDEX IF NOT EXISTS idx_events_type ON events(event_type);

-- ============================================
-- SALES_COMMENTS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS sales_comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  proposal_id UUID REFERENCES proposals(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  content TEXT NOT NULL,
  parent_id UUID REFERENCES sales_comments(id) ON DELETE CASCADE, -- For threaded comments
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_sales_comments_proposal ON sales_comments(proposal_id);
CREATE INDEX IF NOT EXISTS idx_sales_comments_user ON sales_comments(user_id);
CREATE INDEX IF NOT EXISTS idx_sales_comments_parent ON sales_comments(parent_id);

-- ============================================
-- FUNCTIONS & TRIGGERS
-- ============================================

-- Function to auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_briefs_updated_at ON briefs;
CREATE TRIGGER update_briefs_updated_at BEFORE UPDATE ON briefs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_proposals_updated_at ON proposals;
CREATE TRIGGER update_proposals_updated_at BEFORE UPDATE ON proposals
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_clients_updated_at ON clients;
CREATE TRIGGER update_clients_updated_at BEFORE UPDATE ON clients
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_events_updated_at ON events;
CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON events
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_sales_comments_updated_at ON sales_comments;
CREATE TRIGGER update_sales_comments_updated_at BEFORE UPDATE ON sales_comments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE briefs ENABLE ROW LEVEL SECURITY;
ALTER TABLE proposals ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales_comments ENABLE ROW LEVEL SECURITY;

-- Helper function to get current user ID
CREATE OR REPLACE FUNCTION auth.user_id()
RETURNS TEXT AS $$
  SELECT NULLIF(current_setting('request.jwt.claim.sub', true), '')::TEXT
$$ LANGUAGE SQL STABLE;

-- USERS POLICIES
DROP POLICY IF EXISTS "Users can view all authenticated users" ON users;
CREATE POLICY "Users can view all authenticated users" ON users
  FOR SELECT USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Users can update their own profile" ON users;
CREATE POLICY "Users can update their own profile" ON users
  FOR UPDATE USING (id = auth.user_id());

-- BRIEFS POLICIES
DROP POLICY IF EXISTS "Users can view their own briefs" ON briefs;
CREATE POLICY "Users can view their own briefs" ON briefs
  FOR SELECT USING (created_by = auth.user_id() OR created_by IS NULL);

DROP POLICY IF EXISTS "Users can create their own briefs" ON briefs;
CREATE POLICY "Users can create their own briefs" ON briefs
  FOR INSERT WITH CHECK (created_by = auth.user_id());

DROP POLICY IF EXISTS "Users can update their own briefs" ON briefs;
CREATE POLICY "Users can update their own briefs" ON briefs
  FOR UPDATE USING (created_by = auth.user_id());

DROP POLICY IF EXISTS "Users can delete their own briefs" ON briefs;
CREATE POLICY "Users can delete their own briefs" ON briefs
  FOR DELETE USING (created_by = auth.user_id());

-- PROPOSALS POLICIES
DROP POLICY IF EXISTS "Users can view their own proposals" ON proposals;
CREATE POLICY "Users can view their own proposals" ON proposals
  FOR SELECT USING (created_by = auth.user_id() OR created_by IS NULL);

DROP POLICY IF EXISTS "Users can create their own proposals" ON proposals;
CREATE POLICY "Users can create their own proposals" ON proposals
  FOR INSERT WITH CHECK (created_by = auth.user_id());

DROP POLICY IF EXISTS "Users can update their own proposals" ON proposals;
CREATE POLICY "Users can update their own proposals" ON proposals
  FOR UPDATE USING (created_by = auth.user_id());

DROP POLICY IF EXISTS "Users can delete their own proposals" ON proposals;
CREATE POLICY "Users can delete their own proposals" ON proposals
  FOR DELETE USING (created_by = auth.user_id());

-- CLIENTS POLICIES
DROP POLICY IF EXISTS "Users can view their own clients" ON clients;
CREATE POLICY "Users can view their own clients" ON clients
  FOR SELECT USING (created_by = auth.user_id() OR created_by IS NULL);

DROP POLICY IF EXISTS "Users can create their own clients" ON clients;
CREATE POLICY "Users can create their own clients" ON clients
  FOR INSERT WITH CHECK (created_by = auth.user_id());

DROP POLICY IF EXISTS "Users can update their own clients" ON clients;
CREATE POLICY "Users can update their own clients" ON clients
  FOR UPDATE USING (created_by = auth.user_id());

DROP POLICY IF EXISTS "Users can delete their own clients" ON clients;
CREATE POLICY "Users can delete their own clients" ON clients
  FOR DELETE USING (created_by = auth.user_id());

-- EVENTS POLICIES
DROP POLICY IF EXISTS "Users can view their own events" ON events;
CREATE POLICY "Users can view their own events" ON events
  FOR SELECT USING (created_by = auth.user_id() OR created_by IS NULL);

DROP POLICY IF EXISTS "Users can create their own events" ON events;
CREATE POLICY "Users can create their own events" ON events
  FOR INSERT WITH CHECK (created_by = auth.user_id());

DROP POLICY IF EXISTS "Users can update their own events" ON events;
CREATE POLICY "Users can update their own events" ON events
  FOR UPDATE USING (created_by = auth.user_id());

DROP POLICY IF EXISTS "Users can delete their own events" ON events;
CREATE POLICY "Users can delete their own events" ON events
  FOR DELETE USING (created_by = auth.user_id());

-- SALES_COMMENTS POLICIES
DROP POLICY IF EXISTS "Users can view their own comments" ON sales_comments;
CREATE POLICY "Users can view their own comments" ON sales_comments
  FOR SELECT USING (user_id = auth.user_id() OR user_id IS NULL);

DROP POLICY IF EXISTS "Users can create their own comments" ON sales_comments;
CREATE POLICY "Users can create their own comments" ON sales_comments
  FOR INSERT WITH CHECK (user_id = auth.user_id());

DROP POLICY IF EXISTS "Users can update their own comments" ON sales_comments;
CREATE POLICY "Users can update their own comments" ON sales_comments
  FOR UPDATE USING (user_id = auth.user_id());

DROP POLICY IF EXISTS "Users can delete their own comments" ON sales_comments;
CREATE POLICY "Users can delete their own comments" ON sales_comments
  FOR DELETE USING (user_id = auth.user_id());

-- ============================================
-- SEED DATA (Demo Users)
-- ============================================

-- Insert demo users (passwords are plain text - will be hashed on signup)
INSERT INTO users (email, name, role) VALUES
  ('admin@pitchflow.id', 'Admin User', 'Supervisor'),
  ('acs@pitchflow.id', 'ACS User', 'ACS'),
  ('sales@pitchflow.id', 'Sales User', 'Sales')
ON CONFLICT (email) DO NOTHING;
