-- VungTauLand RLS Policies
-- Run this AFTER schema.sql

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE news ENABLE ROW LEVEL SECURITY;
ALTER TABLE view_history ENABLE ROW LEVEL SECURITY;

-- ============================================
-- USERS TABLE POLICIES
-- ============================================

-- Public can read basic user info
CREATE POLICY "Public can view basic user info"
  ON users FOR SELECT
  USING (true);

-- Users can update their own record
CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  USING (auth.uid() = id);

-- Users can insert their own record (for registration)
CREATE POLICY "Users can insert own profile"
  ON users FOR INSERT
  WITH CHECK (auth.uid() = id);

-- ============================================
-- LISTINGS TABLE POLICIES
-- ============================================

-- Everyone can read active listings
CREATE POLICY "Anyone can view active listings"
  ON listings FOR SELECT
  USING (status = 'active' OR user_id = auth.uid());

-- Only approved brokers can create listings
CREATE POLICY "Approved brokers can create listings"
  ON listings FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid()
      AND role = 'broker'
      AND broker_status = 'approved'
    )
  );

-- Only owner can update their listings
CREATE POLICY "Owners can update own listings"
  ON listings FOR UPDATE
  USING (user_id = auth.uid());

-- Only owner can delete their listings
CREATE POLICY "Owners can delete own listings"
  ON listings FOR DELETE
  USING (user_id = auth.uid());

-- ============================================
-- FAVORITES TABLE POLICIES
-- ============================================

-- Users can view their own favorites
CREATE POLICY "Users can view own favorites"
  ON favorites FOR SELECT
  USING (user_id = auth.uid());

-- Users can add favorites
CREATE POLICY "Users can add favorites"
  ON favorites FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- Users can remove their favorites
CREATE POLICY "Users can remove own favorites"
  ON favorites FOR DELETE
  USING (user_id = auth.uid());

-- ============================================
-- CONVERSATIONS TABLE POLICIES
-- ============================================

-- Users can view conversations they're part of
CREATE POLICY "Users can view own conversations"
  ON conversations FOR SELECT
  USING (user_id = auth.uid() OR broker_id = auth.uid());

-- Users can create conversations
CREATE POLICY "Users can create conversations"
  ON conversations FOR INSERT
  WITH CHECK (user_id = auth.uid() OR broker_id = auth.uid());

-- Participants can update conversations
CREATE POLICY "Participants can update conversations"
  ON conversations FOR UPDATE
  USING (user_id = auth.uid() OR broker_id = auth.uid());

-- ============================================
-- MESSAGES TABLE POLICIES
-- ============================================

-- Users can view messages in their conversations
CREATE POLICY "Users can view messages in own conversations"
  ON messages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM conversations
      WHERE id = messages.conversation_id
      AND (user_id = auth.uid() OR broker_id = auth.uid())
    )
  );

-- Users can send messages in their conversations
CREATE POLICY "Users can send messages in own conversations"
  ON messages FOR INSERT
  WITH CHECK (
    sender_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM conversations
      WHERE id = messages.conversation_id
      AND (user_id = auth.uid() OR broker_id = auth.uid())
    )
  );

-- Users can update their own messages (for read status)
CREATE POLICY "Users can update messages in own conversations"
  ON messages FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM conversations
      WHERE id = messages.conversation_id
      AND (user_id = auth.uid() OR broker_id = auth.uid())
    )
  );

-- ============================================
-- CONTACT_HISTORY TABLE POLICIES
-- ============================================

-- Brokers can view their contact history
CREATE POLICY "Brokers can view own contact history"
  ON contact_history FOR SELECT
  USING (broker_id = auth.uid());

-- Anyone can create contact history (for tracking)
CREATE POLICY "Anyone can create contact history"
  ON contact_history FOR INSERT
  WITH CHECK (true);

-- ============================================
-- NEWS TABLE POLICIES
-- ============================================

-- Everyone can read news
CREATE POLICY "Anyone can view news"
  ON news FOR SELECT
  USING (true);

-- Only admins can manage news (handled in backend)
CREATE POLICY "Admins can manage news"
  ON news FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid()
      AND role = 'admin'
    )
  );

-- ============================================
-- VIEW_HISTORY TABLE POLICIES
-- ============================================

-- Users can view their own history
CREATE POLICY "Users can view own history"
  ON view_history FOR SELECT
  USING (user_id = auth.uid());

-- Users can add to their history
CREATE POLICY "Users can add to own history"
  ON view_history FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- Users can delete their history
CREATE POLICY "Users can delete own history"
  ON view_history FOR DELETE
  USING (user_id = auth.uid());
