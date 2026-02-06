import { useEffect, useState } from "react";

export default function useDeviceSignal() {
  const [device, setDevice] = useState("mobile");

  const updateDevice = () => {
    let width = window.innerWidth;

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
