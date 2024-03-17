import { FC } from "react";
import UserTable from "./user-table";
import { Separator } from "@/components/ui/separator";
import PrivilageProvider from "@/components/providers/privilage.provider";

const UsersPage: FC = () => {
  return (
    <PrivilageProvider path="/users/accounts">
      <main className="flex h-full w-full flex-col gap-6 bg-white p-6 pb-24">
        <h2 className="text-lg font-semibold leading-none">User Details</h2>
        <Separator />
        <div className="h-full">
          <UserTable />
        </div>
      </main>
    </PrivilageProvider>
  );
};

export default UsersPage;
