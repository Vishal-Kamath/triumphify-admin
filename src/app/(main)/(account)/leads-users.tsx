"use client";

import { useLeads } from "@/lib/lead";
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
import { FC, useState } from "react";
import { RxCaretSort } from "react-icons/rx";
import EditLead from "@/app/(main)/users/leads/edit-lead";
import AdminEditLead from "@/app/(main)/employees/leads/edit-lead";
import DataTableToolbar from "@/components/data-table/data-table-toolbar";
import DataTable from "@/components/data-table/data-table";
import { DataTablePagination } from "@/components/data-table/data-table-pagination";
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton";
import AssignLeadsDropdown from "../employees/leads/assign-lead-dropdown";

const adminColumns: ColumnDef<Lead>[] = [
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
    header: "Assigned to",
    accessorKey: "assigned",
    cell: ({ row }) => {
      return <AssignLeadsDropdown assignedTo={row.original.assigned} />;
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
  // {
  //   header: "Created At",
  //   accessorKey: "created_at",
  //   cell: ({ row }) => dateFormater(new Date(row.getValue("created_at"))),
  // },
  // {
  //   header: "Updated At",
  //   accessorKey: "updated_at",
  //   cell: ({ row }) =>
  //     row.getValue("updated_at")
  //       ? dateFormater(new Date(row.getValue("updated_at")))
  //       : "N/A",
  // },
  {
    accessorKey: "id",
    header: "",
    enableHiding: false,
    enableSorting: false,
    cell: ({ row }) => <AdminEditLead {...row.original} />,
  },
];

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
  // {
  //   header: "Created At",
  //   accessorKey: "created_at",
  //   cell: ({ row }) => dateFormater(new Date(row.getValue("created_at"))),
  // },
  // {
  //   header: "Updated At",
  //   accessorKey: "updated_at",
  //   cell: ({ row }) =>
  //     row.getValue("updated_at")
  //       ? dateFormater(new Date(row.getValue("updated_at")))
  //       : "N/A",
  // },
  {
    accessorKey: "id",
    header: "",
    enableHiding: false,
    enableSorting: false,
    cell: ({ row }) => <EditLead {...row.original} />,
  },
];

const LeadsSection: FC<{ role: "employee" | "admin" | "superadmin" }> = ({
  role,
}) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  const { data: leads, isLoading, refetch } = useLeads("pending");

  const table = useReactTable({
    data: leads || [],
    columns: role === "employee" ? columns : adminColumns,
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
  return (
    <div className="w-full flex-col gap-9 flex">
      <h3 className="text-lg lg:text-xl text-transparent bg-clip-text bg-gradient-to-br from-blue-950 to-blue-700 font-semibold">
        Pending Leads
      </h3>
      {isLoading ? (
        <DataTableSkeleton columnCount={columns.length} />
      ) : (
        <div className="flex w-full flex-col gap-4">
          <DataTableToolbar
            table={table}
            searchUsing="name"
            refetch={refetch}
          />
          <DataTable table={table} columnSpan={columns.length} />
          <DataTablePagination table={table} />
        </div>
      )}
    </div>
  );
};

export default LeadsSection;
