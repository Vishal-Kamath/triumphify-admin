"use client";

import {
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
import DataTable from "@/components/data-table/data-table";
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton";
import { DataTablePagination } from "@/components/data-table/data-table-pagination";
import DataTableToolbar from "@/components/data-table/data-table-toolbar";
import DataTableExtract from "@/components/data-table/data-table-extract";
import { useEmployees } from "@/lib/employee";
import { DataTableFacetedFilter } from "@/components/data-table/data-table-faceted-filter";
import { useMe } from "@/lib/auth";
import { columns as superadminColumns } from "./superadmin-column-def";
import { columns as adminColumns } from "./admin-column-def";

const EmployeesTable: FC = () => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  const { data: me, isLoading: isMeLoading } = useMe();
  const { data: employees, isLoading, refetch } = useEmployees();

  const columns = me?.role === "superadmin" ? superadminColumns : adminColumns;

  const table = useReactTable({
    data: employees || [],
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
        searchUsing="username"
        actionNodes={
          me?.role === "superadmin" ? (
            <DataTableFacetedFilter
              column={table.getColumn("role")}
              title={"Role"}
              options={[
                {
                  label: "Admin",
                  value: "admin",
                },
                {
                  label: "Employee",
                  value: "employee",
                },
              ]}
            />
          ) : null
        }
        dataTableExtract={
          me?.role === "superadmin" ? (
            <DataTableExtract data={employees || []} name="employees" />
          ) : null
        }
        refetch={refetch}
      />
      <DataTable table={table} columnSpan={columns.length} />
      <DataTablePagination table={table} />
    </div>
  );
};

export default EmployeesTable;
