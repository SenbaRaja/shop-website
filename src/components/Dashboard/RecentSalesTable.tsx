import React from 'react';
import { Sale } from '../../types';
import { formatCurrency } from '../../services/utilService';
import '../styles/Dashboard.css';

interface RecentSalesTableProps {
  sales: Sale[];
}

export const RecentSalesTable: React.FC<RecentSalesTableProps> = ({ sales }) => {
  if (sales.length === 0) {
    return (
      <div className="empty-state">
        <p>No sales yet today</p>
      </div>
    );
  }

  return (
    <div className="table-wrapper">
      <table className="table">
        <thead>
          <tr>
            <th>Invoice ID</th>
            <th>Items</th>
            <th>Amount</th>
            <th>GST</th>
            <th>Total</th>
            <th>Time</th>
          </tr>
        </thead>
        <tbody>
          {sales.map((sale) => (
            <tr key={sale.id}>
              <td className="invoice-id">{sale.id.substring(0, 8)}</td>
              <td>{sale.items.length}</td>
              <td>{formatCurrency(sale.subtotal)}</td>
              <td>{sale.gst > 0 ? `${(sale.gst * 100).toFixed(0)}%` : '-'}</td>
              <td className="total-amount">{formatCurrency(sale.total)}</td>
              <td>{new Date(sale.date).toLocaleTimeString('en-IN')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
