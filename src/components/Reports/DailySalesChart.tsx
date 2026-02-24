import React, { useMemo } from 'react';
import { Sale } from '../../types';

interface DailySalesChartProps {
  sales: Sale[];
}

export const DailySalesChart: React.FC<DailySalesChartProps> = ({ sales }) => {
  const chartData = useMemo(() => {
    const last7Days: { [key: string]: number } = {};
    const today = new Date();

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
      last7Days[dateStr] = 0;
    }

    sales.forEach((sale) => {
      const saleDate = new Date(sale.date);
      const dateStr = saleDate.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
      if (dateStr in last7Days) {
        last7Days[dateStr] += sale.total;
      }
    });

    return last7Days;
  }, [sales]);

  const maxValue = Math.max(...Object.values(chartData));
  const chartHeight = 200;

  return (
    <div className="chart-container">
      <div className="bar-chart">
        <div className="bars">
          {Object.entries(chartData).map(([date, value]) => (
            <div key={date} className="bar-wrapper">
              <div className="bar-container">
                <div
                  className="bar"
                  style={{
                    height: `${maxValue > 0 ? (value / maxValue) * chartHeight : 0}px`,
                  }}
                >
                  {value > 0 && <span className="bar-value">₹{(value / 1000).toFixed(0)}k</span>}
                </div>
              </div>
              <div className="bar-label">{date}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
