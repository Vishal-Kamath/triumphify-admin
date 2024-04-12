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
import { FC, useState } from "react";
import DataTable from "@/components/data-table/data-table";
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton";
import { DataTablePagination } from "@/components/data-table/data-table-pagination";
import DataTableToolbar from "@/components/data-table/data-table-toolbar";
import DataTableExtract from "@/components/data-table/data-table-extract";
import { useActions } from "@/lib/lead";

const columns: ColumnDef<Action>[] = [
  {
    id: "id",
    header: "Id",
    accessorKey: "id",
  },
  {
    id: "title",
    header: "Title",
    accessorKey: "title",
  },
  {
    id: "subject",
    header: "Subject",
    accessorKey: "subject",
  },
  {
    id: "body",
    header: "Body",
    accessorKey: "body",
    cell(props) {
      return (
        <div className="truncate max-w-[300px]">
          {props.row.getValue("body")}
        </div>
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
];

const ActionsTable: FC = () => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  const { data: actions, isLoading, refetch } = useActions();

  const table = useReactTable({
    data: actions || [],
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
        searchUsing="title"
        dataTableExtract={
          <DataTableExtract data={actions || []} name="actions" />
        }
        refetch={refetch}
      />
      <DataTable table={table} columnSpan={columns.length} />
      <DataTablePagination table={table} />
    </div>
  );
};

export default ActionsTable;
