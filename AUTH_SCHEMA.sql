-- ============================================
-- 🔐 AUTHENTICATION & AUTHORIZATION TABLES
-- ============================================
-- Simplified subset containing only the tables needed
-- for user authentication and role/permission management.
-- Created: February 27, 2026

-- Main user table (credentials + basic info)
CREATE TABLE IF NOT EXISTS users (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  uuid UUID UNIQUE DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL DEFAULT 'Cashier',
  status VARCHAR(50) NOT NULL DEFAULT 'active',
  is_verified BOOLEAN DEFAULT FALSE,
  verified_at TIMESTAMP,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Roles definition
CREATE TABLE IF NOT EXISTS user_roles (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  role_name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO user_roles (role_name, description) VALUES
  ('Admin', 'Full system access, user management, configurations'),
  ('Manager', 'Operational management, staff management, reports'),
  ('Cashier', 'POS operations, billing, basic reports'),
  ('Staff', 'Limited POS features, customer service')
ON CONFLICT DO NOTHING;

-- Permissions mapping
CREATE TABLE IF NOT EXISTS user_permissions (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  role_id BIGINT NOT NULL REFERENCES user_roles(id) ON DELETE CASCADE,
  permission_name VARCHAR(255) NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(role_id, permission_name)
);

-- Extension & helper functions for password hashing (bcrypt)
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE OR REPLACE FUNCTION hash_password(password TEXT)
RETURNS TEXT AS $$
BEGIN
  RETURN crypt(password, gen_salt('bf'));
END;
$$ LANGUAGE plpgsql IMMUTABLE;

CREATE OR REPLACE FUNCTION verify_password(password TEXT, hash TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN password = hash OR crypt(password, hash) = hash;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Indexes for authentication
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- RLS policies for auth tables (optional)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid()::uuid = uuid OR auth.jwt() ->> 'role' = 'Admin');
CREATE POLICY "Only admins can create users" ON users
  FOR INSERT WITH CHECK (auth.jwt() ->> 'role' = 'Admin');
CREATE POLICY "Only admins can delete users" ON users
  FOR DELETE USING (auth.jwt() ->> 'role' = 'Admin');

-- Trigger to update updated_at timestamp on users
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER users_update_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- End of authentication/authorization schema
