import React from 'react';
import { Product } from '../../types';
import { formatCurrency } from '../../services/utilService';
import '../styles/Products.css';

interface ProductTableProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
}

export const ProductTable: React.FC<ProductTableProps> = ({
  products,
  onEdit,
  onDelete,
}) => {
  if (products.length === 0) {
    return (
      <div className="empty-state">
        <p>📦 No products found. Add your first product to get started!</p>
      </div>
    );
  }

  return (
    <div className="table-wrapper">
      <table className="table">
        <thead>
          <tr>
            <th>Product Name</th>
            <th>Category</th>
            <th>Purchase Price</th>
            <th>Selling Price</th>
            <th>Quantity</th>
            <th>Profit/Unit</th>
            <th>Barcode</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => {
            const profitPerUnit = product.sellingPrice - product.purchasePrice;
            return (
              <tr key={product.id}>
                <td className="product-name">{product.name}</td>
                <td>
                  <span className="category-badge">{product.category}</span>
                </td>
                <td>{formatCurrency(product.purchasePrice)}</td>
                <td>{formatCurrency(product.sellingPrice)}</td>
                <td>
                  <span className={`quantity-badge ${product.quantity < 5 ? 'low' : ''}`}>
                    {product.quantity}
                  </span>
                </td>
                <td className="profit-value">{formatCurrency(profitPerUnit)}</td>
                <td className="barcode-value">
                  {product.barcode ? (
                    <code>{product.barcode.substring(0, 12)}...</code>
                  ) : (
                    <span className="text-secondary">-</span>
                  )}
                </td>
                <td>
                  <div className="action-buttons">
                    <button
                      className="btn btn-small btn-primary"
                      onClick={() => onEdit(product)}
                      title="Edit product"
                    >
                      ✏️
                    </button>
                    <button
                      className="btn btn-small btn-danger"
                      onClick={() => onDelete(product.id)}
                      title="Delete product"
                    >
                      🗑️
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
