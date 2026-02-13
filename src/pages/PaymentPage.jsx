// PaymentPage.jsx
import React, { useEffect, useState, useRef } from "react";
import "../styles/payment.css";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";

/* ✅ IMPORT IMAGES FROM src/assets */
import gpayImg from "../assets/IMG_0962.WEBP";
import phonepeImg from "../assets/IMG_0963.WEBP";
import rupayImg from "../assets/RuPay.png";

/* ✅ OPTIONAL: icons for other payment options (make sure these files exist in src/assets) */
import cardImg from "../assets/IMG_0966.PNG";
import walletImg from "../assets/Wallet.jpg";        // ✅ FIXED: assets (not asset)
import slicePayImg from "../assets/IMG_0965.JPG";    // ✅ using your existing import
import razorPayImg from "../assets/RazorPay.png";    // ✅ using your existing import

const PaymentPage = () => {
  const [invoice, setInvoice] = useState(null);
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [upiId, setUpiId] = useState("");
  const [upiVerified, setUpiVerified] = useState(false);
  const [showUPI, setShowUPI] = useState(false); // "gpay" | "phonepe" | "rupay" | false
  const [showCard, setShowCard] = useState(false);
  const [showWallet, setShowWallet] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [walletBalance, setWalletBalance] = useState(0);

  const paymentScrollRef = useRef(null);
  const paymentContainerRef = useRef(null);

  const [card, setCard] = useState({
    number: "",
    name: "",
    expiry: "",
    cvv: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setShowUPI(false);
      setShowCard(false);
      setShowWallet(false);
      setUpiVerified(false);
    };

    const el = paymentScrollRef.current;
    if (el) {
      el.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (el) {
        el.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);

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
    const updatedPending = pending.filter((o) => o.orderId !== invoice.orderId);
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
      if (balance < invoice.total) return alert("Insufficient wallet balance");

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

  const closeAllForms = () => {
    setShowUPI(false);
    setShowCard(false);
    setShowWallet(false);
    setUpiVerified(false);
  };

  return (
    <div className="payment-container" onClick={closeAllForms}>
      {/* 🔹 HEADER */}
     <header className="payment-header">
  <span
    className="payment-back-btn"
    onClick={() => navigate(-1)}
    title="Back"
  >
    <FiArrowLeft />
  </span>

  <h3>Bill total ₹{invoice.total}</h3>
</header>


      {/* 🔹 SCROLLABLE PAYMENT CONTENT */}
      <div
        className="payment-scroll"
        ref={(el) => {
          paymentScrollRef.current = el;
          paymentContainerRef.current = el;
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <section className="payment-section">
          {/* ================= RECOMMENDED ================= */}
          <p className="section-title">RECOMMENDED</p>

          <div
            className="payment-option"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedMethod("Google Pay UPI");
              setShowUPI("gpay");
              setShowCard(false);
              setShowWallet(false);
              setUpiVerified(false);
            }}
          >
            <img src={gpayImg} alt="GPay" />
            <span>Google Pay UPI</span>
            <span className="arrow">›</span>
          </div>

          {showUPI === "gpay" && (
            <div className="card-form" onClick={(e) => e.stopPropagation()}>
              <input
                type="text"
                className="card-input"
                placeholder="Enter UPI ID"
                value={upiId}
                onChange={(e) => {
                  setUpiId(e.target.value);
                  setUpiVerified(false);
                }}
              />
              <button
                className="card-save-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  if (!upiId.includes("@")) return alert("Invalid UPI ID");
                  setUpiVerified(true);
                  alert("UPI Verified");
                }}
              >
                Verify
              </button>
            </div>
          )}

          <div
            className="payment-option"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedMethod("PhonePe UPI");
              setShowUPI("phonepe");
              setShowCard(false);
              setShowWallet(false);
              setUpiVerified(false);
            }}
          >
            <img src={phonepeImg} alt="PhonePe" />
            <span>PhonePe UPI</span>
            <span className="arrow">›</span>
          </div>

          {showUPI === "phonepe" && (
            <div className="card-form" onClick={(e) => e.stopPropagation()}>
              <input
                type="text"
                className="card-input"
                placeholder="Enter UPI ID"
                value={upiId}
                onChange={(e) => {
                  setUpiId(e.target.value);
                  setUpiVerified(false);
                }}
              />
              <button
                className="card-save-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  if (!upiId.includes("@")) return alert("Invalid UPI ID");
                  setUpiVerified(true);
                  alert("UPI Verified");
                }}
              >
                Verify
              </button>
            </div>
          )}

          <div
            className="payment-option"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedMethod("RuPay Credit UPI");
              setShowUPI("rupay");
              setShowCard(false);
              setShowWallet(false);
              setUpiVerified(false);
            }}
          >
            <img src={rupayImg} alt="RuPay" />
            <span>RuPay Credit UPI</span>
            <span className="arrow">›</span>
          </div>

          {showUPI === "rupay" && (
            <div className="card-form" onClick={(e) => e.stopPropagation()}>
              <input
                type="text"
                className="card-input"
                placeholder="Enter UPI ID"
                value={upiId}
                onChange={(e) => {
                  setUpiId(e.target.value);
                  setUpiVerified(false);
                }}
              />
              <button
                className="card-save-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  if (!upiId.includes("@")) return alert("Invalid UPI ID");
                  setUpiVerified(true);
                  alert("UPI Verified");
                }}
              >
                Verify
              </button>
            </div>
          )}

          {/* ================= CARDS ================= */}
          <p className="section-title">CARDS</p>

          <div
            className="payment-option"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedMethod("Card Payment");
              setShowCard(true);
              setShowUPI(false);
              setShowWallet(false);
            }}
          >
            <img src={cardImg} alt="Cards" />
            <span>Add credit or debit cards</span>
            <span className="add">ADD</span>
          </div>

          {showCard && (
            <div className="card-form" onClick={(e) => e.stopPropagation()}>
              <input
                className="card-input"
                placeholder="Card Number"
                value={card.number}
                onChange={(e) => setCard({ ...card, number: e.target.value })}
              />
              <input
                className="card-input"
                placeholder="Name on Card"
                value={card.name}
                onChange={(e) => setCard({ ...card, name: e.target.value })}
              />
              <div className="expiry-row">
                <input
                  className="card-input"
                  placeholder="MM/YY"
                  value={card.expiry}
                  onChange={(e) => setCard({ ...card, expiry: e.target.value })}
                />
                <input
                  className="card-input"
                  placeholder="CVV"
                  value={card.cvv}
                  onChange={(e) => setCard({ ...card, cvv: e.target.value })}
                />
              </div>

              <button
                className="card-save-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  handleSaveCard();
                }}
              >
                Save Card
              </button>
            </div>
          )}

          {/* ================= WALLET ================= */}
          <p className="section-title">WALLET</p>

          <div
            className="payment-option"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedMethod("Wallet");
              setShowWallet(true);
              setShowUPI(false);
              setShowCard(false);
            }}
          >
            <img src={walletImg} alt="Wallet" />
            <span>Wallet</span>
            <span className="arrow">›</span>
          </div>

          {showWallet && (
            <div className="wallet-balance" onClick={(e) => e.stopPropagation()}>
              Wallet Balance: ₹{walletBalance}
              {walletBalance < invoice.total && (
                <div className="wallet-warning">Insufficient balance</div>
              )}
            </div>
          )}

          {/* ================= PAY LATER ================= */}
          <p className="section-title">PAY LATER</p>

          <div
            className="payment-option"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedMethod("Slice Pay");
            }}
          >
            <img src={slicePayImg} alt="Slice Pay" />
            <span>Slice Pay</span>
            <span className="arrow">›</span>
          </div>

          <div
            className="payment-option"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedMethod("Razorpay");
            }}
          >
            <img src={razorPayImg} alt="Razorpay" />
            <span>Razorpay</span>
            <span className="arrow">›</span>
          </div>
        </section>
      </div>

      {/* 🔹 PAY NOW (SAME CONTAINER, STICKY) */}
      <div className="pay-now-fixed" onClick={(e) => e.stopPropagation()}>
        <button disabled={processing} onClick={handlePayNow}>
          {processing ? "Processing..." : "Pay Now"}
        </button>
      </div>
    </div>
  );
};

export default PaymentPage;
