import jsPDF from 'jspdf';
import { Sale } from '../types';

export const generateInvoicePDF = async (sale: Sale, shopName: string = 'StockMate Pro') => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  let yPosition = 10;

  // Shop Header
  doc.setFontSize(18);
  doc.setTextColor(75, 0, 130); // Purple
  doc.text(shopName, pageWidth / 2, yPosition, { align: 'center' });
  yPosition += 8;

  // Date and Invoice Number
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);
  const invoiceDate = new Date(sale.date).toLocaleDateString('en-IN');
  doc.text(`Invoice Date: ${invoiceDate}`, 10, yPosition);
  doc.text(`Invoice #: ${sale.id}`, pageWidth - 50, yPosition);
  yPosition += 8;

  // Divider
  doc.setDrawColor(75, 0, 130);
  doc.line(10, yPosition, pageWidth - 10, yPosition);
  yPosition += 6;

  // Item Headers
  doc.setFontSize(9);
  doc.setFont('times', 'bold');
  doc.text('Product', 10, yPosition);
  doc.text('Qty', 80, yPosition);
  doc.text('Price', 100, yPosition);
  doc.text('Amount', 135, yPosition, { align: 'right' });
  yPosition += 7;

  // Divider
  doc.setDrawColor(200, 200, 200);
  doc.line(10, yPosition, pageWidth - 10, yPosition);
  yPosition += 5;

  // Items
  doc.setFont('times', 'normal');
  doc.setFontSize(8);
  sale.items.forEach((item) => {
    const productName = item.productName.substring(0, 35);
    doc.text(productName, 10, yPosition);
    doc.text(item.quantity.toString(), 80, yPosition);
    doc.text(`₹${item.price.toFixed(2)}`, 100, yPosition);
    doc.text(`₹${item.total.toFixed(2)}`, 135, yPosition, { align: 'right' });
    yPosition += 5;
  });

  // Divider
  doc.setDrawColor(75, 0, 130);
  doc.line(10, yPosition, pageWidth - 10, yPosition);
  yPosition += 6;

  // Totals
  doc.setFontSize(10);
  doc.setFont('times', 'bold');
  doc.text('Subtotal:', 100, yPosition);
  doc.text(`₹${sale.subtotal.toFixed(2)}`, 135, yPosition, { align: 'right' });
  yPosition += 6;

  if (sale.gst > 0) {
    doc.text(`GST (${(sale.gst * 100).toFixed(1)}%):`, 100, yPosition);
    doc.text(`₹${sale.gstAmount.toFixed(2)}`, 135, yPosition, { align: 'right' });
    yPosition += 6;
  }

  doc.setTextColor(75, 0, 130);
  doc.text('TOTAL:', 100, yPosition);
  doc.setFontSize(12);
  doc.text(`₹${sale.total.toFixed(2)}`, 135, yPosition, { align: 'right' });

  // Footer
  yPosition += 15;
  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);
  doc.text('Thank you for your purchase!', pageWidth / 2, pageHeight - 15, { align: 'center' });

  return doc;
};

export const downloadInvoicePDF = async (sale: Sale, shopName: string = 'StockMate Pro') => {
  const doc = await generateInvoicePDF(sale, shopName);
  const filename = `invoice_${sale.id}_${new Date(sale.date).toISOString().split('T')[0]}.pdf`;
  doc.save(filename);
};

export const printInvoice = async (sale: Sale, shopName: string = 'StockMate Pro') => {
  const doc = await generateInvoicePDF(sale, shopName);
  const pdfDataUri = doc.output('dataurlstring');
  const printWindow = window.open(pdfDataUri);
  if (printWindow) {
    printWindow.onload = () => {
      printWindow.print();
    };
  }
};
