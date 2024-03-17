import { FC } from "react";
import Logs from "./logs";
import { Separator } from "@/components/ui/separator";
import PrivilageProvider from "@/components/providers/privilage.provider";

const EmployeeLogsListPage: FC = () => {
  return (
    <PrivilageProvider path="/employees/logs">
      <main className="flex h-full min-h-full w-full flex-col gap-6 bg-white p-6">
        <h2 className="text-lg font-semibold leading-none">Employee Logs</h2>
        <Separator />
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
          <Logs />
        </div>
      </main>
    </PrivilageProvider>
  );
};

export default EmployeeLogsListPage;
