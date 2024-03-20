"use client";

import { dateFormater } from "@/utils/dateFormater";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { CheckCircle2, MoreHorizontal, XCircle } from "lucide-react";
import { FC, useState } from "react";
import { User } from "@/@types/user";
import { RxCaretSort } from "react-icons/rx";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { useUsers } from "@/lib/user";
import DataTableToolbar from "@/components/data-table/data-table-toolbar";
import DataTable from "@/components/data-table/data-table";
import { DataTablePagination } from "@/components/data-table/data-table-pagination";
import DataTableExtract from "@/components/data-table/data-table-extract";
import AvatarElement from "@/components/misc/avatar-element";

const columns: ColumnDef<User>[] = [
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
    cell: ({ row }) => (
      <div className="flex gap-3">
        <AvatarElement
          username={row.original.username}
          image={row.original.image}
          className="h-12 w-12"
        />
        <div className="flex flex-col gap-1">
          <span className="max-w-[500px] truncate">
            {row.original.email.length > 30
              ? row.original.email.slice(0, 27) + "..."
              : row.original.email}
          </span>
          <Badge
            variant="outline"
            className={cn(
              row.original.emailVerified
                ? "border-green-500 bg-green-50 text-green-500"
                : "border-yellow-500 bg-yellow-50 text-yellow-500",
              "w-fit font-medium"
            )}
          >
            {row.original.emailVerified ? "Verified" : "Not Verified"}
          </Badge>
        </div>
      </div>
    ),
    accessorKey: "email",
    enableHiding: false,
  },
  {
    header: ({ column }) => {
      return (
        <button
          className="flex items-center gap-2 border-none bg-transparent p-0 outline-none focus:outline-none"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <RxCaretSort className="ml-2 h-4 w-4" />
        </button>
      );
    },
    accessorKey: "username",
    cell: ({ row }) => row.getValue("username") || "N/A",
  },
  {
    header: "Date of Birth",
    accessorKey: "dateOfBirth",
    cell: ({ row }) => dateFormater(new Date(row.getValue("dateOfBirth"))),
  },
  {
    header: "Gender",
    accessorKey: "gender",
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
      <div className="flex">
        <Link
          href={`/users/accounts/${row.getValue("id")}?redirect=${encodeURIComponent("/users/stats")}`}
          className={cn(buttonVariants({ variant: "ghost" }))}
        >
          <MoreHorizontal className="h-4 w-4" />
        </Link>
      </div>
    ),
  },
];

const emailVerifiedStatus = [
  {
    value: "Male",
    label: "Male",
    icon: CheckCircle2,
  },
  {
    value: "Female",
    label: "Female",
    icon: XCircle,
  },
];

const UserTable: FC = () => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  const { data: users, refetch, isLoading } = useUsers();

  const table = useReactTable({
    data: users || [],
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    state: {
      sorting,
      columnFilters,
      columnVisibility,
    },
  });

  if (isLoading) return <DataTableSkeleton columnCount={6} />;

  return isLoading ? (
    <DataTableSkeleton columnCount={columns.length} />
  ) : (
    <div className="flex w-full flex-col gap-4">
      <DataTableToolbar
        table={table}
        searchUsing="username"
        refetch={refetch}
        dataTableExtract={
          <DataTableExtract data={users || []} name="user-details" />
        }
      />
      <DataTable table={table} columnSpan={columns.length} />
      <DataTablePagination table={table} />
    </div>
  );
};

export default UserTable;
