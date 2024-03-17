import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { FC } from "react";

const EmployeeDetailsLoadingPage: FC = () => {
  return (
    <main className="flex h-full min-h-full w-full flex-col gap-6 bg-white p-6">
      <Skeleton className="h-7 w-48" />
      <Separator />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
        <Skeleton className="h-20 w-full rounded-md" />
        <Skeleton className="h-20 w-full rounded-md" />
        <Skeleton className="h-20 w-full rounded-md" />
        <Skeleton className="h-20 w-full rounded-md" />
      </div>
    </main>
  );
};

export default EmployeeDetailsLoadingPage;
