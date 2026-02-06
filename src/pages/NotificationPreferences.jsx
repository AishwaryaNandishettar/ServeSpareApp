import React, { useState, useEffect } from "react";
import "../styles/notificationPreferences.css";

const NotificationPreferences = () => {
  const [enabled, setEnabled] = useState(true);

  // Load saved preference
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("enableNotifications"));
    if (saved !== null) {
      setEnabled(saved);
    }
  }, []);

  // Toggle notification setting
  const toggleNotifications = () => {
    const value = !enabled;
    setEnabled(value);
    localStorage.setItem("enableNotifications", JSON.stringify(value));
  };

  return (
    <div className="notify-container">
      {/* Header */}
      <header className="notify-header">
        <h3>Notification Preferences</h3>
      </header>

      {/* Enable Notifications */}
      <div className="notify-card">
        <div>
          <h4>Enable notifications</h4>
          <p>Turn notifications on or off</p>
        </div>
        <label className="switch">
          <input
            type="checkbox"
            checked={enabled}
            onChange={toggleNotifications}
          />
          <span className="slider"></span>
        </label>
      </div>
    </div>
  );
};

export default NotificationPreferences;