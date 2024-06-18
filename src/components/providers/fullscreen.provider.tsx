"use client";

import { ElementRef, FC, ReactNode, useEffect, useRef } from "react";
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"] });

const FullScreenProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const bodyRef = useRef<ElementRef<"body">>(null);

  useEffect(() => {
    function fullscreenHandler(event: KeyboardEvent) {
      if (event.key === "f") {
        bodyRef.current?.requestFullscreen();
      }
      if (event.key === "Escape") {
        document.exitFullscreen();
      }
    }
    document.addEventListener("keydown", fullscreenHandler);

    return () => {
      document.removeEventListener("keydown", fullscreenHandler);
    };
  }, []);

  return (
    <body ref={bodyRef} className={cn(inter.className, "h-full min-h-screen")}>
      {children}
    </body>
  );
};

export default FullScreenProvider;
