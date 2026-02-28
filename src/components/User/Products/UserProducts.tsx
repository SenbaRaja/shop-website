import React, { useState } from 'react';
import '../../styles/UserModules.css';

export const UserProducts: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('name');

  const products = [
    { id: 1, name: 'Rice (1kg)', category: 'Grains', price: 150, stock: 45 },
    { id: 2, name: 'Wheat (1kg)', category: 'Grains', price: 120, stock: 30 },
    { id: 3, name: 'Sugar (1kg)', category: 'Groceries', price: 140, stock: 25 },
    { id: 4, name: 'Oil (1L)', category: 'Oils', price: 280, stock: 15 },
    { id: 5, name: 'Salt (1kg)', category: 'Groceries', price: 80, stock: 50 },
    { id: 6, name: 'Tea (250g)', category: 'Beverages', price: 220, stock: 20 },
    { id: 7, name: 'Coffee (100g)', category: 'Beverages', price: 180, stock: 18 },
    { id: 8, name: 'Milk (1L)', category: 'Dairy', price: 60, stock: 40 },
  ];

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="user-module">
      <div className="module-header">
        <h1>📦 Products</h1>
        <p className="read-only-badge">Read Only</p>
      </div>

      <div className="module-filters">
        <input
          type="text"
          placeholder="🔍 Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="filter-input"
        />
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="filter-select"
        >
          <option value="name">Sort by Name</option>
          <option value="price">Sort by Price</option>
          <option value="stock">Sort by Stock</option>
        </select>
      </div>

      <div className="module-content">
        <table className="products-table">
          <thead>
            <tr>
              <th>Product Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map(product => (
              <tr key={product.id}>
                <td>{product.name}</td>
                <td>{product.category}</td>
                <td>₹{product.price}</td>
                <td>{product.stock}</td>
                <td>
                  <span className={`status-badge ${product.stock > 10 ? 'in-stock' : 'low-stock'}`}>
                    {product.stock > 10 ? '✓ In Stock' : '⚠️ Low Stock'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
