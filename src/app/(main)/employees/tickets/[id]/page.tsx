import { FC } from "react";
import TicketSidebar from "./ticket-sidebar";

const TicketPage: FC = () => {
  return (
    <main className="relative max-w-6xl py-6 mx-auto w-full max-md:flex-col flex gap-3 items-start p-3">
      <TicketSidebar />
      <div className="h-[100rem] w-full"></div>
    </main>
  );
};

export default TicketPage;
