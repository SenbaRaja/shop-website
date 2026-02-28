import React from 'react';
import '../../styles/AdminModules.css';

export const NotificationsCenter: React.FC = () => {
  const [notifications] = React.useState([
    { id: 1, type: 'stock', message: 'Product A stock below minimum', time: '2 mins ago', severity: 'critical' },
    { id: 2, type: 'payment', message: 'Supplier B payment due', time: '1 hour ago', severity: 'warning' },
    { id: 3, type: 'credit', message: 'Customer C credit limit exceeded', time: '3 hours ago', severity: 'warning' },
    { id: 4, type: 'system', message: 'System backup completed', time: '5 hours ago', severity: 'info' },
  ]);

  return (
    <div className="admin-module">
      <div className="module-header">
        <h1>🔔 Notification Center</h1>
      </div>

      <div className="module-tabs">
        <button className="tab-btn active">All Notifications</button>
        <button className="tab-btn">Stock Alerts</button>
        <button className="tab-btn">Payment Reminders</button>
        <button className="tab-btn">System Alerts</button>
      </div>

      <div className="module-content">
        <div className="notifications-list">
          {notifications.map((notif) => (
            <div key={notif.id} className={`notification-item severity-${notif.severity}`}>
              <div className="notif-icon">
                {notif.type === 'stock' && '📦'}
                {notif.type === 'payment' && '💳'}
                {notif.type === 'credit' && '⚠️'}
                {notif.type === 'system' && 'ℹ️'}
              </div>
              <div className="notif-content">
                <p className="notif-message">{notif.message}</p>
                <p className="notif-time">{notif.time}</p>
              </div>
              <button className="btn-sm btn-close">✕</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
