import { Product } from '../types';

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(amount);
};

export const formatDate = (date: Date | string): string => {
  const d = new Date(date);
  return d.toLocaleDateString('en-IN');
};

export const formatDateTime = (date: Date | string): string => {
  const d = new Date(date);
  return d.toLocaleString('en-IN');
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhoneNumber = (phone: string): boolean => {
  const phoneRegex = /^[6-9]\d{9}$/;
  return phoneRegex.test(phone);
};

export const validateBarcode = (barcode: string): boolean => {
  // Basic barcode validation - can be customized
  return barcode.length >= 8 && barcode.length <= 18;
};

export const generateBarcode = (): string => {
  return Date.now().toString() + Math.random().toString(36).substring(2, 15);
};

export const roundToTwoDecimals = (num: number): number => {
  return Math.round((num + Number.EPSILON) * 100) / 100;
};

export const searchProducts = (
  products: any[],
  query: string,
  searchFields: string[] = ['name', 'category', 'barcode']
): any[] => {
  if (!query.trim()) return products;

  const lowerQuery = query.toLowerCase();
  return products.filter((product) =>
    searchFields.some(
      (field) =>
        product[field] && product[field].toString().toLowerCase().includes(lowerQuery)
    )
  );
};

export const filterByCategory = (products: any[], category: string): any[] => {
  if (!category) return products;
  return products.filter((p) => p.category === category);
};

export const sortProducts = (
  products: any[],
  sortBy: 'name' | 'price' | 'quantity',
  order: 'asc' | 'desc' = 'asc'
): any[] => {
  const sorted = [...products].sort((a, b) => {
    let aVal = a[sortBy];
    let bVal = b[sortBy];

    if (typeof aVal === 'string') {
      aVal = aVal.toLowerCase();
      bVal = (bVal as string).toLowerCase();
    }

    if (aVal < bVal) return order === 'asc' ? -1 : 1;
    if (aVal > bVal) return order === 'asc' ? 1 : -1;
    return 0;
  });

  return sorted;
};

export const calculateLowStockItems = (products: Product[], threshold: number = 5): Product[] => {
  return products.filter((p) => p.quantity < threshold);
};
