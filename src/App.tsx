import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AppProvider } from './context/AppContext';
import { LoginPage } from './pages/LoginPage';
import { Header } from './components/Layout/Header';
import { Sidebar } from './components/Layout/Sidebar';
import { Dashboard } from './components/Dashboard/Dashboard';
import { Products } from './components/Products/Products';
import { StockManagement } from './components/Products/StockManagement';
import { Billing } from './components/Billing/Billing';
import { Reports } from './components/Reports/Reports';
import './components/styles/Common.css';

const MainApp: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!isAuthenticated) {
    return <LoginPage onLoginSuccess={() => setActiveMenu('dashboard')} />;
  }

  const renderContent = () => {
    switch (activeMenu) {
      case 'dashboard':
        return <Dashboard />;
      case 'products':
        return <Products />;
      case 'stock':
        return <StockManagement />;
      case 'billing':
        return <Billing />;
      case 'reports':
        return <Reports />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="app-layout">
      <Sidebar
        activeMenu={activeMenu}
        onMenuChange={setActiveMenu}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <div className="app-main">
        <Header
          title={getPageTitle(activeMenu)}
          onMenuClick={() => setSidebarOpen(!sidebarOpen)}
        />
        <main className="app-content">
          <div className="container">{renderContent()}</div>
        </main>
      </div>
    </div>
  );
};

const getPageTitle = (menu: string): string => {
  const titles: Record<string, string> = {
    dashboard: 'Dashboard',
    products: 'Product Management',
    stock: 'Stock Management',
    billing: 'Sales & Billing',
    reports: 'Reports & Analytics',
  };
  return titles[menu] || 'Dashboard';
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppProvider>
        <MainApp />
      </AppProvider>
    </AuthProvider>
  );
};

export default App;
