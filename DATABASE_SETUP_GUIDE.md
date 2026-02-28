# 🗄️ Database Setup & Configuration Guide

## 📋 Overview

This guide provides step-by-step instructions for setting up the Supabase database for the Almaadeena Stock supermarket management system.

---

## 🎯 Files Included

| File | Purpose |
|------|---------|
| `DATABASE_SCHEMA.sql` | Creates all database tables, relationships, security policies, and functions |
| `ADMIN_USER_SETUP.sql` | Creates the admin account and sample data |
| `DATABASE_SETUP_GUIDE.md` | This file - Setup instructions |

---

## 📊 Database Tables Created

### Core Tables
1. **users** - User accounts and authentication
2. **user_profiles** - Extended user information
3. **user_roles** - Role definitions
4. **user_permissions** - Role-based permissions
5. **activity_logs** - Audit trail
6. **login_history** - Login tracking
7. **user_sessions** - Session management
8. **user_devices** - Trusted device management
9. **notification_preferences** - User notification settings

---

## 🚀 Quick Start (5 Minutes)

### Step 1: Go to Supabase Dashboard
1. Open [https://supabase.com](https://supabase.com)
2. Login to your project
3. Click **SQL Editor** on the left sidebar

### Step 2: Create Schema
1. Click **New Query**
2. Open the file: `DATABASE_SCHEMA.sql`
3. Copy all content
4. Paste into SQL Editor
5. Click **Run** button
6. ✅ Wait for "Success" message (should take 2-3 seconds)

### Step 3: Create Admin User
1. Click **New Query** again
2. Open the file: `ADMIN_USER_SETUP.sql`
3. Copy all content
4. Paste into SQL Editor
5. Click **Run** button
6. ✅ Should show admin user created

### Step 4: Test Login
1. Go to your application
2. Click **Admin Login**
3. Enter credentials:
   - **Email**: `admin@almadeenastock.com`
   - **Password**: `Akhi@5656`
4. ✅ Should login successfully

---

## 📝 Detailed Setup Instructions

### Prerequisites
- ✅ Supabase account (free tier works)
- ✅ Project created
- ✅ Access to SQL Editor
- ✅ Database connection working

### Phase 1: Database Schema Creation

#### Option A: Using Supabase Console (Recommended)

```
1. Login to Supabase → Your Project
2. Click "SQL Editor" in sidebar
3. Click "+ New Query"
4. Copy content from DATABASE_SCHEMA.sql
5. Paste into editor
6. Click "Run" (blue button top-right)
7. Wait for completion (2-3 seconds)
8. Check "Success" message appears
```

#### Option B: Using psql Command Line

```bash
# Download the file locally
curl -O https://your-repo/DATABASE_SCHEMA.sql

# Connect and run
psql "postgresql://username:password@db.supabase.co:5432/postgres" < DATABASE_SCHEMA.sql

# Or with connection string
psql $DATABASE_URL < DATABASE_SCHEMA.sql
```

#### Option C: Using DBeaver

```
1. In DBeaver, right-click your Supabase connection
2. Click "Execute SQL Script"
3. Select DATABASE_SCHEMA.sql
4. Click "Execute"
5. Monitor output in Results tab
```

### Phase 2: Admin User Creation

#### Execute Admin Setup Script

```sql
-- In Supabase SQL Editor:
-- Click "+ New Query"
-- Copy entire ADMIN_USER_SETUP.sql content
-- Click "Run"
```

**Expected Output:**
```
id | uuid | email | role | name | is_verified
---+------+-------+------+------+-------------
 1 | xxxx | admin@almadeenastock.com | Admin | Sahad | true
```

### Phase 3: Verification

Run these queries to verify everything is set up:

#### Check Users Table
```sql
SELECT id, name, email, role, status, is_verified, created_at 
FROM users 
ORDER BY created_at DESC;
```

#### Check Admin User
```sql
SELECT 
  u.id,
  u.name,
  u.email,
  u.role,
  u.status,
  u.is_verified,
  p.employee_id,
  p.department
FROM users u
LEFT JOIN user_profiles p ON u.id = p.user_id
WHERE u.email = 'admin@almadeenastock.com';
```

#### Count Tables Created
```sql
SELECT COUNT(*) as table_count 
FROM information_schema.tables 
WHERE table_schema = 'public';
```

Expected: **9 tables** (users, user_profiles, user_roles, user_permissions, activity_logs, login_history, user_sessions, user_devices, notification_preferences)

#### Verify Indexes
```sql
SELECT COUNT(DISTINCT indexname) as index_count 
FROM pg_indexes 
WHERE schemaname = 'public';
```

#### Check RLS Policies
```sql
SELECT tablename, policyname, qual, with_check 
FROM pg_policies 
WHERE schemaname = 'public';
```

---

## 🔐 Admin User Details

### Created Admin Account

```
Name: Sahad
Email: admin@almadeenastock.com
Password: Akhi@5656
Role: Admin
Status: Active / Verified
```

### Login Steps
1. Open application
2. Click **Admin Login**
3. Enter email: `admin@almadeenastock.com`
4. Enter password: `Akhi@5656`
5. Click **Login**

### First Actions
⚠️ **IMPORTANT**: After first login as admin:
1. ✅ Change password immediately
2. ✅ Use strong, unique password
3. ✅ Enable two-factor authentication
4. ✅ Configure system settings
5. ✅ Create additional user accounts from dashboard

---

## 📋 User Roles Explained

### Admin (Sahad)
- **Full System Access**
- Create/Edit/Delete users
- Manage all settings
- View all reports
- Access audit logs
- Cannot be blocked by non-admins

### Manager
- **Operational Control**
- Create and manage staff
- View daily reports
- Manage customer relationships
- See sales analytics
- Cannot access system settings

### Cashier
- **POS Operations**
- Create bills
- View products
- Process payments
- Basic reports only
- Cannot manage users

### Staff
- **Limited Features**
- Help customers
- View products
- Assist with billing
- Cannot modify any data

---

## 🔑 Additional Users

### Creating New Users Via Dashboard

1. **Login as Admin**
2. **Navigate to**: User Management
3. **Click**: ➕ Add User
4. **Fill Form**:
   - Name: Required
   - Email: Required (unique)
   - Role: Select from dropdown
   - Status: Active/Blocked
5. **Click**: Create User
6. **User is created** with default password sent to email

### Creating Users Via SQL (Advanced)

```sql
-- Method 1: Using hash_password function
INSERT INTO users (
  name,
  email,
  password_hash,
  role,
  status,
  is_verified,
  verified_at
) VALUES (
  'John Manager',
  'john@almadeenastock.com',
  crypt('JohnPass123!', gen_salt('bf')),
  'Manager',
  'active',
  TRUE,
  CURRENT_TIMESTAMP
) 
ON CONFLICT (email) DO NOTHING
RETURNING id, email, role, created_at;

-- Method 2: Create user profile afterwards
INSERT INTO user_profiles (
  user_id,
  first_name,
  last_name,
  employee_id,
  department,
  designation
) 
SELECT 
  id,
  'John',
  'Manager',
  'MGR001',
  'Operations',
  'Store Manager'
FROM users 
WHERE email = 'john@almadeenastock.com'
AND NOT EXISTS (SELECT 1 FROM user_profiles WHERE user_id = users.id);
```

---

## 🔒 Security Features

### Password Security
- ✅ Passwords hashed with bcrypt (pgcrypto)
- ✅ Never stored in plain text
- ✅ Salted with random data
- ✅ One-way encryption

### Row Level Security (RLS)
- ✅ Users can only see their own data
- ✅ Admins can see all data
- ✅ Activity logs properly restricted
- ✅ Policies enforced at database level

### Audit Trail
- ✅ All user actions logged
- ✅ Login attempts recorded
- ✅ Failed logins tracked
- ✅ IP addresses captured

### Account Management
- ✅ Account blocking available
- ✅ Verification status tracking
- ✅ Failed login lockout (configurable)
- ✅ Session management
- ✅ Device trust system

---

## 📊 Database Schema Overview

```
┌─────────────────────────────────────────────┐
│              USERS TABLE                    │
├─────────────────────────────────────────────┤
│ • id (PK)                                   │
│ • uuid (unique)                             │
│ • name                                      │
│ • email (unique)                            │
│ • password_hash                             │
│ • role (Admin/Manager/Cashier/Staff)       │
│ • status (active/blocked/inactive)         │
│ • is_verified                               │
│ • verified_at                               │
│ • login_count                               │
│ • last_login                                │
│ • created_at, updated_at                    │
└─────────────────────────────────────────────┘
           ↓ (1:1 relationship)
┌─────────────────────────────────────────────┐
│         USER_PROFILES TABLE                 │
├─────────────────────────────────────────────┤
│ • user_id (FK)                             │
│ • first_name, last_name                    │
│ • phone, emergency_contact                 │
│ • address fields                           │
│ • employee_id, department                  │
│ • bank details                             │
│ • identification                           │
│ • preferences (JSONB)                      │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│    SUPPORTING TABLES                        │
├─────────────────────────────────────────────┤
│ • user_roles                                │
│ • user_permissions                          │
│ • activity_logs                             │
│ • login_history                             │
│ • user_sessions                             │
│ • user_devices                              │
│ • notification_preferences                  │
└─────────────────────────────────────────────┘
```

---

## 🔧 Common Tasks

### Change Admin Password

```sql
UPDATE users 
SET password_hash = crypt('NewSecurePassword123!', gen_salt('bf')), 
    updated_at = CURRENT_TIMESTAMP
WHERE email = 'admin@almadeenastock.com';
```

### Block a User

```sql
UPDATE users 
SET status = 'blocked', updated_at = CURRENT_TIMESTAMP
WHERE email = 'cashier@almadeenastock.com';
```

### Unblock a User

```sql
UPDATE users 
SET status = 'active', updated_at = CURRENT_TIMESTAMP
WHERE email = 'cashier@almadeenastock.com';
```

### View User Login History

```sql
SELECT 
  lh.login_at,
  lh.login_status,
  lh.ip_address,
  u.name,
  u.email
FROM login_history lh
JOIN users u ON lh.user_id = u.id
WHERE u.email = 'admin@almadeenastock.com'
ORDER BY lh.login_at DESC
LIMIT 10;
```

### View User Activity Log

```sql
SELECT 
  al.created_at,
  al.action,
  al.resource_type,
  al.description,
  u.name
FROM activity_logs al
JOIN users u ON al.user_id = u.id
WHERE u.email = 'admin@almadeenastock.com'
ORDER BY al.created_at DESC
LIMIT 20;
```

### Reset Failed Login Count

```sql
UPDATE users 
SET failed_login_attempts = 0, 
    locked_until = NULL,
    updated_at = CURRENT_TIMESTAMP
WHERE email = 'admin@almadeenastock.com';
```

### Get User Statistics

```sql
SELECT 
  role,
  COUNT(*) as user_count,
  SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END) as active_count,
  SUM(CASE WHEN is_verified THEN 1 ELSE 0 END) as verified_count
FROM users
GROUP BY role
ORDER BY role;
```

---

## ⚙️ Configuration

### Enable Extensions

The scripts automatically enable:
- `pgcrypto` - For password hashing

```sql
CREATE EXTENSION IF NOT EXISTS pgcrypto;
```

### Set Up Triggers

Triggers automatically created for:
- `update_updated_at_column()` - Auto-update timestamps

### Configure RLS (Row Level Security)

Already configured with policies:
- Users see only their own data
- Admins see all data
- Activity logs restricted

---

## 🔍 Troubleshooting

### Issue: Error "relation already exists"

**Cause**: Schema already created
**Solution**: 
- Either use `IF NOT EXISTS` (already in script)
- Or drop all tables first: `DROP SCHEMA public CASCADE;`

### Issue: "Permission denied" for RLS

**Cause**: RLS policies blocking query
**Solution**:
- Disable RLS for testing: `ALTER TABLE users DISABLE ROW LEVEL SECURITY;`
- Re-enable after: `ALTER TABLE users ENABLE ROW LEVEL SECURITY;`

### Issue: Password hash not working

**Cause**: pgcrypto not enabled
**Solution**:
```sql
CREATE EXTENSION pgcrypto;
-- Then try again
```

### Issue: Can't login with credentials

**Cause**: Multiple possibilities
**Solutions**:
1. Check user exists: `SELECT * FROM users WHERE email = 'admin@almadeenastock.com';`
2. Verify is_active = TRUE
3. Check status = 'active' (not 'blocked')
4. Verify password with: 
```sql
SELECT crypt('Akhi@5656', password_hash) = password_hash FROM users WHERE email = 'admin@almadeenastock.com';
```

### Issue: SQL script won't execute

**Cause**: Syntax error or database issue
**Solution**:
1. Check connection to Supabase
2. Click "Clear" and try again
3. Check for special characters in SQL
4. Try running line by line

---

## 📈 Next Steps

### 1. Verify Setup (Do This First!)
- [ ] Login with admin credentials
- [ ] Check User Management module shows no errors
- [ ] Verify database tables exist

### 2. Create Additional Users
- [ ] Open Admin Dashboard
- [ ] Go to User Management
- [ ] Create Manager account
- [ ] Create Cashier accounts
- [ ] Test their logins

### 3. Configure Application
- [ ] Update API endpoints to use Supabase
- [ ] Test all CRUD operations
- [ ] Verify authentication flow
- [ ] Test role-based access

### 4. Production Setup
- [ ] Enable 2FA for admin
- [ ] Change default passwords
- [ ] Enable RLS policies
- [ ] Set up backups
- [ ] Enable audit logging

### 5. Ongoing Maintenance
- [ ] Monitor activity logs
- [ ] Review failed logins
- [ ] Backup database regularly
- [ ] Update user permissions
- [ ] Archive old logs

---

## 📞 Support & Help

### Resources
- 📘 [Supabase Documentation](https://supabase.com/docs)
- 🔐 [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- 💬 [Supabase Community](https://supabase.com/community)

### Common Questions

**Q: Can I change the admin email?**
A: Yes, use `UPDATE users SET email = 'new@email.com' WHERE id = 1;`

**Q: How do I backup the database?**
A: Supabase auto-backups, but you can export via `pg_dump` command

**Q: Can users have multiple roles?**
A: Currently single role per user. Use `user_permissions` table to extend

**Q: How often should I backup?**
A: Supabase backs up hourly. Do manual export before major changes

**Q: Can I migrate data from another system?**
A: Yes! Use `INSERT INTO` statements to import existing user data

---

## ✅ Verification Checklist

After setup, verify:

- [ ] All 9 tables created
- [ ] 20+ indexes created
- [ ] RLS policies active
- [ ] Admin user created
- [ ] Admin profile created
- [ ] Notification preferences set
- [ ] User roles configured
- [ ] Can login with admin credentials
- [ ] Activity logging works
- [ ] Password hashing enabled

---

## 🎉 Success!

If you've completed all steps and can:
1. ✅ Login with admin credentials
2. ✅ See User Management module
3. ✅ Create new users
4. ✅ No database errors

**Then your database is ready for production!** 🚀

---

**Last Updated**: February 27, 2026  
**Version**: 1.0.0  
**Status**: Production Ready ✅
