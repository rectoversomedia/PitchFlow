-- PitchFlow Database Schema
-- Run this in Supabase SQL Editor
-- Version: 2.0 - Complete schema with RLS

-- ============================================
-- ENABLE EXTENSIONS
-- ============================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- HELPER FUNCTION: Get current user ID from auth.jwt()
-- ============================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, name, avatar_url, role)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'email',
    NEW.raw_user_meta_data->>'name',
    NEW.raw_user_meta_data->>'avatar_url',
    COALESCE(NEW.raw_user_meta_data->>'role', 'Sales')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- TABEL: users
-- ============================================
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    name TEXT,
    avatar_url TEXT,
    role TEXT DEFAULT 'Sales' CHECK (role IN ('Supervisor', 'ACS', 'Sales')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- TABEL: briefs
-- ============================================
CREATE TABLE IF NOT EXISTS briefs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
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
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- TABEL: proposals
-- ============================================
CREATE TABLE IF NOT EXISTS proposals (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    brief_id UUID REFERENCES briefs(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    brand_name TEXT NOT NULL,
    program TEXT NOT NULL,
    industry TEXT,
    sponsorship_type TEXT,
    year INTEGER DEFAULT EXTRACT(YEAR FROM CURRENT_DATE),
    status TEXT DEFAULT 'drafting' CHECK (status IN ('new_brief', 'drafting', 'need_input', 'revised', 'ready')),
    result TEXT CHECK (result IN ('won', 'pitched', 'lost', 'template')),
    pic_sales TEXT NOT NULL,
    deadline TEXT,
    last_activity TEXT,
    slides_count INTEGER DEFAULT 0,
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- TABEL: sales_comments
-- ============================================
CREATE TABLE IF NOT EXISTS sales_comments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    proposal_id UUID REFERENCES proposals(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL NOT NULL,
    content TEXT NOT NULL,
    parent_id UUID REFERENCES sales_comments(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- TABEL: clients
-- ============================================
CREATE TABLE IF NOT EXISTS clients (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    brand_name TEXT,
    email TEXT,
    phone TEXT,
    company TEXT,
    industry TEXT,
    address TEXT,
    notes TEXT,
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- TABEL: events (Calendar)
-- ============================================
CREATE TABLE IF NOT EXISTS events (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    event_date DATE NOT NULL,
    event_time TIME,
    event_type TEXT DEFAULT 'other' CHECK (event_type IN ('deadline', 'meeting', 'milestone', 'presentation', 'other')),
    proposal_id UUID REFERENCES proposals(id) ON DELETE SET NULL,
    brief_id UUID REFERENCES briefs(id) ON DELETE SET NULL,
    client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
    reminder BOOLEAN DEFAULT true,
    reminder_days_before INTEGER DEFAULT 1,
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- ENABLE RLS (Row Level Security) ON ALL TABLES
-- ============================================
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE briefs ENABLE ROW LEVEL SECURITY;
ALTER TABLE proposals ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- ============================================
-- RLS POLICIES FOR public.users
-- ============================================
-- Users can view all users (for team collaboration)
CREATE POLICY "users_select_all" ON public.users
    FOR SELECT USING (true);

-- Users can update their own profile
CREATE POLICY "users_update_own" ON public.users
    FOR UPDATE USING (auth.uid() = id);

-- Users can insert their own profile (via trigger)
CREATE POLICY "users_insert_own" ON public.users
    FOR INSERT WITH CHECK (auth.uid() = id);

-- ============================================
-- RLS POLICIES FOR briefs
-- ============================================
-- All authenticated users can view briefs
CREATE POLICY "briefs_select_all" ON briefs
    FOR SELECT USING (auth.role() = 'authenticated');

-- All authenticated users can create briefs
CREATE POLICY "briefs_insert_all" ON briefs
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Users can update briefs (any authenticated user for now)
CREATE POLICY "briefs_update_all" ON briefs
    FOR UPDATE USING (auth.role() = 'authenticated');

-- Only creators or supervisors can delete briefs
CREATE POLICY "briefs_delete_creator" ON briefs
    FOR DELETE USING (auth.uid() = created_by OR EXISTS (
        SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'Supervisor'
    ));

-- ============================================
-- RLS POLICIES FOR proposals
-- ============================================
-- All authenticated users can view proposals
CREATE POLICY "proposals_select_all" ON proposals
    FOR SELECT USING (auth.role() = 'authenticated');

-- All authenticated users can create proposals
CREATE POLICY "proposals_insert_all" ON proposals
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Users can update proposals they created
CREATE POLICY "proposals_update_creator" ON proposals
    FOR UPDATE USING (auth.uid() = created_by OR EXISTS (
        SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('Supervisor', 'ACS')
    ));

-- Only creators or supervisors can delete proposals
CREATE POLICY "proposals_delete_creator" ON proposals
    FOR DELETE USING (auth.uid() = created_by OR EXISTS (
        SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'Supervisor'
    ));

-- ============================================
-- RLS POLICIES FOR sales_comments
-- ============================================
-- All authenticated users can view comments for proposals they can access
CREATE POLICY "sales_comments_select_all" ON sales_comments
    FOR SELECT USING (auth.role() = 'authenticated');

-- All authenticated users can create comments
CREATE POLICY "sales_comments_insert_all" ON sales_comments
    FOR INSERT WITH CHECK (auth.role() = 'authenticated' AND auth.uid() = user_id);

-- Users can update their own comments
CREATE POLICY "sales_comments_update_own" ON sales_comments
    FOR UPDATE USING (auth.uid() = user_id OR EXISTS (
        SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('Supervisor', 'ACS')
    ));

-- Users can delete their own comments
CREATE POLICY "sales_comments_delete_own" ON sales_comments
    FOR DELETE USING (auth.uid() = user_id OR EXISTS (
        SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'Supervisor'
    ));

-- ============================================
-- RLS POLICIES FOR clients
-- ============================================
-- All authenticated users can view clients
CREATE POLICY "clients_select_all" ON clients
    FOR SELECT USING (auth.role() = 'authenticated');

-- All authenticated users can create clients
CREATE POLICY "clients_insert_all" ON clients
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Users can update clients they created
CREATE POLICY "clients_update_creator" ON clients
    FOR UPDATE USING (auth.uid() = created_by OR EXISTS (
        SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('Supervisor', 'ACS')
    ));

-- Only creators or supervisors can delete clients
CREATE POLICY "clients_delete_creator" ON clients
    FOR DELETE USING (auth.uid() = created_by OR EXISTS (
        SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'Supervisor'
    ));

-- ============================================
-- RLS POLICIES FOR events
-- ============================================
-- All authenticated users can view events
CREATE POLICY "events_select_all" ON events
    FOR SELECT USING (auth.role() = 'authenticated');

-- All authenticated users can create events
CREATE POLICY "events_insert_all" ON events
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Users can update events they created
CREATE POLICY "events_update_creator" ON events
    FOR UPDATE USING (auth.uid() = created_by OR EXISTS (
        SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('Supervisor', 'ACS')
    ));

-- Only creators or supervisors can delete events
CREATE POLICY "events_delete_creator" ON events
    FOR DELETE USING (auth.uid() = created_by OR EXISTS (
        SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'Supervisor'
    ));

-- ============================================
-- CREATE INDEXES FOR PERFORMANCE
-- ============================================
CREATE INDEX IF NOT EXISTS idx_briefs_status ON briefs(status);
CREATE INDEX IF NOT EXISTS idx_briefs_created_by ON briefs(created_by);
CREATE INDEX IF NOT EXISTS idx_briefs_created_at ON briefs(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_proposals_status ON proposals(status);
CREATE INDEX IF NOT EXISTS idx_proposals_created_by ON proposals(created_by);
CREATE INDEX IF NOT EXISTS idx_proposals_created_at ON proposals(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_sales_comments_proposal_id ON sales_comments(proposal_id);
CREATE INDEX IF NOT EXISTS idx_sales_comments_user_id ON sales_comments(user_id);

CREATE INDEX IF NOT EXISTS idx_clients_created_by ON clients(created_by);
CREATE INDEX IF NOT EXISTS idx_clients_industry ON clients(industry);

CREATE INDEX IF NOT EXISTS idx_events_event_date ON events(event_date);
CREATE INDEX IF NOT EXISTS idx_events_created_by ON events(created_by);
CREATE INDEX IF NOT EXISTS idx_events_event_type ON events(event_type);

-- ============================================
-- INSERT SAMPLE DATA (Optional - remove in production)
-- ============================================
-- Note: Sample data insertion requires authenticated context
-- Run this separately after creating a user account

/*
-- Sample Clients (after users table is populated)
INSERT INTO clients (name, brand_name, email, phone, company, industry, created_by)
SELECT 'Budi Santoso', 'Wardah', 'budi@wardah.com', '081234567890', 'Parfame', 'Beauty & Personal Care', id
FROM auth.users WHERE email = 'your-admin@email.com'
LIMIT 1;
*/
