import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginPage.css";
import logo from "../assets/Transperant Background.png";

const LoginPage = () => {
  const navigate = useNavigate();
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    const validCompany = "ServeSpare Pvt Ltd";
    const validEmail = "demo@servespare.com";

    if (!company || !email) {
      alert("Please fill in all fields.");
      return;
    }

    if (company === validCompany && email === validEmail) {
      alert("Login successful 🚀");
      navigate("/otp"); // ✅ Navigates to OTP page
    } else {
      alert("Invalid credentials. Please try again.");
    }
  };

  return (
     <div className="container full-height flex-center flex-column">
      {/* Logo */}
      <div className="logo">
        <img src={logo} alt="Company Logo" />
      </div>

      {/* Form */}
      <div className="content">
        <h1 className="welcome">Welcome!</h1>

        <form onSubmit={handleSubmit}>
          <label htmlFor="company">Company Name</label>
          <input
            type="text"
            id="company"
            placeholder="Enter your company name"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            required
          />

          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <button type="submit" className="login-btn">
            Log In
          </button>
        </form>
      </div>

      <div className="extra-links">
        <p>
          Don’t have an account?{" "}
          <button
            className="signup"
            onClick={() => alert("Signup page not yet implemented")}
          >
            Sign up
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;