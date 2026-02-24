// User types
export interface User {
  id: string;
  username: string;
  password?: string;
  role: 'admin' | 'staff';
  createdAt: Date;
}

// Product types
export interface Product {
  id: string;
  name: string;
  category: string;
  purchasePrice: number;
  sellingPrice: number;
  quantity: number;
  barcode?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Sale/Order types
export interface SaleItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  total: number;
}

export interface Sale {
  id: string;
  items: SaleItem[];
  subtotal: number;
  gst: number;
  gstAmount: number;
  total: number;
  date: Date;
  soldBy: string;
}

// Cart types
export interface CartItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  availableQuantity: number;
}

// Auth context types
export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  hasPermission: (role: string) => boolean;
}

// App context types
export interface AppContextType {
  products: Product[];
  sales: Sale[];
  addProduct: (product: Product) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  reduceStock: (productId: string, quantity: number) => void;
  addSale: (sale: Sale) => void;
  getSales: (date?: Date) => Sale[];
}

// Report types
export interface DailySalesReport {
  date: Date;
  totalSales: number;
  totalQuantity: number;
  totalProfit: number;
}

export interface MonthlySalesReport {
  month: string;
  totalSales: number;
  totalProfit: number;
  salesCount: number;
}

export interface TopSellingProduct {
  productId: string;
  productName: string;
  quantitySold: number;
  revenue: number;
}
