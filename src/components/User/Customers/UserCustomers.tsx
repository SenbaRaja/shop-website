import React, { useState } from 'react';
import '../../styles/UserModules.css';

export const UserCustomers: React.FC = () => {
  const [customers] = useState([
    { id: 1, name: 'John Doe', phone: '9876543210', totalSpent: 5420 },
    { id: 2, name: 'Jane Smith', phone: '9876543211', totalSpent: 3200 },
    { id: 3, name: 'Bob Wilson', phone: '9876543212', totalSpent: 2150 },
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', phone: '' });

  const filteredCustomers = customers.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.phone.includes(searchQuery)
  );

  const handleAddCustomer = () => {
    if (formData.name && formData.phone) {
      alert(`Customer ${formData.name} added successfully!`);
      setFormData({ name: '', phone: '' });
      setShowAddForm(false);
    }
  };

  return (
    <div className="user-module">
      <div className="module-header">
        <h1>👥 Customers</h1>
        <button className="btn-add" onClick={() => setShowAddForm(!showAddForm)}>
          ➕ Add Customer
        </button>
      </div>

      {showAddForm && (
        <div className="add-form">
          <input
            type="text"
            placeholder="Customer name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <input
            type="tel"
            placeholder="Phone number"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          />
          <div className="form-buttons">
            <button className="btn-save" onClick={handleAddCustomer}>
              Save
            </button>
            <button className="btn-cancel" onClick={() => setShowAddForm(false)}>
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="module-filters">
        <input
          type="text"
          placeholder="🔍 Search customers..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="filter-input"
        />
      </div>

      <div className="module-content">
        <div className="customers-list">
          {filteredCustomers.length === 0 ? (
            <p className="no-data">No customers found</p>
          ) : (
            filteredCustomers.map(customer => (
              <div key={customer.id} className="customer-card">
                <div className="customer-avatar">👤</div>
                <div className="customer-info">
                  <p className="customer-name">{customer.name}</p>
                  <p className="customer-phone">{customer.phone}</p>
                  <p className="customer-spent">Total: ₹{customer.totalSpent}</p>
                </div>
                <button className="btn-action">📞</button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
