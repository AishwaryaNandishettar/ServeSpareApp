import React, { useState } from "react";
import "./SignupPage.css";
import { useNavigate } from "react-router-dom";
import logo from "../assets/companylogo.png";

const SignupPage = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const { username, email, password, confirmPassword } = formData;

    if (!username || !email || !password || !confirmPassword) {
      alert("Please fill in all fields.");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    alert("Account created successfully! 🎉");
    navigate("/login");
  };

  return (
    <div className="container">
      {/* Back Arrow */}
      <button className="back-arrow" onClick={() => navigate(-1)}>
        <i className="fa-solid fa-arrow-left"></i>
      </button>

      {/* Logo */}
      <div className="logo">
        <img src={logo} alt="Company Logo" />
      </div>

      {/* Form */}
      <div className="form-box">
        <div className="header">
          <h2>
            <span>Create an Account!</span>
          </h2>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Username */}
          <div className="input-box">
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>

          {/* Email */}
          <div className="input-box">
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          {/* Password */}
          <div className="input-box">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              id="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <span
              className="toggle"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "🙈" : "👁️"}
            </span>
          </div>

          {/* Confirm Password */}
          <div className="input-box">
            <input
              type={showConfirm ? "text" : "password"}
              name="confirmPassword"
              id="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
            <span
              className="toggle"
              onClick={() => setShowConfirm(!showConfirm)}
            >
              {showConfirm ? "🙈" : "👁️"}
            </span>
          </div>

          {/* Submit */}
          <button type="submit" className="btn">
            SUBMIT
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignupPage;
