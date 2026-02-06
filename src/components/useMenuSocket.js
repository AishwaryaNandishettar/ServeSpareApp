// useMenuSocket.js
import { useEffect, useRef } from "react";

/**
 * Simple WebSocket hook.
 * - wsUrl: 'wss://yourdomain/ws' (or ws://localhost:8080/ws)
 * - onMessage: function(msg) called on incoming messages (parsed JSON)
 * - token: bearer token to authenticate (optional, appended as query param)
 */
export function useMenuSocket({ wsUrl, token, onMessage }) {
  const wsRef = useRef(null);

  useEffect(() => {
    if (!wsUrl) return;
    const url = token ? `${wsUrl}?token=${encodeURIComponent(token)}` : wsUrl;
    const ws = new WebSocket(url);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log("Menu socket connected");
    };
    ws.onmessage = (evt) => {
      try {
        const data = JSON.parse(evt.data);
        onMessage && onMessage(data);
      } catch (e) {
        console.warn("Invalid socket message", e);
      }
    };
    ws.onerror = (e) => {
      console.error("Socket error", e);
    };
    ws.onclose = () => {
      console.log("Socket closed");
      // Optionally implement reconnect logic here.
    };

    return () => {
      ws.close();
    };
  }, [wsUrl, token, onMessage]);

  // helper to send
  const send = (obj) => {
    const ws = wsRef.current;
    if (!ws || ws.readyState !== WebSocket.OPEN) return false;
    ws.send(JSON.stringify(obj));
    return true;
  };

  return { send };
}
