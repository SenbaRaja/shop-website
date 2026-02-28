import React, { useState } from 'react';
import '../../styles/UserBilling.css';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  stock: number;
}

export const UserBilling: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedPayment, setSelectedPayment] = useState<'cash' | 'upi'>('cash');
  const [customerName, setCustomerName] = useState('');

  const products = [
    { id: '1', name: 'Rice (1kg)', price: 150, stock: 45 },
    { id: '2', name: 'Wheat (1kg)', price: 120, stock: 30 },
    { id: '3', name: 'Sugar (1kg)', price: 140, stock: 25 },
    { id: '4', name: 'Oil (1L)', price: 280, stock: 15 },
    { id: '5', name: 'Salt (1kg)', price: 80, stock: 50 },
    { id: '6', name: 'Tea (250g)', price: 220, stock: 20 },
    { id: '7', name: 'Coffee (100g)', price: 180, stock: 18 },
    { id: '8', name: 'Milk (1L)', price: 60, stock: 40 },
  ];

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const addToCart = (product: typeof products[0]) => {
    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
      if (existingItem.quantity < product.stock) {
        setCart(cart.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        ));
      }
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const removeFromCart = (id: string) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity === 0) {
      removeFromCart(id);
    } else {
      setCart(cart.map(item =>
        item.id === id ? { ...item, quantity } : item
      ));
    }
  };

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const gst = Math.round(subtotal * 0.18);
  const total = subtotal + gst;

  const handlePrintBill = () => {
    window.print();
  };

  const handleCompleteBill = () => {
    alert(`Bill completed!\nTotal: ₹${total}\nPayment: ${selectedPayment}`);
    setCart([]);
    setCustomerName('');
  };

  return (
    <div className="user-billing">
      <div className="billing-container">
        {/* Products Section */}
        <div className="billing-left">
          <div className="billing-header">
            <h1>🛍️ Create Bill</h1>
          </div>

          <div className="product-search">
            <input
              type="text"
              placeholder="🔍 Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="products-grid">
            {filteredProducts.map(product => (
              <div key={product.id} className="product-card">
                <div className="product-icon">📦</div>
                <div className="product-info">
                  <p className="product-name">{product.name}</p>
                  <p className="product-price">₹{product.price}</p>
                  <p className="product-stock">Stock: {product.stock}</p>
                </div>
                <button
                  className="add-btn"
                  onClick={() => addToCart(product)}
                  disabled={product.stock === 0}
                >
                  ADD
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Cart Section */}
        <div className="billing-right">
          <div className="cart-section">
            <h2>🛒 Bill Cart</h2>

            <div className="customer-input">
              <input
                type="text"
                placeholder="Customer name (optional)"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
              />
            </div>

            <div className="cart-items">
              {cart.length === 0 ? (
                <div className="empty-cart">
                  <p>📭</p>
                  <p>Cart is empty</p>
                </div>
              ) : (
                cart.map(item => (
                  <div key={item.id} className="cart-item">
                    <div className="item-info">
                      <p className="item-name">{item.name}</p>
                      <p className="item-price">₹{item.price} x {item.quantity}</p>
                    </div>
                    <div className="item-controls">
                      <button
                        className="qty-btn"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      >
                        −
                      </button>
                      <span className="qty-display">{item.quantity}</span>
                      <button
                        className="qty-btn"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        disabled={item.quantity >= item.stock}
                      >
                        +
                      </button>
                      <button
                        className="remove-btn"
                        onClick={() => removeFromCart(item.id)}
                      >
                        🗑️
                      </button>
                    </div>
                    <p className="item-total">₹{item.price * item.quantity}</p>
                  </div>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <>
                <div className="cart-summary">
                  <div className="summary-row">
                    <span>Subtotal</span>
                    <span>₹{subtotal}</span>
                  </div>
                  <div className="summary-row">
                    <span>GST (18%)</span>
                    <span>₹{gst}</span>
                  </div>
                  <div className="summary-row total">
                    <span>Total Amount</span>
                    <span>₹{total}</span>
                  </div>
                </div>

                <div className="payment-section">
                  <h3>Payment Method</h3>
                  <div className="payment-buttons">
                    <button
                      className={`payment-btn ${selectedPayment === 'cash' ? 'active' : ''}`}
                      onClick={() => setSelectedPayment('cash')}
                    >
                      💵 Cash
                    </button>
                    <button
                      className={`payment-btn ${selectedPayment === 'upi' ? 'active' : ''}`}
                      onClick={() => setSelectedPayment('upi')}
                    >
                      📱 UPI
                    </button>
                  </div>
                </div>

                <div className="action-buttons">
                  <button className="btn btn-print" onClick={handlePrintBill}>
                    🖨️ Print Bill
                  </button>
                  <button className="btn btn-complete" onClick={handleCompleteBill}>
                    ✅ Complete Sale
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
