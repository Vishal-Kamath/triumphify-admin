"use client";

import { cn } from "@/lib/utils";
import { dateFormater } from "@/utils/dateFormater";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { Check, PencilLine, Trash2, X } from "lucide-react";
import { ElementRef, FC, useRef, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { invalidateTicketChats } from "@/lib/ticket";
import axios from "axios";
import { Textarea } from "@/components/ui/textarea";

const TicketChat: FC<{ chat: TicketChat; id: string }> = ({ chat, id }) => {
  const { toast } = useToast();
  const [editMode, setEditMode] = useState(false);
  const [editContent, setEditContent] = useState(chat.content);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<ElementRef<"textarea">>(null);

  function deleteChat(chatId: string) {
    const isUserSure = confirm("Are you sure you want to delete this chat?");

    if (!isUserSure) return;
    axios
      .delete(`${process.env.ENDPOINT}/api/tickets/${id}/chat/${chatId}`, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      })
      .then((res) => {
        invalidateTicketChats(id);
        toast({
          title: res.data.title,
          description: res.data.description,
          variant: res.data.type,
        });
      })
      .catch((err) => {
        toast({
          title: err?.response?.data?.title || "Error",
          description: err?.response?.data?.description,
          variant: err?.response?.data?.type || "error",
        });
      });
  }

  function onUpdate() {
    if (!editContent.trim()) {
      return toast({
        title: "Fill all details",
        variant: "warning",
      });
    }

    setLoading(true);
    axios
      .patch(
        `${process.env.ENDPOINT}/api/tickets/${id}/chat/${chat.id}`,
        {
          content: editContent,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      )
      .then((res) => {
        setLoading(false);
        invalidateTicketChats(id);
        setEditMode(false);
        toast({
          title: res.data.title,
          description: res.data.description,
          variant: res.data.type,
        });
      })
      .catch((err) => {
        setLoading(false);
        toast({
          title: err?.response?.data?.title || "Error",
          description: err?.response?.data?.description,
          variant: err?.response?.data?.type || "error",
        });
      });
  }

  const isEmployee = chat.type === "employee";
  return isEmployee ? (
    editMode ? (
      <div
        className={cn(
          "rounded-md p-3 w-full cursor-pointer max-w-md flex flex-col transition-all duration-200 ease-in-out",
          isEmployee
            ? "ml-auto bg-purple-50 text-right"
            : "bg-slate-50 text-left"
        )}
      >
        <h4 className={cn("text-[14px] font-medium")}>
          {isEmployee ? chat.employee : chat.user}
        </h4>
        <span className="text-[0.6rem] text-slate-500">
          {dateFormater(new Date(chat.created_at), true, true)}
        </span>

        <Textarea
          value={editContent}
          onChange={(e) => setEditContent(e.target.value)}
          className="min-h-16 h-52 max-h-52 w-full mt-3"
        />

        <div className="flex justify-end mt-3 gap-2">
          <button
            disabled={loading}
            type="button"
            onClick={() => {
              inputRef.current?.blur();
              setEditMode(false);
            }}
            className="size-6 rounded-sm flex justify-center items-center hover:bg-red-100 border-none outline-none hover:text-red-800 text-slate-500"
          >
            <X className="size-4" />
          </button>
          <button
            disabled={loading}
            type="submit"
            onClick={onUpdate}
            className="size-6 rounded-sm flex justify-center items-center hover:bg-green-100 border-none outline-none hover:text-green-800 text-slate-500"
          >
            <Check className="size-4" />
          </button>
        </div>
      </div>
    ) : (
      <ContextMenu>
        <ContextMenuTrigger
          className={cn(
            "rounded-md p-3 w-fit cursor-pointer max-w-md flex flex-col transition-all duration-200 ease-in-out",
            isEmployee
              ? "ml-auto bg-purple-50 text-right"
              : "bg-slate-50 text-left"
          )}
        >
          <h4 className={cn("text-[14px] font-medium")}>
            {isEmployee ? chat.employee : chat.user}
          </h4>
          <span className="text-[0.6rem] text-slate-500">
            {dateFormater(new Date(chat.created_at), true, true)}
          </span>
          <p className="text-slate-500 text-sm mt-3">{chat.content}</p>
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem
            onClick={() => {
              setEditMode(true);
              setEditContent(chat.content);
            }}
            className="flex gap-3 text-sm text-slate-700"
          >
            <PencilLine className="size-4" />
            <span>Edit</span>
          </ContextMenuItem>
          <ContextMenuItem
            onClick={() => deleteChat(chat.id)}
            className="flex gap-3 text-sm text-slate-700"
          >
            <Trash2 className="size-4" />
            <span>Delete</span>
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    )
  ) : (
    <div
      className={cn(
        "flex w-fit max-w-md cursor-pointer flex-col rounded-md p-3 transition-all duration-200 ease-in-out",
        isEmployee ? "ml-auto bg-purple-50 text-right" : "bg-slate-50 text-left"
      )}
    >
      <h4 className={cn("text-[14px] font-medium")}>
        {isEmployee ? chat.employee : chat.user}
      </h4>
      <span className="text-[0.6rem] text-slate-500">
        {dateFormater(new Date(chat.created_at), true, true)}
      </span>
      <p className="mt-3 text-sm text-slate-500">{chat.content}</p>
    </div>
  );
};

export default TicketChat;
