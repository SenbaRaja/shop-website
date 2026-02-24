import React, { useState } from 'react';
import { Product } from '../../types';
import { searchProducts } from '../../services/utilService';
import '../styles/Billing.css';

interface ProductSearchSelectProps {
  products: Product[];
  onAddToCart: (productId: string, quantity: number) => void;
}

export const ProductSearchSelect: React.FC<ProductSearchSelectProps> = ({
  products,
  onAddToCart,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [showResults, setShowResults] = useState(false);

  const results = searchProducts(products, searchQuery, ['name', 'category', 'barcode']).slice(
    0,
    10
  );

  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
    setSearchQuery(product.name);
    setShowResults(false);
    setQuantity(1);
  };

  const handleAddToCart = () => {
    if (!selectedProduct) {
      alert('Please select a product');
      return;
    }

    onAddToCart(selectedProduct.id, quantity);
    setSearchQuery('');
    setSelectedProduct(null);
    setQuantity(1);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && selectedProduct) {
      handleAddToCart();
    }
  };

  return (
    <div className="product-search-container">
      <div className="search-field-group">
        <div className="search-wrapper">
          <input
            type="text"
            className="form-input search-input"
            placeholder="🔍 Search products by name, category, or barcode..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowResults(true);
            }}
            onFocus={() => setShowResults(true)}
            onKeyPress={handleKeyPress}
          />

          {showResults && searchQuery && results.length > 0 && (
            <div className="search-results">
              {results.map((product) => (
                <div
                  key={product.id}
                  className={`result-item ${
                    selectedProduct?.id === product.id ? 'selected' : ''
                  }`}
                  onClick={() => handleSelectProduct(product)}
                >
                  <div className="result-name">{product.name}</div>
                  <div className="result-details">
                    <span className="category">{product.category}</span>
                    <span className="price">₹{product.sellingPrice}</span>
                    <span className={`stock ${product.quantity < 5 ? 'low' : ''}`}>
                      Stock: {product.quantity}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {selectedProduct && (
        <div className="selected-product-display">
          <div className="product-info">
            <h4>{selectedProduct.name}</h4>
            <p>Price: ₹{selectedProduct.sellingPrice}</p>
            <p>Available: {selectedProduct.quantity} units</p>
          </div>

          <div className="quantity-selector">
            <button
              className="qty-btn"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              disabled={quantity <= 1}
            >
              −
            </button>
            <input
              type="number"
              className="qty-input"
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
              min="1"
              max={selectedProduct.quantity}
            />
            <button
              className="qty-btn"
              onClick={() => setQuantity(Math.min(selectedProduct.quantity, quantity + 1))}
              disabled={quantity >= selectedProduct.quantity}
            >
              +
            </button>
          </div>

          <div className="quick-qty-buttons">
            {[1, 2, 5, 10].map((q) => (
              q <= selectedProduct.quantity && (
                <button
                  key={q}
                  className="quick-qty-btn"
                  onClick={() => setQuantity(q)}
                >
                  {q}
                </button>
              )
            ))}
          </div>

          <button className="btn btn-success btn-large" onClick={handleAddToCart}>
            ➕ Add to Cart
          </button>
        </div>
      )}
    </div>
  );
};
