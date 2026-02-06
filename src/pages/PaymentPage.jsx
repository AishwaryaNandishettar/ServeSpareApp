import React, { useEffect, useState } from "react";
import "../styles/payment.css";
import { useNavigate } from "react-router-dom";

const PaymentPage = () => {
  const [invoice, setInvoice] = useState(null);
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [upiId, setUpiId] = useState("");
  const [upiVerified, setUpiVerified] = useState(false);
  const [showUPI, setShowUPI] = useState(false);
  const [showCard, setShowCard] = useState(false);
  const [showWallet, setShowWallet] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [walletBalance, setWalletBalance] = useState(0);

  const [card, setCard] = useState({
    number: "",
    name: "",
    expiry: "",
    cvv: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("latestInvoice"));
    if (!data) navigate("/");
    else setInvoice(data);

    const balance = Number(localStorage.getItem("walletBalance")) || 0;
    setWalletBalance(balance);

    const savedCard = JSON.parse(localStorage.getItem("savedCard"));
    if (savedCard) setCard(savedCard);
  }, [navigate]);

  if (!invoice) return null;

  // ---------- PAYMENT LOGIC (UNCHANGED) ----------
  const completePayment = (method) => {
    const pending = JSON.parse(localStorage.getItem("pendingOrders")) || [];
    const updatedPending = pending.filter(
      (o) => o.orderId !== invoice.orderId
    );
    localStorage.setItem("pendingOrders", JSON.stringify(updatedPending));

    const completed = JSON.parse(localStorage.getItem("completedOrders")) || [];
    completed.push({
      ...invoice,
      paymentMethod: method,
      status: "PAID",
    });
    localStorage.setItem("completedOrders", JSON.stringify(completed));

    localStorage.removeItem("cart");
    alert(`Payment Successful via ${method}`);
    navigate("/home");
  };

  const handlePayNow = () => {
    if (!selectedMethod) return alert("Select a payment method");

    if (selectedMethod === "Slice Pay") {
      setProcessing(true);
      setTimeout(() => {
        setProcessing(false);
        completePayment("Slice Pay");
      }, 1800);
      return;
    }

    if (selectedMethod === "Wallet") {
      const balance = Number(localStorage.getItem("walletBalance")) || 0;
      if (balance < invoice.total)
        return alert("Insufficient wallet balance");

      localStorage.setItem("walletBalance", balance - invoice.total);
      return completePayment("Wallet");
    }

    if (selectedMethod.includes("UPI") && (!upiId || !upiVerified))
      return alert("Verify UPI ID");

    if (selectedMethod === "Card Payment" && !card.number)
      return alert("Enter card details");

    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      completePayment(
        selectedMethod.includes("UPI")
          ? `${selectedMethod} (${upiId})`
          : selectedMethod
      );
    }, 2000);
  };

  const handleSaveCard = () => {
    if (!card.number || !card.name || !card.expiry || !card.cvv) {
      alert("Fill all card details before saving");
      return;
    }
    localStorage.setItem("savedCard", JSON.stringify(card));
    alert("Card saved for future payments");
  };

  return (
    <div className="payment-container">
      <header className="payment-header">
        <h3>Bill total ₹{invoice.total}</h3>
      </header>

      {/* ---------- UPI ---------- */}
      <section className="payment-section">
        <p className="section-title">RECOMMENDED</p>

        <div
          className="payment-option"
          onClick={() => {
            setSelectedMethod("Google Pay UPI");
            setShowUPI(true);
            setShowCard(false);
            setShowWallet(false);
            setUpiVerified(false);
          }}
        >
          <img src="/image/gpay.png" alt="GPay" />
          <span>Google Pay UPI</span>
          <span className="arrow">›</span>
        </div>

        <div
          className="payment-option"
          onClick={() => {
            setSelectedMethod("PhonePe UPI");
            setShowUPI(true);
            setShowCard(false);
            setShowWallet(false);
            setUpiVerified(false);
          }}
        >
          <img src="/image/phonepe.png" alt="PhonePe" />
          <span>PhonePe UPI</span>
          <span className="arrow">›</span>
        </div>

         <div
          className="payment-option"
          onClick={() => {
            setSelectedMethod("Google Pay UPI");
            setShowUPI(true);
            setShowCard(false);
            setShowWallet(false);
            setUpiVerified(false);
          }}
        >
          <img src="/image/Rupay.png" alt="RuPay" />
          <span>RuPay Credit UPI</span>
          <span className="arrow">›</span>
        </div>

        {showUPI && (
          <div style={{ padding: "14px 16px", display: "flex", gap: 8 }}>
           <input
  placeholder="Enter UPI ID"
  value={upiId}
  onChange={(e) => {
    setUpiId(e.target.value);
    setUpiVerified(false);
  }}
  style={{
    flex: 1,
    padding: "8px",
    borderRadius: 10,
    border: "2px solid #ddd",
  }}
/>
            <button
              onClick={() => {
                if (!upiId) return alert("Enter UPI ID");
                alert("UPI Verified");
                setUpiVerified(true);
              }}
              style={{
                padding: "8px 12px",
                background: "#36297a",
                color: "#fff",
                border: "none",
                borderRadius: 10,
              }}
            >
              Verify
            </button>
          </div>
        )}
      </section>

      {/* ---------- CARDS ---------- */}
      <section className="payment-section">
        <p className="section-title">CARDS</p>

        <div
          className="payment-option"
          onClick={() => {
            setSelectedMethod("Card Payment");
            setShowCard(true);
            setShowUPI(false);
            setShowWallet(false);
          }}
        >
          <span>Add credit or debit cards</span>
          <span className="add">ADD</span>
        </div>

        {showCard && (
          <div className="card-form">
            <input
              className="card-input"
              placeholder="Card number"
              value={card.number}
              onChange={(e) => setCard({ ...card, number: e.target.value })}
            />

            <input
              className="card-input"
              placeholder="Card holder name"
              value={card.name}
              onChange={(e) => setCard({ ...card, name: e.target.value })}
            />

            <label className="expiry-label">Expiry date</label>

            <div className="expiry-row">
              <select
                value={card.expiry.split("/")[0] || ""}
                onChange={(e) =>
                  setCard({
                    ...card,
                    expiry: `${e.target.value}/${card.expiry.split("/")[1] || ""}`,
                  })
                }
              >
                <option value="">MM</option>
                {[...Array(12)].map((_, i) => (
                  <option key={i} value={String(i + 1).padStart(2, "0")}>
                    {String(i + 1).padStart(2, "0")}
                  </option>
                ))}
              </select>

              <select
                value={card.expiry.split("/")[1] || ""}
                onChange={(e) =>
                  setCard({
                    ...card,
                    expiry: `${card.expiry.split("/")[0] || ""}/${e.target.value}`,
                  })
                }
              >
                <option value="">YYYY</option>
                {[2024, 2025, 2026, 2027, 2028, 2029].map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>

            <input
              className="card-input"
              placeholder="CVV"
              value={card.cvv}
              onChange={(e) => setCard({ ...card, cvv: e.target.value })}
            />

            <button className="card-save-btn" onClick={handleSaveCard}>
              Save
            </button>
          </div>
        )}
      </section>

      {/* ---------- WALLET ---------- */}
      <section className="payment-section">
        <p className="section-title">WALLET</p>

        <div
          className="payment-option"
          onClick={() => {
            setSelectedMethod("Wallet");
            setShowWallet(true);
            setShowUPI(false);
            setShowCard(false);
          }}
        >
          <span>Wallet</span>
          <span className="arrow">›</span>
        </div>

        {showWallet && (
          <div className="wallet-balance">
            <p>
              Available Balance: <b>₹{walletBalance}</b>
            </p>
            {walletBalance < invoice.total && (
              <p className="wallet-warning">Insufficient wallet balance</p>
            )}
          </div>
        )}
      </section>

      {/* ---------- PAY LATER (RESTORED & UNCHANGED) ---------- */}
      <section className="payment-section">
        <p className="section-title">PAY LATER</p>

        <div
          className="payment-option"
          onClick={() => setSelectedMethod("Slice Pay")}
        >
          <span>Slice Pay</span>
          <span className="arrow">›</span>
        </div>

        <div
          className="payment-option"
          onClick={() => setSelectedMethod("Razorpay")}
        >
          <span>Razorpay</span>
          <span className="arrow">›</span>
        </div>

        <div
          className="payment-option"
          onClick={() => setSelectedMethod("Pay Later")}
        >
          <span>Pay Later</span>
          <span className="arrow">›</span>
        </div>
      </section>

      {/* ---------- PAY NOW ---------- */}
      <div
        style={{
          background: "#fff",
          borderTop: "1px solid #ddd",
          padding: 12,
          display: "flex",
          justifyContent: "center",
          marginTop: 12,
        }}
      >
        <button
          style={{
            width: 360,
            padding: "14px",
            fontSize: 16,
            fontWeight: "bold",
            background: "#39017a",
            color: "#fff",
            border: "none",
            borderRadius: 4,
            opacity: processing ? 0.7 : 1,
          }}
          disabled={processing}
          onClick={handlePayNow}
        >
          {processing ? "Processing..." : "Pay Now"}
        </button>
      </div>
    </div>
  );
};

export default PaymentPage;
