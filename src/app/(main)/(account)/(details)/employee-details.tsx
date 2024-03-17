"use client";

import { useMe } from "@/lib/auth";
import { dateFormater } from "@/utils/dateFormater";
import { PencilLine } from "lucide-react";
import Link from "next/link";
import { FC } from "react";
import UpdateUsername from "./update-username";
import UpdateEmail from "./update-email";

const EmployeeDetails: FC = () => {
  const { data: me, isLoading } = useMe();
  if (isLoading) return <div>Loading...</div>;
  if (!me) return <div>Invalid</div>;
  return (
    <div className="w-full flex-col gap-9 flex">
      <h3 className="text-lg lg:text-xl text-transparent bg-clip-text bg-gradient-to-br from-slate-950 to-slate-500 font-semibold">
        Details
      </h3>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-9">
        <UpdateUsername employee_username={me.username || ""} />
        <UpdateEmail employee_email={me.email} />
        <div className="flex w-full flex-col gap-2">
          <h6 className="font-medium text-slate-600">Role</h6>
          <span className="text-sm text-slate-500 capitalize">{me.role}</span>
        </div>
        <div className="flex w-full flex-col gap-2">
          <h6 className="font-medium text-slate-600">Joined at</h6>
          <span className="text-sm text-slate-500">
            {me.created_at ? dateFormater(new Date(me.created_at)) : "NA"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDetails;
