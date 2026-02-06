import React, { useState } from "react";
import CanteenCard from "../components/CanteenCard";
import "../styles/canteenList.css";

import food1 from "../assets/IMG_0862.webp";
import food2 from "../assets/IMG_0960.JPG";
import food3 from "../assets/IMG_0902.JPG";
import food4 from "../assets/IMG_0894.JPG";
import food5 from "../assets/IMG_0894.JPG";
import food6 from "../assets/IMG_0894.JPG";

const CanteenList = () => {
  const [search, setSearch] = useState("");

 const canteens = [
  { id: 1, name: "Canteen 1", image: food1, rating: 4.2, time: "15–20 mins" },
  { id: 2, name: "Canteen 2", image: food2, rating: 3.8, time: "20–25 mins" },
  { id: 3, name: "Canteen 3", image: food3, rating: 4.5, time: "10–15 mins" },
  { id: 4, name: "Canteen 4", image: food4, rating: 4.0, time: "25–30 mins" },
  { id: 5, name: "Canteen 5", image: food5, rating: 3.9, time: "30–35 mins" },
  { id: 6, name: "Canteen 6", image: food6, rating: 4.7, time: "12–18 mins" },
];


  const filtered = canteens.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="canteen-container">
      <div className="top-bar">
        <input
          type="text"
          placeholder="Search canteen..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="canteen-list">
        {filtered.map((canteen) => (
          <CanteenCard
            key={canteen.id}
            id={canteen.id}
            image={canteen.image}
            name={canteen.name}
            rating={canteen.rating}   
            time={canteen.time}       
          />
        ))}
      </div>
    </div>
  );
};

export default CanteenList;
