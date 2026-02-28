import React, { useState } from 'react';
import '../../styles/UserModules.css';

export const UserReports: React.FC = () => {
  const [reportType, setReportType] = useState('daily');

  const dailyData = [
    { time: '10:00 AM', bills: 12, amount: 4500 },
    { time: '11:00 AM', bills: 15, amount: 6200 },
    { time: '12:00 PM', bills: 18, amount: 7800 },
    { time: '1:00 PM', bills: 10, amount: 5600 },
    { time: '2:00 PM', bills: 14, amount: 6900 },
    { time: '3:00 PM', bills: 16, amount: 7200 },
  ];

  const billsData = [
    { billId: 'BL-001', time: '10:30 AM', items: 3, amount: 2450, payment: 'Cash' },
    { billId: 'BL-002', time: '10:45 AM', items: 5, amount: 1890, payment: 'UPI' },
    { billId: 'BL-003', time: '11:00 AM', items: 8, amount: 5600, payment: 'Cash' },
    { billId: 'BL-004', time: '11:15 AM', items: 4, amount: 3200, payment: 'UPI' },
  ];

  const totalSales = dailyData.reduce((sum, d) => sum + d.amount, 0);
  const totalBills = dailyData.reduce((sum, d) => sum + d.bills, 0);

  return (
    <div className="user-module">
      <div className="module-header">
        <h1>📈 Reports</h1>
        <p className="read-only-badge">View Only</p>
      </div>

      <div className="report-summary">
        <div className="summary-card">
          <h3>Today's Total Sales</h3>
          <p className="summary-value">₹{totalSales.toLocaleString('en-IN')}</p>
        </div>
        <div className="summary-card">
          <h3>Total Bills</h3>
          <p className="summary-value">{totalBills}</p>
        </div>
        <div className="summary-card">
          <h3>Avg Bill Amount</h3>
          <p className="summary-value">₹{Math.round(totalSales / totalBills)}</p>
        </div>
      </div>

      <div className="report-tabs">
        <button
          className={`tab-btn ${reportType === 'daily' ? 'active' : ''}`}
          onClick={() => setReportType('daily')}
        >
          Daily Sales
        </button>
        <button
          className={`tab-btn ${reportType === 'bills' ? 'active' : ''}`}
          onClick={() => setReportType('bills')}
        >
          Bills Report
        </button>
      </div>

      <div className="module-content">
        {reportType === 'daily' && (
          <table className="report-table">
            <thead>
              <tr>
                <th>Time</th>
                <th>Bills</th>
                <th>Total Amount</th>
              </tr>
            </thead>
            <tbody>
              {dailyData.map((row, idx) => (
                <tr key={idx}>
                  <td>{row.time}</td>
                  <td>{row.bills}</td>
                  <td>₹{row.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {reportType === 'bills' && (
          <table className="report-table">
            <thead>
              <tr>
                <th>Bill ID</th>
                <th>Time</th>
                <th>Items</th>
                <th>Amount</th>
                <th>Payment</th>
              </tr>
            </thead>
            <tbody>
              {billsData.map((bill, idx) => (
                <tr key={idx}>
                  <td>{bill.billId}</td>
                  <td>{bill.time}</td>
                  <td>{bill.items}</td>
                  <td>₹{bill.amount}</td>
                  <td>
                    <span className={`payment-badge ${bill.payment.toLowerCase()}`}>
                      {bill.payment}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};
