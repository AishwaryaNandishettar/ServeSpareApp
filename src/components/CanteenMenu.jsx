import React, { useState, useEffect, useRef, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FiSearch, FiShoppingCart, FiArrowLeft } from "react-icons/fi";
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

  // ✅ Menu sheet
  const [showMenuSheet, setShowMenuSheet] = useState(false);

  // ✅ selected category (null = show all)
  const [selectedCategory, setSelectedCategory] = useState(null);

  const dropdownRef = useRef(null);

  /* 🛒 CART (LOCALSTORAGE SYNC) */
  const [cart, setCart] = useState(
    JSON.parse(localStorage.getItem("cart")) || []
  );

  /* ================= DATA ================= */
  const canteen = CanteenData[id];
  const items = canteen?.items || [];

  /* ================= OUTSIDE CLICK CLOSE ================= */
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowTypeDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* ================= CART HELPERS ================= */
  const saveCart = (updated) => {
    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  };

  const getQty = (item) => cart.find((c) => c.name === item.name)?.quantity || 0;

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

    if (index !== -1) {
      if (updated[index].quantity > 1) updated[index].quantity--;
      else updated.splice(index, 1);
    }

    saveCart(updated);
  };

  const totalItems = cart.reduce((s, i) => s + i.quantity, 0);

  /* ================= CATEGORY HELPERS ================= */
  const getItemCategory = (item) => item.category || "Others";

  const categories = useMemo(() => {
    const set = new Set();
    items.forEach((it) => set.add(getItemCategory(it)));
    return Array.from(set);
  }, [items]);

  /* ================= FILTER ================= */
  const filteredItems = items.filter((item) => {
    const matchesSearch = item.name
      .toLowerCase()
      .includes(searchText.toLowerCase());

    const matchesCategory =
      !selectedCategory || getItemCategory(item) === selectedCategory;

    if (activeTab === "all") return matchesSearch && matchesCategory;
    if (activeTab === "veg")
      return matchesSearch && matchesCategory && item.type === "veg";
    if (activeTab === "nonveg")
      return matchesSearch && matchesCategory && item.type === "nonveg";
    if (activeTab === "egg")
      return matchesSearch && matchesCategory && item.type === "egg";

    return matchesSearch && matchesCategory;
  });

  /* ================= FSSAI TYPE SYMBOL (UI ONLY) ================= */
  const renderTypeDot = (type) => {
    const color =
      type === "veg"
        ? "#2ecc71"
        : type === "nonveg"
        ? "#e74c3c"
        : type === "egg"
        ? "#f1c40f"
        : "#ccc";

    return (
      <span
        title={type}
        style={{
          width: "14px",
          height: "14px",
          border: `1.8px solid ${color}`,
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "2px",
          flexShrink: 0,
        }}
      >
        <span
          style={{
            width: "6px",
            height: "6px",
            borderRadius: "50%",
            backgroundColor: color,
            display: "block",
          }}
        />
      </span>
    );
  };

  // close menu sheet on ESC
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") setShowMenuSheet(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  if (!canteen) {
    return <h2 style={{ padding: "20px" }}>Canteen not found</h2>;
  }

  const chooseCategory = (cat) => {
    setSelectedCategory(cat);
    setShowMenuSheet(false);
  };

  return (
    <div className="container5">
      {/* ================= NAVBAR ================= */}
      <div className="navbar">
        <div className="header-left">
          <span
            className="header-icon back-btn"
            onClick={() => navigate(-1)}
            title="Back"
          >
            <FiArrowLeft />
          </span>

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
            {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
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
              {/* ✅ IMPORTANT: uses public path like /image/veg_thali.JPG */}
              <img
                src={item.img}
                alt={item.name}
                onError={(e) => {
                  // fallback to avoid broken icon if file missing in public/image
                  e.currentTarget.src =
                    "https://via.placeholder.com/300x200?text=No+Image";
                }}
              />

              <div className="foods-card-info">
                <div className="foods-title-row">
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      minWidth: 0,
                    }}
                  >
                    <h4 style={{ margin: 0 }}>{item.name}</h4>
                    {renderTypeDot(item.type)}
                  </div>

                  <span className="foods-price">₹{item.price}</span>
                </div>

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

      {/* ✅ Floating menu button */}
      <button
        className="floating-menu-btn"
        onClick={() => setShowMenuSheet(true)}
      >
        Menu
      </button>

      {/* ✅ Menu sheet */}
      {showMenuSheet && (
        <>
          <div
            className="menu-sheet-backdrop"
            onClick={() => setShowMenuSheet(false)}
          />
          <div className="menu-sheet">
            <div className="menu-sheet-header">
              <span>Recommended for you</span>
              <button
                className="menu-sheet-close"
                onClick={() => setShowMenuSheet(false)}
              >
                × Close
              </button>
            </div>

            <div className="menu-sheet-list">
              <div
                className="menu-sheet-item"
                onClick={() => {
                  setSelectedCategory(null);
                  setShowMenuSheet(false);
                }}
              >
                <span className="menu-sheet-name">All items</span>
                <span className="menu-sheet-count">{items.length}</span>
              </div>

              {categories.map((cat) => (
                <div
                  key={cat}
                  className="menu-sheet-item"
                  onClick={() => chooseCategory(cat)}
                >
                  <span className="menu-sheet-name">{cat}</span>
                  <span className="menu-sheet-count">
                    {items.filter((x) => getItemCategory(x) === cat).length}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CanteenMenu;
