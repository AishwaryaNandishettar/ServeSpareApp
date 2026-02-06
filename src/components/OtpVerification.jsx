import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./OtpVerification.css";
import logo from "../assets/Transperant Background.png";

const OtpVerification = () => {
  const navigate = useNavigate();
  const inputs = useRef([]);

  const handleInput = (e, index) => {
    const value = e.target.value;
    if (value.length === 1 && index < inputs.current.length - 1) {
      inputs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && e.target.value === "" && index > 0) {
      inputs.current[index - 1].focus();
    }
  };

  const handleConfirm = () => {
    const otp = inputs.current.map((input) => input.value).join("");
    if (otp.length === 4) {
      alert("Entered OTP: " + otp);
      navigate("/home"); // ✅ navigate after OTP success
    } else {
      alert("Please enter all 4 digits of the OTP.");
    }
  };

  return (
     <div className="container full-height flex-center flex-column">
      {/* Back Arrow */}
      <a href="/login" className="back-arrow">
        <i className="fa-solid fa-arrow-left"></i>
      </a>

      {/* Logo */}
      <div className="logo">
        <img src={logo} alt="Company Logo" />
      </div>

      <h2 className="title">Verification Code</h2>
      <p className="subtitle">
        We have sent a verification code to your email address
      </p>

      {/* OTP Inputs */}
      <div className="otp-boxes">
        {[0, 1, 2, 3].map((_, index) => (
          <input
            key={index}
            type="text"
            maxLength="1"
            className="otp-input"
            ref={(el) => (inputs.current[index] = el)}
            onInput={(e) => handleInput(e, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
          />
        ))}
      </div>

      <p className="resend" onClick={() => alert("OTP resent!")}>
        Resend OTP?
      </p>

      <button className="confirm-btn" onClick={handleConfirm}>
        Confirm
      </button>
    </div>
  );
};

export default OtpVerification;