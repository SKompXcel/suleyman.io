-- MHCCA Deal Board Database Schema
-- Run this in your Supabase SQL Editor

-- 1. Create profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('account-manager', 'associate')),
  board_id TEXT CHECK (board_id IN ('edwin', 'elizabeth') OR board_id IS NULL),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create deals table
CREATE TABLE IF NOT EXISTS deals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  board_id TEXT NOT NULL CHECK (board_id IN ('edwin', 'elizabeth')),
  vision_number TEXT,
  vendor TEXT NOT NULL,
  client TEXT NOT NULL,
  stage TEXT NOT NULL,
  assigned_to TEXT NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id)
);

-- 3. Create vendors table (shared across boards)
CREATE TABLE IF NOT EXISTS vendors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Create clients table (shared across boards)
CREATE TABLE IF NOT EXISTS clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE deals ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;

-- 6. RLS Policies for profiles (users can only see their own profile)
CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- 7. RLS Policies for deals
-- Account managers only see their board, associates see all
CREATE POLICY "Users can view deals on their board"
  ON deals FOR SELECT
  USING (
    board_id = (SELECT board_id FROM profiles WHERE id = auth.uid())
    OR 
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'associate'
  );

CREATE POLICY "Users can insert deals on their board"
  ON deals FOR INSERT
  WITH CHECK (
    board_id = (SELECT board_id FROM profiles WHERE id = auth.uid())
    OR 
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'associate'
  );

CREATE POLICY "Users can update deals on their board"
  ON deals FOR UPDATE
  USING (
    board_id = (SELECT board_id FROM profiles WHERE id = auth.uid())
    OR 
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'associate'
  );

CREATE POLICY "Users can delete deals on their board"
  ON deals FOR DELETE
  USING (
    board_id = (SELECT board_id FROM profiles WHERE id = auth.uid())
    OR 
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'associate'
  );

-- 8. RLS Policies for vendors and clients (everyone can view and add)
CREATE POLICY "Everyone can view vendors"
  ON vendors FOR SELECT
  USING (true);

CREATE POLICY "Everyone can insert vendors"
  ON vendors FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Everyone can view clients"
  ON clients FOR SELECT
  USING (true);

CREATE POLICY "Everyone can insert clients"
  ON clients FOR INSERT
  WITH CHECK (true);

-- 9. Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 10. Create trigger for deals table
CREATE TRIGGER update_deals_updated_at BEFORE UPDATE ON deals
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 11. Create indexes for better performance
CREATE INDEX IF NOT EXISTS deals_board_id_idx ON deals(board_id);
CREATE INDEX IF NOT EXISTS deals_stage_idx ON deals(stage);
CREATE INDEX IF NOT EXISTS deals_created_by_idx ON deals(created_by);
CREATE INDEX IF NOT EXISTS profiles_board_id_idx ON profiles(board_id);

-- Success! Now create your users in the Supabase Dashboard → Authentication → Users
