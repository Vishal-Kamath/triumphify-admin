"use client";

import { Order } from "@/@types/order";
import DataTable from "@/components/data-table/data-table";
import { DataTablePagination } from "@/components/data-table/data-table-pagination";
import DataTableToolbar from "@/components/data-table/data-table-toolbar";
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton";
import { buttonVariants } from "@/components/ui/button";
import { useOrders } from "@/lib/orders";
import { cn } from "@/lib/utils";
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
import { ExternalLink, PencilLine } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { FC, useState } from "react";
import { RxCaretSort } from "react-icons/rx";

const columns: ColumnDef<Order>[] = [
  {
    header: ({ column }) => {
      return (
        <button
          className="flex items-center gap-2 border-none bg-transparent p-0 outline-none focus:outline-none"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Product Name
          <RxCaretSort className="ml-2 h-4 w-4" />
        </button>
      );
    },
    accessorKey: "product_name",
    cell: ({ row }) => (
      <div className="flex gap-3 items-center">
        <Image
          src={row.original.product_image || ""}
          alt={row.getValue("name")}
          className="size-14 object-contain flex-shrink-0"
          width={200}
          height={200}
        />
        <div className="flex flex-col gap-1">
          <h3>{row.original.product_name}</h3>
          <Link
            href={`/products/details/${row.original.product_id}?redirect=${encodeURIComponent("/orders/details")}`}
            className="text-xs flex gap-1 text-slate-500 hover:underline hover:text-slate-800"
          >
            <span>View Product</span>
            <ExternalLink className="size-3" />
          </Link>
        </div>
      </div>
    ),
    enableHiding: false,
    enableSorting: true,
  },
  {
    header: "Product Price",
    accessorKey: "product_variation_price",
  },
  {
    header: "Quantity",
    accessorKey: "product_quantity",
  },
  {
    header: "Discount",
    accessorKey: "product_variation_discount_final_price",
  },
  {
    header: "Total Price",
    accessorKey: "product_variation_final_price",
  },
  {
    header: "Status",
    accessorKey: "status",
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
          href={`/orders/details/${row.getValue("id")}`}
          className={cn(buttonVariants({ variant: "ghost" }))}
        >
          <PencilLine className="h-4 w-4" />
        </Link>
      </div>
    ),
  },
];

const OrderTable: FC = () => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  const { data: orders, isLoading, refetch } = useOrders();

  const table = useReactTable({
    data: orders || [],
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
      />
      <DataTable table={table} columnSpan={columns.length} />
      <DataTablePagination table={table} />
    </div>
  );
};

export default OrderTable;
