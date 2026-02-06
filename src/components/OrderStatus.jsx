import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const OrderStatus = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const allOrders = JSON.parse(localStorage.getItem("orders")) || [];
    const found = allOrders.find(o => o.id === id);
    setOrder(found);
  }, [id]);

  if (!order) return <p>Order Not Found</p>;

  return (
    <div className="order-status">
      <h2>Order Status</h2>
      <p>Invoice: {order.invoiceNo}</p>
      <p>Total: ₹{order.total}</p>
      <p>Status: {order.status}</p>
      <p>Items: {order.items.length}</p>
    </div>
  );
};

export default OrderStatus;
