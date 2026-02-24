import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Product } from '../../types';
import { searchProducts, sortProducts } from '../../services/utilService';
import { ProductForm } from './ProductForm';
import { ProductTable } from './ProductTable';
import '../styles/Products.css';

export const Products: React.FC = () => {
  const { products, addProduct, updateProduct, deleteProduct } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'price' | 'quantity'>('name');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const categories = useMemo(() => {
    return Array.from(new Set(products.map((p) => p.category))).sort();
  }, [products]);

 const filteredProducts = useMemo(() => {
    let filtered = searchProducts(products, searchQuery, ['name', 'category', 'barcode']);

    if (categoryFilter) {
      filtered = filtered.filter((p) => p.category === categoryFilter);
    }

    return sortProducts(filtered, sortBy, 'asc');
  }, [products, searchQuery, categoryFilter, sortBy]);

  const handleAddProduct = (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    addProduct({
      ...product,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    setShowForm(false);
  };

  const handleUpdateProduct = (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingProduct) {
      updateProduct(editingProduct.id, product);
      setEditingProduct(null);
      setShowForm(false);
    }
  };

  const handleDeleteProduct = (id: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      deleteProduct(id);
    }
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingProduct(null);
  };

  return (
    <div className="products-container">
      <div className="products-header">
        <div>
          <h1>Product Management</h1>
          <p>Manage your products and inventory</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowForm(true)}>
          ➕ Add New Product
        </button>
      </div>

      <div className="products-filters">
        <div className="filter-group">
          <input
            type="text"
            className="form-input"
            placeholder="🔍 Search products by name, category or barcode..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="filter-controls">
          <select
            className="form-select"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <select
            className="form-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
          >
            <option value="name">Sort by Name</option>
            <option value="price">Sort by Price</option>
            <option value="quantity">Sort by Quantity</option>
          </select>
        </div>
      </div>

      <div className="products-count">
        Showing {filteredProducts.length} of {products.length} products
      </div>

      <ProductTable
        products={filteredProducts}
        onEdit={handleEditProduct}
        onDelete={handleDeleteProduct}
      />

      {showForm && (
        <ProductForm
          product={editingProduct || undefined}
          onSubmit={editingProduct ? handleUpdateProduct : handleAddProduct}
          onClose={handleCloseForm}
        />
      )}
    </div>
  );
};
