import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FiSearch, FiShoppingCart } from "react-icons/fi";
import { FaLeaf } from "react-icons/fa";
import { GiChickenLeg, GiEggClutch } from "react-icons/gi";
import CanteenData from "../data/CanteenData";
import "./home2.css";

const CanteenMenu = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [showSearch, setShowSearch] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);

  const dropdownRef = useRef(null);

  /* 🛒 CART (LOCALSTORAGE SYNC) */
  const [cart, setCart] = useState(
    JSON.parse(localStorage.getItem("cart")) || []
  );

  /* ================= OUTSIDE CLICK CLOSE ================= */
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target)
      ) {
        setShowTypeDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* ================= DATA ================= */
  const canteen = CanteenData[id];

  /* ✅ SAFE RETURN AFTER ALL HOOKS */
  if (!canteen) {
    return <h2 style={{ padding: "20px" }}>Canteen not found</h2>;
  }

  /* ================= CART HELPERS ================= */
  const saveCart = (updated) => {
    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  };

  const getQty = (item) =>
    cart.find((c) => c.name === item.name)?.quantity || 0;

  const addToCart = (item) => {
    const updated = [...cart];
    const index = updated.findIndex((c) => c.name === item.name);

    if (index !== -1) updated[index].quantity++;
    else updated.push({ ...item, quantity: 1 });

    saveCart(updated);
  };

  const decrease = (item) => {
    const updated = [...cart];
    const index = updated.findIndex((c) => c.name === item.name);

    if (updated[index].quantity > 1) updated[index].quantity--;
    else updated.splice(index, 1);

    saveCart(updated);
  };

  const totalItems = cart.reduce((s, i) => s + i.quantity, 0);

  /* ================= FILTER ================= */
  const filteredItems = canteen.items.filter((item) => {
    const matchesSearch = item.name
      .toLowerCase()
      .includes(searchText.toLowerCase());

    if (activeTab === "all") return matchesSearch;
    if (activeTab === "veg") return matchesSearch && item.type === "veg";
    if (activeTab === "nonveg") return matchesSearch && item.type === "nonveg";
    if (activeTab === "egg") return matchesSearch && item.type === "egg";

    return true;
  });

  return (
    <div className="container5">
      {/* ================= NAVBAR ================= */}
      <div className="navbar">
        <div className="header-left">
          <span className="brand-name">{canteen.name}</span>
        </div>

        <div className="header-right">
          <span
            className="header-icon"
            onClick={() => setShowSearch(!showSearch)}
          >
            <FiSearch />
          </span>

          {/* 🥗 FILTER */}
          <div className="veg-filter-wrapper" ref={dropdownRef}>
            <span
              className="header-icon veg-icon"
              onClick={() => setShowTypeDropdown(!showTypeDropdown)}
            >
              🥗
            </span>

            {showTypeDropdown && (
              <div className="veg-dropdown">
                <div
                  onClick={() => {
                    setActiveTab("veg");
                    setShowTypeDropdown(false);
                  }}
                >
                  <FaLeaf style={{ color: "green" }} /> Veg
                </div>

                <div
                  onClick={() => {
                    setActiveTab("nonveg");
                    setShowTypeDropdown(false);
                  }}
                >
                  <GiChickenLeg style={{ color: "red" }} /> Non-Veg
                </div>

                <div
                  onClick={() => {
                    setActiveTab("egg");
                    setShowTypeDropdown(false);
                  }}
                >
                  <GiEggClutch style={{ color: "#f4c430" }} /> Egg
                </div>
              </div>
            )}
          </div>

          {/* 🛒 CART */}
          <span
            className="header-icon"
            style={{ position: "relative" }}
            onClick={() => navigate("/cart")}
          >
            <FiShoppingCart />
            {totalItems > 0 && (
              <span className="cart-badge">{totalItems}</span>
            )}
          </span>
        </div>
      </div>

      {/* ================= SEARCH ================= */}
      {showSearch && (
        <input
          className="search-input"
          placeholder="Search food..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
      )}

      {/* ================= FOOD GRID ================= */}
      <div className="foods-category-card">
        {filteredItems.map((item, index) => {
          const qty = getQty(item);

          return (
            <div className="foods-card-new" key={index}>
              <img src={item.img} alt={item.name} />

              <div className="foods-card-info">
                <h4>{item.name}</h4>

                <p className="foods-desc">
                  Calories: {item.calories || 320} kcal
                  <br />
                  Protein: {item.protein || 14}g
                  <br />
                  Carbs: {item.carbs || 38}g
                </p>

                {qty === 0 ? (
                  <button
                    className="foods-card-btn"
                    onClick={() => addToCart(item)}
                  >
                    Add To Cart
                  </button>
                ) : (
                  <div className="qty-box">
                    <button onClick={() => decrease(item)}>−</button>
                    <span>{qty}</span>
                    <button onClick={() => addToCart(item)}>+</button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CanteenMenu;
