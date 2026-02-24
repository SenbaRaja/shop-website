import React from 'react';
import { formatCurrency } from '../../services/utilService';
import '../styles/Dashboard.css';

interface SummaryCardProps {
  stats: {
    totalProducts: number;
    todaySalesAmount: number;
    lowStockCount: number;
    totalProfit: number;
  };
}

export const SummaryCards: React.FC<SummaryCardProps> = ({ stats }) => {
  const cards = [
    {
      title: 'Total Products',
      value: stats.totalProducts.toString(),
      icon: '📦',
      color: 'blue',
    },
    {
      title: "Today's Sales",
      value: formatCurrency(stats.todaySalesAmount),
      icon: '💰',
      color: 'green',
    },
    {
      title: 'Low Stock Items',
      value: stats.lowStockCount.toString(),
      icon: '⚠️',
      color: stats.lowStockCount > 0 ? 'red' : 'gray',
    },
    {
      title: 'Total Profit',
      value: formatCurrency(stats.totalProfit),
      icon: '📈',
      color: 'purple',
    },
  ];

  return (
    <div className="summary-cards">
      {cards.map((card, index) => (
        <div key={index} className={`summary-card card-${card.color}`}>
          <div className="card-icon">{card.icon}</div>
          <div className="card-content">
            <p className="card-title">{card.title}</p>
            <p className="card-value">{card.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
};
