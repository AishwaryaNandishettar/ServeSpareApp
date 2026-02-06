import React, { useState } from "react";
import "../styles/coupons.css";
import { useNavigate } from "react-router-dom";

const CouponsPage = () => {
  const navigate = useNavigate();
  const [scratched, setScratched] = useState(false);

  return (
    <div className="coupons-container">
      {/* Header */}
      <header className="coupons-header">
        <i className="fa-solid fa-arrow-left" onClick={() => navigate(-1)} />
        <h3>Your coupons</h3>
      </header>

      <p className="section-title">BRAND COUPONS</p>

      <div className="coupon-grid">
        {/* Scratch Coupon */}
        <div
          className={`coupon scratch ${scratched ? "revealed" : ""}`}
          onClick={() => setScratched(true)}
        >
          {!scratched ? (
            <p>Tap to scratch</p>
          ) : (
            <>
              <h4>₹200 OFF</h4>
              <span>On orders above ₹999</span>
            </>
          )}
        </div>

        {/* MakeMyTrip */}
        <div className="coupon">
          <h4>MakeMyTrip</h4>
          <p>Flat ₹1500 Off</p>
          <span>Expires in 9 days</span>
          <button onClick={() => alert("MakeMyTrip coupon applied!")}>
            View details
          </button>
        </div>

        {/* ixigo */}
        <div className="coupon">
          <h4>ixigo</h4>
          <p>Up to ₹4500 Off</p>
          <span>Expires in 115 days</span>
          <button onClick={() => alert("ixigo coupon applied!")}>
            View details
          </button>
        </div>
      </div>
    </div>
  );
};

export default CouponsPage;
