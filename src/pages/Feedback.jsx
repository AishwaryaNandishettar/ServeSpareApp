import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/feedback.css";

const Feedback = () => {
  const navigate = useNavigate();
  const [feedback, setFeedback] = useState("");

  const handleSubmit = () => {
    if (!feedback.trim()) {
      alert("Please enter your feedback");
      return;
    }

    // ✅ Save feedback (can later be sent to backend)
    const existing =
      JSON.parse(localStorage.getItem("userFeedbacks")) || [];

    existing.push({
      message: feedback,
      date: new Date().toISOString(),
    });

    localStorage.setItem("userFeedbacks", JSON.stringify(existing));

    alert("Thank you for your feedback!");
    setFeedback("");
    navigate(-1); // go back to profile
  };

  return (
    <div className="feedback-container">
      {/* Header */}
      <header className="feedback-header">
        {/* <button className="back-btn" onClick={() => navigate(-1)}>
          ←
        </button> */}
        <h3>Send Feedback</h3>
      </header>

      <p className="subtitle">
        Tell us what you love about the app, or what we could be doing better.
      </p>

      <textarea
        placeholder="Enter feedback"
        value={feedback}
        onChange={(e) => setFeedback(e.target.value)}
      />

      <div className="help-card">
        ⭐ Need help with your order?
        <p>Get instant help from our customer support.</p>
      </div>

      <button
        className={`submit-btn ${feedback ? "active" : ""}`}
        onClick={handleSubmit}
        disabled={!feedback}
      >
        Submit feedback
      </button>
    </div>
  );
};

export default Feedback;
