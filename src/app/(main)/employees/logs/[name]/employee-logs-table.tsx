"use client";

import { EmployeeLog } from "@/@types/employee";
import DataTable from "@/components/data-table/data-table";
import DataTableExtract from "@/components/data-table/data-table-extract";
import { DataTablePagination } from "@/components/data-table/data-table-pagination";
import DataTableToolbar from "@/components/data-table/data-table-toolbar";
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton";
import { useEmployeeLog } from "@/lib/employee";
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
import { useParams } from "next/navigation";
import { FC, useState } from "react";

const columns: ColumnDef<EmployeeLog>[] = [
  {
    header: "Id",
    accessorKey: "id",
  },
  {
    header: "Employee Id",
    accessorKey: "employee_id",
  },
  {
    header: "Role",
    accessorKey: "employee_role",
  },
  {
    header: "Message",
    accessorKey: "message",
  },
  {
    header: "Type",
    accessorKey: "type",
  },
  {
    header: "Created At",
    accessorKey: "created_at",
    cell: ({ row }) => dateFormater(new Date(row.getValue("created_at")), true),
  },
];

const EmployeeLogsTable: FC = () => {
  const name = useParams()["name"] as string;

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  const { data: logs, isLoading, refetch } = useEmployeeLog(name);

  const table = useReactTable({
    data: logs || [],
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
      <DataTableToolbar
        table={table}
        searchUsing="employee_id"
        refetch={refetch}
        dataTableExtract={
          <DataTableExtract data={logs || []} name={name.replace(".csv", "")} />
        }
      />
      <DataTable table={table} columnSpan={columns.length} />
      <DataTablePagination table={table} />
    </div>
  );
};

export default EmployeeLogsTable;
