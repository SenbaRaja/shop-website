import React from 'react';
import { TopSellingProduct } from '../../types';
import { formatCurrency } from '../../services/utilService';

interface TopProductsTableProps {
  products: TopSellingProduct[];
}

export const TopProductsTable: React.FC<TopProductsTableProps> = ({ products }) => {
  if (products.length === 0) {
    return <div className="empty-state">No sales data available</div>;
  }

  return (
    <div className="table-wrapper">
      <table className="table">
        <thead>
          <tr>
            <th>Rank</th>
            <th>Product Name</th>
            <th>Quantity Sold</th>
            <th>Revenue</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product, index) => (
            <tr key={product.productId}>
              <td className="rank-cell">#{index + 1}</td>
              <td>{product.productName}</td>
              <td className="qty-cell">{product.quantitySold}</td>
              <td className="revenue-cell">{formatCurrency(product.revenue)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
