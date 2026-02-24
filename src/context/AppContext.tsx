import React, { createContext, useContext, useState, useEffect } from 'react';
import { AppContextType, Product, Sale } from '../types';

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);

  // Load data from localStorage on mount
  useEffect(() => {
    const storedProducts = localStorage.getItem('stockmate_products');
    const storedSales = localStorage.getItem('stockmate_sales');

    if (storedProducts) {
      try {
        setProducts(JSON.parse(storedProducts));
      } catch (e) {
        console.error('Error loading products:', e);
      }
    }

    if (storedSales) {
      try {
        setSales(JSON.parse(storedSales));
      } catch (e) {
        console.error('Error loading sales:', e);
      }
    }
  }, []);

  // Save products to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('stockmate_products', JSON.stringify(products));
  }, [products]);

  // Save sales to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('stockmate_sales', JSON.stringify(sales));
  }, [sales]);

  const addProduct = (product: Product) => {
    setProducts([...products, { ...product, id: Date.now().toString() }]);
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts(
      products.map((p) =>
        p.id === id ? { ...p, ...updates, updatedAt: new Date() } : p
      )
    );
  };

  const deleteProduct = (id: string) => {
    setProducts(products.filter((p) => p.id !== id));
  };

  const reduceStock = (productId: string, quantity: number) => {
    setProducts(
      products.map((p) =>
        p.id === productId
          ? { ...p, quantity: Math.max(0, p.quantity - quantity) }
          : p
      )
    );
  };

  const addSale = (sale: Sale) => {
    setSales([...sales, { ...sale, id: Date.now().toString() }]);
  };

  const getSales = (date?: Date): Sale[] => {
    if (!date) return sales;

    const selectedDate = new Date(date);
    selectedDate.setHours(0, 0, 0, 0);

    const endDate = new Date(selectedDate);
    endDate.setHours(23, 59, 59, 999);

    return sales.filter((sale) => {
      const saleDate = new Date(sale.date);
      saleDate.setHours(0, 0, 0, 0);
      return saleDate.getTime() === selectedDate.getTime();
    });
  };

  const value: AppContextType = {
    products,
    sales,
    addProduct,
    updateProduct,
    deleteProduct,
    reduceStock,
    addSale,
    getSales,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};
