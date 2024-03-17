"use client";

import DataTable from "@/components/data-table/data-table";
import DataTableExtract from "@/components/data-table/data-table-extract";
import { DataTablePagination } from "@/components/data-table/data-table-pagination";
import DataTableToolbar from "@/components/data-table/data-table-toolbar";
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton";
import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { AnalyticsListType, useAnalyticsList } from "@/lib/orders";
import { cn } from "@/lib/utils";
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
import { ExternalLink, MoreHorizontal } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { FC, useState } from "react";
import { RxCaretSort } from "react-icons/rx";

const columns: ColumnDef<AnalyticsListType>[] = [
  {
    header: "Product",
    accessorKey: "product_name",
    cell: ({ row }) => {
      return (
        <div className="flex gap-3">
          <Image
            src={row.original.product_image || ""}
            alt={row.original.product_name}
            width={500}
            height={500}
            className="h-16 w-16 rounded-md object-cover object-left"
          />
          <div className="flex max-w-xs items-center justify-start gap-2">
            <h3 className="text-sm font-normal">{row.original.product_name}</h3>
            <Link href={`/products/details/${row.original.product_id}`}>
              <ExternalLink className="h-4 w-4 text-slate-600" />
            </Link>
          </div>
        </div>
      );
    },
  },
  {
    header: ({ column }) => {
      return (
        <button
          className="flex items-center gap-2 border-none bg-transparent p-0 outline-none focus:outline-none"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Total Units sold
          <RxCaretSort className="ml-2 h-4 w-4" />
        </button>
      );
    },
    accessorKey: "total_units_sold",
  },
  {
    header: ({ column }) => {
      return (
        <button
          className="flex items-center gap-2 border-none bg-transparent p-0 outline-none focus:outline-none"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Total Discount
          <RxCaretSort className="ml-2 h-4 w-4" />
        </button>
      );
    },
    accessorKey: "total_discounted_price",
  },
  {
    header: ({ column }) => {
      return (
        <button
          className="flex items-center gap-2 border-none bg-transparent p-0 outline-none focus:outline-none"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Total Revenue
          <RxCaretSort className="ml-2 h-4 w-4" />
        </button>
      );
    },
    accessorKey: "total_sales",
  },
  {
    accessorKey: "id",
    header: "",
    enableHiding: false,
    enableSorting: false,
    cell: ({ row }) => (
      <div className="flex">
        <Link
          href={`/orders/analytics/${row.original.product_id}`}
          className={cn(buttonVariants({ variant: "ghost" }))}
        >
          <MoreHorizontal className="h-4 w-4" />
        </Link>
      </div>
    ),
  },
];

const AnalyticsPageTable: FC = () => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  const { data: analytics, isLoading, refetch } = useAnalyticsList();

  const table = useReactTable({
    data: analytics || [],
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
        searchUsing="product_name"
        refetch={refetch}
        dataTableExtract={
          <DataTableExtract data={analytics || []} name="order-analytics" />
        }
      />
      <DataTable table={table} columnSpan={columns.length} />
      <DataTablePagination table={table} />
    </div>
  );
};

export default AnalyticsPageTable;
