import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { CartItem, Sale, SaleItem } from '../../types';
import { downloadInvoicePDF, printInvoice } from '../../services/pdfService';
import { BillingCart } from './BillingCart';
import { ProductSearchSelect } from './ProductSearchSelect';
import '../styles/Billing.css';

export const Billing: React.FC = () => {
  const { products, reduceStock, addSale } = useApp();
  const { user } = useAuth();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [gstEnabled, setGstEnabled] = useState(false);
  const [lastSale, setLastSale] = useState<Sale | null>(null);
  const [showInvoice, setShowInvoice] = useState(false);

  const cartTotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.quantity * item.price, 0);
  }, [cart]);

  const gstAmount = useMemo(() => {
    if (!gstEnabled) return 0;
    return cartTotal * 0.18; // 18% GST
  }, [cartTotal, gstEnabled]);

  const finalTotal = useMemo(() => {
    return cartTotal + gstAmount;
  }, [cartTotal, gstAmount]);

  const handleAddToCart = (productId: string, quantity: number) => {
    const product = products.find((p) => p.id === productId);
    if (!product) return;

    if (quantity > product.quantity) {
      alert(`Insufficient stock. Available: ${product.quantity}`);
      return;
    }

    const existingItem = cart.find((item) => item.productId === productId);

    if (existingItem) {
      if (existingItem.quantity + quantity > product.quantity) {
        alert(`Insufficient stock. Available: ${product.quantity}`);
        return;
      }
      setCart(
        cart.map((item) =>
          item.productId === productId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      );
    } else {
      setCart([
        ...cart,
        {
          productId,
          productName: product.name,
          quantity,
          price: product.sellingPrice,
          availableQuantity: product.quantity,
        },
      ]);
    }
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveFromCart(productId);
      return;
    }

    const product = products.find((p) => p.id === productId);
    if (!product || quantity > product.quantity) {
      alert(`Invalid quantity. Available: ${product?.quantity || 0}`);
      return;
    }

    setCart(
      cart.map((item) =>
        item.productId === productId ? { ...item, quantity } : item
      )
    );
  };

  const handleRemoveFromCart = (productId: string) => {
    setCart(cart.filter((item) => item.productId !== productId));
  };

  const handleClearCart = () => {
    if (cart.length > 0 && window.confirm('Clear cart?')) {
      setCart([]);
    }
  };

  const handleCheckout = () => {
    if (cart.length === 0) {
      alert('Cart is empty');
      return;
    }

    const saleItems: SaleItem[] = cart.map((item) => ({
      productId: item.productId,
      productName: item.productName,
      quantity: item.quantity,
      price: item.price,
      total: item.quantity * item.price,
    }));

    const sale: Sale = {
      id: Date.now().toString(),
      items: saleItems,
      subtotal: cartTotal,
      gst: gstEnabled ? 0.18 : 0,
      gstAmount,
      total: finalTotal,
      date: new Date(),
      soldBy: user?.username || 'Unknown',
    };

    // Reduce stock for all items
    cart.forEach((item) => {
      reduceStock(item.productId, item.quantity);
    });

    // Save sale
    addSale(sale);
    setLastSale(sale);
    setCart([]);
    setShowInvoice(true);
  };

  const handleDownloadInvoice = () => {
    if (lastSale) {
      downloadInvoicePDF(lastSale, 'StockMate Pro');
    }
  };

  const handlePrintInvoice = async () => {
    if (lastSale) {
      await printInvoice(lastSale, 'StockMate Pro');
    }
  };

  if (showInvoice && lastSale) {
    return (
      <div className="billing-container">
        <div className="invoice-preview">
          <div className="invoice-header">
            <h1>Invoice Generated Successfully</h1>
            <p>Invoice ID: {lastSale.id}</p>
          </div>

          <div className="invoice-details">
            <div className="invoice-section">
              <h3>StockMate Pro</h3>
              <p>Date: {new Date(lastSale.date).toLocaleString('en-IN')}</p>
              <p>Sold By: {lastSale.soldBy}</p>
            </div>

            <div className="invoice-items">
              {lastSale.items.map((item) => (
                <div key={item.productId} className="invoice-item">
                  <span>{item.productName}</span>
                  <span>{item.quantity} x ₹{item.price.toFixed(2)}</span>
                  <span>₹{item.total.toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="invoice-totals">
              <div className="total-row">
                <span>Subtotal:</span>
                <span>₹{lastSale.subtotal.toFixed(2)}</span>
              </div>
              {lastSale.gst > 0 && (
                <div className="total-row">
                  <span>GST (18%):</span>
                  <span>₹{lastSale.gstAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="total-row final">
                <span>Total:</span>
                <span>₹{lastSale.total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="invoice-actions">
            <button className="btn btn-primary" onClick={handlePrintInvoice}>
              🖨️ Print Invoice
            </button>
            <button className="btn btn-primary" onClick={handleDownloadInvoice}>
              📥 Download PDF
            </button>
            <button className="btn btn-secondary" onClick={() => setShowInvoice(false)}>
              Back to Billing
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="billing-container">
      <div className="billing-layout">
        <div className="billing-main">
          <div className="billing-header">
            <h1>Sales & Billing</h1>
            <p>Create sales invoices and manage transactions</p>
          </div>

          <ProductSearchSelect products={products} onAddToCart={handleAddToCart} />

          <div className="gst-toggle">
            <label className="gst-label">
              <input
                type="checkbox"
                checked={gstEnabled}
                onChange={(e) => setGstEnabled(e.target.checked)}
              />
              <span>Include GST (18%)</span>
            </label>
            {gstEnabled && (
              <div className="gst-info">
                GST will be calculated at checkout
              </div>
            )}
          </div>
        </div>

        <div className="billing-sidebar">
          <BillingCart
            cart={cart}
            subtotal={cartTotal}
            gstAmount={gstAmount}
            total={finalTotal}
            gstEnabled={gstEnabled}
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveItem={handleRemoveFromCart}
            onClearCart={handleClearCart}
            onCheckout={handleCheckout}
          />
        </div>
      </div>
    </div>
  );
};

