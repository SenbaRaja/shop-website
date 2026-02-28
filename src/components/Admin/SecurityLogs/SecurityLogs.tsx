import React from 'react';
import '../../styles/AdminModules.css';

export const SecurityLogs: React.FC = () => {
  const [logs] = React.useState([
    { id: 1, action: 'Login', user: 'admin', timestamp: '2026-02-27 14:30', status: 'success' },
    { id: 2, action: 'Product Edit', user: 'staff', timestamp: '2026-02-27 14:25', status: 'success' },
    { id: 3, action: 'Failed Login', user: 'unknown', timestamp: '2026-02-27 14:15', status: 'failed' },
    { id: 4, action: 'Bill Deletion', user: 'admin', timestamp: '2026-02-27 14:10', status: 'success' },
    { id: 5, action: 'User Blocked', user: 'admin', timestamp: '2026-02-27 13:45', status: 'success' },
  ]);

  return (
    <div className="admin-module">
      <div className="module-header">
        <h1>🔐 Security & Logs</h1>
      </div>

      <div className="module-tabs">
        <button className="tab-btn active">Activity Logs</button>
        <button className="tab-btn">Failed Logins</button>
        <button className="tab-btn">Deletions</button>
        <button className="tab-btn">Backup History</button>
      </div>

      <div className="module-content">
        <table className="data-table">
          <thead>
            <tr>
              <th>Action</th>
              <th>User</th>
              <th>Timestamp</th>
              <th>Status</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log.id}>
                <td>{log.action}</td>
                <td>{log.user}</td>
                <td>{log.timestamp}</td>
                <td>
                  <span className={`status-badge ${log.status}`}>
                    {log.status === 'success' ? '✓ Success' : '✗ Failed'}
                  </span>
                </td>
                <td>
                  <button className="btn-sm btn-view">👁️ Details</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
