// src/components/BottomNav.js
import React from "react";
// import "./BottomNav.css";
import { useNavigate } from "react-router-dom";

const BottomNav = () => {
  const navigate = useNavigate();

  return (
    <div className="bottom-nav">
      <div className="nav-item" onClick={() => navigate("/")}>
        <i className="fa-solid fa-house"></i>
        <span>Home</span>
      </div>
      <div className="nav-item" onClick={() => navigate("/reorder")}>
        <i className="fa-solid fa-rotate-left"></i>
        <span>Reorder</span>
      </div>
    </div>
  );
};

export default BottomNav;
