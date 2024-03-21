"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { useTicket } from "@/lib/ticket";
import { dateFormater } from "@/utils/dateFormater";
import Link from "next/link";
import { notFound, useParams, usePathname } from "next/navigation";
import { FC } from "react";

const TicketDetails: FC = () => {
  const id = useParams()["id"] as string;
  const { data: ticket, isLoading } = useTicket(id);
  const pathname = usePathname();

  if (isLoading)
    return (
      <>
        <div className="flex flex-col gap-1">
          <Skeleton className="w-1/2 h-9" />
          <Skeleton className="w-1/3 mt-3 h-5" />
          <Skeleton className="w-[15rem] h-4" />
        </div>

        <div className="flex flex-col gap-2">
          <Skeleton className="w-full h-6" />
          <Skeleton className="w-full h-6" />
          <Skeleton className="w-full h-6" />
          <Skeleton className="w-full h-6" />
        </div>
      </>
    );
  if (!id) return notFound();
  if (!ticket) return null;
  return (
    <>
      <div className="flex flex-col gap-1">
        <h3 className="font-medium text-2xl">{ticket.title}</h3>
        <div className="flex gap-1 text-sm mt-2 items-center">
          <span className="text-slate-500">Created by</span>
          <Link
            href={`/users/accounts/${ticket.user_id}?redirect=${encodeURIComponent(pathname)}`}
            className="underline font-medium text-slate-600 hover:text-purple-700"
          >
            {ticket.user_username}
          </Link>
        </div>
        <span className="text-slate-400 text-xs">
          on {dateFormater(new Date(ticket.created_at), true, true)}
        </span>
      </div>

      <p className="text-sm text-justify text-slate-600">
        {ticket.description}
      </p>
    </>
  );
};

export default TicketDetails;
