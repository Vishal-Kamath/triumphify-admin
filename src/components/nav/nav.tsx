"use client";

import { FC, ReactNode, useState } from "react";
import {
  LucideIcon,
  Users,
  BookUser,
  UserPlus,
  PackageSearch,
  PackagePlus,
  Blocks,
  FileText,
  FileClock,
  Image as ImageLucide,
  Menu,
  X,
  FileSearch,
  Star,
  BarChart3,
  UserSearch,
  Ticket,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import SignOutButton from "./signout";
import UserAccount from "./account";
import Image from "next/image";
import NavSection from "./nav-section";
import { IoLogoGoogle } from "react-icons/io";
import { MdOutlinePayments } from "react-icons/md";
import { IconType } from "react-icons/lib";

export interface NavElementType {
  label: string;
  href: string;
  icon: LucideIcon | IconType;
}

export interface NavSectionType {
  label?: string;
  elements: NavElementType[];
}

const navSections: NavSectionType[] = [
  {
    label: "User",
    elements: [
      {
        label: "Accounts",
        href: "/users/accounts",
        icon: Users,
      },
      {
        label: "Leads",
        href: "/users/leads",
        icon: UserSearch,
      },
      {
        label: "Stats",
        href: "/users/stats",
        icon: BarChart3,
      },
      {
        label: "Tickets",
        href: "/users/tickets",
        icon: Ticket,
      },
    ],
  },
  {
    label: "Employee",
    elements: [
      {
        label: "Details",
        href: "/employees/details",
        icon: Users,
      },
      {
        label: "Leads",
        href: "/employees/leads",
        icon: UserSearch,
      },
      {
        label: "Tickets",
        href: "/employees/tickets",
        icon: Ticket,
      },
      {
        label: "Logs",
        href: "/employees/logs",
        icon: FileClock,
      },
      {
        label: "Create",
        href: "/employees/create",
        icon: UserPlus,
      },
    ],
  },
  {
    label: "Product",
    elements: [
      {
        label: "Details",
        href: "/products/details",
        icon: PackageSearch,
      },
      {
        label: "Categories",
        href: "/products/categories",
        icon: Blocks,
      },
      {
        label: "Attibutes",
        href: "/products/attributes",
        icon: FileText,
      },
      {
        label: "Create",
        href: "/products/create",
        icon: PackagePlus,
      },
    ],
  },
  {
    label: "Order",
    elements: [
      {
        label: "Details",
        href: "/orders/details",
        icon: FileSearch,
      },
      {
        label: "Analytics",
        href: "/orders/analytics",
        icon: BarChart3,
      },
    ],
  },
  {
    label: "Banners",
    elements: [
      {
        label: "Main Banner",
        href: "/banners/main",
        icon: ImageLucide,
      },
      {
        label: "Sub Banner",
        href: "/banners/sub",
        icon: ImageLucide,
      },
    ],
  },
  {
    label: "Config",
    elements: [
      {
        label: "Google Tag Manager",
        href: "/config/gtm",
        icon: IoLogoGoogle,
      },
      {
        label: "Payment",
        href: "/config/payment",
        icon: MdOutlinePayments,
      },
    ],
  },
];

const NavBar: FC<{ children: ReactNode }> = ({ children }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex h-full min-h-screen flex-col bg-white">
      <header className="fixed left-0 top-0 z-[999] flex h-14 w-full items-center justify-start gap-3 border-b-1 border-slate-300 bg-white px-4 shadow-sm">
        <button
          onClick={() => setOpen((open) => !open)}
          className="rounded-xl p-2 text-slate-500 hover:bg-slate-50 hover:text-slate-800 lg:hidden"
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
        <Link href="/">
          <Image
            src="/logo.svg"
            alt="triumphify"
            width={500}
            height={200}
            className="aspect-auto h-8 w-full object-contain"
          />
        </Link>
      </header>
      <div className="isolate flex h-full min-h-screen pt-14 lg:pl-[15rem]">
        <nav
          className={cn(
            "fixed left-0 top-0 z-50 flex max-h-screen min-h-screen w-full max-w-[15rem] flex-shrink-0 flex-col overflow-y-auto border-r-1 border-slate-300 bg-white pb-24 pt-14 transition-all duration-200 ease-in-out scrollbar-none",
            open ? "" : "max-lg:-translate-x-full"
          )}
        >
          <UserAccount />
          {navSections.map((navGroup, index) => (
            <NavSection key={index} navSection={navGroup} setOpen={setOpen} />
          ))}
          <div className="p-2">
            <SignOutButton />
          </div>
        </nav>
        <div
          onClick={() => setOpen(false)}
          className={cn(
            "fixed left-0 top-0 z-40 h-full min-h-screen w-full bg-slate-950/20 backdrop-blur-sm lg:hidden",
            open ? "max-lg:block" : "hidden"
          )}
        ></div>
        {children}
      </div>
    </div>
  );
};

export default NavBar;
