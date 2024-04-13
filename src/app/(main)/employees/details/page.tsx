import { FC } from "react";
import EmployeesTable from "./employees-table";
import { Separator } from "@/components/ui/separator";
import PrivilageProvider from "@/components/providers/privilage.provider";

const EmployeeDetailsTable: FC = () => {
  return (
    <PrivilageProvider path="/employees/details">
      <main className="flex h-full min-h-full w-full flex-col gap-2 bg-white p-6">
        <div className="flex flex-col gap-6">
          <h2 className="text-lg font-semibold leading-none">
            Employee Details
          </h2>
          <Separator />
        </div>
        <div className="h-full">
          <EmployeesTable />
        </div>
      </main>
    </PrivilageProvider>
  );
};

export default EmployeeDetailsTable;
