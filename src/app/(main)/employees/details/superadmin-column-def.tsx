import { Employee } from "@/@types/employee";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { dateFormater } from "@/utils/dateFormater";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { RxCaretSort } from "react-icons/rx";

export const columns: ColumnDef<Employee>[] = [
  {
    header: ({ column }) => {
      return (
        <button
          className="flex items-center gap-2 border-none bg-transparent p-0 outline-none focus:outline-none"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Username
          <RxCaretSort className="ml-2 h-4 w-4" />
        </button>
      );
    },
    accessorKey: "username",
    enableHiding: false,
    enableSorting: true,
  },
  {
    header: ({ column }) => {
      return (
        <button
          className="flex items-center gap-2 border-none bg-transparent p-0 outline-none focus:outline-none"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Email
          <RxCaretSort className="ml-2 h-4 w-4" />
        </button>
      );
    },
    accessorKey: "email",
  },
  {
    header: "Role",
    id: "role",
    accessorKey: "role",
    cell: ({ row }) => {
      return (
        <Badge
          className={cn(
            "capitalize",
            row.original.role === "admin"
              ? "bg-blue-100 text-blue-600 hover:bg-blue-200 border-1 border-blue-500"
              : "bg-green-100 text-green-600 hover:bg-green-200 border-1 border-green-500"
          )}
        >
          {row.original.role}
        </Badge>
      );
    },
  },
  {
    header: "Created At",
    accessorKey: "created_at",
    cell: ({ row }) => dateFormater(new Date(row.getValue("created_at"))),
  },
  {
    header: "Updated At",
    accessorKey: "updated_at",
    cell: ({ row }) =>
      row.getValue("updated_at")
        ? dateFormater(new Date(row.getValue("updated_at")))
        : "N/A",
  },
  {
    accessorKey: "id",
    header: "",
    enableHiding: false,
    enableSorting: false,
    cell: ({ row }) => (
      <Link
        href={`/employees/details/${row.getValue("id")}`}
        className={cn(buttonVariants({ variant: "ghost" }))}
      >
        <MoreHorizontal />
      </Link>
    ),
  },
];
