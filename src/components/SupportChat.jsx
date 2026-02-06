// SupportChat.jsx
import React, { useEffect, useState } from "react";

const SupportChat = ({ orderId }) => {
  const [chat, setChat] = useState(null);

  useEffect(() => {
    const load = () => {
      const chats = JSON.parse(localStorage.getItem("cancelChats")) || {};
      setChat(chats[orderId]);
    };
    load();
    const t = setInterval(load, 1000);
    return () => clearInterval(t);
  }, [orderId]);

  if (!chat) return null;

  return (
    <div className="support-chat">
      <h4>Support Chat</h4>

      {chat.messages.map((m, i) => (
        <div key={i} className={`chat-msg ${m.from}`}>
          {m.text}
        </div>
      ))}

      {chat.status !== "Pending" && (
        <p className="chat-status">Vendor: {chat.status}</p>
      )}
    </div>
  );
};

export default SupportChat;
