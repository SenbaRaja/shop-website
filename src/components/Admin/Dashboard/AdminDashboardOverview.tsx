import React, { useState } from 'react';
import '../../styles/AdminDashboard.css';

export const AdminDashboardOverview: React.FC = () => {
  const [dateRange, setDateRange] = useState<'today' | 'month' | 'custom'>('today');

  const stats = {
    totalSales: 45620,
    totalBills: 234,
    totalProducts: 1420,
    lowStockItems: 15,
    profit: 8945,
    totalCustomers: 320,
    totalSuppliers: 28,
    avgOrderValue: 195,
  };

  const kpiCards = [
    { title: 'Total Sales', value: `₹${stats.totalSales}`, icon: '💰', color: 'blue', period: dateRange },
    { title: 'Bills Generated', value: stats.totalBills, icon: '🧾', color: 'green' },
    { title: 'Total Products', value: stats.totalProducts, icon: '📦', color: 'purple' },
    { title: 'Low Stock Alerts', value: stats.lowStockItems, icon: '⚠️', color: 'orange' },
    { title: 'Profit (Today)', value: `₹${stats.profit}`, icon: '💸', color: 'success' },
    { title: 'Total Customers', value: stats.totalCustomers, icon: '👥', color: 'indigo' },
    { title: 'Total Suppliers', value: stats.totalSuppliers, icon: '🏪', color: 'cyan' },
    { title: 'Avg Order Value', value: `₹${stats.avgOrderValue}`, icon: '📊', color: 'pink' },
  ];

  return (
    <div className="admin-dashboard-overview">
      <div className="dashboard-header">
        <div>
          <h1>Dashboard Overview</h1>
          <p>Welcome to Admin Dashboard - Complete System Control</p>
        </div>
        <div className="date-filter">
          <label>View by:</label>
          <select value={dateRange} onChange={(e) => setDateRange(e.target.value as any)}>
            <option value="today">Today</option>
            <option value="month">This Month</option>
            <option value="custom">Custom Date</option>
          </select>
        </div>
      </div>

      <div className="kpi-grid">
        {kpiCards.map((card, idx) => (
          <div key={idx} className={`kpi-card kpi-${card.color}`}>
            <div className="kpi-icon">{card.icon}</div>
            <div className="kpi-content">
              <p className="kpi-title">{card.title}</p>
              <p className="kpi-value">{card.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="dashboard-charts">
        <div className="chart-section">
          <h2>📈 Sales Graph</h2>
          <div className="chart-placeholder">
            <div className="filter-tabs">
              <button className="filter-btn active">Daily</button>
              <button className="filter-btn">Monthly</button>
              <button className="filter-btn">Yearly</button>
            </div>
            <div className="chart-area">
              <div className="bar-chart">
                <div className="bar" style={{ height: '60%' }}></div>
                <div className="bar" style={{ height: '75%' }}></div>
                <div className="bar" style={{ height: '45%' }}></div>
                <div className="bar" style={{ height: '85%' }}></div>
                <div className="bar" style={{ height: '70%' }}></div>
                <div className="bar" style={{ height: '90%' }}></div>
                <div className="bar" style={{ height: '65%' }}></div>
              </div>
              <p className="chart-info">📊 Sales trends visualization</p>
            </div>
          </div>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-section">
          <h2>⚠️ Low Stock Alerts</h2>
          <div className="alerts-list">
            {[
              { product: 'Product A', stock: 5, sku: 'SKU-001' },
              { product: 'Product B', stock: 3, sku: 'SKU-002' },
              { product: 'Product C', stock: 2, sku: 'SKU-003' },
            ].map((item, idx) => (
              <div key={idx} className="alert-item">
                <div className="alert-content">
                  <p className="alert-product">{item.product}</p>
                  <p className="alert-sku">{item.sku}</p>
                </div>
                <div className="alert-stock">
                  <span className="stock-badge critical">Stock: {item.stock}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="dashboard-section">
          <h2>💰 Profit Summary</h2>
          <div className="profit-summary">
            <div className="profit-item">
              <span className="profit-label">Today's Profit</span>
              <span className="profit-value positive">₹8,945</span>
            </div>
            <div className="profit-item">
              <span className="profit-label">This Month</span>
              <span className="profit-value positive">₹2,45,600</span>
            </div>
            <div className="profit-item">
              <span className="profit-label">This Year</span>
              <span className="profit-value positive">₹28,56,200</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
