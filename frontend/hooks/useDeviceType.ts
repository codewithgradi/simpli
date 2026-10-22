import { useState, useEffect } from "react";

export function useDeviceType() {
  const [deviceType, setDeviceType] = useState<
    "mobile" | "tablet" | "laptop" | "desktop"
  >("desktop");
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const checkDevice = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setDeviceType("mobile");
      } else if (width >= 640 && width < 1024) {
        setDeviceType("tablet");
      } else if (width >= 1024 && width < 1280) {
        setDeviceType("laptop");
      } else {
        setDeviceType("desktop");
      }
    };

    checkDevice();
    window.addEventListener("resize", checkDevice);
    return () => window.removeEventListener("resize", checkDevice);
  }, []);

  return { deviceType, isClient };
}
