-- Create board_notes table for board-specific notes
CREATE TABLE IF NOT EXISTS board_notes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  board_id TEXT NOT NULL,
  content TEXT NOT NULL,
  author_name TEXT NOT NULL,
  created_by UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add index for faster queries
CREATE INDEX IF NOT EXISTS board_notes_board_id_idx ON board_notes(board_id);
CREATE INDEX IF NOT EXISTS board_notes_created_at_idx ON board_notes(created_at DESC);

-- Enable Row Level Security
ALTER TABLE board_notes ENABLE ROW LEVEL SECURITY;

-- RLS Policies for board_notes
-- Account managers can view notes on their board
-- Associates and directors can view notes on all boards
CREATE POLICY "Users can view board notes"
  ON board_notes FOR SELECT
  USING (
    board_id = (SELECT board_id FROM profiles WHERE id = auth.uid())
    OR 
    (SELECT role FROM profiles WHERE id = auth.uid()) IN ('associate', 'director')
  );

-- Account managers can create notes on their board
-- Associates and directors can create notes on all boards
CREATE POLICY "Users can create board notes"
  ON board_notes FOR INSERT
  WITH CHECK (
    board_id = (SELECT board_id FROM profiles WHERE id = auth.uid())
    OR 
    (SELECT role FROM profiles WHERE id = auth.uid()) IN ('associate', 'director')
  );

-- Users can only delete their own notes
CREATE POLICY "Users can delete own notes"
  ON board_notes FOR DELETE
  USING (created_by = auth.uid());

-- Add trigger for updated_at
CREATE OR REPLACE FUNCTION update_board_notes_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER board_notes_updated_at
  BEFORE UPDATE ON board_notes
  FOR EACH ROW
  EXECUTE FUNCTION update_board_notes_updated_at();

-- Add comment
COMMENT ON TABLE board_notes IS 'Board-specific notes for account managers to communicate and track important information';
