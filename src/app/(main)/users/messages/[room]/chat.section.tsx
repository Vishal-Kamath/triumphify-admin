"use client";

import {
  AlertCircle,
  MoveLeft,
  Settings,
  X,
  SendHorizonal,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  Dispatch,
  FC,
  Fragment,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import AutoResizingTextarea from "@/components/ui/auto-resize-textarea";
import { useParams } from "next/navigation";
import { Socket } from "@/components/providers/socket.provider";
import useResponsive from "@/lib/hooks/use-responsive";
import ConfirmPopover from "@/components/misc/confirmPopup";
import { Separator } from "@/components/ui/separator";

const ChatSection: FC<{
  dropdownOpen: boolean;
  setDropdownOpen: Dispatch<SetStateAction<boolean>>;
  detailsOpen: boolean;
  setDetailsOpen: Dispatch<SetStateAction<boolean>>;
  room: Conversation | undefined;
  setRoom: Dispatch<SetStateAction<Conversation | undefined>>;
}> = ({
  dropdownOpen,
  setDropdownOpen,
  room,
  setRoom,
  detailsOpen,
  setDetailsOpen,
}) => {
  const roomId = useParams()["room"] as string;

  const {
    messages,
    newChat,
    chatUpdate,
    getRoom,
    getConversationsList,
    terminateChat,
  } = useContext(Socket);
  const [msg, setMsg] = useState("");

  const { maxMd } = useResponsive();

  useEffect(() => {
    chatUpdate(roomId);
  }, [roomId]);

  const terminated = room && room.status === "closed";

  return (
    <div className="min-h-remaining max-h-remaining isolate flex h-full w-full grow flex-col p-6">
      <div className="flex justify-between gap-3 border-b-2 border-slate-200 pb-4">
        <Link
          className="flex h-9 w-fit items-center gap-2 rounded-full bg-slate-100 px-4 text-sm font-medium text-slate-700 hover:bg-slate-200 hover:text-black"
          href="/users/messages"
        >
          <MoveLeft className="size-4" />
          <span>Back</span>
        </Link>

        {maxMd ? (
          <div className="relative z-10">
            <button
              onClick={() => setDropdownOpen((open) => !open)}
              className="flex size-9 items-center justify-center rounded-full border-none bg-slate-100 text-slate-400 outline-none hover:bg-slate-200 hover:text-slate-600 md:hidden"
            >
              <Settings
                strokeWidth={1.5}
                className={cn(
                  "size-6 transition-all duration-300 ease-in-out",
                  dropdownOpen ? "rotate-[60deg]" : "",
                )}
              />
            </button>
            <div
              className={cn(
                "absolute right-0 top-12 flex w-full min-w-[12rem] flex-col gap-1 rounded-md border-1 border-slate-300 bg-white p-1",
                dropdownOpen ? "" : "hidden",
              )}
            >
              <button
                onClick={() => {
                  setDetailsOpen(true);
                  setDropdownOpen(false);
                }}
                className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-slate-600 hover:bg-blue-50 hover:text-blue-600"
              >
                <AlertCircle className="size-4" />
                <span>User Details</span>
              </button>
              {!terminated ? (
                <>
                  <Separator />
                  <ConfirmPopover
                    confirmText="Terminate Chat"
                    fcTitle="Are you sure you want to terminate this chat"
                    fcDescription="This is action will terminate the chat permanently"
                    fcButton="Terminate"
                    deleteFn={() =>
                      terminateChat(roomId, () => {
                        getConversationsList();
                        getRoom(roomId, setRoom);
                      })
                    }
                    className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-slate-600 hover:bg-red-50 hover:text-red-600"
                  >
                    <X className="size-4" />
                    <span>Terminate Chat</span>
                  </ConfirmPopover>
                </>
              ) : null}
            </div>
          </div>
        ) : terminated ? (
          <button
            onClick={() => setDetailsOpen(true)}
            className="ml-auto flex w-fit items-center gap-2 rounded-sm px-2 py-1.5 text-slate-600 hover:bg-blue-50 hover:text-blue-600 md:hidden"
          >
            <AlertCircle className="size-4" />
            <span>User Details</span>
          </button>
        ) : (
          <ConfirmPopover
            confirmText="Terminate Chat"
            fcTitle="Are you sure you want to terminate this chat"
            fcDescription="This is action will terminate the chat permanently"
            fcButton="Terminate"
            deleteFn={() =>
              terminateChat(roomId, () => {
                getConversationsList();
                getRoom(roomId, setRoom);
              })
            }
            className="ml-auto flex w-fit items-center gap-2 rounded-sm px-2 py-1.5 text-slate-600 hover:bg-red-50 hover:text-red-600"
          >
            <X className="size-4" />
            <span>Terminate Chat</span>
          </ConfirmPopover>
        )}
      </div>

      {/* Chats */}
      <div className="flex h-full max-h-full grow flex-col-reverse gap-4 overflow-y-auto px-4 py-6">
        {formatData(messages)
          .reverse()
          .map((chat, index) =>
            chat.type === "dateSeprator" ? (
              <div
                key={index + "datesemveba"}
                className="relative mx-auto my-4 w-full max-w-sm border-b-1 border-slate-500"
              >
                <span className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 bg-white px-2 text-xs text-slate-800">
                  {formatDate(chat.date)}
                </span>
              </div>
            ) : (
              <ChatMsg key={index + chat.msg} {...chat} />
            ),
          )}
      </div>

      {!terminated ? (
        <div className="flex h-fit w-full items-center gap-4 rounded-b-lg border-t-2 border-slate-300 bg-slate-100 px-4 py-2">
          <AutoResizingTextarea
            value={msg}
            disabled={terminated}
            onChange={(e) => setMsg(String.raw`${e.target.value}`)}
            className="w-full border-none bg-transparent text-slate-800 outline-none"
            placeholder="Message us here..."
          />
          <button
            onClick={() =>
              newChat(msg, roomId, (newRoom: string) => {
                setMsg("");
                chatUpdate(newRoom);
              })
            }
            className="flex size-7 flex-shrink-0 items-center justify-center rounded-sm bg-slate-300 text-slate-600 hover:text-black"
          >
            <SendHorizonal className="size-4" />
          </button>
        </div>
      ) : (
        <div className="flex h-fit w-full items-center justify-center gap-4 px-4 py-2">
          <span className="text-slate-600">This chat has been terminated</span>
        </div>
      )}
    </div>
  );
};

const ChatMsg: FC<Message> = ({ sender, msg, created_at }) => {
  return (
    <div
      className={cn(
        "relative flex w-fit max-w-sm flex-col items-end gap-[0.35rem] rounded-md px-3 py-2 text-black",
        sender === "customer"
          ? "mr-auto bg-purple-300"
          : "ml-auto bg-slate-300",
      )}
    >
      <div
        className={cn(
          "h-0 w-0 border-l-[7px] border-r-[7px] border-t-[10px] border-l-transparent border-r-transparent",
          sender === "customer"
            ? "absolute left-0 top-0 -translate-x-1/2 border-t-purple-300"
            : "absolute right-0 top-0 translate-x-1/2 border-t-slate-300",
        )}
      ></div>
      <span className="text-wrap break-words text-left leading-5 md:text-xs">
        {formatText(msg)}
      </span>
      <span className="ml-auto text-xs text-slate-700 md:text-[0.6rem]">
        {formatTime(new Date(created_at))}
      </span>
    </div>
  );
};

interface SerializedMessage extends Message {
  type: "message";
}
interface DateSeprator {
  date: Date;
  type: "dateSeprator";
}
function formatData(data: Message[]) {
  const newDataArray: (SerializedMessage | DateSeprator)[] = [];

  let previousDate: Date | null = null;
  data.forEach((entry) => {
    if (
      previousDate === null ||
      new Date(entry.created_at).getDate() !== previousDate.getDate() ||
      new Date(entry.created_at).getMonth() !== previousDate.getMonth() ||
      new Date(entry.created_at).getFullYear() !== previousDate.getFullYear()
    ) {
      newDataArray.push({
        type: "dateSeprator",
        date: new Date(entry.created_at),
      });
    }

    newDataArray.push({ ...entry, type: "message" });
    previousDate = new Date(entry.created_at);
  });

  return newDataArray;
}

function formatTime(date: Date) {
  let hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";

  hours = hours % 12;
  hours = hours ? hours : 12;

  const formattedHours = String(hours).padStart(2, "0");

  return `${formattedHours}:${minutes} ${ampm}`;
}

function formatDate(date: Date) {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
  const year = date.getFullYear();

  return `${day}-${month}-${year}`;
}

const formatText = (inputText: string) => {
  return inputText.split("\n").map((line, index) => (
    <Fragment key={index}>
      {line}
      <br />
    </Fragment>
  ));
};

export default ChatSection;
