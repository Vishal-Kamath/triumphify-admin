import PrivilageProvider from "@/components/providers/privilage.provider";
import { Separator } from "@/components/ui/separator";
import { FC } from "react";
import ActionsTable from "./actions-table";

const ActionsPage: FC = () => {
  return (
    <PrivilageProvider path="/employees/actions">
      <main className="flex h-full min-h-full w-full flex-col gap-2 bg-white p-6">
        <div className="flex flex-col gap-6">
          <h2 className="text-lg font-semibold leading-none">Actions</h2>
          <Separator />
        </div>
        <div className="h-full">
          <ActionsTable />
        </div>
      </main>
    </PrivilageProvider>
  );
};

export default ActionsPage;
