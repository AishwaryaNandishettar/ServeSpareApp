import React from "react";
import { useNavigate } from "react-router-dom";

const CanteenCard = ({ id, image, name, rating, time }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    localStorage.setItem("selectedCanteen", name);
    localStorage.setItem("selectedCanteenId", id);
    navigate(`/canteen/${id}`);
  };

  // ⭐ rating color logic (unchanged logic, safe)
  const ratingClass =
    rating >= 4
      ? "rating-good"
      : rating >= 3
      ? "rating-average"
      : "rating-bad";

  return (
    <div className="canteen-card" onClick={handleClick}>
      <img src={image} alt={name} className="canteen-img" />

      <div className="canteen-info">
        <h3>{name}</h3>
        <span className="canteen-time">⏱ {time}</span>
      </div>

      <div className={`canteen-rating ${ratingClass}`}>
        ★ {rating}
      </div>
    </div>
  );
};

export default CanteenCard;
