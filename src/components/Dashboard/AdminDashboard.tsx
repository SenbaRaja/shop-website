import React from 'react';
import '../styles/Dashboard.css';

export const AdminDashboard: React.FC = () => {
  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Admin Dashboard</h1>
        <p>System Overview & Administration</p>
      </div>

      <div className="dashboard-info">
        <div className="info-card">
          <h2>Welcome to Admin Dashboard</h2>
          <p>Access all admin features from the sidebar menu.</p>
        </div>
      </div>
    </div>
  );
};
