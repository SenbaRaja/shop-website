import React, { useState, useCallback } from 'react';
import { Product } from '../../types';
import { formatCurrency, validateBarcode, generateBarcode } from '../../services/utilService';
import '../styles/Products.css';

interface ProductFormProps {
  product?: Product;
  onSubmit: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onClose: () => void;
}

export const ProductForm: React.FC<ProductFormProps> = ({ product, onSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    name: product?.name || '',
    category: product?.category || '',
    purchasePrice: product?.purchasePrice || 0,
    sellingPrice: product?.sellingPrice || 0,
    quantity: product?.quantity || 0,
    barcode: product?.barcode || '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = useCallback(() => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Product name is required';
    }
    if (!formData.category.trim()) {
      newErrors.category = 'Category is required';
    }
    if (formData.purchasePrice < 0) {
      newErrors.purchasePrice = 'Purchase price must be positive';
    }
    if (formData.sellingPrice < formData.purchasePrice) {
      newErrors.sellingPrice = 'Selling price must be greater than purchase price';
    }
    if (formData.quantity < 0) {
      newErrors.quantity = 'Quantity must be positive';
    }
    if (formData.barcode && !validateBarcode(formData.barcode)) {
      newErrors.barcode = 'Invalid barcode format';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'name' || name === 'category' || name === 'barcode' 
        ? value 
        : parseFloat(value) || 0,
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleGenerateBarcode = () => {
    setFormData((prev) => ({
      ...prev,
      barcode: generateBarcode(),
    }));
  };

  return (
    <div className="modal-overlay open">
      <div className="modal">
        <div className="modal-header">
          <h3>{product ? 'Edit Product' : 'Add New Product'}</h3>
          <button className="modal-close" onClick={onClose}>
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group required">
              <label htmlFor="name">Product Name</label>
              <input
                type="text"
                id="name"
                name="name"
                className="form-input"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter product name"
              />
              {errors.name && <div className="form-error">{errors.name}</div>}
            </div>

            <div className="form-group required">
              <label htmlFor="category">Category</label>
              <input
                type="text"
                id="category"
                name="category"
                className="form-input"
                value={formData.category}
                onChange={handleChange}
                placeholder="Enter category (e.g., Electronics, Clothing)"
              />
              {errors.category && <div className="form-error">{errors.category}</div>}
            </div>

            <div className="form-row">
              <div className="form-group required">
                <label htmlFor="purchasePrice">Purchase Price (₹)</label>
                <input
                  type="number"
                  id="purchasePrice"
                  name="purchasePrice"
                  className="form-input"
                  value={formData.purchasePrice}
                  onChange={handleChange}
                  step="0.01"
                  min="0"
                />
                {errors.purchasePrice && (
                  <div className="form-error">{errors.purchasePrice}</div>
                )}
              </div>

              <div className="form-group required">
                <label htmlFor="sellingPrice">Selling Price (₹)</label>
                <input
                  type="number"
                  id="sellingPrice"
                  name="sellingPrice"
                  className="form-input"
                  value={formData.sellingPrice}
                  onChange={handleChange}
                  step="0.01"
                  min="0"
                />
                {errors.sellingPrice && (
                  <div className="form-error">{errors.sellingPrice}</div>
                )}
              </div>
            </div>

            <div className="form-group required">
              <label htmlFor="quantity">Quantity</label>
              <input
                type="number"
                id="quantity"
                name="quantity"
                className="form-input"
                value={formData.quantity}
                onChange={handleChange}
                min="0"
                placeholder="Enter quantity"
              />
              {errors.quantity && <div className="form-error">{errors.quantity}</div>}
            </div>

            <div className="form-group">
              <label htmlFor="barcode">Barcode (Optional)</label>
              <div className="barcode-input-group">
                <input
                  type="text"
                  id="barcode"
                  name="barcode"
                  className="form-input"
                  value={formData.barcode}
                  onChange={handleChange}
                  placeholder="Enter or generate barcode"
                />
                <button
                  type="button"
                  className="btn btn-secondary btn-small"
                  onClick={handleGenerateBarcode}
                >
                  Generate
                </button>
              </div>
              {errors.barcode && <div className="form-error">{errors.barcode}</div>}
            </div>

            <div className="profit-calculator">
              <p>Profit per unit: <strong>{formatCurrency(formData.sellingPrice - formData.purchasePrice)}</strong></p>
              <p>Profit margin: <strong>{formData.purchasePrice > 0 ? ((((formData.sellingPrice - formData.purchasePrice) / formData.purchasePrice) * 100).toFixed(1)) : '0'}%</strong></p>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {product ? 'Update Product' : 'Add Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
