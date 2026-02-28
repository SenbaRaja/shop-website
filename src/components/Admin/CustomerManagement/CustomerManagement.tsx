import React from 'react';
import '../../styles/AdminModules.css';

export const CustomerManagement: React.FC = () => {
  const [customers] = React.useState([
    { id: 1, name: 'John Doe', phone: '9876543210', email: 'john@email.com', totalSpent: 15420, dues: 0 },
    { id: 2, name: 'Jane Smith', phone: '9876543211', email: 'jane@email.com', totalSpent: 8900, dues: 2500 },
    { id: 3, name: 'Bob Wilson', phone: '9876543212', email: 'bob@email.com', totalSpent: 5600, dues: 1200 },
  ]);

  return (
    <div className="admin-module">
      <div className="module-header">
        <h1>👥 Customer Management</h1>
        <button className="btn-primary">➕ Add Customer</button>
      </div>

      <div className="module-tabs">
        <button className="tab-btn active">All Customers</button>
        <button className="tab-btn">Credit Tracking</button>
        <button className="tab-btn">SMS/WhatsApp</button>
      </div>

      <div className="module-content">
        <table className="data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Phone</th>
              <th>Email</th>
              <th>Total Spent</th>
              <th>Outstanding Dues</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer) => (
              <tr key={customer.id}>
                <td>{customer.name}</td>
                <td>{customer.phone}</td>
                <td>{customer.email}</td>
                <td>₹{customer.totalSpent}</td>
                <td>
                  <span className={`amount-badge ${customer.dues > 0 ? 'due' : 'paid'}`}>
                    ₹{customer.dues}
                  </span>
                </td>
                <td className="action-btns">
                  <button className="btn-sm btn-view">👁️</button>
                  <button className="btn-sm btn-edit">✏️</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
