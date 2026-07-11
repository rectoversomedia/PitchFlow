-- ============================================
-- PitchFlow Supabase RLS (Row Level Security) Policies
-- ============================================
-- Run this in Supabase Dashboard > SQL Editor
-- Or use Supabase CLI: supabase db push
-- ============================================

-- Enable RLS on all tables
ALTER TABLE briefs ENABLE ROW LEVEL SECURITY;
ALTER TABLE proposals ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- ============================================
-- Helper function to get current user ID
-- ============================================
CREATE OR REPLACE FUNCTION auth.user_id()
RETURNS TEXT AS $$
  SELECT NULLIF(current_setting('request.jwt.claim.sub', true), '')::TEXT
$$ LANGUAGE SQL STABLE;

-- ============================================
-- BRIEFS POLICIES
-- ============================================

-- Users can only see their own briefs
CREATE POLICY "Users can view their own briefs"
ON briefs FOR SELECT
USING (created_by = auth.user_id());

-- Users can only create briefs for themselves
CREATE POLICY "Users can create their own briefs"
ON briefs FOR INSERT
WITH CHECK (created_by = auth.user_id());

-- Users can only update their own briefs
CREATE POLICY "Users can update their own briefs"
ON briefs FOR UPDATE
USING (created_by = auth.user_id())
WITH CHECK (created_by = auth.user_id());

-- Users can only delete their own briefs
CREATE POLICY "Users can delete their own briefs"
ON briefs FOR DELETE
USING (created_by = auth.user_id());

-- ============================================
-- PROPOSALS POLICIES
-- ============================================

-- Users can only see their own proposals
CREATE POLICY "Users can view their own proposals"
ON proposals FOR SELECT
USING (created_by = auth.user_id());

-- Users can only create proposals for themselves
CREATE POLICY "Users can create their own proposals"
ON proposals FOR INSERT
WITH CHECK (created_by = auth.user_id());

-- Users can only update their own proposals
CREATE POLICY "Users can update their own proposals"
ON proposals FOR UPDATE
USING (created_by = auth.user_id())
WITH CHECK (created_by = auth.user_id());

-- Users can only delete their own proposals
CREATE POLICY "Users can delete their own proposals"
ON proposals FOR DELETE
USING (created_by = auth.user_id());

-- ============================================
-- SALES COMMENTS POLICIES
-- ============================================

-- Users can only see their own comments
CREATE POLICY "Users can view their own comments"
ON sales_comments FOR SELECT
USING (user_id = auth.user_id());

-- Users can only create comments as themselves
CREATE POLICY "Users can create their own comments"
ON sales_comments FOR INSERT
WITH CHECK (user_id = auth.user_id());

-- Users can only update their own comments
CREATE POLICY "Users can update their own comments"
ON sales_comments FOR UPDATE
USING (user_id = auth.user_id())
WITH CHECK (user_id = auth.user_id());

-- Users can only delete their own comments
CREATE POLICY "Users can delete their own comments"
ON sales_comments FOR DELETE
USING (user_id = auth.user_id());

-- ============================================
-- CLIENTS POLICIES
-- ============================================

-- Users can only see their own clients
CREATE POLICY "Users can view their own clients"
ON clients FOR SELECT
USING (created_by = auth.user_id());

-- Users can only create clients for themselves
CREATE POLICY "Users can create their own clients"
ON clients FOR INSERT
WITH CHECK (created_by = auth.user_id());

-- Users can only update their own clients
CREATE POLICY "Users can update their own clients"
ON clients FOR UPDATE
USING (created_by = auth.user_id())
WITH CHECK (created_by = auth.user_id());

-- Users can only delete their own clients
CREATE POLICY "Users can delete their own clients"
ON clients FOR DELETE
USING (created_by = auth.user_id());

-- ============================================
-- EVENTS POLICIES
-- ============================================

-- Users can only see their own events
CREATE POLICY "Users can view their own events"
ON events FOR SELECT
USING (created_by = auth.user_id());

-- Users can only create events for themselves
CREATE POLICY "Users can create their own events"
ON events FOR INSERT
WITH CHECK (created_by = auth.user_id());

-- Users can only update their own events
CREATE POLICY "Users can update their own events"
ON events FOR UPDATE
USING (created_by = auth.user_id())
WITH CHECK (created_by = auth.user_id());

-- Users can only delete their own events
CREATE POLICY "Users can delete their own events"
ON events FOR DELETE
USING (created_by = auth.user_id());

-- ============================================
-- USERS POLICIES (for profile management)
-- ============================================

-- Users can view their own profile
CREATE POLICY "Users can view their own profile"
ON users FOR SELECT
USING (id = auth.user_id());

-- Users can update their own profile
CREATE POLICY "Users can update their own profile"
ON users FOR UPDATE
USING (id = auth.user_id())
WITH CHECK (id = auth.user_id());

-- ============================================
-- ADDITIONAL SECURITY POLICIES
-- ============================================

-- Prevent direct table access (service role bypasses this)
-- Note: This is already enforced by the policies above

-- ============================================
-- HELPER FUNCTIONS
-- ============================================

-- Function to check if user owns a resource
CREATE OR REPLACE FUNCTION auth.owns_resource(resource_created_by TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN resource_created_by = auth.user_id();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get current user's role
CREATE OR REPLACE FUNCTION auth.user_role()
RETURNS TEXT AS $$
  SELECT role FROM users WHERE id = auth.user_id();
$$ LANGUAGE sql STABLE;

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================

CREATE INDEX IF NOT EXISTS idx_briefs_created_by ON briefs(created_by);
CREATE INDEX IF NOT EXISTS idx_proposals_created_by ON proposals(created_by);
CREATE INDEX IF NOT EXISTS idx_sales_comments_user_id ON sales_comments(user_id);
CREATE INDEX IF NOT EXISTS idx_sales_comments_proposal_id ON sales_comments(proposal_id);
CREATE INDEX IF NOT EXISTS idx_clients_created_by ON clients(created_by);
CREATE INDEX IF NOT EXISTS idx_events_created_by ON events(created_by);
CREATE INDEX IF NOT EXISTS idx_events_event_date ON events(event_date);

-- ============================================
-- GRANT PERMISSIONS
-- ============================================

-- Grant usage on helper functions
GRANT EXECUTE ON FUNCTION auth.user_id() TO authenticated;
GRANT EXECUTE ON FUNCTION auth.owns_resource(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION auth.user_role() TO authenticated;

-- ============================================
-- VERIFICATION QUERIES
-- ============================================

-- Check if RLS is enabled on all tables
-- SELECT tablename, rowsecurity
-- FROM pg_tables
-- WHERE schemaname = 'public'
-- AND tablename IN ('briefs', 'proposals', 'sales_comments', 'clients', 'events', 'users');

-- List all policies
-- SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
-- FROM pg_policies
-- WHERE schemaname = 'public';
