"use client";

import AvatarElement from "@/components/misc/avatar-element";
import { Socket } from "@/components/providers/socket.provider";
import { useUser } from "@/lib/user";
import { cn } from "@/lib/utils";
import { ExternalLink, Mail, MessageCircle, Phone } from "lucide-react";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { FC, useContext, useEffect, useState } from "react";

const ChatUserDetails: FC<{
  open: boolean;
  room: Conversation | undefined;
  closeDetails: VoidFunction;
}> = ({ open, room, closeDetails }) => {
  const roomId = useParams()["room"] as string;
  const { getRoom, conversations } = useContext(Socket);

  const pathname = usePathname();
  const { data: user, refetch } = useUser(room?.user_id as string);

  useEffect(() => {
    refetch();
  }, [roomId]);

  const userConversations = conversations.filter(
    (conversation) =>
      conversation.user.id === user?.id && conversation.room !== roomId,
  );

  return user ? (
    <div
      className={cn(
        "max-h-remaining flex w-full flex-col gap-4 overflow-y-auto bg-white p-6 md:max-w-lg",
        "max-md:fixed max-md:left-0 max-md:top-0 max-md:min-h-screen max-md:pt-[5rem]",
        open ? "" : "max-md:hidden",
      )}
    >
      <button
        onClick={closeDetails}
        className="w-fit font-medium text-slate-600 hover:text-black hover:underline md:hidden"
      >
        Close
      </button>
      <div className="flex w-full items-center gap-3 rounded-sm border-1 border-slate-200 p-4">
        <AvatarElement
          image={user.image}
          elementClassName="rounded-sm"
          className="rounded-sm"
          username={user.username}
        />
        <div className="flex flex-col">
          <span className="font-medium text-slate-600">{user.username}</span>
          <Link
            href={`/users/accounts/${user.id}?redirect=${encodeURIComponent(pathname)}`}
            className="flex w-fit items-center gap-1 border-b-2 border-transparent text-blue-500 hover:border-blue-500 hover:text-blue-700"
          >
            <span className="text-[0.8rem]">View user</span>
            <ExternalLink className="size-3" />
          </Link>
        </div>
      </div>

      <div className="flex w-full flex-col gap-4 rounded-sm border-1 border-slate-200 p-4">
        <h3 className="text-lg font-medium text-slate-600">About</h3>
        <div className="flex items-center gap-4">
          <Mail className="size-5 text-slate-500" />
          <a
            href={`mailto:${user.email}`}
            target="_blank"
            className="m-0 border-none p-0 font-medium text-slate-500 outline-none hover:underline hover:underline-offset-1"
          >
            {user.email}
          </a>
        </div>
        <div className="flex items-center gap-4">
          <Phone className="size-5 text-slate-500" />
          {user.tel ? (
            <a
              href={`tel:${user.tel}`}
              target="_blank"
              className="m-0 border-none p-0 font-medium text-slate-500 outline-none hover:underline hover:underline-offset-1"
            >
              {user.tel}
            </a>
          ) : (
            <span className="font-medium text-slate-500">Not Available</span>
          )}
        </div>
      </div>

      <div className="flex max-h-full w-full flex-col gap-4 rounded-sm border-1 border-slate-200 p-4">
        <h3 className="text-lg font-medium text-slate-600">
          Conversation History
        </h3>

        <div className="flex flex-col gap-2">
          {userConversations.length ? (
            userConversations.slice(0, 4).map((conversation, index) => (
              <Link
                key={conversation.room + index}
                href={`/users/messages/${conversation.room}`}
                className="flex gap-2 rounded-lg bg-slate-200/40 p-[0.4rem]"
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
            ))
          ) : (
            <i className="text-sm text-slate-500">No other conversations</i>
          )}
        </div>
      </div>
    </div>
  ) : (
    <div className="w-full max-w-lg p-6">User not found</div>
  );
};

export default ChatUserDetails;
