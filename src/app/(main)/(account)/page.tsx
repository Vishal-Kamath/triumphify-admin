"use client";

import { useMe } from "@/lib/auth";
import { FC } from "react";
import WelcomeUserSection from "./welcome";
import UserTasksSection from "./tasks";
import LeadsSection from "./leads-users";
import { Separator } from "@/components/ui/separator";
import EmployeeDetails from "./(details)/employee-details";
import EmployeeTime from "./(details)/employee-time";

const AccountPage: FC = () => {
  const { data: employee, isLoading } = useMe();

  if (isLoading) return <div>Loading...</div>;
  if (!employee) return <div>Invalid</div>;

  return (
    <div className="w-full bg-white px-6 py-9">
      <div className="flex mx-auto max-w-6xl w-full flex-col gap-9">
        <WelcomeUserSection employee={employee} />
        <Separator />
        <div className="flex gap-9 max-lg:flex-col max-lg:items-center">
          <EmployeeDetails />
          <EmployeeTime />
        </div>
        <Separator />
        <LeadsSection role={employee.role} />
        <Separator />
        <UserTasksSection />
      </div>
    </div>
  );
};

export default AccountPage;
