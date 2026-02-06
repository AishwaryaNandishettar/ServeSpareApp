import React, { useState, useEffect, useRef } from "react";
import "./MonitorDashboard.css";
import { Html5Qrcode } from "html5-qrcode";
import { useNavigate } from "react-router-dom";

const MonitorDashboard = () => {
  const [currentTime, setCurrentTime] = useState("");

  const [orders, setOrders] = useState(() => {
    return JSON.parse(localStorage.getItem("monitorOrders")) || [];
  });

  const [searchTerm, setSearchTerm] = useState("");

  const [showScanner, setShowScanner] = useState(false);
  const qrInstanceRef = useRef(null);

  const navigate = useNavigate();

  /* ================= TIME ================= */
  useEffect(() => {
    const update = () => {
      const now = new Date();
      let h = now.getHours();
      let m = now.getMinutes().toString().padStart(2, "0");
      const ampm = h >= 12 ? "PM" : "AM";
      h = h % 12 || 12;
      setCurrentTime(`${h}:${m} ${ampm}`);
    };
    update();
    const t = setInterval(update, 1000);
    return () => clearInterval(t);
  }, []);

  /* ================= SAVE ORDERS ================= */
  useEffect(() => {
    localStorage.setItem("monitorOrders", JSON.stringify(orders));
  }, [orders]);

  /* ================= PENDING ORDERS ================= */
  useEffect(() => {
    const interval = setInterval(() => {
      const pending =
        JSON.parse(localStorage.getItem("pendingOrders")) || [];

      if (pending.length === 0) return;

      setOrders((prev) => {
        const existingIds = prev.map((o) => o.id);

        const newOrders = pending
          .filter((p) => !existingIds.includes(p.orderId))
          .map((p) => {
            const total = p.items.reduce(
              (sum, item) => sum + item.price * item.quantity,
              0
            );

            return {
              id: p.orderId,
              canteen: localStorage.getItem("selectedCanteen") || "N/A",
              source: `Price : ₹${total}/-`,
              time: p.time,
              items: p.items
                .map((i) => `${i.quantity} × ${i.name}`)
                .join(", "),
              status: "Order Received",
              comment: "No comment",
            };
          });

        if (newOrders.length > 0) {
          localStorage.setItem("pendingOrders", JSON.stringify([]));
          return [...newOrders, ...prev];
        }

        return prev;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  /* ================= SEARCH ================= */
  const filteredOrders = orders.filter((o) => {
    const s = searchTerm.toLowerCase();
    return (
      o.id?.toLowerCase().includes(s) ||
      o.status?.toLowerCase().includes(s) ||
      o.items?.toLowerCase().includes(s)
    );
  });

  /* ================= STATUS CYCLE ================= */
  const handleStatusCycle = (orderId) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id !== orderId) return o;

        let next = "Order Received";
        if (o.status === "Order Received") next = "Preparing";
        else if (o.status === "Preparing") next = "Prepared";
        else if (o.status === "Prepared") next = "Delivered";

        return { ...o, status: next };
      })
    );
  };

  /* ================= QR ================= */
  const startQrScanner = () => setShowScanner(true);

  useEffect(() => {
    if (!showScanner) return;

    const startScanner = async () => {
      if (qrInstanceRef.current) return;

      qrInstanceRef.current = new Html5Qrcode("qr-reader");

      try {
        await qrInstanceRef.current.start(
          { facingMode: "environment" },
          { fps: 15, qrbox: 250 },
          (decodedText) => {
            const orderId = decodedText.trim();
            setSearchTerm(orderId);

            setOrders((prev) =>
              prev.map((o) =>
                o.id === orderId ? { ...o, status: "Delivered" } : o
              )
            );

            stopQrScanner();
          }
        );
      } catch (err) {
        console.error("QR Error:", err);
        stopQrScanner();
      }
    };

    startScanner();
    return () => stopQrScanner();
  }, [showScanner]);

  const stopQrScanner = async () => {
    if (qrInstanceRef.current) {
      try {
        await qrInstanceRef.current.stop();
        await qrInstanceRef.current.clear();
      } catch {}
      qrInstanceRef.current = null;
    }
    setShowScanner(false);
  };

  return (
    <div className="monitor-dashboard">
      <header>
        <div className="canteen-name">
          SERVESPARE - Satisfying Every Bite
          <div className="sub-canteen-name">
            Canteen: Main Campus Canteen
          </div>
        </div>
        <div className="time">{currentTime}</div>
      </header>

      <div className="toolbar">
        <button className="filter-btn">ALL</button>

        <div className="search-box">
          <input
            placeholder="Search order..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <button onClick={() => navigate("/excel-menu-manager")}>
            Update Menu
          </button>

          <button onClick={startQrScanner}>Scan QR</button>
        </div>
      </div>

      <main id="orderContainer">
        {filteredOrders.map((order) => {
          const cancelRequests =
            JSON.parse(localStorage.getItem("cancelRequests")) || {};
          const chats =
            JSON.parse(localStorage.getItem("supportChats")) || {};

          /* 🔥 NEW (SAFE): pick cancel reason if present */
          const commentToShow =
            order.cancelReason || order.comment || "No comment";

          return (
            <div className="order-card" key={order.id}>
              <div className="order-id">{order.id}</div>

              <div className="order-details">
                <div>{order.source}</div>
                <div>{order.time}</div>
                <div>{order.items}</div>
              </div>

              <div className="order-actions">
                <button
                  className={`btn ${order.status
                    .toLowerCase()
                    .replaceAll(" ", "-")}`}
                  onClick={() => handleStatusCycle(order.id)}
                >
                  {order.status}
                </button>
              </div>

              <div className="order-comment">
                <strong>Customer Comment:</strong> {commentToShow}
              </div>

              {cancelRequests[order.id] === "pending" && (
                <div className="support-chat">
                  {(chats[order.id] || []).map((c, i) => (
                    <div key={i}>
                      <strong>{c.sender}:</strong> {c.text}
                    </div>
                  ))}

                  <button
                    onClick={() => {
                      chats[order.id] = chats[order.id] || [];
                      chats[order.id].push({
                        time: new Date().toLocaleTimeString(),
                      });

                      cancelRequests[order.id] = "accepted";

                      localStorage.setItem("supportChats", JSON.stringify(chats));
                      localStorage.setItem(
                        "cancelRequests",
                        JSON.stringify(cancelRequests)
                      );

                      setOrders((prev) =>
                        prev.filter((o) => o.id !== order.id)
                      );
                    }}
                  >
                    Accept Cancel
                  </button>

                  <button
                    onClick={() => {
                      chats[order.id] = chats[order.id] || [];
                      chats[order.id].push({
                        time: new Date().toLocaleTimeString(),
                      });

                      cancelRequests[order.id] = "rejected";

                      localStorage.setItem("supportChats", JSON.stringify(chats));
                      localStorage.setItem(
                        "cancelRequests",
                        JSON.stringify(cancelRequests)
                      );

                      setOrders((prev) =>
                        prev.map((o) =>
                          o.id === order.id
                            ? { ...o, status: "Cancellation Rejected" }
                            : o
                        )
                      );
                    }}
                  >
                    Reject Cancel
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </main>

      {showScanner && (
        <div className="qr-overlay">
          <div className="qr-box">
            <div id="qr-reader" />
            <button onClick={stopQrScanner}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MonitorDashboard;