import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import '../components/styles/Login.css';

interface AdminLoginPageProps {
  onLoginSuccess?: () => void;
  onSwitchToUserLogin?: () => void;
}

export const AdminLoginPage: React.FC<AdminLoginPageProps> = ({ onLoginSuccess, onSwitchToUserLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login, user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username.trim() || !password.trim()) {
      setError('Please enter username and password');
      return;
    }

    try {
      setIsLoading(true);
      const success = await login(username, password);
      
      if (success) {
        // Check if user is actually an admin
        if (user?.role !== 'admin') {
          setError('Admin credentials required. You do not have admin access.');
          setPassword('');
          return;
        }
        setUsername('');
        setPassword('');
        onLoginSuccess?.();
      } else {
        setError('Invalid username or password');
        setPassword('');
      }
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || 'Login failed. Please try again.');
      setPassword('');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <div className="logo">🔐</div>
          <h1>Admin Portal</h1>
          <p>StockMate Pro - Administration</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter admin username"
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="password-input-group">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                disabled={isLoading}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="login-button" disabled={isLoading}>
            {isLoading ? 'Logging in...' : 'Admin Login'}
          </button>
        </form>

        <div className="login-footer">
          <p className="login-footer-text">
            Not an admin?{' '}
            <button
              type="button"
              className="switch-login-button"
              onClick={onSwitchToUserLogin}
              disabled={isLoading}
            >
              User Login
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};
