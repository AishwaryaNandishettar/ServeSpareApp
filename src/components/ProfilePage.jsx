import React, { useRef, useState } from "react";
import "../styles/profile.css";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";

const ProfilePage = () => {
  const navigate = useNavigate();
  const photoInputRef = useRef(null);
  const [photo, setPhoto] = useState(null);
  const [showLogoutSheet, setShowLogoutSheet] = useState(false);

  const handlePhotoClick = () => {
    photoInputRef.current.click();
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setPhoto(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const goToOrders = () => navigate("/orders");
  const goToFeedback = () => navigate("/feedback");
  const goToSettings = () => navigate("/settings");
  const goToCoupons = () => navigate("/coupons");
  const goToRewards = () => navigate("/rewards");
  const goToServespareWallet = () => navigate("/wallet");
  const goToPaymentModes = () => navigate("/payment");
  const goToAboutApp = () => navigate("/monitor");

  const logoutThisDevice = () => {
    localStorage.removeItem("userProfile");
    alert("Logged out from this device");
    navigate("/");
  };

  const logoutAllDevices = () => {
    localStorage.clear();
    alert("Logged out from all devices");
    navigate("/");
  };

  return (
    <div className="profile-container">
      {/* HEADER */}
      <header className="header5">
        {/* ✅ FORCE-VISIBLE BACK BUTTON */}
        <span
          onClick={() => navigate(-1)}
          title="Back"
          style={{
            position: "absolute",
            left: "16px",
            top: "50%",
            transform: "translateY(-50%)",
            cursor: "pointer",
            zIndex: 10,
            color: "#ffffff",
          }}
        >
          <FiArrowLeft size={22} />
        </span>

        <h2 className="header-title">Profile</h2>
      </header>

      {/* Profile Section */}
      <section className="profile-section">
        <div className="profile-info">
          <div className="profile-left">
            <h3>John</h3>
            <p className="phone">+91 - xxxxxxxxx</p>
            <p className="email">john@gmail.com</p>
          </div>

          <div className="add-photo">
            <div
              className="photo-circle"
              onClick={handlePhotoClick}
              style={{
                backgroundImage: photo ? `url(${photo})` : "none",
                backgroundSize: "cover",
                backgroundPosition: "center",
                color: photo ? "transparent" : "#003366",
              }}
            >
              {!photo && (
                <>
                  ADD
                  <br />
                  PHOTO
                </>
              )}
            </div>

            <input
              type="file"
              ref={photoInputRef}
              accept="image/*"
              hidden
              onChange={handlePhotoChange}
            />
          </div>
        </div>
      </section>

      {/* Menu List */}
      <section className="menu-list">
        {[
          "Rating",
          "My Orders",
          "Coupons",
          "Servespare Wallet",
          "My Refunds",
          "Payment Modes",
          "About App",
          "Rewards",
          "Feedback",
          "Support",
          "Settings",
          "Log Out",
        ].map((item, index) => (
          <div
            className="menu-item"
            key={index}
            onClick={
              item === "My Orders"
                ? goToOrders
                : item === "Feedback"
                ? goToFeedback
                : item === "Settings"
                ? goToSettings
                : item === "Coupons"
                ? goToCoupons
                : item === "Rewards"
                ? goToRewards
                : item === "Payment Modes"
                ? goToPaymentModes
                : item === "About App"
                ? goToAboutApp
                : item === "Servespare Wallet"
                ? goToServespareWallet
                : item === "Log Out"
                ? () => setShowLogoutSheet(true)
                : undefined
            }
          >
            {item}
          </div>
        ))}
      </section>

      {/* Logout Bottom Sheet */}
      {showLogoutSheet && (
        <>
          <div
            className="logout-backdrop"
            onClick={() => setShowLogoutSheet(false)}
          />

          <div className="logout-sheet">
            <p className="logout-title">Log out from?</p>

            <button
              className="logout-option danger"
              onClick={logoutThisDevice}
            >
              This device
            </button>

            <button
              className="logout-option danger"
              onClick={logoutAllDevices}
            >
              All devices
            </button>

            <button
              className="logout-option cancel"
              onClick={() => setShowLogoutSheet(false)}
            >
              Cancel
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ProfilePage;
