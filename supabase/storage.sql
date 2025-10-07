-- VungTauLand Storage Buckets & Policies
-- Run this in Supabase Dashboard > Storage

-- ============================================
-- STORAGE BUCKETS
-- ============================================

-- Create buckets (run these in Supabase Dashboard or via API)
-- 1. listing-images (public)
-- 2. avatars (public)
-- 3. news-images (public)

-- ============================================
-- STORAGE POLICIES
-- ============================================

-- LISTING IMAGES BUCKET
-- Anyone can view
CREATE POLICY "Anyone can view listing images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'listing-images');

-- Authenticated users can upload
CREATE POLICY "Authenticated users can upload listing images"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'listing-images' 
    AND auth.role() = 'authenticated'
  );

-- Users can update their own images
CREATE POLICY "Users can update own listing images"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'listing-images' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Users can delete their own images
CREATE POLICY "Users can delete own listing images"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'listing-images' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- AVATARS BUCKET
-- Anyone can view
CREATE POLICY "Anyone can view avatars"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'avatars');

-- Authenticated users can upload their avatar
CREATE POLICY "Users can upload own avatar"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'avatars' 
    AND auth.role() = 'authenticated'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Users can update their own avatar
CREATE POLICY "Users can update own avatar"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'avatars' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Users can delete their own avatar
CREATE POLICY "Users can delete own avatar"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'avatars' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- NEWS IMAGES BUCKET
-- Anyone can view
CREATE POLICY "Anyone can view news images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'news-images');

-- Only admins can upload news images
CREATE POLICY "Admins can upload news images"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'news-images' 
    AND EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid()
      AND role = 'admin'
    )
  );

-- Only admins can update news images
CREATE POLICY "Admins can update news images"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'news-images' 
    AND EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid()
      AND role = 'admin'
    )
  );

-- Only admins can delete news images
CREATE POLICY "Admins can delete news images"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'news-images' 
    AND EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid()
      AND role = 'admin'
    )
  );
