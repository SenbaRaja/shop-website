import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import '../components/styles/Login.css';

interface LoginPageProps {
  onLoginSuccess?: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username.trim() || !password.trim()) {
      setError('Please enter username and password');
      return;
    }

    if (login(username, password)) {
      setUsername('');
      setPassword('');
      onLoginSuccess?.();
    } else {
      setError('Invalid username or password');
      setPassword('');
    }
  };

  const handleDemoLogin = (role: 'admin' | 'staff') => {
    const credentials = role === 'admin' 
      ? { username: 'admin', password: 'Admin@123' }
      : { username: 'staff', password: 'Staff@123' };
    
    if (login(credentials.username, credentials.password)) {
      onLoginSuccess?.();
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <div className="logo">📊</div>
          <h1>StockMate Pro</h1>
          <p>Shop Stock Management System</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
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
                placeholder="Enter your password"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="login-button">
            Login
          </button>
        </form>

        <div className="demo-section">
          <p className="demo-title">Try Demo Credentials:</p>
          <div className="demo-buttons">
            <button
              type="button"
              className="demo-btn admin-demo"
              onClick={() => handleDemoLogin('admin')}
            >
              👑 Admin Demo
            </button>
            <button
              type="button"
              className="demo-btn staff-demo"
              onClick={() => handleDemoLogin('staff')}
            >
              👤 Staff Demo
            </button>
          </div>
        </div>

        <div className="credentials-info">
          <p><strong>Admin:</strong> admin / Admin@123</p>
          <p><strong>Staff:</strong> staff / Staff@123</p>
        </div>
      </div>
    </div>
  );
};
