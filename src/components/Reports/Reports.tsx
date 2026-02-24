import React, { useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import {
  calculateMonthlySalesReports,
  getTopSellingProducts,
  calculateLowStockItems,
} from '../../services/reportService';
import { DailySalesChart } from './DailySalesChart';
import { MonthlyProfitChart } from './MonthlyProfitChart';
import { TopProductsTable } from './TopProductsTable';
import '../styles/Reports.css';

export const Reports: React.FC = () => {
  const { products, sales } = useApp();

  const monthlySales = useMemo(() => {
    return calculateMonthlySalesReports(sales);
  }, [sales]);

  const topProducts = useMemo(() => {
    return getTopSellingProducts(sales, 10);
  }, [sales]);

  const lowStockItems = useMemo(() => {
    return calculateLowStockItems(products, 5);
  }, [products]);

  const totalRevenue = useMemo(() => {
    return sales.reduce((sum, sale) => sum + sale.total, 0);
  }, [sales]);

  const totalSales = useMemo(() => {
    return sales.length;
  }, [sales]);

  const averageOrderValue = useMemo(() => {
    return totalSales > 0 ? totalRevenue / totalSales : 0;
  }, [totalRevenue, totalSales]);

  return (
    <div className="reports-container">
      <div className="reports-header">
        <h1>Reports & Analytics</h1>
        <p>View your business insights and performance metrics</p>
      </div>

      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-icon">💰</div>
          <div className="metric-content">
            <p className="metric-label">Total Revenue</p>
            <p className="metric-value">₹{totalRevenue.toFixed(2)}</p>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">🛒</div>
          <div className="metric-content">
            <p className="metric-label">Total Sales</p>
            <p className="metric-value">{totalSales}</p>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">📊</div>
          <div className="metric-content">
            <p className="metric-label">Average Order Value</p>
            <p className="metric-value">₹{averageOrderValue.toFixed(2)}</p>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">📦</div>
          <div className="metric-content">
            <p className="metric-label">Total Products</p>
            <p className="metric-value">{products.length}</p>
          </div>
        </div>
      </div>

      <div className="charts-grid">
        <div className="chart-card">
          <h2 className="chart-title">Daily Sales Trend</h2>
          <DailySalesChart sales={sales} />
        </div>

        <div className="chart-card">
          <h2 className="chart-title">Monthly Revenue</h2>
          <MonthlyProfitChart monthlySales={monthlySales} />
        </div>
      </div>

      <div className="reports-grid">
        <div className="report-card">
          <h2 className="report-title">Top Selling Products</h2>
          <TopProductsTable products={topProducts} />
        </div>

        {lowStockItems.length > 0 && (
          <div className="report-card">
            <h2 className="report-title">Low Stock Alert</h2>
            <div className="low-stock-report">
              {lowStockItems.slice(0, 5).map((item) => (
                <div key={item.id} className="low-stock-item">
                  <h4>{item.name}</h4>
                  <div className="stock-info">
                    <span className="stock-level">{item.quantity} units</span>
                    <span className="stock-percentage">
                      {((item.quantity / 50) * 100).toFixed(0)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {monthlySales.length > 0 && (
        <div className="monthly-report">
          <h2 className="report-title">Monthly Summary</h2>
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>Month</th>
                  <th>Total Sales</th>
                  <th>Sales Count</th>
                  <th>Average Order</th>
                </tr>
              </thead>
              <tbody>
                {monthlySales.map((month) => (
                  <tr key={month.month}>
                    <td>{month.month}</td>
                    <td>₹{month.totalSales.toFixed(2)}</td>
                    <td>{month.salesCount}</td>
                    <td>₹{(month.totalSales / month.salesCount).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
