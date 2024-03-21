"use client";

import { FC } from "react";
import TicketsChatTextArea from "./tickets-chat-textarea";
import { useParams } from "next/navigation";
import { useTicketChats } from "@/lib/ticket";
import { AiOutlineLoading } from "react-icons/ai";
import TicketChat from "./tickets-chat";

const TicketChatWindow: FC = () => {
  const id = useParams()["id"] as string;
  const { data: chats, isLoading } = useTicketChats(id);

  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <AiOutlineLoading className="animate-spin size-12 text-slate-500" />
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col gap-4 relative">
      <div className="h-full justify-end max-h-full flex flex-col-reverse gap-3 overflow-y-auto">
        {chats?.map((chat, index) => (
          <TicketChat key={chat.id} chat={chat} id={id} />
        ))}
      </div>
      <TicketsChatTextArea />
    </div>
  );
};

export default TicketChatWindow;
