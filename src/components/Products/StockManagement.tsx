import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Product } from '../../types';
import { searchProducts, sortProducts, calculateLowStockItems } from '../../services/utilService';
import { StockUpdateModal } from './StockUpdateModal';
import '../styles/StockManagement.css';

export const StockManagement: React.FC = () => {
  const { products, updateProduct, deleteProduct } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'low' | 'high'>('all');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);

  const filteredProducts = useMemo(() => {
    let filtered = searchProducts(products, searchQuery, ['name', 'category', 'barcode']);

    if (filterType === 'low') {
      filtered = filtered.filter((p) => p.quantity < 5);
    } else if (filterType === 'high') {
      filtered = filtered.filter((p) => p.quantity >= 5);
    }

    return sortProducts(filtered, 'quantity', 'asc');
  }, [products, searchQuery, filterType]);

  const lowStockItems = useMemo(() => {
    return calculateLowStockItems(products, 5);
  }, [products]);

  const handleEditStock = (product: Product) => {
    setSelectedProduct(product);
    setShowUpdateModal(true);
  };

  const handleUpdateStock = (quantity: number, type: 'set' | 'add' | 'reduce') => {
    if (!selectedProduct) return;

    let newQuantity = selectedProduct.quantity;

    if (type === 'set') {
      newQuantity = quantity;
    } else if (type === 'add') {
      newQuantity += quantity;
    } else if (type === 'reduce') {
      newQuantity = Math.max(0, newQuantity - quantity);
    }

    updateProduct(selectedProduct.id, { quantity: newQuantity });
    setShowUpdateModal(false);
    setSelectedProduct(null);
  };

  const handleDeleteProduct = (id: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      deleteProduct(id);
    }
  };

  const lowStockPercentage = products.length > 0 
    ? ((lowStockItems.length / products.length) * 100).toFixed(1)
    : '0';

  return (
    <div className="stock-management-container">
      <div className="stock-header">
        <div>
          <h1>Stock Management</h1>
          <p>Monitor and manage your product inventory</p>
        </div>
        <div className="stock-summary">
          <div className="summary-item">
            <span className="summary-label">Total Products</span>
            <span className="summary-value">{products.length}</span>
          </div>
          <div className="summary-item warning">
            <span className="summary-label">Low Stock</span>
            <span className="summary-value">{lowStockItems.length}</span>
            <span className="summary-percentage">({lowStockPercentage}%)</span>
          </div>
        </div>
      </div>

      <div className="stock-filters">
        <input
          type="text"
          className="form-input"
          placeholder="🔍 Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        <div className="filter-buttons">
          <button
            className={`filter-btn ${filterType === 'all' ? 'active' : ''}`}
            onClick={() => setFilterType('all')}
          >
            All Products ({products.length})
          </button>
          <button
            className={`filter-btn ${filterType === 'low' ? 'active' : ''} ${
              lowStockItems.length > 0 ? 'alert' : ''
            }`}
            onClick={() => setFilterType('low')}
          >
            Low Stock ({lowStockItems.length})
          </button>
          <button
            className={`filter-btn ${filterType === 'high' ? 'active' : ''}`}
            onClick={() => setFilterType('high')}
          >
            Adequate Stock ({products.length - lowStockItems.length})
          </button>
        </div>
      </div>

      {filteredProducts.length === 0 ? (
        <div className="empty-state">
          <p>No products found</p>
        </div>
      ) : (
        <div className="stock-table-wrapper">
          <table className="stock-table">
            <thead>
              <tr>
                <th>Product Name</th>
                <th>Category</th>
                <th>Current Stock</th>
                <th>Status</th>
                <th>Selling Price</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr key={product.id} className={product.quantity < 5 ? 'low-stock-row' : ''}>
                  <td className="product-name">{product.name}</td>
                  <td>{product.category}</td>
                  <td className="stock-quantity">
                    <span className={`stock-badge ${product.quantity < 5 ? 'critical' : ''}`}>
                      {product.quantity}
                    </span>
                  </td>
                  <td>
                    {product.quantity < 5 ? (
                      <span className="status-badge critical">⚠️ Low Stock</span>
                    ) : product.quantity < 20 ? (
                      <span className="status-badge warning">⏰ Reorder Soon</span>
                    ) : (
                      <span className="status-badge success">✓ Adequate</span>
                    )}
                  </td>
                  <td>₹{product.sellingPrice.toFixed(2)}</td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="btn btn-small btn-primary"
                        onClick={() => handleEditStock(product)}
                        title="Edit stock"
                      >
                        📦
                      </button>
                      <button
                        className="btn btn-small btn-danger"
                        onClick={() => handleDeleteProduct(product.id)}
                        title="Delete product"
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showUpdateModal && selectedProduct && (
        <StockUpdateModal
          product={selectedProduct}
          onUpdate={handleUpdateStock}
          onClose={() => {
            setShowUpdateModal(false);
            setSelectedProduct(null);
          }}
        />
      )}
    </div>
  );
};
