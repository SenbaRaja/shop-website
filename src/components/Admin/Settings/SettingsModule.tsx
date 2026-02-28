import React from 'react';
import '../../styles/AdminModules.css';

export const SettingsModule: React.FC = () => {
  return (
    <div className="admin-module">
      <div className="module-header">
        <h1>⚙️ Settings</h1>
      </div>

      <div className="module-tabs">
        <button className="tab-btn active">Company</button>
        <button className="tab-btn">Invoice</button>
        <button className="tab-btn">Tax</button>
        <button className="tab-btn">Backup</button>
      </div>

      <div className="module-content">
        <div className="settings-grid">
          <div className="settings-section">
            <h3>🏢 Company Details</h3>
            <div className="setting-item">
              <label>Company Name:</label>
              <input type="text" placeholder="Enter company name" />
            </div>
            <div className="setting-item">
              <label>Email:</label>
              <input type="email" placeholder="company@email.com" />
            </div>
            <div className="setting-item">
              <label>Phone:</label>
              <input type="tel" placeholder="+91 98765 43210" />
            </div>
            <button className="btn-primary">💾 Save Changes</button>
          </div>

          <div className="settings-section">
            <h3>🖨️ Invoice Template</h3>
            <div className="setting-item">
              <label>Template Style:</label>
              <select>
                <option>Standard</option>
                <option>Detailed</option>
                <option>Minimal</option>
              </select>
            </div>
            <div className="setting-item">
              <label>Logo Upload:</label>
              <input type="file" accept="image/*" />
            </div>
            <button className="btn-primary">💾 Save Changes</button>
          </div>

          <div className="settings-section">
            <h3>📊 Tax Configuration</h3>
            <div className="setting-item">
              <label>GST %:</label>
              <input type="number" placeholder="18" min="0" max="100" />
            </div>
            <div className="setting-item">
              <label>CGST %:</label>
              <input type="number" placeholder="9" min="0" max="100" />
            </div>
            <div className="setting-item">
              <label>SGST %:</label>
              <input type="number" placeholder="9" min="0" max="100" />
            </div>
            <button className="btn-primary">💾 Save Changes</button>
          </div>

          <div className="settings-section">
            <h3>🔐 Backup & Restore</h3>
            <p className="setting-hint">Last backup: 2 hours ago</p>
            <button className="btn-secondary">📥 Backup Now</button>
            <button className="btn-secondary">📤 Restore Data</button>
            <button className="btn-secondary">🔄 Schedule Auto-Backup</button>
          </div>
        </div>
      </div>
    </div>
  );
};
