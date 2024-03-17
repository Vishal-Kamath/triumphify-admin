import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { FC } from "react";

const EmployeeLogsLoadingPage: FC = () => {
  return (
    <main className="flex h-full min-h-full w-full flex-col gap-6 bg-white p-6">
      <Skeleton className="h-7 w-48" />
      <Separator />
      <div className="p-6">
        <DataTableSkeleton columnCount={6} />
      </div>
    </main>
  );
};

export default EmployeeLogsLoadingPage;
