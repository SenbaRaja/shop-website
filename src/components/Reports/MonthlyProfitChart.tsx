import React from 'react';
import { MonthlySalesReport } from '../../types';

interface MonthlyProfitChartProps {
  monthlySales: MonthlySalesReport[];
}

export const MonthlyProfitChart: React.FC<MonthlyProfitChartProps> = ({ monthlySales }) => {
  const maxValue = Math.max(...monthlySales.map((m) => m.totalSales), 1);
  const chartHeight = 200;

  return (
    <div className="chart-container">
      <div className="bar-chart">
        <div className="bars">
          {monthlySales.slice(-12).map((month) => (
            <div key={month.month} className="bar-wrapper">
              <div className="bar-container">
                <div
                  className="bar monthly"
                  style={{
                    height: `${(month.totalSales / maxValue) * chartHeight}px`,
                  }}
                >
                  {month.totalSales > 0 && (
                    <span className="bar-value">₹{(month.totalSales / 1000).toFixed(0)}k</span>
                  )}
                </div>
              </div>
              <div className="bar-label">{month.month}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
