import React, { useState } from "react";
import "../styles/payment1.css";
import { FaCreditCard, FaPlus, FaUniversity } from "react-icons/fa";
import { FiArrowLeft } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const PaymentSettings = () => {
  const navigate = useNavigate();

  const [openSection, setOpenSection] = useState({
    card: false,
    upi: false,
    bank: false,
  });

  const toggleSection = (key) => {
    setOpenSection((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const verifyUPI = (app) => {
    alert(`Redirecting to ${app} for UPI verification...`);
  };

  const verifyWallet = (wallet) => {
    alert(`Connecting to ${wallet}...`);
  };

  return (
    <div className="payment-container">
      {/* ✅ HEADER (same look as before) + back button */}
      <div className="payment-header-bar">
        <span
          className="payment-back-btn"
          onClick={() => navigate(-1)}
          title="Back"
        >
          <FiArrowLeft size={22} />
        </span>

        <h2>Payment Settings</h2>
      </div>

      {/* ================= CARDS ================= */}
      <div className="section">
        <h3>CREDIT CARD TO BANK ACCOUNT</h3>

        <div className="option" onClick={() => toggleSection("card")}>
          <FaCreditCard /> Add Credit Card <span>+</span>
        </div>

        {openSection.card && (
          <div className="details card-box" style={{ display: "flex" }}>
            <div className="card-header">
              <span>Add credit or debit cards</span>
              <span className="add-text">ADD</span>
            </div>

            <input type="text" placeholder="Card number" />
            <input type="text" placeholder="Card holder name" />

            <label className="expiry-label">Expiry date</label>
            <div className="expiry-row">
              <select>
                <option>MM</option>
                {[...Array(12)].map((_, i) => (
                  <option key={i}>{String(i + 1).padStart(2, "0")}</option>
                ))}
              </select>

              <select>
                <option>YYYY</option>
                {[2024, 2025, 2026, 2027, 2028].map((year) => (
                  <option key={year}>{year}</option>
                ))}
              </select>
            </div>

            <input type="password" placeholder="CVV" />

            <button
              className="save-btn"
              onClick={() => alert("Card Added Successfully!")}
            >
              Save
            </button>
          </div>
        )}
      </div>

      {/* ================= UPI ================= */}
      <div className="section">
        <h3>UPI</h3>

        <div className="option" onClick={() => verifyUPI("Google Pay")}>
          <img src="/image/IMG_0962.WEBP" alt="GPay" /> Google Pay UPI
        </div>

        <div className="option" onClick={() => verifyUPI("PhonePe")}>
          <img src="/image/IMG_0963.WEBP" alt="PhonePe" /> PhonePe UPI
        </div>

        <div className="option" onClick={() => verifyUPI("Paytm")}>
          <img src="/image/IMG_0964.PNG" alt="Paytm" /> Paytm
        </div>

        <div className="option" onClick={() => toggleSection("upi")}>
          <FaPlus /> Add New UPI ID
        </div>

        {openSection.upi && (
          <div className="details" style={{ display: "flex" }}>
            <input type="text" placeholder="Enter your UPI ID (e.g., name@upi)" />
            <button onClick={() => alert("UPI Verified Successfully!")}>
              Verify
            </button>
          </div>
        )}
      </div>

      {/* ================= WALLETS ================= */}
      <div className="section">
        <h3>WALLETS</h3>

        <div className="option" onClick={() => verifyWallet("Amazon Pay Balance")}>
          <img src="/image/IMG_1034.PNG" alt="Amazon" /> Amazon Pay Balance
        </div>

        <div className="option" onClick={() => verifyWallet("Pay Later")}>
          <img src="/image/Pay Later.jpg" alt="Pay Later" /> Pay Later
        </div>
      </div>

      {/* ================= NET BANKING ================= */}
      <div className="section">
        <h3>NET BANKING</h3>

        <div className="option" onClick={() => toggleSection("bank")}>
          <FaUniversity /> Select Your Bank <span>+</span>
        </div>

        {openSection.bank && (
          <div className="details" style={{ display: "flex" }}>
            <select>
              <option>Select Bank</option>
              <option>HDFC Bank</option>
              <option>ICICI Bank</option>
              <option>SBI</option>
              <option>Axis Bank</option>
              <option>Kotak Mahindra</option>
            </select>

            <button onClick={() => alert("Redirecting to Bank Login...")}>
              Proceed
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentSettings;
