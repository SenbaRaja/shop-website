import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AppProvider } from './context/AppContext';
import { LoginPage } from './pages/LoginPage';
import { AdminLoginPage } from './pages/AdminLoginPage';
import { Header } from './components/Layout/Header';
import { AdminSidebar } from './components/Admin/AdminSidebar';
import { AdminDashboardOverview } from './components/Admin/Dashboard/AdminDashboardOverview';
import { UserSidebar } from './components/User/UserSidebar';
import { UserDashboardOverview } from './components/User/Dashboard/UserDashboardOverview';
import { UserBilling } from './components/User/Billing/UserBilling';
import { UserProducts } from './components/User/Products/UserProducts';
import { UserStock } from './components/User/Stock/UserStock';
import { UserCustomers } from './components/User/Customers/UserCustomers';
import { UserReports } from './components/User/Reports/UserReports';
import { UserProfile } from './components/User/Profile/UserProfile';
import { UserManagement } from './components/Admin/UserManagement/UserManagement';
import { ProductManagement } from './components/Admin/ProductManagement/ProductManagement';
import { StockManagementModule } from './components/Admin/StockManagement/StockManagementModule';
import { BillingManagement } from './components/Admin/BillingManagement/BillingManagement';
import { CustomerManagement } from './components/Admin/CustomerManagement/CustomerManagement';
import { SupplierManagement } from './components/Admin/SupplierManagement/SupplierManagement';
import { ReportsModule } from './components/Admin/Reports/ReportsModule';
import { NotificationsCenter } from './components/Admin/Notifications/NotificationsCenter';
import { SettingsModule } from './components/Admin/Settings/SettingsModule';
import { SecurityLogs } from './components/Admin/SecurityLogs/SecurityLogs';
import './components/styles/Common.css';
import './components/styles/AdminLayout.css';

const MainApp: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const isAdmin = user?.role === 'admin';

  if (!isAuthenticated) {
    if (showAdminLogin) {
      return (
        <AdminLoginPage
          onLoginSuccess={() => setActiveMenu('dashboard')}
          onSwitchToUserLogin={() => setShowAdminLogin(false)}
        />
      );
    }
    return (
      <LoginPage
        onLoginSuccess={() => setActiveMenu('dashboard')}
        onSwitchToAdminLogin={() => setShowAdminLogin(true)}
      />
    );
  }

  // Admin App Rendering
  if (isAdmin) {
    const renderAdminContent = () => {
      switch (activeMenu) {
        case 'dashboard':
          return <AdminDashboardOverview />;
        case 'sales':
          return <BillingManagement />;
        case 'products':
          return <ProductManagement />;
        case 'stock':
          return <StockManagementModule />;
        case 'customers':
          return <CustomerManagement />;
        case 'suppliers':
          return <SupplierManagement />;
        case 'users':
          return <UserManagement />;
        case 'reports':
          return <ReportsModule />;
        case 'notifications':
          return <NotificationsCenter />;
        case 'settings':
          return <SettingsModule />;
        case 'security':
          return <SecurityLogs />;
        default:
          return <AdminDashboardOverview />;
      }
    };

    return (
      <div className="admin-layout">
        <AdminSidebar
          activeMenu={activeMenu}
          onMenuChange={setActiveMenu}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
        <div className="admin-main">
          <div className="admin-header">
            <button className="admin-menu-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
              ☰
            </button>
            <h1 className="admin-page-title">{getAdminPageTitle(activeMenu)}</h1>
            <div className="admin-header-actions">
              <button className="admin-header-btn">🔔</button>
              <button className="admin-header-btn">⚙️</button>
            </div>
          </div>
          <main className="admin-content">
            <div className="admin-container">{renderAdminContent()}</div>
          </main>
        </div>
      </div>
    );
  }

  // User App Rendering
  const renderUserContent = () => {
    switch (activeMenu) {
      case 'dashboard':
        return <UserDashboardOverview />;
      case 'billing':
        return <UserBilling />;
      case 'products':
        return <UserProducts />;
      case 'stock':
        return <UserStock />;
      case 'customers':
        return <UserCustomers />;
      case 'reports':
        return <UserReports />;
      case 'profile':
        return <UserProfile />;
      default:
        return <UserDashboardOverview />;
    }
  };

  return (
    <div className="app-layout">
      <UserSidebar
        activeMenu={activeMenu}
        onMenuChange={setActiveMenu}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <div className="app-main">
        <Header
          title={getUserPageTitle(activeMenu)}
          onMenuClick={() => setSidebarOpen(!sidebarOpen)}
        />
        <main className="app-content">
          <div className="container">{renderUserContent()}</div>
        </main>
      </div>
    </div>
  );
};

const getAdminPageTitle = (menu: string): string => {
  const titles: Record<string, string> = {
    dashboard: 'Dashboard Overview',
    sales: 'Sales & Billing',
    products: 'Product Management',
    stock: 'Stock Management',
    customers: 'Customer Management',
    suppliers: 'Supplier Management',
    users: 'User Management',
    reports: 'Reports & Analytics',
    notifications: 'Notification Center',
    settings: 'Settings',
    security: 'Security & Logs',
  };
  return titles[menu] || 'Dashboard';
};

const getPageTitle = (menu: string): string => {
  const titles: Record<string, string> = {
    dashboard: 'Dashboard',
    products: 'Products',
    stock: 'Stock Management',
    billing: 'Point of Sale',
    reports: 'Reports & Analytics',
    customers: 'Customers',
    profile: 'My Profile',
  };
  return titles[menu] || 'Dashboard';
};

const getUserPageTitle = (menu: string): string => {
  return getPageTitle(menu);
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
