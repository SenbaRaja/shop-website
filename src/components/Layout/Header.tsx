import React from 'react';
import { useAuth } from '../../context/AuthContext';
import '../styles/Header.css';

interface HeaderProps {
  title: string;
  onMenuClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ title, onMenuClick }) => {
  const { user, logout } = useAuth();

  return (
    <header className="header">
      <div className="header-left">
        {onMenuClick && (
          <button className="menu-toggle" onClick={onMenuClick}>
            ☰
          </button>
        )}
        <h1 className="header-title">StockMate Pro</h1>
      </div>

      <div className="header-center">
        <h2 className="page-title">{title}</h2>
      </div>

      <div className="header-right">
        <div className="user-info">
          <span className="username">{user?.username}</span>
          <span className="role-badge">{user?.role === 'admin' ? '👑 Admin' : '👤 Staff'}</span>
        </div>
        <button className="logout-btn" onClick={logout}>
          Logout
        </button>
      </div>
    </header>
  );
};
