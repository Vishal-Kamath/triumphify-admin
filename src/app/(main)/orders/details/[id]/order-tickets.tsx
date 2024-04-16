import AvatarElement from "@/components/misc/avatar-element";
import { useMe } from "@/lib/auth";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { FC } from "react";

const statusStyle = {
  pending: "bg-yellow-50/50 text-yellow-600 border-yellow-600",
  completed: "bg-green-50/50 text-green-600 border-green-600",
  failed: "bg-red-50/50 text-red-600 border-red-600",
};

const OrderTickets: FC<{ tickets: Ticket[] }> = ({ tickets }) => {
  const { data: me } = useMe();
  const pathname = usePathname();
  const redirect = useSearchParams().get("redirect");
  const link = redirect ? "?redirect=" + encodeURIComponent(redirect) : "";

  return (
    <div className="flex flex-col gap-4">
      <h3 className="font-medium">Order Tickets</h3>
      <div className="flex flex-col gap-2">
        {tickets.length ? (
          tickets.map((ticket, index) => (
            <Link
              key={ticket.id + index}
              href={
                me?.role === "admin" || me?.role === "superadmin"
                  ? `/employees/tickets/${ticket.id}?redirect=${encodeURIComponent(pathname + link)}`
                  : `/users/tickets/${ticket.id}?redirect=${encodeURIComponent(pathname + link)}`
              }
              className="flex gap-3 w-full p-3 border-1 rounded-md border-slate-300"
            >
              <AvatarElement
                image={ticket.user_image}
                username={ticket.user_username}
              />
              <div className="flex flex-col w-full">
                <div className="flex gap-3 w-full justify-between">
                  <h4 className="text-sm text-slate-700 truncate">
                    {ticket.title}
                  </h4>
                  <span
                    className={cn(
                      statusStyle[ticket.status],
                      "border-1 text-xs px-1 rounded-full"
                    )}
                  >
                    {ticket.status}
                  </span>
                </div>
                <p className="text-xs text-slate-500">{ticket.description}</p>
              </div>
            </Link>
          ))
        ) : (
          <i className="w-full text-center text-slate-400">No tickets found</i>
        )}
      </div>
    </div>
  );
};

export default OrderTickets;
