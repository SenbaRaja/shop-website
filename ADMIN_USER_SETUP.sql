-- ============================================
-- 👤 ADMIN USER CREATION & SETUP
-- ============================================
-- File: ADMIN_USER_SETUP.sql
-- For: Initial Admin Account Setup
-- Date: February 27, 2026

-- ============================================
-- ⚠️ IMPORTANT SECURITY NOTES
-- ============================================
-- 1. NEVER store plain text passwords in database
-- 2. Always use bcrypt or similar for password hashing
-- 3. This script uses PostgreSQL's pgcrypto extension
-- 4. **IMPORTANT**: Change password after first login
-- 5. Use strong, unique passwords in production

-- ============================================
-- 1️⃣ CREATE ADMIN USER - SAHAD
-- ============================================

-- Option A: Using PostgreSQL pgcrypto crypt() function
INSERT INTO users (
  name,
  email,
  password_hash,
  role,
  status,
  is_verified,
  verified_at,
  is_active,
  login_count,
  created_at,
  updated_at
) VALUES (
  'Sahad',
  'admin@almadeenastock.com',
  crypt('Akhi@5656', gen_salt('bf')),
  'Admin',
  'active',
  TRUE,
  CURRENT_TIMESTAMP,
  TRUE,
  0,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
) ON CONFLICT (email) DO UPDATE SET
  password_hash = EXCLUDED.password_hash,
  status = EXCLUDED.status,
  is_verified = EXCLUDED.is_verified,
  verified_at = EXCLUDED.verified_at
RETURNING id, uuid, email, role, name, is_verified;

-- ============================================
-- 2️⃣ CREATE USER PROFILE FOR ADMIN
-- ============================================

-- Get the user ID from the inserted user
-- Then insert the profile

INSERT INTO user_profiles (
  user_id,
  first_name,
  last_name,
  phone_primary,
  employee_id,
  department,
  designation,
  date_of_joining,
  address_line_1,
  city,
  state,
  country,
  created_at,
  updated_at
) 
SELECT 
  id,
  'Sahad',
  '',
  '',
  'ADMIN001',
  'Administration',
  'Administrator',
  CURRENT_DATE,
  'Almaadeena Stock',
  'Dubai',
  'Dubai',
  'UAE',
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
FROM users 
WHERE email = 'admin@almadeenastock.com'
AND NOT EXISTS (
  SELECT 1 FROM user_profiles 
  WHERE user_id = users.id
)
RETURNING id, user_id;

-- ============================================
-- 3️⃣ CREATE NOTIFICATION PREFERENCES
-- ============================================

INSERT INTO notification_preferences (
  user_id,
  email_low_stock,
  email_payment_alert,
  email_daily_report,
  email_security_alerts,
  sms_alerts,
  app_notifications,
  digest_frequency
)
SELECT 
  id,
  TRUE,
  TRUE,
  TRUE,
  TRUE,
  FALSE,
  TRUE,
  'immediate'
FROM users 
WHERE email = 'admin@almadeenastock.com'
AND NOT EXISTS (
  SELECT 1 FROM notification_preferences 
  WHERE user_id = users.id
)
RETURNING id, user_id;

-- ============================================
-- 4️⃣ VERIFY ADMIN USER CREATION
-- ============================================

-- Run this query to verify the admin was created
SELECT 
  u.id,
  u.uuid,
  u.name,
  u.email,
  u.role,
  u.status,
  u.is_verified,
  u.verified_at,
  u.created_at,
  u.login_count,
  CASE WHEN p.id IS NOT NULL THEN 'Yes' ELSE 'No' END as has_profile,
  CASE WHEN np.id IS NOT NULL THEN 'Yes' ELSE 'No' END as has_notifications
FROM users u
LEFT JOIN user_profiles p ON u.id = p.user_id
LEFT JOIN notification_preferences np ON u.id = np.user_id
WHERE u.email = 'admin@almadeenastock.com';

-- ============================================
-- 5️⃣ TEST PASSWORD VERIFICATION
-- ============================================

-- Test if password works (should return TRUE)
-- Note: Use this query to verify login credentials
SELECT 
  u.id,
  u.name,
  u.email,
  u.role,
  -- Test password verification
  CASE 
    WHEN crypt('Akhi@5656', u.password_hash) = u.password_hash THEN 'Password Match ✓'
    ELSE 'Password Mismatch ✗'
  END as password_status
FROM users u
WHERE u.email = 'admin@almadeenastock.com';

-- ============================================
-- 6️⃣ SAMPLE DATA: OTHER USERS (FOR REFERENCE)
-- ============================================
-- The admin will create other users via the dashboard
-- But here are sample SQL statements for reference

-- Comment out the lines below if you want sample users
/*

-- Example: Create a Manager user
INSERT INTO users (
  name,
  email,
  password_hash,
  role,
  status,
  is_verified,
  verified_at,
  is_active
) VALUES (
  'Jane Smith',
  'jane.manager@almadeenastock.com',
  crypt('ManagerPass123!', gen_salt('bf')),
  'Manager',
  'active',
  TRUE,
  CURRENT_TIMESTAMP,
  TRUE
) 
ON CONFLICT (email) DO NOTHING
RETURNING id, email, role;

-- Example: Create a Cashier user
INSERT INTO users (
  name,
  email,
  password_hash,
  role,
  status,
  is_verified,
  verified_at,
  is_active
) VALUES (
  'John Cashier',
  'john.cashier@almadeenastock.com',
  crypt('CashierPass123!', gen_salt('bf')),
  'Cashier',
  'active',
  TRUE,
  CURRENT_TIMESTAMP,
  TRUE
) 
ON CONFLICT (email) DO NOTHING
RETURNING id, email, role;

-- Example: Create a Staff user
INSERT INTO users (
  name,
  email,
  password_hash,
  role,
  status,
  is_verified,
  verified_at,
  is_active
) VALUES (
  'Mary Staff',
  'mary.staff@almadeenastock.com',
  crypt('StaffPass123!', gen_salt('bf')),
  'Staff',
  'active',
  TRUE,
  CURRENT_TIMESTAMP,
  TRUE
) 
ON CONFLICT (email) DO NOTHING
RETURNING id, email, role;

*/

-- ============================================
-- 7️⃣ USEFUL ADMIN QUERIES
-- ============================================

-- List all users
-- SELECT id, name, email, role, status, is_verified, created_at FROM users ORDER BY created_at DESC;

-- List all admins
-- SELECT id, name, email, status FROM users WHERE role = 'Admin';

-- List active users
-- SELECT id, name, email, role, status FROM users WHERE status = 'active' ORDER BY created_at;

-- Get user with profile info
-- SELECT u.name, u.email, u.role, p.employee_id, p.department, p.designation FROM users u
-- LEFT JOIN user_profiles p ON u.id = p.user_id;

-- View login history for a user
-- SELECT * FROM login_history WHERE user_id = (SELECT id FROM users WHERE email = 'admin@almadeenastock.com') ORDER BY login_at DESC LIMIT 10;

-- View activity logs for a user
-- SELECT * FROM activity_logs WHERE user_id = (SELECT id FROM users WHERE email = 'admin@almadeenastock.com') ORDER BY created_at DESC LIMIT 10;

-- Get role-wise user count
-- SELECT role, COUNT(*) as count FROM users GROUP BY role;

-- Get status-wise user count
-- SELECT status, COUNT(*) as count FROM users GROUP BY status;

-- ============================================
-- 8️⃣ IMPORTANT: PASSWORD RESET/CHANGE
-- ============================================

-- To reset admin password later (change 'NewPassword123!' to the new password):
-- UPDATE users 
-- SET password_hash = crypt('NewPassword123!', gen_salt('bf')), updated_at = CURRENT_TIMESTAMP
-- WHERE email = 'admin@almadeenastock.com';

-- To block a user:
-- UPDATE users SET status = 'blocked' WHERE email = 'admin@almadeenastock.com';

-- To unblock a user:
-- UPDATE users SET status = 'active' WHERE email = 'admin@almadeenastock.com';

-- To delete a user (careful!):
-- DELETE FROM users WHERE email = 'admin@almadeenastock.com';

-- ============================================
-- 9️⃣ USEFUL VERIFICATION QUERIES
-- ============================================

-- Count total users by role
-- SELECT role, COUNT(*) FROM users GROUP BY role;

-- Find users created in last 7 days
-- SELECT name, email, role, created_at FROM users WHERE created_at > NOW() - INTERVAL '7 days' ORDER BY created_at DESC;

-- Find locked users (failed logins)
-- SELECT name, email, locked_until FROM users WHERE locked_until IS NOT NULL;

-- Find unverified users
-- SELECT name, email, created_at FROM users WHERE is_verified = FALSE;

-- ============================================
-- 🔟 BACKUP & RESTORE
-- ============================================

-- Backup all users (save this before major changes)
-- COPY users (id, name, email, role, status, is_verified, created_at) TO STDOUT;

-- Backup to file
-- pg_dump -U postgres -h localhost -d shop_database -t users > users_backup.sql

-- ============================================
-- END OF ADMIN USER SETUP
-- ============================================

-- ============================================
-- 📋 ADMIN CREDENTIALS SUMMARY
-- ============================================
/*

 👤 ADMIN USER ACCOUNT
╔════════════════════════════════════════════════════════════╗
║                                                            ║
║  Name: Sahad                                              ║
║  Email: admin@almadeenastock.com                         ║
║  Password: Akhi@5656                                      ║
║  Role: Admin                                              ║
║  Status: Verified                                         ║
║                                                            ║
║  🔐 KEEP THIS SECURE!                                     ║
║  ⚠️ Change password after first login                     ║
║  ⚠️ Enable two-factor authentication                      ║
║  ⚠️ Never share these credentials                         ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝

 🔧 ADMIN CAPABILITIES
 ✓ Create, edit, delete users
 ✓ Manage all staff accounts
 ✓ Access full dashboard
 ✓ View all reports
 ✓ Configure system settings
 ✓ View audit logs
 ✓ Manage products & inventory
 ✓ Handle billing & transactions

 📝 NEXT STEPS
 1. Run DATABASE_SCHEMA.sql first (creates all tables)
 2. Run ADMIN_USER_SETUP.sql (creates admin account)
 3. Login with admin credentials
 4. Create additional users from Admin Dashboard
 5. Change admin password immediately
 6. Enable two-factor authentication
 7. Configure system settings

*/

-- ============================================
-- 🎯 EXECUTION INSTRUCTIONS
-- ============================================
/*

TO EXECUTE THIS SCRIPT:

Option 1: Using psql command line
psql -U postgres -h localhost -d shop_database -f ADMIN_USER_SETUP.sql

Option 2: Using Supabase console (SQL Editor)
- Copy entire content of this file
- Paste into Supabase SQL Editor
- Click "Run" or press Ctrl+Enter

Option 3: Using DBeaver or similar GUI
- Create new SQL script
- Copy entire content
- Execute all

IMPORTANT NOTES:
- Run DATABASE_SCHEMA.sql FIRST
- This script creates the admin account
- Password is hashed using bcrypt (pgcrypto)
- Email must be unique
- Admin account is verified by default
- Additional users will be created via dashboard

VERIFY SUCCESS:
- Script should return admin user details
- No errors should appear
- Login should work with provided credentials

*/
