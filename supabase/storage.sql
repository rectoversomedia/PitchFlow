-- =====================================================
-- PitchFlow Storage Configuration
-- Version: 1.0.0
-- Created: 2026-07-13
-- Description: Supabase Storage bucket for file uploads
-- =====================================================

-- Note: Run this SQL in Supabase Dashboard > SQL Editor

-- =====================================================
-- CREATE STORAGE BUCKET
-- =====================================================

-- Create bucket for general uploads (restricted to authenticated users)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'pitchflow-uploads',
  'pitchflow-uploads',
  false, -- Private bucket
  10485760, -- 10MB limit
  ARRAY[
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  ]::text[]
)
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- STORAGE POLICIES
-- =====================================================

-- Allow authenticated users to upload files to their own folder
CREATE POLICY "Users can upload to their own folder"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'pitchflow-uploads'
  AND (storage.foldername(name))[1] IN (
    SELECT id::text FROM auth.users
  )
);

-- Allow users to view files they uploaded
CREATE POLICY "Users can view their own files"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'pitchflow-uploads'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow users to update their own files
CREATE POLICY "Users can update their own files"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'pitchflow-uploads'
  AND (storage.foldername(name))[1] = auth.uid()::text
)
WITH CHECK (
  bucket_id = 'pitchflow-uploads'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow users to delete their own files
CREATE POLICY "Users can delete their own files"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'pitchflow-uploads'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- =====================================================
-- DONE
-- =====================================================
SELECT 'Storage bucket configured successfully!' AS status;
