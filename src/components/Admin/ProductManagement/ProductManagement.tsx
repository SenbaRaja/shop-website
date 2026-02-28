import React from 'react';
import '../../styles/AdminModules.css';

export const ProductManagement: React.FC = () => {
  const [products] = React.useState([
    { id: 1, name: 'Product A', sku: 'SKU-001', category: 'Electronics', cost: 500, mrp: 899, stock: 45 },
    { id: 2, name: 'Product B', sku: 'SKU-002', category: 'Grocery', cost: 150, mrp: 299, stock: 120 },
    { id: 3, name: 'Product C', sku: 'SKU-003', category: 'Beauty', cost: 250, mrp: 599, stock: 5 },
  ]);

  return (
    <div className="admin-module">
      <div className="module-header">
        <h1>📦 Product Management</h1>
        <button className="btn-primary">➕ Add Product</button>
      </div>

      <div className="module-tabs">
        <button className="tab-btn active">All Products</button>
        <button className="tab-btn">Categories</button>
        <button className="tab-btn">Brands</button>
        <button className="tab-btn">Bulk Import</button>
      </div>

      <div className="module-content">
        <table className="data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>SKU</th>
              <th>Category</th>
              <th>Cost Price</th>
              <th>MRP</th>
              <th>Stock</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td>{product.name}</td>
                <td>{product.sku}</td>
                <td>{product.category}</td>
                <td>₹{product.cost}</td>
                <td>₹{product.mrp}</td>
                <td>
                  <span className={`stock-badge ${product.stock < 10 ? 'critical' : 'normal'}`}>
                    {product.stock}
                  </span>
                </td>
                <td className="action-btns">
                  <button className="btn-sm btn-edit">✏️</button>
                  <button className="btn-sm btn-delete">🗑️</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
