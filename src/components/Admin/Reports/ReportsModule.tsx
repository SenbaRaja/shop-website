import React from 'react';
import '../../styles/AdminModules.css';

export const ReportsModule: React.FC = () => {
  return (
    <div className="admin-module">
      <div className="module-header">
        <h1>📊 Reports & Analytics</h1>
      </div>

      <div className="module-tabs">
        <button className="tab-btn active">Sales Reports</button>
        <button className="tab-btn">Product Analytics</button>
        <button className="tab-btn">Profit & Loss</button>
        <button className="tab-btn">GST Report</button>
        <button className="tab-btn">Inventory</button>
      </div>

      <div className="module-content">
        <div className="reports-grid">
          <div className="report-card">
            <h3>📅 Daily Sales Report</h3>
            <p>View daily sales breakdown</p>
            <button className="btn-secondary">View Report</button>
          </div>
          <div className="report-card">
            <h3>📊 Product-wise Sales</h3>
            <p>Sales by product category</p>
            <button className="btn-secondary">View Report</button>
          </div>
          <div className="report-card">
            <h3>💰 Profit & Loss</h3>
            <p>P&L statement analysis</p>
            <button className="btn-secondary">View Report</button>
          </div>
          <div className="report-card">
            <h3>🧾 GST Report</h3>
            <p>GST component breakdown</p>
            <button className="btn-secondary">View Report</button>
          </div>
          <div className="report-card">
            <h3>📦 Low Stock Report</h3>
            <p>Items below minimum stock</p>
            <button className="btn-secondary">View Report</button>
          </div>
          <div className="report-card">
            <h3>📦 Inventory Valuation</h3>
            <p>Total inventory value</p>
            <button className="btn-secondary">View Report</button>
          </div>
        </div>
      </div>
    </div>
  );
};
