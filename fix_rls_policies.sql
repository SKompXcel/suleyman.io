-- Fix RLS Policies for Deal Board
-- This fixes issues where users can't create/update/delete deals or notes

-- ============================================
-- DEALS TABLE - Fix all policies
-- ============================================

-- Drop all existing policies
DROP POLICY IF EXISTS "Users can view deals on their board" ON deals;
DROP POLICY IF EXISTS "Users can insert deals on their board" ON deals;
DROP POLICY IF EXISTS "Users can update deals on their board" ON deals;
DROP POLICY IF EXISTS "Users can delete deals on their board" ON deals;

-- Create new, more permissive policies
-- SELECT: View deals
CREATE POLICY "Users can view deals on their board"
  ON deals FOR SELECT
  USING (
    -- Account managers can see their own board
    board_id IN (SELECT board_id FROM profiles WHERE id = auth.uid())
    OR 
    -- Associates and directors can see all boards
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND role IN ('associate', 'director')
    )
  );

-- INSERT: Create deals
CREATE POLICY "Users can insert deals on their board"
  ON deals FOR INSERT
  WITH CHECK (
    -- Account managers can create on their own board
    board_id IN (SELECT board_id FROM profiles WHERE id = auth.uid())
    OR 
    -- Associates and directors can create on any board
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND role IN ('associate', 'director')
    )
  );

-- UPDATE: Modify deals
CREATE POLICY "Users can update deals on their board"
  ON deals FOR UPDATE
  USING (
    -- Account managers can update their own board
    board_id IN (SELECT board_id FROM profiles WHERE id = auth.uid())
    OR 
    -- Associates and directors can update any board
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND role IN ('associate', 'director')
    )
  )
  WITH CHECK (
    -- Same check for the updated data
    board_id IN (SELECT board_id FROM profiles WHERE id = auth.uid())
    OR 
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND role IN ('associate', 'director')
    )
  );

-- DELETE: Remove deals
CREATE POLICY "Users can delete deals on their board"
  ON deals FOR DELETE
  USING (
    -- Account managers can delete from their own board
    board_id IN (SELECT board_id FROM profiles WHERE id = auth.uid())
    OR 
    -- Associates and directors can delete from any board
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND role IN ('associate', 'director')
    )
  );

-- ============================================
-- BOARD_NOTES TABLE - Fix all policies
-- ============================================

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view board notes" ON board_notes;
DROP POLICY IF EXISTS "Users can create board notes" ON board_notes;
DROP POLICY IF EXISTS "Users can delete own notes" ON board_notes;

-- SELECT: View notes
CREATE POLICY "Users can view board notes"
  ON board_notes FOR SELECT
  USING (
    -- Account managers can see notes on their board
    board_id IN (SELECT board_id FROM profiles WHERE id = auth.uid())
    OR 
    -- Associates and directors can see all board notes
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND role IN ('associate', 'director')
    )
  );

-- INSERT: Create notes
CREATE POLICY "Users can create board notes"
  ON board_notes FOR INSERT
  WITH CHECK (
    -- Account managers can create notes on their board
    board_id IN (SELECT board_id FROM profiles WHERE id = auth.uid())
    OR 
    -- Associates and directors can create notes on any board
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND role IN ('associate', 'director')
    )
  );

-- DELETE: Remove notes (only own notes)
CREATE POLICY "Users can delete own notes"
  ON board_notes FOR DELETE
  USING (
    created_by = auth.uid()
  );

-- ============================================
-- VENDORS TABLE - Make sure it's accessible
-- ============================================

-- Drop existing policies if any
DROP POLICY IF EXISTS "Anyone can view vendors" ON vendors;
DROP POLICY IF EXISTS "Anyone can insert vendors" ON vendors;

-- Allow all authenticated users to view vendors
CREATE POLICY "Anyone can view vendors"
  ON vendors FOR SELECT
  USING (auth.uid() IS NOT NULL);

-- Allow all authenticated users to insert vendors
CREATE POLICY "Anyone can insert vendors"
  ON vendors FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- ============================================
-- CLIENTS TABLE - Make sure it's accessible
-- ============================================

-- Drop existing policies if any
DROP POLICY IF EXISTS "Anyone can view clients" ON clients;
DROP POLICY IF EXISTS "Anyone can insert clients" ON clients;

-- Allow all authenticated users to view clients
CREATE POLICY "Anyone can view clients"
  ON clients FOR SELECT
  USING (auth.uid() IS NOT NULL);

-- Allow all authenticated users to insert clients
CREATE POLICY "Anyone can insert clients"
  ON clients FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- ============================================
-- PROFILES TABLE - Make sure users can read their own profile
-- ============================================

-- Drop existing policy if any
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;

-- Allow users to view their own profile
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (id = auth.uid());

-- ============================================
-- VERIFICATION QUERIES
-- ============================================

-- Run these to verify everything is working:
-- SELECT * FROM deals; -- Should see deals based on your role
-- SELECT * FROM board_notes; -- Should see notes based on your role
-- SELECT * FROM vendors; -- Should see all vendors
-- SELECT * FROM clients; -- Should see all clients
-- SELECT * FROM profiles WHERE id = auth.uid(); -- Should see your profile
