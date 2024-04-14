import { useMe } from "@/lib/auth";
import { FC } from "react";
import AdminLeadsTable from "./admin-leads-table";
import EmployeeLeadsTable from "./leads-table";

const LeadsTable: FC = () => {
  const { data: me } = useMe();
  return (
    <div className="w-full flex-col gap-2 flex">
      <h3 className="text-lg lg:text-xl text-transparent bg-clip-text bg-gradient-to-br from-blue-950 to-blue-700 font-semibold">
        Pending Leads
      </h3>
      {me?.role === "admin" || me?.role === "superadmin" ? (
        <AdminLeadsTable />
      ) : (
        <EmployeeLeadsTable />
      )}
    </div>
  );
};

export default LeadsTable;
