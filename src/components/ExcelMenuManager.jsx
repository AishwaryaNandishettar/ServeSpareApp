// ExcelMenuManager.jsx
import React, {
  useEffect,
  useRef,
  useState,
  useCallback
} from "react";

import * as XLSX from "xlsx";
import { useMenuSocket } from "./useMenuSocket";

export default function ExcelMenuManager({
  apiBase = "/api/vendor/menu",
  bulkJsonUrl = "/api/vendor/menu/bulk-json",
  token,
  wsUrl
}) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState([]);
  const fileInputRef = useRef(null);

  const { send: socketSend } = useMenuSocket({
    wsUrl,
    token,
    onMessage: (msg) => {
      if (msg?.type === "menu:update" && msg.payload) {
        if (Array.isArray(msg.payload)) setItems(msg.payload);
        else {
          setItems(prev => {
            const idx = prev.findIndex(p => p.id === msg.payload.id);
            if (idx >= 0) {
              const copy = [...prev];
              copy[idx] = msg.payload;
              return copy;
            }
            return [msg.payload, ...prev];
          });
        }
      }
    }
  });

  const fetchMenu = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(apiBase, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      if (!res.ok) throw new Error("Failed to load menu");
      const json = await res.json();
      setItems(Array.isArray(json) ? json : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [apiBase, token]);

  useEffect(() => {
    fetchMenu();
  }, [fetchMenu]);

  async function saveItem(item, isNew = false) {
    if (!item.name || item.price == null) {
      setErrors(["Name and Price are required"]);
      return;
    }
    setErrors([]);

    if (isNew) setItems(prev => [item, ...prev]);
    else setItems(prev => prev.map(p => (p.id === item.id ? item : p)));

    try {
      const url = isNew ? apiBase : `${apiBase}/${item.id}`;
      const method = isNew ? "POST" : "PUT";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify(item)
      });

      if (!res.ok) throw new Error("Save failed");
      const saved = await res.json();

      setItems(prev =>
        prev.map(p => (p.id === (item.id || saved.id) ? saved : p))
      );

      socketSend?.({ type: "menu:update", payload: saved });
    } catch (err) {
      console.error(err);
      setErrors([err.message || "Save failed"]);
      fetchMenu();
    }
  }

  async function deleteItem(id) {
    if (!window.confirm("Delete this item?")) return;

    const backup = items;
    setItems(prev => prev.filter(i => i.id !== id));

    try {
      const res = await fetch(`${apiBase}/${id}`, {
        method: "DELETE",
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      if (!res.ok) throw new Error("Delete failed");
    } catch (err) {
      console.error(err);
      setItems(backup);
      setErrors([err.message || "Delete failed"]);
    }
  }

  function handleExcelFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      const wb = XLSX.read(new Uint8Array(ev.target.result), { type: "array" });
      const sheet = wb.Sheets[wb.SheetNames[0]];
      const json = XLSX.utils.sheet_to_json(sheet, { defval: "" });

      setItems(
        json.map(r => ({
          id: r.id || null,
          name: r.name || "",
          category: r.category || "",
          price: Number(r.price || 0),
          available: r.available !== false,
          tags: (r.tags || "").split(",").map(t => t.trim())
        }))
      );
    };

    reader.readAsArrayBuffer(file);
  }

  async function handleBulkUpload() {
    if (!items.length) return alert("No items to upload");

    try {
      setLoading(true);
      const res = await fetch(bulkJsonUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify(items)
      });

      if (!res.ok) throw new Error("Bulk upload failed");
      alert("Bulk upload completed");
      fetchMenu();
    } catch (err) {
      console.error(err);
      setErrors([err.message || "Bulk upload failed"]);
    } finally {
      setLoading(false);
    }
  }

  const updateField = (idx, key, value) => {
    setItems(prev => {
      const copy = [...prev];
      copy[idx] = { ...copy[idx], [key]: value };
      return copy;
    });
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Vendor Menu Manager</h2>

      <input
        ref={fileInputRef}
        type="file"
        accept=".xlsx,.xls"
        onChange={handleExcelFile}
      />

      <button onClick={handleBulkUpload} disabled={loading}>
        Upload Menu
      </button>

      {errors.map((e, i) => (
        <div key={i} style={{ color: "red" }}>{e}</div>
      ))}

      <table border="1" cellPadding="6">
        <thead>
          <tr>
            <th>Name</th>
            <th>Category</th>
            <th>Price</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((it, idx) => (
            <tr key={idx}>
              <td>
                <input
                  value={it.name}
                  onChange={e => updateField(idx, "name", e.target.value)}
                />
              </td>
              <td>
                <input
                  value={it.category}
                  onChange={e => updateField(idx, "category", e.target.value)}
                />
              </td>
              <td>
                <input
                  type="number"
                  value={it.price}
                  onChange={e => updateField(idx, "price", Number(e.target.value))}
                />
              </td>
              <td>
                <button onClick={() => saveItem(it, !it.id)}>Save</button>
                {it.id && (
                  <button onClick={() => deleteItem(it.id)}>Delete</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
