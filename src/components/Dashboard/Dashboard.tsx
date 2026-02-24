import React, { useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import {
  calculateLowStockItems,
  calculateTodaysSalesReport,
  calculateTotalProfit,
} from '../../services/reportService';
import { SummaryCards } from './SummaryCards';
import { RecentSalesTable } from './RecentSalesTable';
import { LowStockAlerts } from './LowStockAlerts';
import '../styles/Dashboard.css';

export const Dashboard: React.FC = () => {
  const { products, sales } = useApp();

  const stats = useMemo(() => {
    const totalProducts = products.length;
    const todaySales = calculateTodaysSalesReport(sales);
    const lowStockItems = calculateLowStockItems(products, 5);
    const totalProfit = calculateTotalProfit(sales, products);

    return {
      totalProducts,
      todaySalesAmount: todaySales.totalSales,
      lowStockCount: lowStockItems.length,
      totalProfit,
    };
  }, [products, sales]);

  const recentSales = useMemo(() => {
    const today = new Date();
    const todaySales = sales.filter((sale) => {
      const saleDate = new Date(sale.date);
      return (
        saleDate.toDateString() === today.toDateString()
      );
    });
    return todaySales.slice(-10).reverse();
  }, [sales]);

  const lowStockItems = useMemo(() => {
    return calculateLowStockItems(products, 5);
  }, [products]);

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <p>Welcome to StockMate Pro - Your Shop Management System</p>
      </div>

      <SummaryCards stats={stats} />

      <div className="dashboard-grid">
        <div className="dashboard-section">
          <h2 className="section-title">Recent Sales</h2>
          <RecentSalesTable sales={recentSales} />
        </div>

        {lowStockItems.length > 0 && (
          <div className="dashboard-section">
            <h2 className="section-title">⚠️ Low Stock Alerts</h2>
            <LowStockAlerts items={lowStockItems} />
          </div>
        )}
      </div>
    </div>
  );
};
