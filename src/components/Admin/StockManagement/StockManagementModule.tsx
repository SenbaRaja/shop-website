import React from 'react';
import '../../styles/AdminModules.css';

export const StockManagementModule: React.FC = () => {
  return (
    <div className="admin-module">
      <div className="module-header">
        <h1>📊 Stock Management</h1>
        <button className="btn-primary">➕ Add Stock (Purchase Entry)</button>
      </div>

      <div className="module-tabs">
        <button className="tab-btn active">Stock Levels</button>
        <button className="tab-btn">Stock Adjustment</button>
        <button className="tab-btn">Transfer</button>
        <button className="tab-btn">History</button>
        <button className="tab-btn">Valuation Report</button>
      </div>

      <div className="module-content">
        <div className="stock-overview">
          <div className="stock-stat">
            <h3>Total Inventory Value</h3>
            <p className="stat-value">₹5,42,800</p>
          </div>
          <div className="stock-stat">
            <h3>Items in Stock</h3>
            <p className="stat-value">4,256</p>
          </div>
          <div className="stock-stat">
            <h3>Low Stock Items</h3>
            <p className="stat-value critical">15</p>
          </div>
          <div className="stock-stat">
            <h3>Stock Movements (Today)</h3>
            <p className="stat-value">23</p>
          </div>
        </div>
      </div>
    </div>
  );
};
