import React from 'react';
import '../../styles/UserDashboard.css';

export const UserDashboardOverview: React.FC = () => {
  const stats = {
    todaysSales: 45620,
    totalBillsToday: 234,
    lowStockItems: 5,
  };

  const recentBills = [
    { id: 'BL-001', time: '10:30 AM', amount: 2450, items: 3 },
    { id: 'BL-002', time: '10:45 AM', amount: 1890, items: 5 },
    { id: 'BL-003', time: '11:00 AM', amount: 5600, items: 8 },
    { id: 'BL-004', time: '11:15 AM', amount: 3200, items: 4 },
  ];

  const lowStockProducts = [
    { name: 'Product A', stock: 3, sku: 'SKU-001' },
    { name: 'Product C', stock: 2, sku: 'SKU-003' },
    { name: 'Product E', stock: 1, sku: 'SKU-005' },
  ];

  return (
    <div className="user-dashboard">
      <div className="dashboard-header">
        <h1>Good Morning! 👋</h1>
        <p>{new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
      </div>

      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-content">
            <p className="stat-label">Today's Sales</p>
            <p className="stat-value">₹{stats.todaysSales.toLocaleString('en-IN')}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🧾</div>
          <div className="stat-content">
            <p className="stat-label">Total Bills</p>
            <p className="stat-value">{stats.totalBillsToday}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">⚠️</div>
          <div className="stat-content">
            <p className="stat-label">Low Stock</p>
            <p className="stat-value critical">{stats.lowStockItems}</p>
          </div>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-section">
          <h2>📋 Recent Bills</h2>
          <div className="recent-bills">
            {recentBills.map((bill, idx) => (
              <div key={idx} className="bill-item">
                <div className="bill-info">
                  <p className="bill-id">{bill.id}</p>
                  <p className="bill-time">{bill.time}</p>
                </div>
                <div className="bill-details">
                  <p className="bill-items">{bill.items} items</p>
                  <p className="bill-amount">₹{bill.amount}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="dashboard-section">
          <h2>⚠️ Low Stock Items</h2>
          <div className="low-stock-list">
            {lowStockProducts.map((product, idx) => (
              <div key={idx} className="stock-alert">
                <div className="alert-icon">📦</div>
                <div className="alert-content">
                  <p className="alert-name">{product.name}</p>
                  <p className="alert-sku">{product.sku}</p>
                </div>
                <div className="alert-stock">
                  <span className="stock-count">{product.stock}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="dashboard-actions">
        <button className="action-btn primary">
          <span className="btn-icon">🧾</span>
          <span>Create New Bill</span>
        </button>
        <button className="action-btn secondary">
          <span className="btn-icon">📊</span>
          <span>View Reports</span>
        </button>
      </div>
    </div>
  );
};
