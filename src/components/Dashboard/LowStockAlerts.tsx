import React from 'react';
import { Product } from '../../types';
import '../styles/Dashboard.css';

interface LowStockAlertsProps {
  items: Product[];
}

export const LowStockAlerts: React.FC<LowStockAlertsProps> = ({ items }) => {
  return (
    <div className="low-stock-list">
      {items.map((item) => (
        <div key={item.id} className="low-stock-item">
          <div className="item-info">
            <h4>{item.name}</h4>
            <p className="item-category">{item.category}</p>
          </div>
          <div className="item-stock">
            <span className="stock-value">{item.quantity}</span>
            <span className="stock-label">units</span>
          </div>
        </div>
      ))}
    </div>
  );
};
