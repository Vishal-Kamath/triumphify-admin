import PrivilageProvider from "@/components/providers/privilage.provider";
import { Separator } from "@/components/ui/separator";
import { FC } from "react";
import TicketsTable from "./tickets-table";

const TicketsListPage: FC = () => {
  return (
    <PrivilageProvider path="/users/tickets">
      <main className="flex h-full min-h-full w-full flex-col gap-2 bg-white p-6">
        <div className="flex flex-col gap-6">
          <h2 className="text-lg font-semibold leading-none">
            Employee tickets details
          </h2>
          <Separator />
        </div>
        <div className="h-full">
          <TicketsTable />
        </div>
      </main>
    </PrivilageProvider>
  );
};

export default TicketsListPage;
