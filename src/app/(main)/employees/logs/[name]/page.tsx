"use client";

import { useParams } from "next/navigation";
import { FC } from "react";
import EmployeeLogsTable from "./employee-logs-table";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { MoveLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import PrivilageProvider from "@/components/providers/privilage.provider";

const EmployeeLogsPage: FC = () => {
  const name = useParams()["name"] as string;
  return (
    <PrivilageProvider path="/employees/logs/:name">
      <main className="flex h-full min-h-full w-full flex-col gap-6 bg-white p-6">
        <div className="flex w-full items-center gap-3">
          <Link
            href="/employees/logs"
            className={cn(
              buttonVariants({ variant: "ghost" }),
              "text-gray-600"
            )}
          >
            <MoveLeft />
          </Link>
          <h2 className="text-lg font-semibold">Logs: {name}</h2>
        </div>
        <Separator />
        <div className="h-full">
          <EmployeeLogsTable />
        </div>
      </main>
    </PrivilageProvider>
  );
};

export default EmployeeLogsPage;
