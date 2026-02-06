import React, { useEffect, useState } from "react";
import "./InvoicePage.css";
import { QRCodeCanvas } from "qrcode.react";

const InvoicePage = () => {
  const [order, setOrder] = useState(null);
  const [qrValue, setQrValue] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      try {
        const latestOrderId = localStorage.getItem("latestOrderId");
        const monitorOrders =
          JSON.parse(localStorage.getItem("monitorOrders")) || [];

        if (!latestOrderId || !monitorOrders.length) return;

        const index = monitorOrders.findIndex(
          (o) => String(o.id) === String(latestOrderId)
        );

        if (index === -1) return;

        const matchedOrder = monitorOrders[index];

        /* 🔐 LOCKED INVOICE NUMBER (PER CANTEEN) */
        if (!matchedOrder.invoiceNumber) {
          const canteen = matchedOrder.canteen || "UNKNOWN";

          const counters =
            JSON.parse(localStorage.getItem("canteenInvoiceCounters")) || {};

          const next = (counters[canteen] || 0) + 1;
          counters[canteen] = next;

          localStorage.setItem(
            "canteenInvoiceCounters",
            JSON.stringify(counters)
          );

          const invoiceNumber = `INV-${canteen
            .replace(/\s+/g, "-")
            .toUpperCase()}-${String(next).padStart(3, "0")}`;

          matchedOrder.invoiceNumber = invoiceNumber;

          monitorOrders[index] = matchedOrder;
          localStorage.setItem(
            "monitorOrders",
            JSON.stringify(monitorOrders)
          );
        }

        const qrPayload = JSON.stringify({
          orderId: matchedOrder.id,
          invoice: matchedOrder.invoiceNumber,
        });

        localStorage.setItem("invoiceQR", qrPayload);
        setQrValue(qrPayload);
        setOrder(matchedOrder);
      } catch (err) {
        console.error("Invoice fetch error:", err);
      }
    }, 500);

    return () => clearInterval(interval);
  }, []);

  if (!order) return <h2>No Invoice Found</h2>;
  // ✅ DERIVE ORDER DATE (NO DATA CHANGE)
  const orderDate = new Date().toLocaleDateString();



  /* -------------------------------
     PARSE ITEMS
  -------------------------------- */
  const parsedItems = (order.items || "")
    .split(",")
    .map((it) => it.trim())
    .filter(Boolean)
    .map((entry) => {
      const match = entry.match(/^(\d+)\s*[×x]\s*(.+)$/);
      return match
        ? { quantity: Number(match[1]), name: match[2] }
        : { quantity: 1, name: entry };
    });

  let total = 0;
  if (order.source) {
    const match = order.source.match(/(\d+(\.\d+)?)/);
    if (match) total = Number(match[0]);
  }

  const totalQty = parsedItems.reduce((s, it) => s + it.quantity, 0);
  const itemsWithPrice = parsedItems.map((it) => ({
    ...it,
    price: totalQty ? +(total / totalQty).toFixed(2) : 0,
  }));

  const subtotal = total;
  const tax = subtotal * 0.05;
  const finalTotal = subtotal + tax;

  return (
    <div className="invoice-container">
      <div className="invoice-card">
        <div className="invoice-header">
          <h1>Omoi Servespare</h1>
        </div>

        <div className="info-grid">
          <div>
            <p className="label">Invoice Number</p>
            <p className="value">{order.invoiceNumber}</p>

            <p className="label">Order ID</p>
            <p className="value">{order.id}</p>

            <p className="label">Order Date</p>
            <p className="value">{orderDate}</p>
          </div>

          <div>
            <p className="label">Payment Mode</p>
            <p className="value">Online</p>

            <p className="label">Canteen Name</p>
            <p className="value">{order.canteen}</p>
          </div>

          <div className="amount-highlight">
            <p className="label">Total Transaction Amount</p>
            <p className="big-amount">₹{finalTotal.toFixed(2)}</p>
          </div>
        </div>

        <table className="invoice-table">
          <thead>
            <tr>
              <th>Item</th>
              <th>Price</th>
              <th>Qty</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {itemsWithPrice.map((item, index) => (
              <tr key={index}>
                <td>{item.name}</td>
                <td>₹{item.price}</td>
                <td>{item.quantity}</td>
                <td>
                  ₹{(item.price * item.quantity).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="summary">
          <div>
            <span>Subtotal</span>
            <span>₹{subtotal.toFixed(2)}</span>
          </div>
          <div>
            <span>CGST</span>
            <span>₹{(tax / 2).toFixed(2)}</span>
          </div>
          <div>
            <span>SGST</span>
            <span>₹{(tax / 2).toFixed(2)}</span>
          </div>
          <div className="final">
            <span>Balance Amount Paid</span>
            <span>₹{finalTotal.toFixed(2)}</span>
          </div>
        </div>

        <div className="qr-wrapper">
          {qrValue && <QRCodeCanvas value={qrValue} size={140} />}
          <p>Scan to Track Order</p>
        </div>
      </div>
    </div>
  );
};

export default InvoicePage;