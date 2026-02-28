import React, { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import '../../styles/UserModules.css';

export const UserProfile: React.FC = () => {
  const { logout, user } = useAuth();
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleChangePassword = () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    if (passwordData.newPassword.length < 6) {
      alert('Password must be at least 6 characters!');
      return;
    }
    alert('Password changed successfully!');
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    setShowPasswordForm(false);
  };

  return (
    <div className="user-module">
      <div className="module-header">
        <h1>👤 My Profile</h1>
      </div>

      <div className="profile-container">
        <div className="profile-card">
          <div className="profile-avatar">👤</div>
          <div className="profile-info">
            <h2>{user?.username || 'Staff Member'}</h2>
            <p className="profile-role">Cashier</p>
            <p className="profile-email">staff@supermarket.com</p>
          </div>
        </div>

        <div className="profile-section">
          <h3>Account Details</h3>
          <div className="detail-row">
            <span>Username:</span>
            <span className="detail-value">{user?.username || 'staff'}</span>
          </div>
          <div className="detail-row">
            <span>Role:</span>
            <span className="detail-value">Cashier</span>
          </div>
          <div className="detail-row">
            <span>Status:</span>
            <span className="detail-value active">Active</span>
          </div>
          <div className="detail-row">
            <span>Last Login:</span>
            <span className="detail-value">Today, 10:15 AM</span>
          </div>
        </div>

        <div className="profile-section">
          <h3>Security</h3>
          {!showPasswordForm ? (
            <button
              className="btn-change-password"
              onClick={() => setShowPasswordForm(true)}
            >
              🔐 Change Password
            </button>
          ) : (
            <div className="password-form">
              <input
                type="password"
                placeholder="Current Password"
                value={passwordData.currentPassword}
                onChange={(e) =>
                  setPasswordData({ ...passwordData, currentPassword: e.target.value })
                }
              />
              <input
                type="password"
                placeholder="New Password"
                value={passwordData.newPassword}
                onChange={(e) =>
                  setPasswordData({ ...passwordData, newPassword: e.target.value })
                }
              />
              <input
                type="password"
                placeholder="Confirm Password"
                value={passwordData.confirmPassword}
                onChange={(e) =>
                  setPasswordData({ ...passwordData, confirmPassword: e.target.value })
                }
              />
              <div className="form-buttons">
                <button className="btn-save" onClick={handleChangePassword}>
                  Update Password
                </button>
                <button
                  className="btn-cancel"
                  onClick={() => setShowPasswordForm(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="profile-section">
          <h3>Session</h3>
          <button className="btn-logout" onClick={logout}>
            🚪 Logout
          </button>
        </div>
      </div>
    </div>
  );
};
