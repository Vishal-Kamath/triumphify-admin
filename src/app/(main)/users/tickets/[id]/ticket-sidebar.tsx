"use client";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { FC, useState } from "react";
import TicketDetails from "./ticket-details";
import { ChevronDown } from "lucide-react";
import { useSearchParams } from "next/navigation";

const TicketSidebar: FC = () => {
  const [open, setOpen] = useState(false);
  const redirect = useSearchParams().get("redirect");

  return (
    <div className="fixed top-16 z-10 max-md:left-0 md:sticky max-md:pb-3 max-md:pt-2 px-6 bg-white max-md:border-b-1 max-md:border-slate-300 max-md:shadow-sm md:max-w-sm w-full md:top-0 flex flex-col gap-5">
      <div className="flex gap-6 w-full items-center">
        <Link
          href={redirect ? redirect : "/users/tickets"}
          className={cn(
            buttonVariants({ variant: "link" }),
            "w-fit p-0 text-slate-500 leading-none hover:text-slate-900"
          )}
        >
          Back
        </Link>
        <button
          onClick={() => setOpen((open) => !open)}
          className="size-9 ml-auto rounded-md flex justify-center items-center hover:bg-slate-50 hover:text-slate-700 text-slate-500 md:hidden"
        >
          <ChevronDown
            className={cn(
              "size-4 transition-all duration-200 ease-in-out",
              open ? "-rotate-180" : ""
            )}
          />
        </button>
      </div>

      <div className={cn("flex flex-col gap-5", !open ? "max-md:hidden" : "")}>
        <TicketDetails />
      </div>
    </div>
  );
};

export default TicketSidebar;
