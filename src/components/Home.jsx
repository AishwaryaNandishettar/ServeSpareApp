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

  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("Daily Specials");
  const [foodType, setFoodType] = useState("all");

  const [selectedFood, setSelectedFood] = useState(null);
  const [availableCanteens, setAvailableCanteens] = useState([]);

  /* ✅ SEARCH BAR ONLY (like image) */
  const [showSearchOverlay, setShowSearchOverlay] = useState(false);
  const searchInputRef = useRef(null);

  /* ✅ PROFILE MENU */
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const profileMenuRef = useRef(null);

  /* ✅ FOOD TYPE DROPDOWN */
  const [showFoodDropdown, setShowFoodDropdown] = useState(false);
  const foodDropdownRef = useRef(null);

  /* ✅ Focus search input when opened */
  useEffect(() => {
    if (showSearchOverlay) {
      setTimeout(() => searchInputRef.current?.focus(), 0);
    }
  }, [showSearchOverlay]);

  /* ✅ ESC to close search */
  useEffect(() => {
    if (!showSearchOverlay) return;

    const onKeyDown = (e) => {
      if (e.key === "Escape") setShowSearchOverlay(false);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [showSearchOverlay]);

  /* ✅ Close search when clicking outside the input */
  useEffect(() => {
    if (!showSearchOverlay) return;

    const handleOutside = (e) => {
      if (!e.target.closest(".floating-search")) {
        setShowSearchOverlay(false);
      }
    };

    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, [showSearchOverlay]);

  /* ✅ OUTSIDE CLICK: close FOOD dropdown */
  useEffect(() => {
    if (!showFoodDropdown) return;

    const handleClickOutside = (e) => {
      if (
        foodDropdownRef.current &&
        !foodDropdownRef.current.contains(e.target)
      ) {
        setShowFoodDropdown(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [showFoodDropdown]);

  /* ✅ OUTSIDE CLICK: close PROFILE menu */
  useEffect(() => {
    if (!showProfileMenu) return;

    const handleClickOutside = (e) => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(e.target)
      ) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [showProfileMenu]);

  /* FOOD ITEMS */
  const foodItems = [
    { img: Burger, name: "Burger", type: "veg", category: ["Lunch"] },
    { img: Pizza, name: "Pizza", type: "veg", category: ["Dinner"] },
    { img: Noodles, name: "Noodles", type: "nonveg", category: ["Lunch"] },
    {
      img: ChanaChaat,
      name: "Chana Chaat",
      type: "veg",
      category: ["Breakfast"],
    },
    { img: CholeBhature, name: "Chole Bhature", type: "veg", category: ["Lunch"] },
    { img: Idli, name: "Idli", type: "veg", category: ["Breakfast"] },
    { img: Vada, name: "Vada", type: "veg", category: ["Breakfast"] },
    { img: Desserts, name: "Desserts", type: "egg", category: ["Dinner"] },
    {
      img: FriedRice,
      name: "Fried Rice",
      type: "veg",
      category: ["Lunch", "Dinner"],
    },
    { img: Tea, name: "Tea", type: "veg", category: ["Drinks"] },
    { img: Coffee, name: "Coffee", type: "veg", category: ["Drinks"] },
  ];

  // ✅ REPLACE ONLY THIS FUNCTION inside Home.jsx
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
        item, // ✅ keep reference for auto-add
      });
    }
  });

  // ✅ If not available anywhere: don't open modal, don't show "No canteens found"
  if (matches.length === 0) {
    setSelectedFood(null);
    setAvailableCanteens([]);
    return;
  }

  // ✅ If only in one canteen: auto add to cart + redirect
  if (matches.length === 1) {
    const selected = matches[0];

    // ✅ Auto add to cart (same cart structure your CanteenMenu uses)
    const existingCart = JSON.parse(localStorage.getItem("cart")) || [];
    const idx = existingCart.findIndex((c) => c.name === selected.item.name);

    if (idx !== -1) {
      existingCart[idx].quantity = (existingCart[idx].quantity || 0) + 1;
    } else {
      existingCart.push({ ...selected.item, quantity: 1 });
    }

    localStorage.setItem("cart", JSON.stringify(existingCart));

    // ✅ Redirect to that canteen
    navigate(selected.link);
    return;
  }

  // ✅ Multiple canteens: keep your existing modal behavior
  setSelectedFood(foodName);
  setAvailableCanteens(matches);
};


  /* ✅ Toggle search bar (open/close) */
  const openSearch = () => {
    setShowFoodDropdown(false);
    setShowProfileMenu(false);
    setShowSearchOverlay((prev) => !prev);
  };

  const openProfileMenu = () => {
    setShowFoodDropdown(false);
    setShowSearchOverlay(false);
    setShowProfileMenu((p) => !p);
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
          {/* ✅ SEARCH (shows only search bar like image) */}
          <button
            type="button"
            className="header-icon icon-btn"
            onMouseDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
              openSearch();
            }}
            aria-label="Search"
          >
            <FiSearch />
          </button>

          {/* FOOD TYPE DROPDOWN */}
          <div className="veg-filter-wrapper" ref={foodDropdownRef}>
            <button
              type="button"
              className="header-icon veg-icon icon-btn"
              onClick={(e) => {
                e.stopPropagation();
                setShowProfileMenu(false);
                setShowFoodDropdown((p) => !p);
              }}
              aria-label="Filter food type"
            >
              🥗
            </button>

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

                <div
                  onClick={() => {
                    setFoodType("all");
                    setShowFoodDropdown(false);
                  }}
                >
                  ✅ All
                </div>
              </div>
            )}
          </div>

          {/* ✅ PROFILE */}
          <div className="profile-wrapper" ref={profileMenuRef}>
            <button
              type="button"
              className="header-icon profile-icon icon-btn"
              onClick={(e) => {
                e.stopPropagation();
                openProfileMenu();
              }}
              aria-label="Open profile menu"
            >
              <FaUserCircle />
            </button>

            {showProfileMenu && (
              <div className="profile-menu">
                <div
                  className="profile-menu-item"
                  onClick={() => {
                    setShowProfileMenu(false);
                    navigate("/profile");
                  }}
                >
                  My Profile
                </div>

                <div
                  className="profile-menu-item"
                  onClick={() => {
                    setShowProfileMenu(false);
                    navigate("/orders");
                  }}
                >
                  My Orders
                </div>

                <div
                  className="profile-menu-item danger"
                  onClick={() => {
                    setShowProfileMenu(false);
                    localStorage.removeItem("user");
                    navigate("/login");
                  }}
                >
                  Logout
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ✅ SEARCH BAR ONLY (like image) */}
      {showSearchOverlay && (
        <div className="floating-search" onMouseDown={(e) => e.stopPropagation()}>
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search canteen..."
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
        {["Daily Specials", "Breakfast", "Lunch", "Dinner", "Drinks"].map((tab) => (
          <button
            key={tab}
            className={activeTab === tab ? "tab active1" : "tab"}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* FOOD CARDS */}
      <section className="food-category-cards">
        {foodItems
          .filter(
            (item) =>
              (foodType === "all" || item.type === foodType) &&
              (activeTab === "Daily Specials" || item.category.includes(activeTab)) &&
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
        <div className="container1 fixed-cta">
          <button className="welcome-btn" onClick={() => navigate("/canteens")}>
            CANTEEN CRAVINGS...
          </button>
        </div>
      )}

      {/* MODAL */}
      {selectedFood && (
        <div className="modal-overlay" onClick={() => setSelectedFood(null)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
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

            <button className="close-btn" onClick={() => setSelectedFood(null)}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
