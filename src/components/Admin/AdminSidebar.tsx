import React from 'react';
import { useAuth } from '../../context/AuthContext';
import '../styles/AdminSidebar.css';

interface AdminSidebarProps {
  activeMenu: string;
  onMenuChange: (menu: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
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
    { id: 'dashboard', label: 'Dashboard', icon: '🏠', section: 'Dashboard' },
    { id: 'sales', label: 'Sales & Billing', icon: '🧾', section: 'Operations' },
    { id: 'products', label: 'Products', icon: '📦', section: 'Operations' },
    { id: 'stock', label: 'Stock', icon: '📊', section: 'Operations' },
    { id: 'customers', label: 'Customers', icon: '👥', section: 'Management' },
    { id: 'suppliers', label: 'Suppliers', icon: '🏪', section: 'Management' },
    { id: 'users', label: 'Users', icon: '🧑‍💼', section: 'Management' },
    { id: 'reports', label: 'Reports', icon: '📈', section: 'Analytics' },
    { id: 'notifications', label: 'Notifications', icon: '🔔', section: 'System' },
    { id: 'settings', label: 'Settings', icon: '⚙️', section: 'System' },
    { id: 'security', label: 'Security & Logs', icon: '🔐', section: 'System' },
  ];

  const sections = ['Dashboard', 'Operations', 'Management', 'Analytics', 'System'];

  return (
    <>
      {isOpen && <div className="admin-sidebar-overlay" onClick={onClose} />}
      <aside className={`admin-sidebar ${isOpen ? 'open' : ''}`}>
        <div className="admin-sidebar-header">
          <div className="admin-logo">
            <span className="logo-icon">📊</span>
            <h2>Admin Portal</h2>
          </div>
          <button className="close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="admin-user-info">
          <div className="user-avatar">👤</div>
          <div className="user-details">
            <p className="user-name">{user?.username || 'Admin'}</p>
            <p className="user-role">{'Admin'}</p>
          </div>
        </div>

        <nav className="admin-nav">
          {sections.map((section) => {
            const sectionItems = menuItems.filter((item) => item.section === section);
            if (sectionItems.length === 0) return null;

            return (
              <div key={section} className="nav-section">
                <h3 className="nav-section-title">{section}</h3>
                <ul className="nav-list">
                  {sectionItems.map((item) => (
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
              </div>
            );
          })}
        </nav>

        <div className="admin-sidebar-footer">
          <button className="logout-btn" onClick={logout}>
            <span className="logout-icon">🚪</span>
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};
