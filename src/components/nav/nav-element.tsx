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

  function preventDefault(e: React.MouseEvent) {
    setOpen(false);

    if (!pathname.startsWith("/blog/") || pathname.startsWith("/blog/posts"))
      return;

    const confirmChange = window.confirm(
      "Are you sure you want to leave? Changes you made may not be saved.",
    );
    if (!confirmChange) {
      e.preventDefault();
      return;
    }
  }

  useEffect(() => {
    if (!access) {
      setIsHiddenList((prev) =>
        Array.from(new Set([...prev, navElement.href])),
      );
    } else {
      setIsHiddenList((prev) =>
        prev.filter((item) => item !== navElement.href),
      );
    }
  }, [access]);
  if (isLoading) return null;

  return access ? (
    <Link
      href={navElement.href}
      onClick={preventDefault}
      className={cn(
        "flex h-10 items-center gap-3 rounded-md px-2",
        pathname.startsWith(navElement.href)
          ? "bg-blue-50 text-blue-700"
          : "hover:bg-slate-100",
      )}
    >
      <navElement.icon
        className={cn(
          "h-5 w-5",
          pathname.startsWith(navElement.href)
            ? "text-blue-700"
            : "text-slate-500",
        )}
      />
      <span>{navElement.label}</span>

      {navElement.notification ? (
        <span className="ml-auto rounded-full bg-gradient-to-br from-blue-600 to-blue-700 px-2 text-xs font-semibold leading-4 text-white">
          {navElement.notification}
        </span>
      ) : null}
    </Link>
  ) : null;
};

export default NavElement;
