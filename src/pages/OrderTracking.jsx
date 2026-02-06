import React, { useEffect, useState } from "react";
import "./OrderTracking.css";
import QRCode from "react-qr-code";

const OrderTracking = () => {
  const [order, setOrder] = useState(null);
  const [disableCancel, setDisableCancel] = useState(false);

  const [showDetails, setShowDetails] = useState(false);
  const [showSupport, setShowSupport] = useState(false);
  const [chatMsg, setChatMsg] = useState("");
  const [messages, setMessages] = useState([
    { from: "vendor", text: "Hello 👋 How can we help you?" },
  ]);

  /* 🔁 REALTIME FETCH (UNCHANGED DATA SOURCE) */
  useEffect(() => {
    const t = setInterval(() => {
      const orders =
        JSON.parse(localStorage.getItem("monitorOrders")) || [];

      const active = orders.find(
        (o) => o.status !== "Delivered" && o.status !== "Cancelled"
      );

      setOrder(active || null);
    }, 1000);

    return () => clearInterval(t);
  }, []);

  /* ⏱ CANCEL AFTER 5 MIN */
  useEffect(() => {
    if (!order?.time) return;

    const placed = new Date(`1970-01-01 ${order.time}`);
    const diff = (new Date() - placed) / 60000;

    if (diff >= 5) setDisableCancel(true);
  }, [order]);

  /* 💬 SEND MESSAGE */
  const sendMessage = () => {
    if (!chatMsg.trim()) return;

    setMessages((m) => [
      ...m,
      { from: "user", text: chatMsg },
      {
        from: "vendor",
        text: "Thanks for reaching out! We’ll assist you shortly.",
      },
    ]);

    setChatMsg("");
  };

  if (!order) {
    return <div className="tracking-empty">No active order</div>;
  }

  return (
    <div className="tracking-container">
      {/* HEADER */}
      <div className="tracking-header">
        <h3>{order.canteen}</h3>
        <p className="status-text">Order is on the way ✌️</p>
        <span className="arrival">Status: {order.status}</span>
      </div>

      {/* MESSAGE STRIP */}
      <div className="info-strip">
        <span>You have 1 new message from the vendor</span>
        <button onClick={() => setShowSupport(true)}>CHAT NOW</button>
      </div>

      {/* ACTIONS */}
      <div className="tracking-actions">
        <button className="primary" onClick={() => setShowDetails(true)}>
          Order Details
        </button>

        <button className="danger" disabled={disableCancel}>
          Cancel Order
        </button>

        <button className="support" onClick={() => setShowSupport(true)}>
          Support
        </button>
      </div>

      {disableCancel && (
        <p className="cancel-info">
          Cancellation after 5 minutes is available via Support
        </p>
      )}

      {/* QR */}
      <div className="qr-box">
        <QRCode value={order.id} size={120} />
        <p>Scan QR at delivery</p>
      </div>

      {/* ORDER DETAILS MODAL */}
      {showDetails && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Order Details</h3>
            <p><strong>Order ID:</strong> {order.id}</p>
            <p><strong>Canteen:</strong> {order.canteen}</p>
            <p><strong>Items:</strong> {order.items}</p>
            <p><strong>Time:</strong> {order.time}</p>
            <p><strong>Total:</strong> {order.source}</p>

            <button onClick={() => setShowDetails(false)}>
              Close
            </button>
          </div>
        </div>
      )}

      {/* SUPPORT CHAT MODAL */}
      {showSupport && (
        <div className="modal-overlay">
          <div className="modal chat-modal">
            <h3>Support Chat</h3>

            <div className="chat-body">
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`chat-msg ${m.from}`}
                >
                  {m.text}
                </div>
              ))}
            </div>

            <div className="chat-input">
              <input
                placeholder="Type your message..."
                value={chatMsg}
                onChange={(e) => setChatMsg(e.target.value)}
              />
              <button onClick={sendMessage}>Send</button>
            </div>

            <button
              className="close"
              onClick={() => setShowSupport(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderTracking;
