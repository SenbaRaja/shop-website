import React from 'react';
import { CartItem } from '../../types';
import '../styles/Billing.css';

interface BillingCartProps {
  cart: CartItem[];
  subtotal: number;
  gstAmount: number;
  total: number;
  gstEnabled: boolean;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
  onCheckout: () => void;
}

export const BillingCart: React.FC<BillingCartProps> = ({
  cart,
  subtotal,
  gstAmount,
  total,
  gstEnabled,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onCheckout,
}) => {
  return (
    <div className="billing-cart">
      <div className="cart-header">
        <h2>🛒 Cart</h2>
        {cart.length > 0 && (
          <span className="cart-count">{cart.length} items</span>
        )}
      </div>

      {cart.length === 0 ? (
        <div className="empty-cart">
          <p>Cart is empty</p>
          <p className="empty-cart-text">Add products to get started</p>
        </div>
      ) : (
        <>
          <div className="cart-items">
            {cart.map((item) => (
              <div key={item.productId} className="cart-item">
                <div className="item-header">
                  <h4>{item.productName}</h4>
                  <button
                    className="remove-btn"
                    onClick={() => onRemoveItem(item.productId)}
                  >
                    ✕
                  </button>
                </div>

                <div className="item-details">
                  <span>₹{item.price.toFixed(2)}</span>
                  <span>×</span>
                  <input
                    type="number"
                    className="qty-input"
                    value={item.quantity}
                    onChange={(e) =>
                      onUpdateQuantity(item.productId, parseInt(e.target.value) || 1)
                    }
                    min="1"
                    max={item.availableQuantity}
                  />
                </div>

                <div className="item-total">
                  ₹{(item.quantity * item.price).toFixed(2)}
                </div>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <div className="summary-row">
              <span>Subtotal:</span>
              <span className="amount">₹{subtotal.toFixed(2)}</span>
            </div>

            {gstEnabled && (
              <div className="summary-row gst">
                <span>GST (18%):</span>
                <span className="amount gst-amount">₹{gstAmount.toFixed(2)}</span>
              </div>
            )}

            <div className="summary-row total">
              <span>Total:</span>
              <span className="amount">₹{total.toFixed(2)}</span>
            </div>
          </div>

          <div className="cart-actions">
            <button className="btn btn-secondary btn-small" onClick={onClearCart}>
              Clear Cart
            </button>
            <button className="btn btn-primary btn-large" onClick={onCheckout}>
              💳 Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
};
