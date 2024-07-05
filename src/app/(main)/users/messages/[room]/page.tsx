"use client";

import { FC, useContext, useEffect, useState } from "react";
import ChatSection from "./chat.section";
import ChatUserDetails from "./users.details";

import { Socket } from "@/components/providers/socket.provider";
import { useParams } from "next/navigation";

const ChatPage: FC = () => {
  const roomId = useParams()["room"] as string;
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [room, setRoom] = useState<Conversation>();

  const { getRoom } = useContext(Socket);

  useEffect(() => {
    getRoom(roomId, setRoom);
  }, []);

  return (
    <main className="relative flex h-full w-full grow">
      <ChatSection
        dropdownOpen={dropdownOpen}
        setDropdownOpen={setDropdownOpen}
        detailsOpen={detailsOpen}
        setDetailsOpen={setDetailsOpen}
        room={room}
        setRoom={setRoom}
      />

      <ChatUserDetails
        open={detailsOpen}
        closeDetails={() => setDetailsOpen(false)}
        room={room}
      />
    </main>
  );
};

export default ChatPage;
