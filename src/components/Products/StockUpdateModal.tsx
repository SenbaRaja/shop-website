import React, { useState } from 'react';
import { Product } from '../../types';
import '../styles/StockManagement.css';

interface StockUpdateModalProps {
  product: Product;
  onUpdate: (quantity: number, type: 'set' | 'add' | 'reduce') => void;
  onClose: () => void;
}

export const StockUpdateModal: React.FC<StockUpdateModalProps> = ({
  product,
  onUpdate,
  onClose,
}) => {
  const [quantity, setQuantity] = useState(0);
  const [updateType, setUpdateType] = useState<'set' | 'add' | 'reduce'>('add');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (quantity > 0 || updateType === 'set') {
      onUpdate(quantity, updateType);
    }
  };

  const presetButtons = [5, 10, 20, 50, 100];

  return (
    <div className="modal-overlay open">
      <div className="modal stock-update-modal">
        <div className="modal-header">
          <h3>Update Stock: {product.name}</h3>
          <button className="modal-close" onClick={onClose}>
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="current-stock-info">
              <p>Current Stock: <strong>{product.quantity} units</strong></p>
            </div>

            <div className="form-group">
              <label>Update Type</label>
              <div className="update-type-buttons">
                <button
                  type="button"
                  className={`type-btn ${updateType === 'add' ? 'active' : ''}`}
                  onClick={() => setUpdateType('add')}
                >
                  ➕ Add Stock
                </button>
                <button
                  type="button"
                  className={`type-btn ${updateType === 'reduce' ? 'active' : ''}`}
                  onClick={() => setUpdateType('reduce')}
                >
                  ➖ Reduce Stock
                </button>
                <button
                  type="button"
                  className={`type-btn ${updateType === 'set' ? 'active' : ''}`}
                  onClick={() => setUpdateType('set')}
                >
                  🔧 Set Stock
                </button>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="quantity">
                {updateType === 'add' && 'Add Quantity'}
                {updateType === 'reduce' && 'Reduce Quantity'}
                {updateType === 'set' && 'Set Total Quantity'}
              </label>
              <input
                type="number"
                id="quantity"
                className="form-input"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(0, parseInt(e.target.value) || 0))}
                min="0"
                placeholder="Enter quantity"
              />
            </div>

            <div className="preset-buttons">
              <p>Quick Select:</p>
              <div className="preset-grid">
                {presetButtons.map((value) => (
                  <button
                    key={value}
                    type="button"
                    className="preset-btn"
                    onClick={() => setQuantity(value)}
                  >
                    {value}
                  </button>
                ))}
              </div>
            </div>

            <div className="update-preview">
              <p>
                {updateType === 'add' && `New Stock: ${product.quantity + quantity} units`}
                {updateType === 'reduce' && `New Stock: ${Math.max(0, product.quantity - quantity)} units`}
                {updateType === 'set' && `New Stock: ${quantity} units`}
              </p>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={quantity === 0 && updateType !== 'set'}
            >
              Update Stock
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
