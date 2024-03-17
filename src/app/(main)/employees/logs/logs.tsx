"use client";

import ConfirmDelete from "@/components/misc/confirmDelete";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";
import { useEmployeeLogs } from "@/lib/employee";
import { dateFormater } from "@/utils/dateFormater";
import axios from "axios";
import { CalendarDays, MoreHorizontal, Trash2 } from "lucide-react";
import Link from "next/link";
import { FC } from "react";

const Logs: FC = () => {
  const { toast } = useToast();
  const { data: logs, isLoading, refetch } = useEmployeeLogs();

  const handleDeleteLogs = (name: string) => {
    axios
      .delete(`${process.env.ENDPOINT}/api/employees/logs/${name}`, {
        withCredentials: true,
      })
      .then((res) => {
        toast({
          title: res.data.title,
          description: res.data.description,
          variant: res.data.type,
        });
        refetch();
      })
      .catch((err) => {
        toast({
          title: err?.response?.data?.title || "Error",
          description: err?.response?.data?.description,
          variant: err?.response?.data?.type || "error",
        });
      });
  };

  if (isLoading)
    return (
      <>
        <Skeleton className="h-24 w-full rounded-md" />
        <Skeleton className="h-24 w-full rounded-md" />
        <Skeleton className="h-24 w-full rounded-md" />
        <Skeleton className="h-24 w-full rounded-md" />
      </>
    );
  return (logs || []).map((log, index) => (
    <div
      key={log.name + index}
      className="flex flex-col gap-6 rounded-md border-1 border-slate-200 p-4 shadow-sm transition-all duration-200 ease-in-out hover:shadow-md"
    >
      <div className="flex gap-3">
        <span>{log.name}</span>
        <Link
          className="ml-auto rounded-md bg-slate-50 p-1 text-slate-500 hover:bg-sky-100 hover:text-sky-600"
          href={`/employees/logs/${log.name}`}
        >
          <MoreHorizontal className="h-4 w-4" />
        </Link>
        <ConfirmDelete
          confirmText={log.name}
          deleteFn={() => handleDeleteLogs(log.name)}
          className="rounded-md bg-slate-50 p-1 text-slate-500 hover:bg-red-100 hover:text-red-600"
        >
          <Trash2 className="h-4 w-4" />
        </ConfirmDelete>
      </div>
      <div className="flex justify-between gap-3 text-xs text-slate-500">
        <span>Size: {log.size}</span>
        <div className="flex items-center gap-2">
          <CalendarDays className="h-3 w-3 text-slate-400" />
          <span>{dateFormater(new Date(log.createdAt))}</span>
        </div>
      </div>
    </div>
  ));
};

export default Logs;
