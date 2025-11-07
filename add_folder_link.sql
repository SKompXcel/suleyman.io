-- Add folder_link column to deals table
ALTER TABLE deals ADD COLUMN IF NOT EXISTS folder_link TEXT;

-- Add comment to explain the column
COMMENT ON COLUMN deals.folder_link IS 'Link to folder funding folder containing deal files';
