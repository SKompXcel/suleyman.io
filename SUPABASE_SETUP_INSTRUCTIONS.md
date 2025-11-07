# 🚀 MHCCA Deal Board - Supabase Setup Guide

## ✅ Step 1: Run the Database Schema (REQUIRED FIRST!)

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Select your project: **mhcca-deals**
3. Click on **SQL Editor** in the left sidebar
4. Click **+ New Query**
5. Copy the entire contents of `supabase_setup.sql` (in your project root)
6. Paste it into the SQL editor
7. Click **RUN** button (or press Cmd+Enter)
8. You should see "Success. No rows returned" - that's good!

---

## ✅ Step 2: Create User Accounts

### Option A: Using Supabase Dashboard (Easier)

1. In Supabase Dashboard, go to **Authentication** → **Users**
2. Click **Add User** → **Create new user**

**Create these 3 accounts:**

#### Account 1: Edwin
- **Email:** `edwin@mhcca.com` (or any email you want)
- **Password:** Choose a secure password (save it!)
- **Auto Confirm User:** ✅ Check this box
- Click **Create User**
- **COPY THE USER ID** (looks like: `123e4567-e89b-12d3-a456-426614174000`)

#### Account 2: Elizabeth  
- **Email:** `elizabeth@mhcca.com`
- **Password:** Choose a secure password (save it!)
- **Auto Confirm User:** ✅ Check this box
- Click **Create User**
- **COPY THE USER ID**

#### Account 3: Associate (You)
- **Email:** `associate@mhcca.com` (or your actual email)
- **Password:** Choose a secure password (save it!)
- **Auto Confirm User:** ✅ Check this box
- Click **Create User**
- **COPY THE USER ID**

---

## ✅ Step 3: Link Users to Their Boards

1. Go back to **SQL Editor**
2. Create a **new query**
3. Paste this SQL (replace the UUIDs with the actual User IDs you copied):

```sql
-- Replace 'EDWIN_USER_ID_HERE' with Edwin's actual UUID
INSERT INTO profiles (id, email, full_name, role, board_id)
VALUES ('93470418-b20e-4351-bd3c-3e3c3dab14ff', 'evanschepen@mhccna.com', 'Edwin', 'account-manager', 'edwin');

-- Replace 'ELIZABETH_USER_ID_HERE' with Elizabeth's actual UUID
INSERT INTO profiles (id, email, full_name, role, board_id)
VALUES ('b5c64064-7b23-4573-980b-d95b63bd3f42', 'ewylie@mhccna.com', 'Elizabeth', 'account-manager', 'elizabeth');

-- Replace 'ASSOCIATE_USER_ID_HERE' with Associate's actual UUID
INSERT INTO profiles (id, email, full_name, role, board_id)
VALUES ('20cbf529-5daa-4de6-896e-4d1441af15c3', 'skiani@mhccna.com', 'Associate', 'associate', NULL);
```

4. **RUN** the query
5. You should see "Success. 3 rows returned"

---

## ✅ Step 4: Verify Everything Works

Run this query to check your users:

```sql
SELECT 
  p.email,
  p.full_name,
  p.role,
  p.board_id
FROM profiles p;
```

You should see your 3 users with their roles and boards!

---

## ✅ Step 5: Test Login Credentials

Save these somewhere secure (like 1Password or a password manager):

```
Edwin's Login:
Email: edwin@mhcca.com
Password: [whatever you set]

Elizabeth's Login:
Email: elizabeth@mhcca.com
Password: [whatever you set]

Associate's Login:
Email: associate@mhcca.com
Password: [whatever you set]
```

---

## 🎯 Next Steps

Once you've completed Steps 1-5 above, tell me:
**"Database is set up and users are created"**

Then I'll update the code to use real authentication instead of the mock login!

---

## ⚠️ Troubleshooting

### "User already exists" error
- You may have already created these emails
- Either use different emails or delete the existing users first

### "Foreign key violation" error  
- Make sure you ran the schema SQL (Step 1) BEFORE creating users
- Make sure you're using the correct User IDs in Step 3

### Can't find User ID
- In Authentication → Users, click on the user
- The ID is shown at the top of the user details

---

## 📧 Recommended Email Addresses

Instead of `edwin@mhcca.com`, you could use:
- **Edwin:** His real work email
- **Elizabeth:** Her real work email  
- **You:** Your real email

This way they can reset passwords if needed!

