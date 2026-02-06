import React, { useState, useRef, useEffect } from "react";
import "../styles/Home.css";
import canteenData from "../data/CanteenData";
import { useNavigate } from "react-router-dom";
import { FaLeaf } from "react-icons/fa";
import { GiChickenLeg, GiEggClutch } from "react-icons/gi";

/* ICONS */
import { FiSearch } from "react-icons/fi";
import { FaUserCircle } from "react-icons/fa";

/* Images */
import Burger from "../assets/Real_veggie.webp";
import Pizza from "../assets/Pizza.PNG";
import Noodles from "../assets/IMG_0960.JPG";
import ChanaChaat from "../assets/Chaats.WEBP";
import CholeBhature from "../assets/NorthIndian.PNG";
import Idli from "../assets/Idli.jpg";
import Vada from "../assets/Vada.webp";
import Desserts from "../assets/Desserts.jpg";
import FriedRice from "../assets/veg-fried-rice.jpg";
import Tea from "../assets/Tea.webp";
import Coffee from "../assets/Coffee.webp";

const Home = () => {
  const navigate = useNavigate();

  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("Daily Specials");
  const [foodType, setFoodType] = useState("all");
  const [selectedFood, setSelectedFood] = useState(null);
  const [availableCanteens, setAvailableCanteens] = useState([]);

  /* DROPDOWN STATE */
  const [showFoodDropdown, setShowFoodDropdown] = useState(false);
  const foodDropdownRef = useRef(null);

  /* CLOSE DROPDOWN ON OUTSIDE CLICK */
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        foodDropdownRef.current &&
        !foodDropdownRef.current.contains(e.target)
      ) {
        setShowFoodDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* FOOD ITEMS */
  const foodItems = [
    { img: Burger, name: "Burger", type: "veg", category: ["Lunch"] },
    { img: Pizza, name: "Pizza", type: "veg", category: ["Dinner"] },
    { img: Noodles, name: "Noodles", type: "nonveg", category: ["Lunch"] },
    { img: ChanaChaat, name: "Chana Chaat", type: "veg", category: ["Breakfast"] },
    { img: CholeBhature, name: "Chole Bhature", type: "veg", category: ["Lunch"] },
    { img: Idli, name: "Idli", type: "veg", category: ["Breakfast"] },
    { img: Vada, name: "Vada", type: "veg", category: ["Breakfast"] },
    { img: Desserts, name: "Desserts", type: "egg", category: ["Dinner"] },
    { img: FriedRice, name: "Fried Rice", type: "veg", category: ["Lunch", "Dinner"] },
    { img: Tea, name: "Tea", type: "veg", category: ["Drinks"] },
    { img: Coffee, name: "Coffee", type: "veg", category: ["Drinks"] },
  ];

  const handleFoodClick = (foodName) => {
    const matches = [];

    Object.values(canteenData).forEach((canteen) => {
      const item = canteen.items.find(
        (i) =>
          i.name.toLowerCase() === foodName.toLowerCase() &&
          (foodType === "all" || i.type === foodType)
      );

      if (item) {
        matches.push({
          canteenName: canteen.name,
          price: item.price,
          link: canteen.link,
        });
      }
    });

    setSelectedFood(foodName);
    setAvailableCanteens(matches);
  };

  return (
    <div className="container5">
      {/* HEADER */}
      <header className="navbar">
        <div className="header-left">
          <span className="logo-circle">⟳</span>
          <span className="brand-name">
            <span className="brand-line-1">Omoikane</span>
            <span className="brand-line-2">Innovations</span>
          </span>
        </div>

        <div className="header-right">
          {/* SEARCH ICON */}
          <span
            className="header-icon"
            onClick={() => setShowSearch(!showSearch)}
          >
            <FiSearch />
          </span>

          <div className="veg-filter-wrapper" ref={foodDropdownRef}>
  <span
    className="header-icon veg-icon"
    onClick={() => setShowFoodDropdown(!showFoodDropdown)}
  >
    🥗
  </span>

  {showFoodDropdown && (
    <div className="veg-dropdown">
      <div
        onClick={() => {
          setFoodType("veg");
          setShowFoodDropdown(false);
        }}
      >
        <FaLeaf style={{ color: "green" }} /> Veg
      </div>

      <div
        onClick={() => {
          setFoodType("nonveg");
          setShowFoodDropdown(false);
        }}
      >
        <GiChickenLeg style={{ color: "red" }} /> Non-Veg
      </div>

      <div
        onClick={() => {
          setFoodType("egg");
          setShowFoodDropdown(false);
        }}
      >
        <GiEggClutch style={{ color: "#f4c430" }} /> Egg
      </div>
    </div>
  )}
</div>

          {/* PROFILE ICON */}
          <span
            className="header-icon profile-icon"
            onClick={() => navigate("/profile")}
          >
            <FaUserCircle />
          </span>
        </div>
      </header>

      {/* SEARCH BAR */}
      {showSearch && (
        <div className="floating-search">
          <input
            type="text"
            placeholder="Search food..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      )}

      {/* WELCOME */}
      <section className="welcome-banner">
        <div className="welcome-text">
          <h1>Welcome to the Cafeteria</h1>
          <p>Order Meals for Your Workday</p>
        </div>
      </section>

      {/* QUICK TABS */}
      <div className="quick-tab">
        {["Daily Specials", "Breakfast", "Lunch", "Dinner", "Drinks"].map(
          (tab) => (
            <button
              key={tab}
              className={activeTab === tab ? "tab active1" : "tab"}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          )
        )}
      </div>

      {/* FOOD CARDS */}
      <section className="food-category-cards">
        {foodItems
          .filter(
            (item) =>
              (foodType === "all" || item.type === foodType) &&
              (activeTab === "Daily Specials" ||
                item.category.includes(activeTab)) &&
              item.name.toLowerCase().includes(searchQuery.toLowerCase())
          )
          .map((item, index) => (
            <div
              key={index}
              className="food-card-new"
              onClick={() => handleFoodClick(item.name)}
            >
              <img src={item.img} alt={item.name} />
              <p className="food-name">{item.name}</p>
            </div>
          ))}
      </section>

      {/* CTA */}
      {searchQuery === "" && (
        <div className="container1">
          <button
            className="welcome-btn"
            onClick={() => navigate("/canteens")}
          >
            CANTEEN CRAVINGS...
          </button>
        </div>
      )}

      {/* MODAL */}
      {selectedFood && (
        <div
          className="modal-overlay"
          onClick={() => setSelectedFood(null)}
        >
          <div
            className="modal-box"
            onClick={(e) => e.stopPropagation()}
          >
            <h3>{selectedFood} available at</h3>

            {availableCanteens.length === 0 ? (
              <p>No canteens found</p>
            ) : (
              availableCanteens.map((c, i) => (
                <div
                  key={i}
                  className="canteen-price-row"
                  onClick={() => navigate(c.link)}
                >
                  <span>{c.canteenName}</span>
                  <span className="price">₹{c.price}</span>
                </div>
              ))
            )}

            <button
              className="close-btn"
              onClick={() => setSelectedFood(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
