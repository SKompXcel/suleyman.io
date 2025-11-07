# Deal Comments Feature Setup Guide

## Overview
The deal notes have been upgraded to a threaded comment system similar to the board notes. Each deal now has a dedicated comments section showing:
- Author name with avatar
- Timestamp (date and time)
- Comment content
- Delete button (for own comments)

## Database Setup Required

### Step 1: Create the deal_comments table
Run this SQL in your Supabase SQL Editor:

```sql
-- Located in: add_deal_comments.sql
```

This will:
- Create the `deal_comments` table with proper structure
- Set up Row Level Security (RLS) policies
- Add indexes for performance
- Create triggers for timestamp updates

## Features

### Comment System
1. **Threaded Comments**: Each deal can have multiple comments
2. **Author Tracking**: Shows who posted each comment
3. **Timestamps**: Full date and time for each comment
4. **Real-time Updates**: Comments load when you open a deal
5. **User Avatar**: First letter of author name in a colored circle
6. **Delete Own Comments**: Users can only delete their own comments

### UI Changes
- Old "Notes" textarea has been replaced with a comment system
- Comments are displayed in reverse chronological order (newest first)
- Keyboard shortcut: Press `⌘+Enter` to post a comment quickly
- Maximum height with scrolling for many comments
- Empty state message when no comments exist

### Backward Compatibility
- The old `notes` field still exists in the database
- Existing notes won't be lost
- You can migrate old notes to comments if needed

## Migration Steps

### 1. Run the SQL Script
```bash
# In Supabase Dashboard:
# 1. Go to SQL Editor
# 2. Create a new query
# 3. Copy contents from add_deal_comments.sql
# 4. Run the query
```

### 2. Test the Feature
1. Open an existing deal in edit mode
2. The comments section will load at the bottom
3. Try adding a comment
4. Verify the author name and timestamp appear correctly
5. Test deleting a comment

### 3. (Optional) Migrate Old Notes
If you have existing deals with notes in the old `notes` field, you can migrate them to comments:

```sql
-- Create comments from existing notes
INSERT INTO deal_comments (deal_id, content, author_name, created_by)
SELECT 
  id as deal_id,
  notes as content,
  'System Migration' as author_name,
  (SELECT id FROM auth.users LIMIT 1) as created_by
FROM deals
WHERE notes IS NOT NULL AND notes != '';
```

## How It Works

### When You Open a Deal:
1. Modal opens and triggers `fetchDealComments()`
2. Comments are loaded from database
3. Displayed in reverse chronological order

### When You Add a Comment:
1. Type in the textarea
2. Click "Post" or press `⌘+Enter`
3. Comment is saved to database with your name and timestamp
4. Appears immediately at the top of the list

### When You Delete a Comment:
1. Click the trash icon
2. Confirm deletion
3. Comment is removed from database and UI

## RLS Policies

The deal_comments table has three policies:

1. **View Comments**: Users can see comments on deals they can access
   - Account managers see comments on their board's deals
   - Associates and directors see comments on all deals

2. **Create Comments**: Users can add comments to deals they can access
   - Same visibility rules as viewing

3. **Delete Comments**: Users can only delete their own comments
   - Based on `created_by` field matching `auth.uid()`

## Troubleshooting

### Comments Not Loading?
- Check browser console for errors
- Verify the `deal_comments` table exists in Supabase
- Ensure RLS policies are enabled

### Can't Post Comments?
- Check if you're logged in
- Verify RLS policies allow INSERT for your role
- Check browser console for error messages

### Comments Show Wrong Author?
- Verify your profile has `full_name` set
- Check the `profiles` table in Supabase

## Technical Details

### Database Schema
```sql
deal_comments (
  id UUID PRIMARY KEY,
  deal_id UUID REFERENCES deals(id),
  content TEXT,
  author_name TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)
```

### Component Updates
- File: `src/pages/deals.jsx`
- Added state: `dealComments`, `newComment`
- Added functions: `fetchDealComments`, `addDealComment`, `deleteDealComment`
- Updated `DealModal` to display threaded comments
- Used `useCallback` to optimize performance
