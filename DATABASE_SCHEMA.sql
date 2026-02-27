-- ============================================
-- 👤 USER PROFILE & AUTHENTICATION TABLES
-- ============================================
-- Supabase / PostgreSQL SQL Schema
-- For: Shop Website - Supermarket Management System
-- Created: February 27, 2026

-- ============================================
-- 1️⃣ USERS TABLE (Main Authentication)
-- ============================================
CREATE TABLE IF NOT EXISTS users (
  -- Primary Key & Identifiers
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  uuid UUID UNIQUE DEFAULT gen_random_uuid(),
  
  -- Basic Information
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  
  -- Authentication
  password_hash VARCHAR(255) NOT NULL,
  
  -- Role & Status
  role VARCHAR(50) NOT NULL DEFAULT 'Cashier',
  -- Roles: 'Admin', 'Manager', 'Cashier', 'Staff'
  
  status VARCHAR(50) NOT NULL DEFAULT 'active',
  -- Status: 'active', 'blocked', 'inactive'
  
  -- Verification & Security
  is_verified BOOLEAN DEFAULT FALSE,
  verified_at TIMESTAMP,
  verification_token VARCHAR(255),
  verification_token_expires TIMESTAMP,
  
  -- Password Reset
  password_reset_token VARCHAR(255),
  password_reset_expires TIMESTAMP,
  
  -- Two-Factor Authentication (Future)
  two_fa_enabled BOOLEAN DEFAULT FALSE,
  two_fa_secret VARCHAR(255),
  
  -- Activity Tracking
  login_count INT DEFAULT 0,
  last_login TIMESTAMP,
  failed_login_attempts INT DEFAULT 0,
  locked_until TIMESTAMP,
  
  -- Metadata
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP,
  
  -- Additional Fields
  phone VARCHAR(20),
  profile_image_url VARCHAR(500),
  is_active BOOLEAN DEFAULT TRUE,
  
  -- Constraints
  CONSTRAINT users_email_check CHECK (email ~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$'),
  CONSTRAINT users_role_check CHECK (role IN ('Admin', 'Manager', 'Cashier', 'Staff')),
  CONSTRAINT users_status_check CHECK (status IN ('active', 'blocked', 'inactive'))
);

-- ============================================
-- 📋 USER PROFILES TABLE (Extended Information)
-- ============================================
CREATE TABLE IF NOT EXISTS user_profiles (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  user_id BIGINT NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  
  -- Personal Information
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  date_of_birth DATE,
  gender VARCHAR(20),
  
  -- Contact Information
  phone_primary VARCHAR(20),
  phone_secondary VARCHAR(20),
  emergency_contact_name VARCHAR(255),
  emergency_contact_phone VARCHAR(20),
  
  -- Address
  address_line_1 VARCHAR(255),
  address_line_2 VARCHAR(255),
  city VARCHAR(100),
  state VARCHAR(100),
  postal_code VARCHAR(20),
  country VARCHAR(100) DEFAULT 'India',
  
  -- Employment Details
  employee_id VARCHAR(50) UNIQUE,
  department VARCHAR(100),
  designation VARCHAR(100),
  date_of_joining DATE,
  date_of_leaving DATE,
  
  -- Bank Details (Optional - for salary/payments)
  bank_account_holder_name VARCHAR(255),
  bank_account_number VARCHAR(50),
  bank_ifsc_code VARCHAR(20),
  bank_account_type VARCHAR(50),
  
  -- Identification
  id_type VARCHAR(50),
  -- Types: 'Aadhaar', 'PAN', 'DL', 'Passport'
  id_number VARCHAR(50),
  id_issue_date DATE,
  id_expiry_date DATE,
  
  -- Additional Info
  bio TEXT,
  preferences JSONB DEFAULT '{}',
  
  -- Timestamps
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  
  CONSTRAINT user_profiles_id_type_check CHECK (id_type IN ('Aadhaar', 'PAN', 'DL', 'Passport', 'Other'))
);

-- ============================================
-- 🔐 USER ROLES & PERMISSIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS user_roles (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  role_name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default roles
INSERT INTO user_roles (role_name, description) VALUES
  ('Admin', 'Full system access, user management, configurations'),
  ('Manager', 'Operational management, staff management, reports'),
  ('Cashier', 'POS operations, billing, basic reports'),
  ('Staff', 'Limited POS features, customer service')
ON CONFLICT DO NOTHING;

-- ============================================
-- 🔒 USER PERMISSIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS user_permissions (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  role_id BIGINT NOT NULL REFERENCES user_roles(id) ON DELETE CASCADE,
  permission_name VARCHAR(255) NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(role_id, permission_name)
);

-- ============================================
-- 📜 ACTIVITY LOG / AUDIT TRAIL
-- ============================================
CREATE TABLE IF NOT EXISTS activity_logs (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  user_id BIGINT REFERENCES users(id) ON DELETE SET NULL,
  
  -- Log Details
  action VARCHAR(100) NOT NULL,
  resource_type VARCHAR(100),
  resource_id VARCHAR(255),
  description TEXT,
  
  -- Request Information
  ip_address VARCHAR(45),
  user_agent TEXT,
  
  -- Status
  status VARCHAR(50),
  
  -- Timestamps
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Post-table indexes for PostgreSQL
CREATE INDEX IF NOT EXISTS idx_activity_user_id ON activity_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_created_at ON activity_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_activity_action ON activity_logs(action);

-- ============================================
-- 📋 LOGIN HISTORY
-- ============================================
CREATE TABLE IF NOT EXISTS login_history (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Login Details
  ip_address VARCHAR(45),
  user_agent TEXT,
  device_type VARCHAR(50),
  
  -- Status
  login_status VARCHAR(50) NOT NULL,
  -- Status: 'success', 'failed', 'locked'
  
  failure_reason VARCHAR(255),
  
  -- Location (Optional)
  location_city VARCHAR(100),
  location_country VARCHAR(100),
  
  -- Timestamps
  login_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  logout_at TIMESTAMP,
  
  INDEX idx_login_user_id (user_id),
  INDEX idx_login_at (login_at)
);

-- ============================================
-- 🔑 SESSION MANAGEMENT
-- ============================================
CREATE TABLE IF NOT EXISTS user_sessions (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Session Token
  session_token VARCHAR(500) UNIQUE NOT NULL,
  refresh_token VARCHAR(500) UNIQUE,
  
  -- Session Info
  ip_address VARCHAR(45),
  user_agent TEXT,
  device_type VARCHAR(50),
  
  -- Timestamps
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP NOT NULL,
  last_activity TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  -- Session Status
  is_active BOOLEAN DEFAULT TRUE,
  revoked_at TIMESTAMP,
  revoked_reason VARCHAR(255),
  
  INDEX idx_session_user_id (user_id),
  INDEX idx_session_token (session_token),
  INDEX idx_session_expires_at (expires_at)
);

-- ============================================
-- 📱 DEVICE MANAGEMENT
-- ============================================
CREATE TABLE IF NOT EXISTS user_devices (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Device Info
  device_name VARCHAR(255),
  device_type VARCHAR(50),
  -- Types: 'Desktop', 'Tablet', 'Mobile'
  
  device_id VARCHAR(255) UNIQUE,
  operating_system VARCHAR(100),
  
  -- Security
  is_trusted BOOLEAN DEFAULT FALSE,
  last_used TIMESTAMP,
  
  -- Timestamps
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  INDEX idx_device_user_id (user_id)
);

-- ============================================
-- 💳 NOTIFICATION PREFERENCES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS notification_preferences (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  user_id BIGINT NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  
  -- Email Notifications
  email_low_stock BOOLEAN DEFAULT TRUE,
  email_payment_alert BOOLEAN DEFAULT TRUE,
  email_daily_report BOOLEAN DEFAULT FALSE,
  email_security_alerts BOOLEAN DEFAULT TRUE,
  
  -- SMS Notifications (Future)
  sms_alerts BOOLEAN DEFAULT FALSE,
  
  -- In-App Notifications
  app_notifications BOOLEAN DEFAULT TRUE,
  
  -- Digest Preferences
  digest_frequency VARCHAR(50) DEFAULT 'daily',
  -- Options: 'immediate', 'daily', 'weekly', 'monthly'
  
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 🔒 INDEXES FOR PERFORMANCE
-- ============================================
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_status ON users(status);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at);
CREATE INDEX IF NOT EXISTS idx_users_is_verified ON users(is_verified);

CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_employee_id ON user_profiles(employee_id);

CREATE INDEX IF NOT EXISTS idx_activity_logs_user_id ON activity_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_created_at ON activity_logs(created_at);

-- ============================================
-- 🔐 ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================
-- Enable RLS on tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE login_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_preferences ENABLE ROW LEVEL SECURITY;

-- Users can view their own profile
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid()::uuid = uuid OR auth.jwt() ->> 'role' = 'Admin');

-- Users can update their own profile
CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid()::uuid = uuid);

-- Only Admins can create users
CREATE POLICY "Only admins can create users" ON users
  FOR INSERT WITH CHECK (auth.jwt() ->> 'role' = 'Admin');

-- Only Admins can delete users
CREATE POLICY "Only admins can delete users" ON users
  FOR DELETE USING (auth.jwt() ->> 'role' = 'Admin');

-- Users can view their own profile data
CREATE POLICY "Users can view own profile data" ON user_profiles
  FOR SELECT USING (
    user_id = (SELECT id FROM users WHERE uuid = auth.uid()::uuid) 
    OR (SELECT role FROM users WHERE id = user_profiles.user_id) = 'Admin'
  );

-- Activity logs - Users can view their own
CREATE POLICY "Users can view own activity logs" ON activity_logs
  FOR SELECT USING (
    user_id = (SELECT id FROM users WHERE uuid = auth.uid()::uuid)
    OR (SELECT role FROM users WHERE uuid = auth.uid()::uuid) = 'Admin'
  );

-- ============================================
-- 📊 UTILITY FUNCTIONS
-- ============================================

-- Function to hash password (bcrypt)
-- Note: Install pgcrypto extension first
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Function to generate password hash
CREATE OR REPLACE FUNCTION hash_password(password TEXT)
RETURNS TEXT AS $$
BEGIN
  RETURN crypt(password, gen_salt('bf'));
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Function to verify password
CREATE OR REPLACE FUNCTION verify_password(password TEXT, hash TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN password = hash OR crypt(password, hash) = hash;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Function to update 'updated_at' timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for users table
CREATE TRIGGER users_update_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger for user_profiles table
CREATE TRIGGER user_profiles_update_updated_at BEFORE UPDATE ON user_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger for notification_preferences table
CREATE TRIGGER notification_preferences_update_updated_at BEFORE UPDATE ON notification_preferences
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- ⚠️ IMPORTANT: SAMPLE DATA & INITIALIZATION
-- ============================================
-- THESE ARE JUST FOR TESTING - REMOVE IN PRODUCTION

-- Insert default permissions for each role
INSERT INTO user_permissions (role_id, permission_name, description) 
SELECT id, 'create_users', 'Can create new user accounts' FROM user_roles WHERE role_name = 'Admin'
UNION ALL
SELECT id, 'edit_users', 'Can edit user details' FROM user_roles WHERE role_name = 'Admin'
UNION ALL
SELECT id, 'delete_users', 'Can delete user accounts' FROM user_roles WHERE role_name = 'Admin'
UNION ALL
SELECT id, 'view_reports', 'Can view all reports' FROM user_roles WHERE role_name = 'Admin'
UNION ALL
SELECT id, 'manage_stock', 'Can manage stock' FROM user_roles WHERE role_name = 'Admin'
UNION ALL
SELECT id, 'view_billing', 'Can view billing information' FROM user_roles WHERE role_name = 'Manager'
UNION ALL
SELECT id, 'manage_customers', 'Can manage customers' FROM user_roles WHERE role_name = 'Manager'
UNION ALL
SELECT id, 'create_bills', 'Can create billing invoices' FROM user_roles WHERE role_name = 'Cashier'
UNION ALL
SELECT id, 'view_products', 'Can view product catalog' FROM user_roles WHERE role_name = 'Cashier'
UNION ALL
SELECT id, 'view_products', 'Can view product catalog' FROM user_roles WHERE role_name = 'Staff'
ON CONFLICT DO NOTHING;

-- ============================================
-- ✅ VERIFICATION QUERIES
-- ============================================
-- Run these to verify the tables were created:
/*
SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';

-- Count indexes
SELECT COUNT(*) as index_count FROM information_schema.statistics WHERE table_schema = 'public';

-- View RLS policies
SELECT * FROM pg_policies WHERE schemaname = 'public';

-- Check triggers
SELECT * FROM information_schema.triggers WHERE trigger_schema = 'public';
*/

-- ============================================
-- END OF SCHEMA CREATION
-- ============================================
