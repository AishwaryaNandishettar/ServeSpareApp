import React, { useEffect, useState } from "react";

/* ⭐ DEVICE SIMULATOR SIZES */
const deviceSizes = {
  default: { width: "100%", height: "100%" },
  iphone14: { width: "390px", height: "844px" },
  iphoneSE: { width: "375px", height: "667px" },
  samsungS21: { width: "412px", height: "915px" },
  ipad: { width: "820px", height: "1180px" },
  laptop: { width: "1366px", height: "768px" },
  desktop: { width: "1920px", height: "1080px" }
};

/* ⭐ CUSTOM HOOK — DEVICE SIGNAL */
export function useDeviceSignal() {
  const [device, setDevice] = useState("mobile");

  const updateDevice = () => {
    const width = window.innerWidth;

    if (width < 600) setDevice("mobile");
    else if (width < 900) setDevice("tablet");
    else setDevice("desktop");
  };

  useEffect(() => {
    updateDevice();
    window.addEventListener("resize", updateDevice);
    return () => window.removeEventListener("resize", updateDevice);
  }, []);

  return device;
}

/* ⭐ RESPONSIVE DESIGN TOOL WRAPPER */
const ResponsiveDesignTool = ({ children }) => {
  const [preview, setPreview] = useState("default");

  return (
    <>
      {/* ⭐ DEVICE SELECTOR UI */}
      <div
        style={{
          position: "fixed",
          top: "10px",
          left: "10px",
          zIndex: "9999",
          background: "white",
          padding: "6px 10px",
          borderRadius: "8px",
          border: "1px solid #ddd",
          boxShadow: "0 2px 6px rgba(0,0,0,0.1)"
        }}
      >
        <select value={preview} onChange={(e) => setPreview(e.target.value)}>
          <option value="default">Default Auto Responsive</option>
          <option value="iphone14">iPhone 14</option>
          <option value="iphoneSE">iPhone SE</option>
          <option value="samsungS21">Samsung S21</option>
          <option value="ipad">iPad</option>
          <option value="laptop">Laptop</option>
          <option value="desktop">Desktop</option>
        </select>
      </div>

      {/* ⭐ DEVICE SIMULATION AREA */}
      <div
        style={{
          width: deviceSizes[preview].width,
          height: deviceSizes[preview].height,
          margin: "auto",
          marginTop: "60px",
          border: preview === "default" ? "none" : "1px solid #ccc",
          background: "inherit",
          overflow: "auto",
          transition: "0.3s"
        }}
      >
        {children}
      </div>
    </>
  );
};

export default ResponsiveDesignTool;
