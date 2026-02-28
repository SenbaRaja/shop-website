import React from 'react';
import '../styles/Dashboard.css';

export const UserDashboard: React.FC = () => {
  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <p>Your Business Overview</p>
      </div>

      <div className="dashboard-info">
        <div className="info-card">
          <h2>Welcome to Your Dashboard</h2>
          <p>Quick access to sales, inventory, and billing information.</p>
        </div>
      </div>
    </div>
  );
};
