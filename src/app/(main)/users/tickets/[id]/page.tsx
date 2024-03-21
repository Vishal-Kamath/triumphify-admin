import { FC } from "react";
import TicketSidebar from "./ticket-sidebar";
import TicketChatWindow from "./tickets-chat-window";
import PrivilageProvider from "@/components/providers/privilage.provider";

const TicketPage: FC = () => {
  return (
    <PrivilageProvider path="/users/tickets/:id">
      <main className="relative isolate max-w-6xl py-6 mx-auto w-full max-md:flex-col flex gap-12 items-start p-3">
        <TicketSidebar />
        <TicketChatWindow />
      </main>
    </PrivilageProvider>
  );
};

export default TicketPage;
