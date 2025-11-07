# MHCCA Deal Board - Authentication Implementation Plan

## Current Status
✅ Multi-board system built  
❌ Mock login (no real authentication)  
❌ No password protection  
❌ Anyone can access any account  

## Recommended Solution: **Supabase Authentication**

### Why Supabase?
- ✅ Built-in secure authentication (industry-standard)
- ✅ Email/password login with proper hashing
- ✅ Row-level security (users only see their own data)
- ✅ Free tier: 50,000 monthly active users
- ✅ Takes ~10 minutes to set up
- ✅ Automatic session management
- ✅ Can add 2FA later if needed

---

## Implementation Steps

### Step 1: Set Up Supabase (5 minutes)
1. Go to [supabase.com](https://supabase.com)
2. Create free account
3. Create new project: "mhcca-deals"
4. Wait for database to provision (~2 minutes)
5. Copy your project URL and anon key

### Step 2: Database Schema (2 minutes)
```sql
-- Users table (Supabase creates auth.users automatically)
-- We just need a profiles table to link to boards

CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('account-manager', 'associate')),
  board_id TEXT CHECK (board_id IN ('edwin', 'elizabeth')),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Deals table (same structure, but with board_id and user ownership)
CREATE TABLE deals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  board_id TEXT NOT NULL,
  vision_number TEXT,
  vendor TEXT NOT NULL,
  client TEXT NOT NULL,
  stage TEXT NOT NULL,
  assigned_to TEXT NOT NULL,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id)
);

-- Vendors and Clients (shared across boards)
CREATE TABLE vendors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE clients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Step 3: Row-Level Security (Critical!)
```sql
-- Users can only see deals on their board
ALTER TABLE deals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users see their own board deals"
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

-- Similar policies for UPDATE and DELETE
```

### Step 4: Create User Accounts
```sql
-- In Supabase Dashboard > Authentication > Users
-- Manually add:

1. Edwin:
   - Email: edwin@mhcca.com
   - Password: (set secure password)
   - Then add to profiles:
     INSERT INTO profiles (id, email, full_name, role, board_id)
     VALUES ('[edwin-user-id]', 'edwin@mhcca.com', 'Edwin', 'account-manager', 'edwin');

2. Elizabeth:
   - Email: elizabeth@mhcca.com
   - Password: (set secure password)
   - Then add to profiles:
     INSERT INTO profiles (id, email, full_name, role, board_id)
     VALUES ('[elizabeth-user-id]', 'elizabeth@mhcca.com', 'Elizabeth', 'account-manager', 'elizabeth');

3. You (Associate):
   - Email: associate@mhcca.com
   - Password: (set secure password)
   - Then add to profiles:
     INSERT INTO profiles (id, email, full_name, role, board_id)
     VALUES ('[your-user-id]', 'associate@mhcca.com', 'Associate', 'associate', NULL);
```

### Step 5: Install Dependencies
```bash
npm install @supabase/supabase-js @supabase/auth-helpers-nextjs
```

### Step 6: Environment Variables
```bash
# .env.local
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

---

## Code Changes Overview

### Files to Modify:
1. `/src/pages/deals.jsx` - Add Supabase auth, load deals from database
2. `/src/pages/login.jsx` - NEW: Login page with email/password form
3. `/src/lib/supabase.js` - NEW: Supabase client configuration
4. `/src/pages/_app.jsx` - Add auth session provider

### What Changes:
- ❌ Remove: Mock login modal with user selection
- ❌ Remove: localStorage for deals (move to database)
- ✅ Add: Real login page with username/password
- ✅ Add: Session management (stays logged in)
- ✅ Add: Protected routes (redirect to login if not authenticated)
- ✅ Add: Database queries instead of localStorage

---

## Security Features You'll Get:

✅ **Password Hashing**: Bcrypt encryption (industry standard)  
✅ **Session Tokens**: Secure JWT tokens  
✅ **HTTPS Only**: Credentials only sent over encrypted connections  
✅ **Row-Level Security**: Database enforces access rules  
✅ **CSRF Protection**: Built into Supabase auth  
✅ **Rate Limiting**: Prevents brute force attacks  

---

## Migration Path:

### Migrate Existing localStorage Deals:
```javascript
// One-time migration script
const migrateToSupabase = async () => {
  const edwinDeals = JSON.parse(localStorage.getItem('mhcca-deals-edwin') || '[]')
  const elizabethDeals = JSON.parse(localStorage.getItem('mhcca-deals-elizabeth') || '[]')
  
  // Insert into Supabase
  await supabase.from('deals').insert(edwinDeals)
  await supabase.from('deals').insert(elizabethDeals)
  
  console.log('Migration complete!')
}
```

---

## Next Steps:

**Ready to implement? I need from you:**

1. ✅ Approval to proceed with Supabase
2. ⏳ Create Supabase account and project
3. ⏳ Share your Supabase URL and anon key
4. ⏳ What email addresses to use for Edwin, Elizabeth, and yourself?

**Then I'll:**
1. Install dependencies
2. Create login page
3. Connect to Supabase
4. Migrate your existing deals
5. Add row-level security
6. Test everything

**Estimated Time:** 30 minutes total (10 min setup + 20 min implementation)

