import React from "react";
import "./LandingPage.css";
import logo from "../assets/companylogo.png"; // adjust the path as needed

const LandingPage = () => {
  const handleProfessionalClick = () => {
    alert("Professional selected!");
    window.open("page2.html", "_blank");
  };

  const handlePersonalClick = () => {
    alert("Personal selected!");
    window.open("page3.html", "_blank");
  };

  return (
    <div className="container">
      {/* Logo */}
      <div className="logo">
        <img src={logo} alt="Servespare Logo" />
      </div>

      {/* Text */}
      <div className="content">
        <h1>SERVESPARE</h1>
        <p className="para">Satisfying Every Bite!</p>
      </div>

      {/* Buttons */}
      <div className="buttons">
        <button className="btn btn-primary" onClick={handleProfessionalClick}>
          Professional
        </button>
        <button className="btn btn-secondary" onClick={handlePersonalClick}>
          Personal
        </button>
      </div>
    </div>
  );
};

export default LandingPage;
