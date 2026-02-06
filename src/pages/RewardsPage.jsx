import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/rewards.css";

const rewardsData = [
  {
    title: "Guaranteed Monthly Cashback",
    highlight: "₹75 Cashback",
    description:
      "Maintain a minimum wallet balance of ₹1000 and get guaranteed cashback every month.",
    subText: "Cashback range: ₹50–₹100",
    tag: "Most Popular",
  },
  {
    title: "Extra Wallet Cashback on Orders",
    highlight: "+5% Cashback",
    description:
      "Earn extra cashback every time you pay using wallet balance.",
    subText: "Cashback capped per order",
    tag: "Smart Savings",
  },
  {
    title: "Spend & Maintain Combo",
    highlight: "₹150 Cashback",
    description:
      "Maintain ₹1000 wallet balance and place 3 orders in a month to unlock bonus cashback.",
    subText: "Perfect for regular office orders",
    tag: "High Value",
  },
];

const Rewards = () => {
  const navigate = useNavigate();

  return (
    <div className="rewards-page">
      <header className="rewards-header">
        <h1>Wallet Rewards</h1>
      </header>

      <div className="rewards-grid">
        {rewardsData.map((reward, index) => (
          <div className="reward-card" key={index}>
            {/* <span className="reward-tag">{reward.tag}</span> */}
            <h2>{reward.title}</h2>
            <div className="reward-highlight">{reward.highlight}</div>
            <p className="reward-desc">{reward.description}</p>
            <button
              className="reward-btn"
              onClick={() => navigate("/wallet")}
            >
              Use Wallet
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Rewards;
