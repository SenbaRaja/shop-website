# 🚀 Database Quick Reference Guide

## 📋 File-by-File Execution Order

```
1️⃣  DATABASE_SCHEMA.sql         ← Run FIRST (creates all tables)
2️⃣  ADMIN_USER_SETUP.sql        ← Run SECOND (creates admin user)
3️⃣  Rest of application setup   ← Proceed with app config
```

---

## ⚡ 5-Minute Quick Setup

### Step 1: Supabase SQL Editor
```
1. Go to Supabase Dashboard
2. Select your project
3. Click SQL Editor (left sidebar)
4. Click "+ New Query"
```

### Step 2: Copy & Run Schema
```
1. Open DATABASE_SCHEMA.sql
2. Select all (Ctrl+A)
3. Paste into SQL Editor
4. Click "Run" button
5. ✅ Wait for success message
```

### Step 3: Copy & Run Admin Setup
```
1. Click "+ New Query" again
2. Open ADMIN_USER_SETUP.sql
3. Select all, paste
4. Click "Run" button
5. ✅ See admin user created
```

### Step 4: Test Login
```
Email: admin@almadeenastock.com
Password: Akhi@5656
Role: Admin
Status: Verified ✓
```

---

## 🔑 Admin Account Details

```sql
Name:     Sahad
Email:    admin@almadeenastock.com
Password: Akhi@5656
Role:     Admin
Status:   Active
Verified: Yes ✓
```

---

## 📊 Tables Created

| # | Table Name | Purpose | Rows |
|---|---|---|---|
| 1 | users | User accounts & authentication | 1 (admin) |
| 2 | user_profiles | Extended user information | 1 |
| 3 | user_roles | Role definitions | 4 |
| 4 | user_permissions | Permissions per role | 10+ |
| 5 | activity_logs | Audit trail | 0 (populated on use) |
| 6 | login_history | Login tracking | 0 (populated on use) |
| 7 | user_sessions | Session management | 0 (populated on use) |
| 8 | user_devices | Device management | 0 (populated on use) |
| 9 | notification_preferences | Notification settings | 1 |

---

## 🔑 Key Fields in Users Table

```typescript
users {
  id: BIGINT PRIMARY KEY              // Auto-increment ID
  uuid: UUID                          // Universal unique ID
  name: VARCHAR(255)                  // User's display name
  email: VARCHAR(255) UNIQUE          // Must be unique
  password_hash: VARCHAR(255)         // Bcrypt hashed password
  role: VARCHAR(50)                   // Admin/Manager/Cashier/Staff
  status: VARCHAR(50)                 // active/blocked/inactive
  is_verified: BOOLEAN                // Email verified?
  verified_at: TIMESTAMP              // When verified
  login_count: INT                    // Total logins
  last_login: TIMESTAMP               // Last login time
  created_at: TIMESTAMP               // Account creation date
  updated_at: TIMESTAMP               // Last update
}
```

---

## 🔐 Password Hashing

All passwords are hashed using **bcrypt**:

```sql
-- Hashing a password
password_hash = crypt('Akhi@5656', gen_salt('bf'))

-- Verifying a password
SELECT crypt('Akhi@5656', password_hash) = password_hash
```

---

## 👥 User Roles

```
┌─────────────────┬────────────────────────────────────────┐
│ Role            │ Permissions                            │
├─────────────────┼────────────────────────────────────────┤
│ Admin           │ Everything - Full system access        │
│ Manager         │ Staff management, reports, customers   │
│ Cashier         │ POS, billing, basic reports            │
│ Staff           │ Limited - customer service only        │
└─────────────────┴────────────────────────────────────────┘
```

---

## 🔍 Useful Queries

### View All Users
```sql
SELECT id, name, email, role, status, is_verified, created_at 
FROM users 
ORDER BY created_at DESC;
```

### View Admin User
```sql
SELECT * FROM users WHERE email = 'admin@almadeenastock.com';
```

### Count Users by Role
```sql
SELECT role, COUNT(*) as count 
FROM users 
GROUP BY role 
ORDER BY count DESC;
```

### View User Profile
```sql
SELECT u.name, u.email, p.employee_id, p.department 
FROM users u
LEFT JOIN user_profiles p ON u.id = p.user_id;
```

### Check User Login History
```sql
SELECT login_at, login_status, ip_address 
FROM login_history 
WHERE user_id = 1 
ORDER BY login_at DESC 
LIMIT 10;
```

### View Activity Log
```sql
SELECT created_at, action, description 
FROM activity_logs 
WHERE user_id = 1 
ORDER BY created_at DESC 
LIMIT 20;
```

### Get User Statistics
```sql
SELECT 
  COUNT(*) as total_users,
  SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END) as active_count,
  SUM(CASE WHEN is_verified THEN 1 ELSE 0 END) as verified_count
FROM users;
```

---

## ✏️ Common Operations

### Create New User (SQL)
```sql
INSERT INTO users (name, email, password_hash, role, status, is_verified)
VALUES (
  'John Doe',
  'john@example.com',
  crypt('TempPass123!', gen_salt('bf')),
  'Cashier',
  'active',
  TRUE
);
```

### Change Password
```sql
UPDATE users 
SET password_hash = crypt('NewPass123!', gen_salt('bf'))
WHERE email = 'admin@almadeenastock.com';
```

### Block User
```sql
UPDATE users 
SET status = 'blocked'
WHERE email = 'user@example.com';
```

### Unblock User
```sql
UPDATE users 
SET status = 'active'
WHERE email = 'user@example.com';
```

### Delete User
```sql
DELETE FROM users 
WHERE email = 'user@example.com';
```

### Reset Failed Logins
```sql
UPDATE users 
SET failed_login_attempts = 0, locked_until = NULL
WHERE email = 'user@example.com';
```

---

## 🔒 Row Level Security (RLS)

**Automatically enforced:**
- Users see only their own data
- Admins see all user data
- Activity logs are restricted
- Policies at database level

**To disable RLS (testing only):**
```sql
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
```

**To re-enable RLS:**
```sql
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
```

---

## 📊 Database Verification Queries

### Verify Tables Created
```sql
SELECT COUNT(*) as table_count 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_type = 'BASE TABLE';
-- Should return: 9
```

### Verify Indexes
```sql
SELECT COUNT(DISTINCT indexname) as index_count 
FROM pg_indexes 
WHERE schemaname = 'public';
-- Should return: 10+
```

### Verify RLS Policies
```sql
SELECT COUNT(*) as policy_count 
FROM pg_policies 
WHERE schemaname = 'public';
-- Should return: 4+
```

### Verify Triggers
```sql
SELECT COUNT(*) as trigger_count 
FROM information_schema.triggers 
WHERE trigger_schema = 'public';
-- Should return: 3
```

### Verify Functions
```sql
SELECT COUNT(*) as function_count 
FROM information_schema.routines 
WHERE routine_schema = 'public';
-- Should return: 3+
```

---

## 🐛 Troubleshooting

### Login Not Working?

1. Check user exists:
```sql
SELECT * FROM users WHERE email = 'admin@almadeenastock.com';
```

2. Verify password:
```sql
SELECT crypt('Akhi@5656', password_hash) = password_hash 
FROM users 
WHERE email = 'admin@almadeenastock.com';
-- Should return: true
```

3. Check status is active:
```sql
SELECT status FROM users WHERE email = 'admin@almadeenastock.com';
-- Should return: 'active'
```

### Password Hash Error?

Enable pgcrypto:
```sql
CREATE EXTENSION IF NOT EXISTS pgcrypto;
```

### Can't Run Script?

- Check Supabase connection
- Verify SQL syntax
- Try running line by line
- Check for special characters

---

## 📅 Maintenance Queries

### Cleanup Old Sessions
```sql
DELETE FROM user_sessions 
WHERE expires_at < NOW();
```

### Cleanup Old Login History (30+ days)
```sql
DELETE FROM login_history 
WHERE login_at < NOW() - INTERVAL '30 days';
```

### Cleanup Old Activity Logs (90+ days)
```sql
DELETE FROM activity_logs 
WHERE created_at < NOW() - INTERVAL '90 days';
```

### Archive Deleted Users
```sql
SELECT * FROM users 
WHERE deleted_at IS NOT NULL 
AND deleted_at < NOW() - INTERVAL '30 days';
```

---

## 🔄 Backup Commands

### Export Users to CSV
```sql
\copy (SELECT id, name, email, role, status, created_at FROM users) 
TO 'users_backup.csv' WITH CSV HEADER;
```

### Export All Data
```bash
pg_dump "postgresql://user:pass@host:port/db" > database_backup.sql
```

### Using Supabase CLI
```bash
supabase db dump -f backup.sql
```

---

## 🚦 Status Codes

### User Status
- `active` - User can login
- `blocked` - User cannot login
- `inactive` - User archived

### Login Status
- `success` - Successful login
- `failed` - Failed attempt
- `locked` - Account locked due to failures

### Verification Status
- `verified_at IS NOT NULL` - Email verified
- `verified_at IS NULL` - Not verified

---

## 🎯 Access Levels

### Admin (Sahad - admin@almadeenastock.com)
- ✅ Create users
- ✅ Edit users
- ✅ Delete users
- ✅ View all data
- ✅ Change settings
- ✅ View audit logs

### Manager
- ✅ Create staff
- ✅ View daily reports
- ✅ Manage returns
- ❌ Cannot delete users
- ❌ Cannot access settings

### Cashier
- ✅ Create bills
- ✅ View products
- ✅ Process payments
- ❌ Cannot manage users
- ❌ Cannot view all data

### Staff
- ✅ Help customers
- ✅ View products
- ❌ Cannot make changes
- ❌ Cannot view reports

---

## 💡 Tips & Tricks

1. **Use IS NOT NULL for verification:**
   ```sql
   WHERE is_verified IS TRUE
   ```

2. **Find recently created users:**
   ```sql
   WHERE created_at > NOW() - INTERVAL '7 days'
   ```

3. **Count active users:**
   ```sql
   SELECT COUNT(*) FROM users WHERE status = 'active'
   ```

4. **List managers:**
   ```sql
   SELECT * FROM users WHERE role = 'Manager'
   ```

5. **Export user list:**
   ```sql
   SELECT name, email, role FROM users ORDER BY name
   ```

---

## 🔗 Integration Points

### For Frontend (React/TypeScript)

```typescript
// Check if user is admin
const isAdmin = user.role === 'Admin'

// Check if verified
const isVerified = user.is_verified === true

// Get user profile
const profile = user_profiles.find(p => p.user_id === user.id)
```

### For Backend (Node/API)

```javascript
// Verify password on login
const isValid = await bcrypt.compare(password, user.password_hash)

// Hash new password
const hash = await bcrypt.hash(password, 10)

// Check role permission
if (user.role === 'Admin') { /* allow */ }
```

---

## 📚 Documentation Files

- `DATABASE_SCHEMA.sql` - Full schema definition
- `ADMIN_USER_SETUP.sql` - Admin account creation
- `DATABASE_SETUP_GUIDE.md` - Detailed setup guide
- `DATABASE_QUICK_REFERENCE.md` - This file

---

## ✅ Pre-Launch Checklist

- [ ] All tables created
- [ ] Admin user created
- [ ] Can login with admin credentials
- [ ] RLS policies active
- [ ] Indexes created
- [ ] Triggers working
- [ ] Backups configured
- [ ] Application connected to database
- [ ] User creation working via dashboard
- [ ] Role-based access working

---

**Quick Setup Time: 5 minutes**  
**Files to Execute: 2**  
**Admin Created: Sahad**  
**Status: Ready for Production ✅**

---

*Last Updated: February 27, 2026*
