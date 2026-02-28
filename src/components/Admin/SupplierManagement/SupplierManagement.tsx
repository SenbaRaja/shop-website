import React from 'react';
import '../../styles/AdminModules.css';

export const SupplierManagement: React.FC = () => {
  const [suppliers] = React.useState([
    { id: 1, name: 'Supplier A', contact: '9876543210', email: 'supplier@email.com', payable: 45000 },
    { id: 2, name: 'Supplier B', contact: '9876543211', email: 'supplierb@email.com', payable: 28500 },
    { id: 3, name: 'Supplier C', contact: '9876543212', email: 'supplierc@email.com', payable: 0 },
  ]);

  return (
    <div className="admin-module">
      <div className="module-header">
        <h1>🏪 Supplier Management</h1>
        <button className="btn-primary">➕ Add Supplier</button>
      </div>

      <div className="module-tabs">
        <button className="tab-btn active">All Suppliers</button>
        <button className="tab-btn">Payment History</button>
        <button className="tab-btn">Outstanding Payables</button>
      </div>

      <div className="module-content">
        <table className="data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Contact</th>
              <th>Email</th>
              <th>Outstanding Payable</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {suppliers.map((supplier) => (
              <tr key={supplier.id}>
                <td>{supplier.name}</td>
                <td>{supplier.contact}</td>
                <td>{supplier.email}</td>
                <td>
                  <span className={`amount-badge ${supplier.payable > 0 ? 'due' : 'paid'}`}>
                    ₹{supplier.payable}
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
