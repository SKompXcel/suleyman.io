# Troubleshooting: "Stuck" or Unresponsive Operations

## Problem
Sometimes when trying to create, update, or delete deals, the operation gets stuck and nothing happens. This is caused by Row-Level Security (RLS) policies blocking the operation.

## Solution

### Step 1: Run the RLS Policy Fix
1. Open **Supabase Dashboard** → SQL Editor
2. Run the SQL in `fix_rls_policies.sql`
3. This will recreate all RLS policies with proper permissions

### Step 2: Verify Permissions
After running the fix, test these operations for each user type:

#### Edwin (Account Manager - edwin board)
- ✅ Can create deals on Edwin's board
- ✅ Can edit deals on Edwin's board
- ✅ Can delete deals on Edwin's board
- ❌ CANNOT see Elizabeth's board (should only see his own)
- ✅ Can add board notes to Edwin's board

#### Elizabeth (Account Manager - elizabeth board)
- ✅ Can create deals on Elizabeth's board
- ✅ Can edit deals on Elizabeth's board
- ✅ Can delete deals on Elizabeth's board
- ❌ CANNOT see Edwin's board (should only see her own)
- ✅ Can add board notes to Elizabeth's board

#### Associate (e.g., skiani@mhccna.com)
- ✅ Can switch between Edwin's and Elizabeth's boards
- ✅ Can create deals on BOTH boards
- ✅ Can edit deals on BOTH boards
- ✅ Can delete deals on BOTH boards
- ✅ Can add board notes to BOTH boards
- ✅ Can view all notes on both boards

#### Director (e.g., Siraaj - sgrewal@mhccna.com)
- ✅ Can switch between Edwin's and Elizabeth's boards
- ✅ Can create deals on BOTH boards
- ✅ Can edit deals on BOTH boards
- ✅ Can delete deals on BOTH boards
- ✅ Can add board notes to BOTH boards
- ✅ Can view all notes on both boards

### Step 3: Debug Information
The code now includes better error logging. If an operation fails:

1. **Open Browser Console** (F12 → Console tab)
2. Look for error messages that show:
   - `Error adding deal:` or `Error updating deal:`
   - Error details with the specific issue
3. Common error messages:
   - `"new row violates row-level security policy"` - RLS blocking operation
   - `"column does not exist"` - Database schema mismatch
   - `"permission denied"` - Authentication issue

### Step 4: Common Fixes

#### If deals won't create:
1. Check you're logged in (not expired session)
2. Verify RLS policies are updated
3. Check browser console for specific error
4. Try logging out and back in

#### If deals won't update:
1. Make sure you have permission for that board
2. Check if you're trying to update a deal on another manager's board (only associates/directors can do this)
3. Verify the deal exists in the database

#### If deals won't delete:
1. Same permissions as update
2. Check browser console for specific error
3. Confirm the delete confirmation dialog appeared

#### If board notes won't save:
1. Make sure you have permission to view that board
2. Check you're not trying to add empty notes
3. Verify you're on the correct board

### Step 5: Verify Database State

Run these queries in Supabase SQL Editor to check:

```sql
-- Check your profile
SELECT * FROM profiles WHERE id = auth.uid();

-- Check RLS policies are active
SELECT schemaname, tablename, policyname, permissive, roles, cmd
FROM pg_policies
WHERE tablename IN ('deals', 'board_notes', 'vendors', 'clients', 'profiles')
ORDER BY tablename, policyname;

-- Test deal visibility (should see deals based on your role)
SELECT id, board_id, vendor, client, stage
FROM deals
LIMIT 10;
```

## What Changed

### Database (fix_rls_policies.sql)
- ✅ Fixed all RLS policies for deals table
- ✅ Fixed all RLS policies for board_notes table
- ✅ Added policies for vendors and clients tables
- ✅ Added policy for profiles table
- ✅ Used `EXISTS` subqueries for better performance
- ✅ Separated USING and WITH CHECK clauses for UPDATE policies

### Frontend (deals.jsx)
- ✅ Added detailed error logging to console
- ✅ Shows specific error messages in alerts
- ✅ Checks errors at each step (vendor, client, deal)
- ✅ Logs error details as JSON for debugging

## Prevention
- Always log out/in after making database changes
- Keep browser console open during testing
- Test with all 4 user types after changes
- Run RLS policy fix after any schema changes
