import { Sale, Product, DailySalesReport, MonthlySalesReport, TopSellingProduct } from '../types';
import { startOfDay, format } from 'date-fns';

export const calculateDailySalesReport = (sales: Sale[], date: Date): DailySalesReport => {
  const dayStart = startOfDay(date);
  const dayEnd = new Date(dayStart);
  dayEnd.setHours(23, 59, 59, 999);

  const daySales = sales.filter((sale) => {
    const saleDate = new Date(sale.date);
    return saleDate >= dayStart && saleDate <= dayEnd;
  });

  let totalSales = 0;
  let totalQuantity = 0;
  let totalCost = 0;

  daySales.forEach((sale) => {
    totalSales += sale.total;
    sale.items.forEach((item) => {
      totalQuantity += item.quantity;
    });
  });

  return {
    date,
    totalSales,
    totalQuantity,
    totalProfit: totalSales - totalCost,
  };
};

export const calculateMonthlySalesReports = (sales: Sale[]): MonthlySalesReport[] => {
  const reports: MonthlySalesReport[] = [];
  const monthsMap = new Map<string, Sale[]>();

  sales.forEach((sale) => {
    const date = new Date(sale.date);
    const monthKey = format(date, 'yyyy-MM');
    if (!monthsMap.has(monthKey)) {
      monthsMap.set(monthKey, []);
    }
    monthsMap.get(monthKey)!.push(sale);
  });

  monthsMap.forEach((monthlySales, monthKey) => {
    let totalSales = 0;
    monthlySales.forEach((sale) => {
      totalSales += sale.total;
    });

    reports.push({
      month: monthKey,
      totalSales,
      totalProfit: totalSales,
      salesCount: monthlySales.length,
    });
  });

  return reports.sort((a, b) => a.month.localeCompare(b.month));
};

export const getTopSellingProducts = (sales: Sale[], limit: number = 10): TopSellingProduct[] => {
  const productMap = new Map<string, TopSellingProduct>();

  sales.forEach((sale) => {
    sale.items.forEach((item) => {
      const key = item.productId;
      if (!productMap.has(key)) {
        productMap.set(key, {
          productId: item.productId,
          productName: item.productName,
          quantitySold: 0,
          revenue: 0,
        });
      }

      const product = productMap.get(key)!;
      product.quantitySold += item.quantity;
      product.revenue += item.total;
    });
  });

  return Array.from(productMap.values())
    .sort((a, b) => b.quantitySold - a.quantitySold)
    .slice(0, limit);
};

export const calculateTodaysSalesReport = (sales: Sale[]): DailySalesReport => {
  return calculateDailySalesReport(sales, new Date());
};

export const calculateTotalProfit = (sales: Sale[], products: Product[]): number => {
  if (sales.length === 0) return 0;

  let totalRevenue = 0;
  let totalCost = 0;

  sales.forEach((sale) => {
    sale.items.forEach((item) => {
      const product = products.find((p) => p.id === item.productId);
      if (product) {
        totalRevenue += item.total;
        totalCost += product.purchasePrice * item.quantity;
      }
    });
  });

  return totalRevenue - totalCost;
};

export const calculateLowStockItems = (products: Product[], threshold: number = 5): Product[] => {
  return products.filter((p) => p.quantity < threshold);
};
