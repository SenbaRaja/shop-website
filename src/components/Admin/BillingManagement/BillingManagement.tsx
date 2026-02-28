import React from 'react';
import '../../styles/AdminModules.css';

export const BillingManagement: React.FC = () => {
  const [bills] = React.useState([
    { id: 'BL-001', date: '2026-02-27', customer: 'John Doe', amount: 2450, items: 3, status: 'completed' },
    { id: 'BL-002', date: '2026-02-27', customer: 'Jane Smith', amount: 1890, items: 5, status: 'completed' },
    { id: 'BL-003', date: '2026-02-26', customer: 'Bob Wilson', amount: 5600, items: 8, status: 'returned' },
  ]);

  return (
    <div className="admin-module">
      <div className="module-header">
        <h1>🧾 Billing & Sales</h1>
        <button className="btn-primary">➕ Create New Bill</button>
      </div>

      <div className="module-tabs">
        <button className="tab-btn active">All Bills</button>
        <button className="tab-btn">Returns</button>
        <button className="tab-btn">Daily Report</button>
      </div>

      <div className="module-content">
        <table className="data-table">
          <thead>
            <tr>
              <th>Bill ID</th>
              <th>Date</th>
              <th>Customer</th>
              <th>Items</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {bills.map((bill) => (
              <tr key={bill.id}>
                <td>{bill.id}</td>
                <td>{bill.date}</td>
                <td>{bill.customer}</td>
                <td>{bill.items}</td>
                <td>₹{bill.amount}</td>
                <td>
                  <span className={`status-badge ${bill.status}`}>
                    {bill.status === 'completed' ? '✓ Completed' : '↩️ Returned'}
                  </span>
                </td>
                <td className="action-btns">
                  <button className="btn-sm btn-view">👁️</button>
                  <button className="btn-sm btn-print">🖨️</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
