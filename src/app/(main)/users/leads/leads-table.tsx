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
import { Badge } from "@/components/ui/badge";
import { DataTableFacetedFilter } from "@/components/data-table/data-table-faceted-filter";
import { useLeads } from "@/lib/lead";
import EditLead from "./edit-lead";

const statusStyles = {
  new: "bg-blue-50 border-1 border-blue-500 hover:bg-blue-50 text-blue-600 capitalize",
  pending:
    "bg-yellow-50 border-1 border-yellow-500 hover:bg-yellow-50 text-yellow-600 capitalize",
  converted:
    "bg-green-50 border-1 border-green-500 hover:bg-green-50 text-green-600 capitalize",
  rejected:
    "bg-red-50 border-1 border-red-500 hover:bg-red-50 text-red-600 capitalize",
};

const columns: ColumnDef<Lead>[] = [
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
    accessorKey: "name",
    enableHiding: false,
    enableSorting: true,
  },
  {
    header: "Email",
    accessorKey: "email",
  },
  {
    header: "Mobile Number",
    accessorKey: "tel",
  },
  {
    header: "Status",
    accessorKey: "status",
    cell: ({ row }) => {
      return (
        <Badge
          className={
            row.original.status ? statusStyles[row.original.status] : ""
          }
        >
          {row.original.status}
        </Badge>
      );
    },
  },
  {
    header: "Source",
    accessorKey: "source",
  },
  {
    header: "Last Contacted At",
    accessorKey: "last_contacted",
    cell: ({ row }) =>
      row.getValue("last_contacted")
        ? dateFormater(new Date(row.getValue("last_contacted")))
        : "N/A",
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
    cell: ({ row }) => <EditLead {...row.original} />,
  },
];

const LeadsTable: FC = () => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  const { data: leads, isLoading, refetch } = useLeads();

  const table = useReactTable({
    data: leads || [],
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

  return isLoading ? (
    <DataTableSkeleton columnCount={columns.length} />
  ) : (
    <div className="flex w-full flex-col gap-4">
      <DataTableToolbar table={table} searchUsing="name" refetch={refetch} />
      <div className="flex gap-3">
        <DataTableFacetedFilter
          title="Status"
          column={table.getColumn("status")}
          options={[
            {
              label: "New",
              value: "new",
            },
            {
              label: "Pending",
              value: "pending",
            },
            {
              label: "Converted",
              value: "converted",
            },
            {
              label: "Rejected",
              value: "rejected",
            },
          ]}
        />
      </div>
      <DataTable table={table} columnSpan={columns.length} />
      <DataTablePagination table={table} />
    </div>
  );
};

export default LeadsTable;
