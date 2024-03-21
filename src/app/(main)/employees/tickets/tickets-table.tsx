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
import { RxCaretSort } from "react-icons/rx";
import { FC, useState } from "react";
import DataTable from "@/components/data-table/data-table";
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton";
import { DataTablePagination } from "@/components/data-table/data-table-pagination";
import DataTableToolbar from "@/components/data-table/data-table-toolbar";
import DataTableExtract from "@/components/data-table/data-table-extract";
import { DataTableFacetedFilter } from "@/components/data-table/data-table-faceted-filter";
import AssignedToDataTableFacetedFilter from "./assigned-to-filter";
import AssignedTo from "./assigned-to";
import { useTickets } from "@/lib/ticket";
import AvatarElement from "@/components/misc/avatar-element";
import Link from "next/link";
import { ExternalLink, MoreHorizontal } from "lucide-react";
import TicketStatusDropdown from "./[id]/ticket-status-dropdown";

const statusStyles = {
  pending:
    "bg-yellow-50 border-1 border-yellow-500 hover:bg-yellow-50 text-yellow-600",
  completed:
    "bg-green-50 border-1 border-green-500 hover:bg-green-50 text-green-600",
  failed: "bg-red-50 border-1 border-red-500 hover:bg-red-50 text-red-600",
};

const columns: ColumnDef<Ticket>[] = [
  {
    header: ({ column }) => {
      return (
        <button
          className="flex items-center gap-2 border-none bg-transparent p-0 outline-none focus:outline-none"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          User
          <RxCaretSort className="ml-2 h-4 w-4" />
        </button>
      );
    },
    id: "User",
    accessorKey: "user_username",
    cell: ({ row }) => {
      return (
        <div className="flex h-full min-w-[15rem] items-start gap-3">
          <AvatarElement
            image={row.original.user_image}
            username={row.original.user_username}
          />

          <div className="flex flex-col">
            <h3 className="font-medium">{row.original.user_username}</h3>
            <Link
              href={`/users/accounts/${row.original.user_id}?redirect=${encodeURIComponent("/employees/tickets")}`}
              className="text-xs flex gap-1 text-slate-500 hover:underline hover:text-slate-800"
            >
              <span>View User</span>
              <ExternalLink className="size-3" />
            </Link>
          </div>
        </div>
      );
    },
    enableHiding: false,
    enableSorting: true,
  },
  {
    header: "Ticket",
    id: "Ticket",
    accessorKey: "title",
    cell: ({ row }) => {
      return (
        <div className="flex w-full min-w-[24rem] max-w-sm flex-col gap-1">
          <h3 className="text-[16px] font-medium">{row.original.title}</h3>
          <p className="text-xs text-slate-500">
            {row.original.description.length > 500
              ? row.original.description?.slice(0, 500) + "..."
              : row.original.description}
          </p>
        </div>
      );
    },
  },
  {
    header: "Assigned to",
    accessorKey: "assigned",
    cell: ({ row }) => {
      return <AssignedTo assignedTo={row.original.assigned} />;
    },
  },
  {
    header: "Status",
    accessorKey: "status",
    cell: ({ row }) => {
      return (
        <TicketStatusDropdown id={row.original.id} ticket={row.original} all />
      );
    },
  },
  {
    header: "Created At",
    accessorKey: "created_at",
    id: "created_at",
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
    cell: ({ row }) => (
      <Link
        href={`/employees/tickets/${row.original.id}`}
        className="flex items-center gap-2"
      >
        <MoreHorizontal className="size-4" />
      </Link>
    ),
    enableHiding: false,
    enableSorting: false,
  },
];

const TicketsTable: FC = () => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  const { data: tickets, isLoading, refetch } = useTickets();

  const table = useReactTable({
    data: tickets || [],
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
    initialState: {
      columnVisibility: {
        created_at: false,
        updated_at: false,
      },
    },
  });

  return isLoading ? (
    <DataTableSkeleton columnCount={columns.length} />
  ) : (
    <div className="flex w-full flex-col gap-4">
      <DataTableToolbar
        table={table}
        searchUsing="user_username"
        dataTableExtract={
          <DataTableExtract data={tickets || []} name="tickets" />
        }
        refetch={refetch}
      />
      <div className="flex gap-3">
        <AssignedToDataTableFacetedFilter
          column={table.getColumn("assigned")}
        />
        <DataTableFacetedFilter
          title="Status"
          column={table.getColumn("status")}
          options={[
            {
              label: "Pending",
              value: "pending",
            },
            {
              label: "Completed",
              value: "completed",
            },
            {
              label: "Failed",
              value: "failed",
            },
          ]}
        />
      </div>
      <DataTable table={table} columnSpan={columns.length} />
      <DataTablePagination table={table} />
    </div>
  );
};

export default TicketsTable;
