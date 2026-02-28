import React, { useState } from 'react';
import '../../styles/UserModules.css';

export const UserStock: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const stockItems = [
    { id: 1, name: 'Rice (1kg)', sku: 'SKU-001', stock: 45, minStock: 10, status: 'good' },
    { id: 2, name: 'Wheat (1kg)', sku: 'SKU-002', stock: 30, minStock: 10, status: 'good' },
    { id: 3, name: 'Sugar (1kg)', sku: 'SKU-003', stock: 5, minStock: 15, status: 'warning' },
    { id: 4, name: 'Oil (1L)', sku: 'SKU-004', stock: 15, minStock: 10, status: 'good' },
    { id: 5, name: 'Salt (1kg)', sku: 'SKU-005', stock: 50, minStock: 20, status: 'good' },
    { id: 6, name: 'Tea (250g)', sku: 'SKU-006', stock: 2, minStock: 10, status: 'critical' },
    { id: 7, name: 'Coffee (100g)', sku: 'SKU-007', stock: 18, minStock: 10, status: 'good' },
    { id: 8, name: 'Milk (1L)', sku: 'SKU-008', stock: 1, minStock: 10, status: 'critical' },
  ];

  const filteredItems = stockItems.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.sku.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="user-module">
      <div className="module-header">
        <h1>📊 Stock Levels</h1>
        <p className="read-only-badge">Read Only</p>
      </div>

      <div className="stock-overview">
        <div className="stock-stat">
          <h3>Total Items</h3>
          <p className="stat-number">{stockItems.length}</p>
        </div>
        <div className="stock-stat">
          <h3>Low Stock ⚠️</h3>
          <p className="stat-number warning">{stockItems.filter(i => i.status === 'warning').length}</p>
        </div>
        <div className="stock-stat">
          <h3>Critical 🚨</h3>
          <p className="stat-number critical">{stockItems.filter(i => i.status === 'critical').length}</p>
        </div>
      </div>

      <div className="module-filters">
        <input
          type="text"
          placeholder="🔍 Search by product or SKU..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="filter-input"
        />
      </div>

      <div className="module-content">
        <table className="stock-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>SKU</th>
              <th>Current Stock</th>
              <th>Min Stock</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.map(item => (
              <tr key={item.id} className={`status-${item.status}`}>
                <td>{item.name}</td>
                <td>{item.sku}</td>
                <td>{item.stock}</td>
                <td>{item.minStock}</td>
                <td>
                  <span className={`stock-badge ${item.status}`}>
                    {item.status === 'good' && '✓ Good'}
                    {item.status === 'warning' && '⚠️ Low'}
                    {item.status === 'critical' && '🚨 Critical'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="stock-info">
        <p>📝 Note: You can only view stock levels. To update stock, contact your manager.</p>
      </div>
    </div>
  );
};
