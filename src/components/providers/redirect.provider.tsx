"use client";

import { useMe } from "@/lib/auth";
import { isServer } from "@tanstack/react-query";
import { redirect, usePathname } from "next/navigation";
import { FC, ReactNode, useEffect, useRef } from "react";

const RedirectProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const pathname = usePathname();
  const { data: me, isLoading } = useMe();

  const isFirstVisit = useRef(true);

  useEffect(() => {
    if (
      pathname === "/" &&
      isFirstVisit.current &&
      !isServer &&
      me &&
      !isLoading &&
      me.role === "superadmin"
    ) {
      isFirstVisit.current = false;
      redirect("/analytics");
    }
  }, [me]);

  return children;
};

export default RedirectProvider;
