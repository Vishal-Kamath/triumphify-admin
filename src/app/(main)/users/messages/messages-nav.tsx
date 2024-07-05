"use client";

import { Socket } from "@/components/providers/socket.provider";
import { cn } from "@/lib/utils";
import { Mails, MessageCircle } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FC, useContext } from "react";

const NavMessages: FC<{
  href: string;
  preventDefault(e: React.MouseEvent): void;
}> = ({ href, preventDefault }) => {
  const pathname = usePathname();
  const { conversations } = useContext(Socket);

  return (
    <div
      className={cn(
        "flex flex-col rounded-md px-2 pb-2",
        pathname.startsWith(href)
          ? "bg-slate-50 text-blue-700"
          : "hover:bg-slate-50",
      )}
    >
      <Link
        className={cn("flex h-10 w-full items-center gap-3")}
        href={href}
        onClick={preventDefault}
      >
        <Mails
          className={cn(
            "h-5 w-5",
            pathname.startsWith(href) ? "text-blue-700" : "text-slate-500",
          )}
        />
        <span>Messages</span>

        {/* {navElement.notification ? (
        <span className="ml-auto rounded-full bg-gradient-to-br from-blue-600 to-blue-700 px-2 text-xs font-semibold leading-4 text-white">
          {navElement.notification}
        </span>
      ) : null} */}
      </Link>
      <div className="flex flex-col gap-1 text-black">
        {conversations.slice(0, 4).map((conversation, index) => (
          <Link
            key={conversation.room + index}
            href={`/users/messages/${conversation.room}`}
            className="flex gap-2 rounded-lg bg-slate-200/50 p-[0.4rem]"
          >
            <div className="flex size-8 flex-shrink-0 items-center justify-center rounded-md bg-emerald-400 text-emerald-200">
              <MessageCircle className="size-6" />
            </div>

            <div className="flex max-w-full flex-col text-xs">
              <span>
                {conversation.lastMessage.sender === "customer"
                  ? "Customer"
                  : "Operator"}
              </span>
              <span className="w-full max-w-28 truncate text-slate-600">
                {conversation.lastMessage.msg}
              </span>
            </div>
          </Link>
        ))}
        {pathname.startsWith(href) ? null : (
          <Link
            href={href}
            className="w-full pt-2 text-center text-xs text-slate-500"
          >
            View all messages...
          </Link>
        )}
      </div>
    </div>
  );
};

export default NavMessages;
