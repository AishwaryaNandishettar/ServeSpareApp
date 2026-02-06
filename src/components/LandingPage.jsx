import React from "react";
import { Link } from "react-router-dom";
import "./LandingPage.css";
import logo from "../assets/Transperant Background.png"; // make sure this path is correct

const LandingPage = () => {
  const handleProfessionalClick = () => {
    alert("Professional selected!");
  };

  const handlePersonalClick = () => {
    alert("Personal selected!");
  };

  return (
   <div className="container full-height flex-center flex-column">
      {/* Logo */}
      <div className="logo">
        <img src={logo} alt="ServeSpare Logo" />
      </div>

      {/* Text */}
      <div className="content">
        <h1>SERVESPARE</h1>
        <p className="para">Satisfying Every Bite!</p>
      </div>

      {/* Buttons */}
      <div className="buttons">
        <Link to="/login">
          <button className="btn btn-primary" onClick={handleProfessionalClick}>
            Professional
          </button>
        </Link>

        <Link to="/personal">
          <button className="btn btn-secondary" onClick={handlePersonalClick}>
            Personal
          </button>
        </Link>
      </div>
    </div>
  );
};

export default LandingPage;