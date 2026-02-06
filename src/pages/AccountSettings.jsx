import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/accountSettings.css";

const AccountSettings = () => {
  const navigate = useNavigate();
  const [showAccounts, setShowAccounts] = useState(false);
  const [accounts, setAccounts] = useState([]);

  // 🔹 Change email (realtime) — unchanged
  const handleChangeEmail = () => {
    const profile = JSON.parse(localStorage.getItem("userProfile"));

    const newEmail = prompt("Enter new email address", profile?.email || "");
    if (!newEmail) return;

    const updatedProfile = {
      ...profile,
      email: newEmail,
    };

    localStorage.setItem("userProfile", JSON.stringify(updatedProfile));
    alert("Email updated successfully");
  };

  // 🔹 Step 1: Show accounts list
  const handleDeleteAccountClick = () => {
    const storedAccounts =
      JSON.parse(localStorage.getItem("userAccounts")) ||
      [JSON.parse(localStorage.getItem("userProfile"))].filter(Boolean);

    if (!storedAccounts.length) {
      alert("No accounts found");
      return;
    }

    setAccounts(storedAccounts);
    setShowAccounts(true);
  };

  // 🔹 Step 2: Delete selected account (original logic preserved)
  const handleDeleteSelectedAccount = (account) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete the account "${account.email}"? This action cannot be undone.`
    );

    if (!confirmDelete) return;

    // Remove selected account from list
    const updatedAccounts = accounts.filter((a) => a.id !== account.id);

    localStorage.setItem("userAccounts", JSON.stringify(updatedAccounts));

    // 🔹 ORIGINAL DELETE LOGIC (unchanged)
    localStorage.removeItem("userProfile");
    localStorage.removeItem("notificationPrefs");
    localStorage.removeItem("walletBalance");
    localStorage.removeItem("cart");
    localStorage.removeItem("pendingOrders");
    localStorage.removeItem("completedOrders");

    alert("Account deleted successfully");
    navigate("/");
  };

  return (
    <div className="account-container">
      {/* Header */}
      <div className="account-header">
        <h3>Account settings</h3>
      </div>

      {/* Account list OR options */}
      {!showAccounts ? (
        <div className="account-list">
          <div className="account-item" onClick={handleChangeEmail}>
            <span>Change email</span>
            <span className="arrow">›</span>
          </div>

          <div
            className="account-item danger"
            onClick={handleDeleteAccountClick}
          >
            <span>Delete account</span>
            <span className="arrow">›</span>
          </div>
        </div>
      ) : (
        <div className="account-list">
          {accounts.map((account) => (
            <div
              key={account.id}
              className="account-item danger"
              onClick={() => handleDeleteSelectedAccount(account)}
            >
              <span>{account.email}</span>
              <span className="arrow">›</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AccountSettings;