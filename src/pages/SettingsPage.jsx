import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/settings.css";

const SettingsPage = () => {
  const navigate = useNavigate();

  return (
    <div className="settings-container">
      {/* Header */}
      <header className="settings-header">
        <i
          className="fa-solid fa-arrow-left back-btn"
          onClick={() => navigate(-1)}
        ></i>
        <h2>Settings</h2>
      </header>

      {/* App Version */}
      <p className="settings-version">v18.58.1(0)</p>

      {/* Settings List */}
      <div className="settings-list">

        <div className="settings-item" onClick={() => navigate("/edit-profile")}>
          <h4 className="settings-title">Edit Profile</h4>
          <p className="settings-subtitle">
            Change your name, description and profile photo
          </p>
        </div>

        <div className="settings-item" onClick={() => navigate("/notification-settings")}>
          <h4 className="settings-title">Notification Settings</h4>
          <p className="settings-subtitle">
            Define what emails and notifications you want to see
          </p>
        </div>

        <div className="settings-item" onClick={() => navigate("/account-settings")}>
          <h4 className="settings-title">Account Settings</h4>
          <p className="settings-subtitle">
            Change your email or delete your account
          </p>
        </div>

        <div className="settings-item" onClick={() => alert("Open phone settings")}>
          <h4 className="settings-title">App Permissions</h4>
          <p className="settings-subtitle">Open your phone settings</p>
        </div>

      </div>
    </div>
  );
};

export default SettingsPage;
