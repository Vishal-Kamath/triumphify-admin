"use client";

import { Dispatch, FC, SetStateAction, useEffect } from "react";
import { NavElementType } from "./nav";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { usePrivilage } from "@/lib/privilage";

const NavElement: FC<{
  navElement: NavElementType;
  setOpen: (open: boolean) => void;
  setIsHiddenList: Dispatch<SetStateAction<string[]>>;
}> = ({ navElement, setOpen, setIsHiddenList }) => {
  const pathname = usePathname();
  const { data: privilage, isLoading } = usePrivilage(navElement.href);

  const access = !!(privilage && privilage.data === "granted");

  useEffect(() => {
    if (!access) {
      setIsHiddenList((prev) =>
        Array.from(new Set([...prev, navElement.href]))
      );
    } else {
      setIsHiddenList((prev) =>
        prev.filter((item) => item !== navElement.href)
      );
    }
  }, [access]);
  if (isLoading) return null;

  return access ? (
    <Link
      href={navElement.href}
      onClick={() => setOpen(false)}
      className={cn(
        "flex h-10 items-center gap-3 rounded-md px-2",
        pathname.startsWith(navElement.href)
          ? "bg-blue-50 text-blue-700"
          : "hover:bg-slate-100"
      )}
    >
      <navElement.icon
        className={cn(
          "h-5 w-5",
          pathname.startsWith(navElement.href)
            ? "text-blue-700"
            : "text-slate-500"
        )}
      />
      <span>{navElement.label}</span>

      {navElement.notification ? (
        <span className="px-2 ml-auto leading-4 font-semibold text-xs text-white rounded-full bg-gradient-to-br from-blue-600 to-blue-700">
          {navElement.notification}
        </span>
      ) : null}
    </Link>
  ) : null;
};

export default NavElement;
