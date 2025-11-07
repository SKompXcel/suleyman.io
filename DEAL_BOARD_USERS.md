# MHCCA Deal Board - User Guide

## User Access System

### Three User Types:

#### 1. **Edwin** (Account Manager)
- Icon: 👔
- Access: Only sees Edwin's deal board
- Can: Create, edit, and manage deals on his board
- Cannot: See or switch to Elizabeth's board

#### 2. **Elizabeth** (Account Manager)  
- Icon: 👩‍💼
- Access: Only sees Elizabeth's deal board
- Can: Create, edit, and manage deals on her board
- Cannot: See or switch to Edwin's board

#### 3. **Associate** (You)
- Icon: 👤
- Access: Can view and switch between BOTH boards
- Can: 
  - Switch between Edwin's and Elizabeth's boards using the board switcher
  - Create, edit, and manage deals on either board
  - See all deals from both account managers
- Special Feature: Board switcher buttons appear in the header

---

## How It Works

### First Time Access
1. When you visit `/deals`, you'll see a login screen
2. Click your user type (Edwin, Elizabeth, or Associate)
3. Your selection is saved in localStorage

### For Edwin & Elizabeth
- Automatically see only their own board
- Board name appears in subtitle: "Edwin's Pipeline" or "Elizabeth's Pipeline"
- No board switching options shown

### For Associates
- Default view: Edwin's board
- Board switcher appears in header with two buttons:
  - 👔 Edwin (Blue when active)
  - 👩‍💼 Elizabeth (Purple when active)
- Click either button to instantly switch boards
- Your selection is remembered for next visit

---

## Data Storage

### Separate Databases
- Edwin's deals: `localStorage: mhcca-deals-edwin`
- Elizabeth's deals: `localStorage: mhcca-deals-elizabeth`
- Shared vendors: `localStorage: mhcca-vendors`
- Shared clients: `localStorage: mhcca-clients`

### What's Shared vs. Separate
**Separate (per board):**
- All deals and their stages
- Deal assignments
- Deal notes and history

**Shared (across boards):**
- Vendor autocomplete list
- Client autocomplete list

---

## Team Assignment

When creating or editing deals, you can assign to:
- 👥 Unassigned
- 👔 Edwin
- 👩‍💼 Elizabeth

This is separate from the board ownership - a deal on Edwin's board could be assigned to Elizabeth for collaboration.

---

## Logout & Switching Users

Click the "Logout" button in the top right to:
- Clear your current session
- Return to the login screen
- Switch to a different user account

---

## Current User Badge

Always visible in top right showing:
- Your icon and name
- Your role (Account Manager or Associate)

