import React, { useState } from "react";
import "./VendorLogin.css";
import { vendorLogin } from "../services/api";

const VendorLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = async () => {
    if (!email || !password) {
      setMessage("Please enter email and password");
      return;
    }

    try {
      const response = await vendorLogin(email, password);
      setMessage(response.message);
    } catch (error) {
      setMessage("Invalid email or password");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Login</h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setMessage("");
          }}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setMessage("");
          }}
        />

        <button onClick={handleLogin}>Login</button>

        {message && <p className="message">{message}</p>}

        <div className="links">
          <span>Forgot <b>Password?</b></span>
          <span>
            Don't have an account? <b>Sign up</b>
          </span>
        </div>
      </div>
    </div>
  );
};

export default VendorLogin;
