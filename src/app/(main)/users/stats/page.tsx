import { FC } from "react";
import { Separator } from "@/components/ui/separator";
import TopUsers from "./top-user";
import NewUsers from "./new-users";
import UserTable from "./user-table";

const UsersPage: FC = () => {
  return (
    <main className="flex h-full w-full flex-col gap-3 bg-white p-6 pb-24">
      <div className="flex flex-col gap-6">
        <h2 className="text-lg font-semibold leading-none">User Stats</h2>
        <Separator />
      </div>
      <div className="flex flex-col gap-12">
        <div className="h-full">
          <UserTable />
        </div>
        <Separator />
        <div className="flex justify-between gap-14 max-lg:flex-col lg:gap-9">
          <TopUsers />
          <NewUsers />
        </div>
      </div>
    </main>
  );
};

export default UsersPage;
