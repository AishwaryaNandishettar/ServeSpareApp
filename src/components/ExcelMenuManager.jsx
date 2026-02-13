// ExcelMenuManager.jsx
import React, { useEffect, useRef, useState } from "react";
import * as XLSX from "xlsx";
import { useMenuSocket } from "./useMenuSocket";
import "../styles/ExcelMenuManager.css"; // ✅ IMPORTANT: now CSS will actually apply

export default function ExcelMenuManager({
  apiBase = "/api/vendor/menu",
  bulkJsonUrl = "/api/vendor/menu/bulk-json",
  token,
  wsUrl
}) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState([]);
  const fileInputRef = useRef();

  const { send: socketSend } = useMenuSocket({
    wsUrl,
    token,
    onMessage: (msg) => {
      if (msg?.type === "menu:update" && msg.payload) {
        if (Array.isArray(msg.payload)) setItems(msg.payload);
        else {
          setItems((prev) => {
            const idx = prev.findIndex((p) => p.id === msg.payload.id);
            if (idx >= 0) {
              const copy = [...prev];
              copy[idx] = msg.payload;
              return copy;
            } else {
              return [msg.payload, ...prev];
            }
          });
        }
      }
    }
  });

  useEffect(() => {
    fetchMenu();
  }, []);

  async function fetchMenu() {
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
  }

  async function saveItem(item, isNew = false) {
    if (!item.name || item.price == null) {
      setErrors(["Name and Price are required"]);
      return;
    }
    setErrors([]);
    if (isNew) setItems((prev) => [item, ...prev]);
    else setItems((prev) => prev.map((p) => (p.id === item.id ? item : p)));

    try {
      if (item.imageFile) {
        const fd = new FormData();
        fd.append("name", item.name);
        fd.append("price", item.price);
        fd.append("category", item.category || "");
        fd.append("available", item.available ? "true" : "false");
        fd.append("description", item.description || "");
        fd.append("prepTimeMin", item.prepTimeMin || 0);
        fd.append(
          "tags",
          Array.isArray(item.tags) ? item.tags.join(",") : (item.tags || "")
        );
        fd.append("image", item.imageFile);

        const url = isNew ? apiBase : `${apiBase}/${item.id}`;
        const method = isNew ? "POST" : "PUT";

        const res = await fetch(url, {
          method,
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          body: fd
        });
        if (!res.ok) throw new Error("Save failed");
        const saved = await res.json();

        setItems((prev) => {
          if (isNew) return prev.map((p) => (p === item ? saved : p));
          return prev.map((p) => (p.id === saved.id ? saved : p));
        });

        socketSend && socketSend({ type: "menu:update", payload: saved });
      } else {
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
        setItems((prev) => prev.map((p) => (p.id === (item.id || saved.id) ? saved : p)));
        socketSend && socketSend({ type: "menu:update", payload: saved });
      }
    } catch (err) {
      console.error(err);
      setErrors([err.message || "Save failed"]);
      fetchMenu();
    }
  }

  async function deleteItem(id) {
    const confirm = window.confirm("Delete this item?");
    if (!confirm) return;
    const backup = items;
    setItems((prev) => prev.filter((i) => i.id !== id));
    try {
      const res = await fetch(`${apiBase}/${id}`, {
        method: "DELETE",
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      if (!res.ok) throw new Error("Delete failed");
      socketSend && socketSend({ type: "menu:update", payload: { id, deleted: true } });
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
      const arr = new Uint8Array(ev.target.result);
      const wb = XLSX.read(arr, { type: "array" });
      const sheet = wb.Sheets[wb.SheetNames[0]];
      const json = XLSX.utils.sheet_to_json(sheet, { defval: "" });

      const parsed = json.map((r) => ({
        id: r.id || null,
        name: (r.name || r.Name || "").toString(),
        category: (r.category || r.Category || ""),
        price: Number(r.price || r.Price || 0),
        available: String(r.available || r.Available || "true").toLowerCase() !== "false",
        description: r.description || r.Description || "",
        prepTimeMin: Number(r.prepTimeMin || r.PrepTimeMin || 0),
        tags: (r.tags || r.Tags || "").toString().split(/[;,|]/).map((t) => t.trim()).filter(Boolean)
      }));

      setItems(parsed);
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
      const saved = await res.json();
      setItems(Array.isArray(saved) ? saved : items);
      socketSend && socketSend({ type: "menu:update", payload: Array.isArray(saved) ? saved : items });
      alert("Bulk upload completed");
    } catch (err) {
      console.error(err);
      setErrors([err.message || "Bulk upload failed"]);
    } finally {
      setLoading(false);
    }
  }

  const updateField = (idx, key, value) => {
    setItems((prev) => {
      const copy = [...prev];
      copy[idx] = { ...copy[idx], [key]: value };
      return copy;
    });
  };

  return (
    <div className="vmm-root">
      <h2>Vendor Menu Manager</h2>

      <div className="vmm-actions">
        <button onClick={() => {
          const header = [["name","category","price","available","description","prepTimeMin","tags"]];
          const sample = [["Idli","Breakfast",30,true,"Soft idli",5,"veg"]];
          const wb = XLSX.utils.book_new();
          const ws = XLSX.utils.aoa_to_sheet([...header, ...sample]);
          XLSX.utils.book_append_sheet(wb, ws, "template");
          XLSX.writeFile(wb, "menu-template.xlsx");
        }}>Download Template</button>

        <label className="vmm-upload">
          <input ref={fileInputRef} type="file" accept=".xlsx,.xls" onChange={handleExcelFile} />
          Upload Excel
        </label>

        <button onClick={handleBulkUpload} disabled={loading}>Upload Previewed Menu</button>

        <button onClick={fetchMenu}>Refresh</button>
      </div>

      {errors.length > 0 && (
        <div className="vmm-error">
          {errors.map((e,i) => <div key={i}>{e}</div>)}
        </div>
      )}

      <div className="vmm-tablewrap">
        <table className="vmm-table">
          <thead>
            <tr>
              <th>#</th><th>Name</th><th>Category</th><th>Price</th><th>Available</th><th>PrepMin</th><th>Tags</th><th>Image</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((it, idx) => (
              <tr key={it.id || idx}>
                <td>{idx+1}</td>
                <td><input value={it.name||""} onChange={e => updateField(idx, "name", e.target.value)} /></td>
                <td><input value={it.category||""} onChange={e => updateField(idx, "category", e.target.value)} /></td>
                <td><input type="number" value={it.price||0} onChange={e => updateField(idx, "price", Number(e.target.value))} /></td>
                <td><input type="checkbox" checked={!!it.available} onChange={e => updateField(idx, "available", e.target.checked)} /></td>
                <td><input type="number" value={it.prepTimeMin||0} onChange={e => updateField(idx, "prepTimeMin", Number(e.target.value))} /></td>
                <td><input value={(it.tags||[]).join(", ")} onChange={e => updateField(idx, "tags", e.target.value.split(",").map(s=>s.trim()))} /></td>
                <td>
                  <input type="file" accept="image/*" onChange={e => updateField(idx, "imageFile", e.target.files?.[0])} />
                  {it.imageUrl && <div style={{ marginTop: 6 }}><img src={it.imageUrl} alt="" style={{ width: 60, height: 40, objectFit: "cover" }} /></div>}
                </td>
                <td style={{ whiteSpace: "nowrap" }}>
                  <button onClick={() => saveItem(it, !it.id)}>Save</button>
                  {it.id && <button onClick={() => deleteItem(it.id)} style={{ marginLeft: 6 }}>Delete</button>}
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr>
                <td colSpan={9} style={{ textAlign: "center", padding: 12 }}>
                  No items. Upload Excel or add rows.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="vmm-bottom">
        <button onClick={() => setItems(prev => [{ name: "", category: "", price: 0, available: true, description: "", prepTimeMin: 0, tags: [] }, ...prev])}>
          Add Empty Row
        </button>
      </div>
    </div>
  );
}
