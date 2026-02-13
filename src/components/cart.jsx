import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import "../styles/cart.css";

/* ✅ suggestion images */
import riceBathImg from "../assets/IMG_0969.WEBP";
import gingerTeaImg from "../assets/ginger_tea.jpg";
import filterCoffeeImg from "../assets/IMG_0900.WEBP";
import teaImg from "../assets/Tea.webp";

/* ✅ cart item images (ADD YOUR REAL FILES HERE) */
import pizzaImg from "../assets/Pizza.PNG";
import friedRiceImg from "../assets/veg-fried-rice.jpg";
import noodlesImg from "../assets/IMG_0960.JPG";

/* ✅ map by item name (must match exactly your item.name) */
const CART_IMAGE_MAP = {
  Pizza: pizzaImg,
  "Fried Rice": friedRiceImg,
  Noodles: noodlesImg,
};

const Cart = () => {
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();

  // ✅ note state + toggle
  const [showNote, setShowNote] = useState(false);
  const [restaurantNote, setRestaurantNote] = useState("");

  // ✅ suggestions (Complete your meal with)
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(storedCart);

    const cid =
      storedCart?.[0]?.canteenId ||
      storedCart?.[0]?.canteenID ||
      storedCart?.[0]?.canteen ||
      storedCart?.[0]?.canteen_id ||
      storedCart?.[0]?.canteenMenuId ||
      null;

    const saved =
      (cid && localStorage.getItem(`restaurantNote_${cid}`)) ||
      localStorage.getItem("restaurantNote") ||
      "";

    setRestaurantNote(saved);

    const sug =
      (cid && JSON.parse(localStorage.getItem(`cartSuggestions_${cid}`))) ||
      JSON.parse(localStorage.getItem("cartSuggestions")) ||
      null;

    if (Array.isArray(sug) && sug.length) {
      setSuggestions(sug);
    } else {
      setSuggestions([
        { name: "Rice Bath", price: 38, img: riceBathImg },
        { name: "Ginger Tea", price: 12, img: gingerTeaImg },
        { name: "Filter coffee", price: 12, img: filterCoffeeImg },
        { name: "Tea", price: 10, img: teaImg },
      ]);
    }
  }, []);

  const updateCart = (updated) => {
    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  };

  const increase = (i) => {
    const c = [...cart];
    c[i].quantity++;
    updateCart(c);
  };

  const decrease = (i) => {
    const c = [...cart];
    if (c[i].quantity > 1) c[i].quantity--;
    else c.splice(i, 1);
    updateCart(c);
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const subtotal = total;
  const cgst = +(subtotal * 0.025).toFixed(2);
  const sgst = +(subtotal * 0.025).toFixed(2);
  const grandTotal = subtotal + cgst + sgst;

  const handleAddMoreItems = () => {
    if (!cart.length) return;

    const first = cart[0];
    const canteenId =
      first.canteenId ||
      first.canteenID ||
      first.canteen ||
      first.canteen_id ||
      first.canteenMenuId;

    if (first.canteenLink || first.menuLink || first.link) {
      navigate(first.canteenLink || first.menuLink || first.link);
      return;
    }

    if (canteenId) {
      navigate(`/canteen/${canteenId}`);
      return;
    }

    navigate(-1);
  };

  const handleNoteChange = (e) => {
    const val = e.target.value;
    setRestaurantNote(val);

    const cid =
      cart?.[0]?.canteenId ||
      cart?.[0]?.canteenID ||
      cart?.[0]?.canteen ||
      cart?.[0]?.canteen_id ||
      cart?.[0]?.canteenMenuId ||
      null;

    if (cid) localStorage.setItem(`restaurantNote_${cid}`, val);
    else localStorage.setItem("restaurantNote", val);
  };

  const addSuggestionToCart = (sug) => {
    const cid =
      cart?.[0]?.canteenId ||
      cart?.[0]?.canteenID ||
      cart?.[0]?.canteen ||
      cart?.[0]?.canteen_id ||
      cart?.[0]?.canteenMenuId ||
      null;

    const current = [...cart];
    const idx = current.findIndex((x) => x.name === sug.name && x.price === sug.price);

    if (idx >= 0) current[idx].quantity++;
    else
      current.push({
        ...sug,
        quantity: 1,
        ...(cid ? { canteenId: cid } : {}),
      });

    updateCart(current);
  };

  const handlePay = () => {
    const invoice = {
      orderId: Date.now(),
      items: cart,
      subtotal,
      cgst,
      sgst,
      total: grandTotal,
      createdAt: new Date().toISOString(),
      note: restaurantNote,
    };

    localStorage.setItem("latestInvoice", JSON.stringify(invoice));
    navigate("/payment-page");
  };

  return (
    <div className="cart-page">
      <div className="app-container">
        {/* ✅ HEADER WITH BACK BUTTON */}
        <div className="cart-header">
          <button
            className="cart-back-btn"
            onClick={() => navigate(-1)}
            aria-label="Go back"
          >
            <FiArrowLeft />
          </button>
          <h3>My Cart</h3>
        </div>

        <div className="cart-content">
          <div className="cart-items">
            {cart.map((item, i) => (
              <div className="cart-item" key={i}>
                {/* ✅ FIX: always try imported image first; if fails, fallback safely */}
                <img
                  src={CART_IMAGE_MAP[item.name] || item.img}
                  alt={item.name}
                  onError={(e) => {
                    const fallback = CART_IMAGE_MAP[item.name];
                    if (fallback && e.currentTarget.src !== fallback) {
                      e.currentTarget.src = fallback;
                      return;
                    }
                    // prevent infinite loop if both are broken
                    e.currentTarget.onerror = null;
                  }}
                />

                <div className="item-info">
                  <h4>{item.name}</h4>
                  <p>₹{item.price}</p>
                </div>
                <div className="qty-pill">
                  <button onClick={() => decrease(i)}>−</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => increase(i)}>+</button>
                </div>
              </div>
            ))}
          </div>

          <div className="add-more-row" onClick={handleAddMoreItems}>
            <span className="add-more-plus">+</span>
            <span className="add-more-text">Add more items</span>
          </div>

          <div className="note-row" onClick={() => setShowNote(true)}>
            <span>Add a note for the restaurant</span>
            <span>›</span>
          </div>

          {showNote && (
            <div className="note-box" onClick={(e) => e.stopPropagation()}>
              <textarea
                value={restaurantNote}
                onChange={handleNoteChange}
                placeholder="e.g. Less spicy, no onions..."
                rows={3}
                autoFocus
              />
              <div className="note-actions">
                <button className="note-done" onClick={() => setShowNote(false)}>
                  Done
                </button>
              </div>
              <div className="note-hint">Saved automatically</div>
            </div>
          )}

          {suggestions.length > 0 && (
            <div className="complete-meal">
              <div className="complete-title">Complete your meal with:</div>
              <div className="complete-scroll">
                {suggestions.map((s, idx) => (
                  <div className="complete-card" key={idx}>
                    <div className="complete-img-wrap">
                      <img src={s.img} alt={s.name} />
                      <button
                        className="complete-plus-btn"
                        onClick={() => addSuggestionToCart(s)}
                      >
                        +
                      </button>
                    </div>
                    <div className="complete-name">{s.name}</div>
                    <div className="complete-price">₹{s.price}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="coupons">
            <span>Apply Coupon</span>
            <span>›</span>
          </div>

          <div className="bill-row">
            <span>Subtotal</span>
            <span>₹{subtotal}</span>
          </div>
          <div className="bill-row">
            <span>CGST (2.5%)</span>
            <span>₹{cgst}</span>
          </div>
          <div className="bill-row">
            <span>SGST (2.5%)</span>
            <span>₹{sgst}</span>
          </div>

          <div className="total-box">
            <span>Total</span>
            <span>₹{grandTotal}</span>
          </div>
        </div>

        <button className="pay-btn" onClick={handlePay}>
          Pay ₹{grandTotal}
        </button>
      </div>
    </div>
  );
};

export default Cart;
