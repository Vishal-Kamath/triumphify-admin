import { FC } from "react";
import { Separator } from "@/components/ui/separator";
import PrivilageProvider from "@/components/providers/privilage.provider";
import MessagesTable from "./messages-table";

const LeadsTablePage: FC = () => {
  return (
    <PrivilageProvider path="/users/messages">
      <main className="flex h-full min-h-full w-full flex-col gap-2 bg-white p-6">
        <div className="flex flex-col gap-6">
          <h2 className="text-lg font-semibold leading-none">Messages</h2>
          <Separator />
        </div>
        <div className="h-full">
          <MessagesTable />
        </div>
      </main>
    </PrivilageProvider>
  );
};

export default LeadsTablePage;
