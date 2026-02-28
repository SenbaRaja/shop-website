import React from 'react';
import { useAuth } from '../../context/AuthContext';
import '../styles/UserSidebar.css';

interface UserSidebarProps {
  activeMenu: string;
  onMenuChange: (menu: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const UserSidebar: React.FC<UserSidebarProps> = ({
  activeMenu,
  onMenuChange,
  isOpen,
  onClose,
}) => {
  const { logout, user } = useAuth();

  const handleMenuClick = (menu: string) => {
    onMenuChange(menu);
    onClose();
  };

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '🏠' },
    { id: 'billing', label: 'Billing (POS)', icon: '🧾' },
    { id: 'products', label: 'Products', icon: '📦' },
    { id: 'stock', label: 'Stock', icon: '📊' },
    { id: 'customers', label: 'Customers', icon: '👥' },
    { id: 'reports', label: 'Reports', icon: '📈' },
    { id: 'profile', label: 'Profile', icon: '👤' },
  ];

  return (
    <>
      {isOpen && <div className="user-sidebar-overlay" onClick={onClose} />}
      <aside className={`user-sidebar ${isOpen ? 'open' : ''}`}>
        <div className="user-sidebar-header">
          <div className="user-logo">
            <span className="logo-icon">🛒</span>
            <h2>POS System</h2>
          </div>
          <button className="close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="user-info">
          <div className="user-avatar">👤</div>
          <div className="user-details">
            <p className="user-name">{user?.username || 'Staff'}</p>
            <p className="user-role">Cashier</p>
          </div>
        </div>

        <nav className="user-nav">
          <ul className="nav-list">
            {menuItems.map((item) => (
              <li key={item.id}>
                <button
                  className={`nav-link ${activeMenu === item.id ? 'active' : ''}`}
                  onClick={() => handleMenuClick(item.id)}
                >
                  <span className="nav-icon">{item.icon}</span>
                  <span className="nav-label">{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div className="user-sidebar-footer">
          <button className="logout-btn" onClick={logout}>
            <span className="logout-icon">🚪</span>
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};
