import { useEffect, useState } from "react";

export default function useResponsive() {
  const [device, setDevice] = useState<"sm" | "md" | "lg" | "xl" | null>(null);
  const [dimensions, setDimensions] = useState<{
    width: number;
    height: number;
  } | null>(null);

  useEffect(() => {
    const checkDevice = () => {
      if (window.matchMedia("(max-width: 640px)").matches) {
        setDevice("sm");
      } else if (
        window.matchMedia("(min-width: 641px) and (max-width: 768px)").matches
      ) {
        setDevice("md");
      } else if (
        window.matchMedia("(min-width: 769px) and (max-width: 1024px)").matches
      ) {
        setDevice("lg");
      } else {
        setDevice("xl");
      }
      setDimensions({ width: window.innerWidth, height: window.innerHeight });
    };

    // Initial detection
    checkDevice();

    // Listener for windows resize
    window.addEventListener("resize", checkDevice);

    // Cleanup listener
    return () => {
      window.removeEventListener("resize", checkDevice);
    };
  }, []);

  return {
    device,
    width: dimensions?.width,
    height: dimensions?.height,

    // responsive breakpoints
    sm: device === "sm",
    md: device === "md",
    lg: device === "lg",
    xl: device === "xl",

    // responsive max breakpoints
    maxSm: device === "sm",
    maxMd: device === "sm" || device === "md",
    maxLg: device === "sm" || device === "md" || device === "lg",
    maxXl:
      device === "sm" || device === "md" || device === "lg" || device === "xl",
  };
}
