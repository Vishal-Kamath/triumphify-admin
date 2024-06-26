"use client";

import { useEmployee } from "@/lib/employee";
import { useParams } from "next/navigation";
import { FC, useState } from "react";
import EmployeeDetailsForm from "./employee-details-form";
import { MoveLeft } from "lucide-react";
import Link from "next/link";
import ActivateDeactivateEmployee from "./activate-deactivate-employee";
import { useMe } from "@/lib/auth";
import TabComponent from "@/components/misc/component";
import PrivilageProvider from "@/components/providers/privilage.provider";
import EmployeeTime from "./employee-time";
import EmployeeRateForm from "./rate-form";

const EmpolyeDetails: FC = () => {
  const id = useParams()["id"] as string;
  const [rate, setRate] = useState(0);

  const { data: me } = useMe();
  const { data: employee, isLoading } = useEmployee(id);
  if (!id || id === "undefined") return <div>Invalid ID</div>;

  if (isLoading) return <div>Loading...</div>;
  if (!employee) return <div>Invalid</div>;

  return (
    <PrivilageProvider path="/employees/details/:id">
      <TabComponent className="max-xl:max-w-lg mx-auto max-w-6xl flex xl:flex-row max-xl:flex-col justify-between max-xl:items-center gap-12 xl:gap-6">
        <div className="flex max-w-lg flex-col gap-9 w-full min-w-[25rem]">
          <div className="flex flex-col w-full items-start gap-3">
            <h2 className="text-xl font-semibold">{employee?.username}</h2>
            <Link
              href="/employees/details"
              className="text-slate-500 flex gap-2 items-center hover:text-slate-600 text-sm underline"
            >
              <MoveLeft className="size-4" />
              <span>Back</span>
            </Link>
          </div>
          <EmployeeDetailsForm employee={employee} />
        </div>

        <div className="flex max-w-lg flex-col gap-9 w-full min-w-[25rem]">
          <EmployeeTime rate={rate} employee={employee} />
          {me && me.role === "superadmin" ? (
            <>
              <EmployeeRateForm setRate={setRate} employee={employee} />
              <ActivateDeactivateEmployee employee={employee} />
            </>
          ) : null}
        </div>
      </TabComponent>
    </PrivilageProvider>
  );
};

export default EmpolyeDetails;
