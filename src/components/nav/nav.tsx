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
  ActivitySquare,
  NotebookText,
  NotebookPen,
  Contact,
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
import { useNav } from "@/lib/nav";
import NavMessages from "@/app/(main)/users/messages/messages-nav";

export interface NavElementType {
  label: string;
  href: string;
  icon: LucideIcon | IconType;
  notification?: string;

  type: "element";
}

export interface NavFCElementType {
  label: string;
  href: string;
  element: FC<{
    href: string;
    preventDefault(e: React.MouseEvent): void;
  }>;

  type: "FC";
}

export interface NavSectionType {
  label?: string;
  elements: (NavElementType | NavFCElementType)[];
}

const NavBar: FC<{ children: ReactNode }> = ({ children }) => {
  const [open, setOpen] = useState(false);

  const { data: nav } = useNav();
  const navSections: NavSectionType[] = [
    {
      elements: [
        {
          label: "Analytics",
          type: "element",
          href: "/analytics",
          icon: BarChart3,
        },
      ],
    },
    {
      label: "User",
      elements: [
        {
          label: "Accounts",
          type: "element",
          href: "/users/accounts",
          icon: Users,
        },
        {
          label: "Leads",
          type: "element",
          href: "/users/leads",
          icon: UserSearch,
          notification: nav?.leads,
        },
        {
          label: "Stats",
          type: "element",
          href: "/users/stats",
          icon: BarChart3,
        },
        {
          label: "Tickets",
          type: "element",
          href: "/users/tickets",
          icon: Ticket,
          notification: nav?.tickets,
        },
        // {
        //   label: "Contacts",
        //   type: "element",
        //   href: "/users/contacts",
        //   icon: Contact,
        // },
        {
          href: "/users/messages",
          label: "Messages",
          element: NavMessages,
          type: "FC",
        },
      ],
    },
    {
      label: "Employee",
      elements: [
        {
          label: "Details",
          type: "element",
          href: "/employees/details",
          icon: Users,
        },
        {
          label: "Leads",
          type: "element",
          href: "/employees/leads",
          icon: UserSearch,
          notification: nav?.leads,
        },
        {
          label: "Actions",
          type: "element",
          href: "/employees/actions",
          icon: ActivitySquare,
        },
        {
          label: "Tickets",
          type: "element",
          href: "/employees/tickets",
          icon: Ticket,
          notification: nav?.tickets,
        },
        {
          label: "Logs",
          type: "element",
          href: "/employees/logs",
          icon: FileClock,
        },
        {
          label: "Create",
          type: "element",
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
          type: "element",
          href: "/products/details",
          icon: PackageSearch,
        },
        {
          label: "Categories",
          type: "element",
          href: "/products/categories",
          icon: Blocks,
        },
        {
          label: "Attibutes",
          type: "element",
          href: "/products/attributes",
          icon: FileText,
        },
        {
          label: "Create",
          type: "element",
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
          type: "element",
          href: "/orders/details",
          icon: FileSearch,
          notification: nav?.orders,
        },
      ],
    },
    {
      label: "Banners",
      elements: [
        {
          label: "Main Banner",
          type: "element",
          href: "/banners/main",
          icon: ImageLucide,
        },
        {
          label: "Sub Banner",
          type: "element",
          href: "/banners/sub",
          icon: ImageLucide,
        },
      ],
    },
    {
      label: "Blog",
      elements: [
        {
          label: "Posts",
          type: "element",
          href: "/blog/posts",
          icon: NotebookText,
        },
        {
          label: "Write",
          type: "element",
          href: "/blog/write",
          icon: NotebookPen,
        },
      ],
    },
    {
      label: "Config",
      elements: [
        {
          label: "Google Tag Manager",
          type: "element",
          href: "/config/gtm",
          icon: IoLogoGoogle,
        },
        {
          label: "Payment",
          type: "element",
          href: "/config/payment",
          icon: MdOutlinePayments,
        },
      ],
    },
  ];

  return (
    <div className="flex h-full min-h-screen flex-col bg-white">
      <header className="fixed left-0 top-0 z-[995] flex h-14 w-full items-center justify-start gap-3 border-b-1 border-slate-300 bg-white px-4 shadow-sm">
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
      <div className="flex h-full min-h-screen pt-14 lg:pl-[15rem]">
        <nav
          className={cn(
            "fixed left-0 top-0 z-50 flex max-h-screen min-h-screen w-full max-w-[15rem] flex-shrink-0 flex-col overflow-y-auto border-r-1 border-slate-300 bg-white pb-24 pt-14 transition-all duration-200 ease-in-out scrollbar-none",
            open ? "" : "max-lg:-translate-x-full",
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
            open ? "max-lg:block" : "hidden",
          )}
        ></div>
        {children}
      </div>
    </div>
  );
};

export default NavBar;
