import React, { useState } from 'react';
import '../../styles/AdminModules.css';

interface User {
  id: number;
  name: string;
  email: string;
  role: 'Cashier' | 'Manager' | 'Staff';
  status: 'active' | 'blocked';
  loginCount: number;
  createdAt: string;
}

interface FormData {
  name: string;
  email: string;
  role: 'Cashier' | 'Manager' | 'Staff';
  status: 'active' | 'blocked';
}

export const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([
    { id: 1, name: 'John Doe', email: 'john@shop.com', role: 'Cashier', status: 'active', loginCount: 45, createdAt: '2025-01-15' },
    { id: 2, name: 'Jane Smith', email: 'jane@shop.com', role: 'Manager', status: 'active', loginCount: 23, createdAt: '2025-02-10' },
    { id: 3, name: 'Bob Wilson', email: 'bob@shop.com', role: 'Cashier', status: 'blocked', loginCount: 12, createdAt: '2025-01-20' },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    role: 'Cashier',
    status: 'active',
  });
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [filterTab, setFilterTab] = useState('all');

  // Validation function
  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    // Check if email is unique (excluding current user if editing)
    const emailExists = users.some((u) => u.email === formData.email && u.id !== editingId);
    if (emailExists) {
      newErrors.email = 'Email already exists';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Open modal for adding new user
  const handleAddUser = () => {
    setEditingId(null);
    setFormData({
      name: '',
      email: '',
      role: 'Cashier',
      status: 'active',
    });
    setErrors({});
    setShowModal(true);
  };

  // Open modal for editing user
  const handleEditUser = (user: User) => {
    setEditingId(user.id);
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
    });
    setErrors({});
    setShowModal(true);
  };

  // Save user (create or update)
  const handleSaveUser = () => {
    if (!validateForm()) {
      return;
    }

    if (editingId !== null) {
      // Update existing user
      setUsers(
        users.map((u) =>
          u.id === editingId
            ? {
                ...u,
                name: formData.name,
                email: formData.email,
                role: formData.role,
                status: formData.status,
              }
            : u
        )
      );
    } else {
      // Create new user
      const newUser: User = {
        id: Math.max(...users.map((u) => u.id), 0) + 1,
        name: formData.name,
        email: formData.email,
        role: formData.role,
        status: formData.status,
        loginCount: 0,
        createdAt: new Date().toISOString().split('T')[0],
      };
      setUsers([...users, newUser]);
    }

    setShowModal(false);
    setFormData({
      name: '',
      email: '',
      role: 'Cashier',
      status: 'active',
    });
  };

  // Delete user
  const handleDeleteUser = (id: number) => {
    if (confirm('Are you sure you want to delete this user?')) {
      setUsers(users.filter((u) => u.id !== id));
    }
  };

  // Toggle user status
  const handleToggleStatus = (id: number) => {
    setUsers(
      users.map((u) =>
        u.id === id
          ? { ...u, status: u.status === 'active' ? 'blocked' : 'active' }
          : u
      )
    );
  };

  // Filter users based on tab
  const getFilteredUsers = () => {
    switch (filterTab) {
      case 'cashiers':
        return users.filter((u) => u.role === 'Cashier');
      case 'managers':
        return users.filter((u) => u.role === 'Manager');
      case 'active':
        return users.filter((u) => u.status === 'active');
      default:
        return users;
    }
  };

  const filteredUsers = getFilteredUsers();

  return (
    <div className="admin-module">
      <div className="module-header">
        <h1>👥 User Management</h1>
        <button className="btn-primary" onClick={handleAddUser}>
          ➕ Add User
        </button>
      </div>

      <div className="module-tabs">
        <button
          className={`tab-btn ${filterTab === 'all' ? 'active' : ''}`}
          onClick={() => setFilterTab('all')}
        >
          All Users ({users.length})
        </button>
        <button
          className={`tab-btn ${filterTab === 'cashiers' ? 'active' : ''}`}
          onClick={() => setFilterTab('cashiers')}
        >
          Cashiers ({users.filter((u) => u.role === 'Cashier').length})
        </button>
        <button
          className={`tab-btn ${filterTab === 'managers' ? 'active' : ''}`}
          onClick={() => setFilterTab('managers')}
        >
          Managers ({users.filter((u) => u.role === 'Manager').length})
        </button>
        <button
          className={`tab-btn ${filterTab === 'active' ? 'active' : ''}`}
          onClick={() => setFilterTab('active')}
        >
          Active ({users.filter((u) => u.status === 'active').length})
        </button>
      </div>

      <div className="module-content">
        {filteredUsers.length === 0 ? (
          <div className="empty-state">
            <p>📭 No users found</p>
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Logins</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td>
                    <strong>{user.name}</strong>
                  </td>
                  <td>{user.email}</td>
                  <td>
                    <span className="badge">{user.role}</span>
                  </td>
                  <td>
                    <span className={`status-badge ${user.status}`}>
                      {user.status === 'active' ? '✓ Active' : '✗ Blocked'}
                    </span>
                  </td>
                  <td>{user.loginCount}</td>
                  <td>{user.createdAt}</td>
                  <td className="action-btns">
                    <button
                      className="btn-sm btn-edit"
                      onClick={() => handleEditUser(user)}
                      title="Edit user"
                    >
                      ✏️
                    </button>
                    <button
                      className="btn-sm btn-block"
                      onClick={() => handleToggleStatus(user.id)}
                      title={user.status === 'active' ? 'Block user' : 'Unblock user'}
                    >
                      {user.status === 'active' ? '🚫' : '✓'}
                    </button>
                    <button
                      className="btn-sm btn-delete"
                      onClick={() => handleDeleteUser(user.id)}
                      title="Delete user"
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Add/Edit User Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>{editingId ? '✏️ Edit User' : '➕ Add New User'}</h2>
              <button
                className="modal-close"
                onClick={() => setShowModal(false)}
              >
                ✕
              </button>
            </div>

            <div className="modal-body">
              <div className="form-group">
                <label>Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Enter user name"
                  className={errors.name ? 'input-error' : ''}
                />
                {errors.name && (
                  <span className="error-message">{errors.name}</span>
                )}
              </div>

              <div className="form-group">
                <label>Email *</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder="Enter email address"
                  className={errors.email ? 'input-error' : ''}
                />
                {errors.email && (
                  <span className="error-message">{errors.email}</span>
                )}
              </div>

              <div className="form-group">
                <label>Role *</label>
                <select
                  value={formData.role}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      role: e.target.value as 'Cashier' | 'Manager' | 'Staff',
                    })
                  }
                >
                  <option value="Cashier">Cashier</option>
                  <option value="Manager">Manager</option>
                  <option value="Staff">Staff</option>
                </select>
              </div>

              <div className="form-group">
                <label>Status *</label>
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      status: e.target.value as 'active' | 'blocked',
                    })
                  }
                >
                  <option value="active">✓ Active</option>
                  <option value="blocked">✗ Blocked</option>
                </select>
              </div>

              <div className="info-box">
                <p>📌 Default password will be sent to the user's email</p>
              </div>
            </div>

            <div className="modal-footer">
              <button
                className="btn-secondary"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button className="btn-primary" onClick={handleSaveUser}>
                {editingId ? 'Update User' : 'Create User'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
