-- Add deal_comments table for threaded comments on deals
CREATE TABLE IF NOT EXISTS deal_comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  deal_id UUID NOT NULL REFERENCES deals(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  author_name TEXT NOT NULL,
  created_by UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for faster queries
CREATE INDEX IF NOT EXISTS deal_comments_deal_id_idx ON deal_comments(deal_id);
CREATE INDEX IF NOT EXISTS deal_comments_created_at_idx ON deal_comments(created_at DESC);

-- Enable Row Level Security
ALTER TABLE deal_comments ENABLE ROW LEVEL SECURITY;

-- RLS Policies for deal_comments
-- Users can view comments on deals they can see
CREATE POLICY "Users can view deal comments"
  ON deal_comments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM deals
      WHERE deals.id = deal_comments.deal_id
      AND (
        deals.board_id IN (SELECT board_id FROM profiles WHERE id = auth.uid())
        OR 
        EXISTS (
          SELECT 1 FROM profiles 
          WHERE id = auth.uid() 
          AND role IN ('associate', 'director')
        )
      )
    )
  );

-- Users can create comments on deals they can see
CREATE POLICY "Users can create deal comments"
  ON deal_comments FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM deals
      WHERE deals.id = deal_comments.deal_id
      AND (
        deals.board_id IN (SELECT board_id FROM profiles WHERE id = auth.uid())
        OR 
        EXISTS (
          SELECT 1 FROM profiles 
          WHERE id = auth.uid() 
          AND role IN ('associate', 'director')
        )
      )
    )
  );

-- Users can only delete their own comments
CREATE POLICY "Users can delete own deal comments"
  ON deal_comments FOR DELETE
  USING (created_by = auth.uid());

-- Add trigger for updated_at
CREATE OR REPLACE FUNCTION update_deal_comments_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER deal_comments_updated_at
  BEFORE UPDATE ON deal_comments
  FOR EACH ROW
  EXECUTE FUNCTION update_deal_comments_updated_at();

-- Add comment
COMMENT ON TABLE deal_comments IS 'Comments/notes on individual deals with author tracking and timestamps';
