import { useMe } from "@/lib/auth";
import { FC } from "react";
import AdminTicketsTable from "./admin-tickets-table";
import EmployeeTicketsTable from "./tickets-table";

const TicketsTable: FC = () => {
  const { data: me } = useMe();
  return (
    <div className="w-full flex-col gap-2 flex">
      <h3 className="text-lg lg:text-xl text-transparent bg-clip-text bg-gradient-to-br from-green-950 to-green-700 font-semibold">
        Pending Tickets
      </h3>
      {me?.role === "admin" || me?.role === "superadmin" ? (
        <AdminTicketsTable />
      ) : (
        <EmployeeTicketsTable />
      )}
    </div>
  );
};

export default TicketsTable;
