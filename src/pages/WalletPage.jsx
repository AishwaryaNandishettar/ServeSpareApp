import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import "../styles/wallet.css";

const WalletPage = () => {
  const navigate = useNavigate();

  const [balance, setBalance] = useState(
    Number(localStorage.getItem("walletBalance")) || 0
  );

  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState(null);
  const [upiId, setUpiId] = useState("");
  const [minAmountError, setMinAmountError] = useState("");

  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [bankAccount, setBankAccount] = useState("");

  const [card, setCard] = useState({
    number: "",
    name: "",
    expiry: "",
    cvv: "",
  });

  const addBalance = () => {
    const numAmount = Number(amount);
    if (!amount || isNaN(numAmount) || numAmount <= 0) {
      setMinAmountError("Enter a valid amount");
      return;
    }

    const updatedBalance = balance + numAmount;
    if (updatedBalance < 500) {
      setMinAmountError("Total wallet balance must be at least ₹500");
      return;
    }

    setMinAmountError("");

    if (method === "UPI" && !upiId) return alert("Enter UPI ID");
    if (method === "CARD" && !card.number) return alert("Enter card details");

    localStorage.setItem("walletBalance", updatedBalance);
    localStorage.setItem("canOrder", updatedBalance >= 1000 ? "true" : "false");
    setBalance(updatedBalance);

    alert(`₹${amount} added to wallet`);
    setAmount("");
    setUpiId("");
    setMethod(null);
  };

  const withdrawBalance = () => {
    const numAmount = Number(withdrawAmount);

    if (!withdrawAmount || isNaN(numAmount) || numAmount <= 0) {
      alert("Enter a valid withdrawal amount");
      return;
    }

    if (numAmount > balance) {
      alert("Insufficient wallet balance");
      return;
    }

    if (!bankAccount) {
      alert("Enter bank account number");
      return;
    }

    const updatedBalance = balance - numAmount;

    localStorage.setItem("walletBalance", updatedBalance);
    localStorage.setItem("canOrder", updatedBalance >= 500 ? "true" : "false");

    setBalance(updatedBalance);
    alert(`₹${numAmount} transferred to bank account`);

    setWithdrawAmount("");
    setBankAccount("");
  };

  useEffect(() => {
    const allowed = balance >= 500;
    localStorage.setItem("canOrder", allowed ? "true" : "false");
  }, [balance]);

  return (
    <div className="wallet-container">
      <header className="wallet-header">
        {/* ✅ Back Arrow (left) */}
        <span
          className="wallet-back-btn"
          onClick={() => navigate(-1)}
          title="Back"
        >
          <FiArrowLeft />
        </span>

        <h3>Servespare Wallet</h3>
      </header>

      <div className="wallet-balance-card">
        <p className="balance-label">Available Balance</p>
        <h1>₹{balance}</h1>
      </div>

      {minAmountError && (
        <p className="balance-label" style={{ marginLeft: "16px", color: "red" }}>
          {minAmountError}
        </p>
      )}

      <div className="wallet-card">
        <h4>Add Balance</h4>

        <input
          className="wallet-input"
          placeholder="Enter amount"
          value={amount}
          onChange={(e) => {
            setAmount(e.target.value);
            setMinAmountError("");
          }}
        />

        <div className="payment-option" onClick={() => setMethod("UPI")}>
          <span>UPI</span>
        </div>

        {method === "UPI" && (
          <input
            className="wallet-input"
            placeholder="Enter UPI ID"
            value={upiId}
            onChange={(e) => setUpiId(e.target.value)}
          />
        )}

        <div className="payment-option" onClick={() => setMethod("CARD")}>
          <span>Card</span>
        </div>

        {method === "CARD" && (
          <>
            <input
              className="wallet-input"
              placeholder="Card Number"
              onChange={(e) => setCard({ ...card, number: e.target.value })}
            />
            <input
              className="wallet-input"
              placeholder="Name"
              onChange={(e) => setCard({ ...card, name: e.target.value })}
            />
            <input
              className="wallet-input"
              placeholder="MM/YY"
              onChange={(e) => setCard({ ...card, expiry: e.target.value })}
            />
            <input
              className="wallet-input"
              placeholder="CVV"
              onChange={(e) => setCard({ ...card, cvv: e.target.value })}
            />
          </>
        )}

        <button className="wallet-add-btn" onClick={addBalance}>
          Add Balance
        </button>

        <h4 style={{ marginTop: "20px" }}>Withdraw Balance</h4>

        <input
          className="wallet-input"
          placeholder="Enter amount to withdraw"
          value={withdrawAmount}
          onChange={(e) => setWithdrawAmount(e.target.value)}
        />

        <input
          className="wallet-input"
          placeholder="Enter bank account number"
          value={bankAccount}
          onChange={(e) => setBankAccount(e.target.value)}
        />

        <button
          className="wallet-add-btn wallet-add-btn-bottom"
          onClick={withdrawBalance}
        >
          Withdraw to Bank
        </button>
      </div>
    </div>
  );
};

export default WalletPage;
