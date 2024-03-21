import { FC } from "react";
import TicketSidebar from "./ticket-sidebar";
import TicketChatWindow from "./tickets-chat-window";

const TicketPage: FC = () => {
  return (
    <main className="relative isolate max-w-6xl py-6 mx-auto w-full max-md:flex-col flex gap-12 items-start p-3">
      <TicketSidebar />
      <TicketChatWindow />
    </main>
  );
};

export default TicketPage;
