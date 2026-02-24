import React from 'react';
import { useAuth } from '../../context/AuthContext';
import '../styles/Sidebar.css';

interface SidebarProps {
  activeMenu: string;
  onMenuChange: (menu: string) => void;
  isOpen: boolean;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeMenu, onMenuChange, isOpen, onClose }) => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  const handleMenuClick = (menu: string) => {
    onMenuChange(menu);
    onClose?.();
  };

  return (
    <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
      <nav className="sidebar-nav">
        <button
          className={`nav-item ${activeMenu === 'dashboard' ? 'active' : ''}`}
          onClick={() => handleMenuClick('dashboard')}
        >
          📊 Dashboard
        </button>

        {isAdmin && (
          <>
            <button
              className={`nav-item ${activeMenu === 'products' ? 'active' : ''}`}
              onClick={() => handleMenuClick('products')}
            >
              📦 Products
            </button>
            <button
              className={`nav-item ${activeMenu === 'stock' ? 'active' : ''}`}
              onClick={() => handleMenuClick('stock')}
            >
              📈 Stock Management
            </button>
          </>
        )}

        <button
          className={`nav-item ${activeMenu === 'billing' ? 'active' : ''}`}
          onClick={() => handleMenuClick('billing')}
        >
          🛒 Sales & Billing
        </button>

        {isAdmin && (
          <button
            className={`nav-item ${activeMenu === 'reports' ? 'active' : ''}`}
            onClick={() => handleMenuClick('reports')}
          >
            📋 Reports
          </button>
        )}
      </nav>
    </aside>
  );
};
