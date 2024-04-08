"use client";

import { useEmployee } from "@/lib/employee";
import { useParams } from "next/navigation";
import { FC } from "react";
import EmployeeDetailsForm from "./employee-details-form";
import { MoveLeft } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import ActivateDeactivateEmployee from "./activate-deactivate-employee";
import { useMe } from "@/lib/auth";
import TabComponent from "@/components/misc/component";
import PrivilageProvider from "@/components/providers/privilage.provider";
import EmployeeTime from "./employee-time";

const EmpolyeDetails: FC = () => {
  const id = useParams()["id"] as string;

  const { data: me } = useMe();
  const { data: employee, isLoading } = useEmployee(id);
  if (!id || id === "undefined") return <div>Invalid ID</div>;

  if (isLoading) return <div>Loading...</div>;
  if (!employee) return <div>Invalid</div>;

  return (
    <PrivilageProvider path="/employees/details/:id">
      <TabComponent className="max-xl:max-w-lg mx-auto max-w-6xl">
        <div className="flex w-full items-center gap-3">
          <Link
            href="/employees/details"
            className={cn(buttonVariants({ variant: "ghost" }), "rounded-full")}
          >
            <MoveLeft />
          </Link>
          <h2 className="text-xl font-semibold">{employee?.username}</h2>
        </div>

        <div className="flex max-xl:flex-col justify-between max-xl:items-center gap-12 xl:gap-6">
          <EmployeeDetailsForm employee={employee} />
          <div className="flex max-w-lg flex-col gap-9 w-full min-w-[25rem]">
            <EmployeeTime employee={employee} />
            {me && me.role === "superadmin" ? (
              <ActivateDeactivateEmployee employee={employee} />
            ) : null}
          </div>
        </div>
      </TabComponent>
    </PrivilageProvider>
  );
};

export default EmpolyeDetails;
