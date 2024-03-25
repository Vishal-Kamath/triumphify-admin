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
import DataTableExtract from "@/components/data-table/data-table-extract";
import { DataTableFacetedFilter } from "@/components/data-table/data-table-faceted-filter";

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
    id: "Product Name",
    cell: ({ row }) => (
      <div className="flex gap-3 min-w-[15rem] items-center">
        <Image
          src={row.original.product_image || ""}
          alt={row.original.product_name}
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
    id: "Product Price",
    accessorKey: "product_variation_price",
  },
  {
    header: "Quantity",
    id: "Quantity",
    accessorKey: "product_quantity",
  },
  {
    header: "Discount",
    id: "Discount",
    accessorKey: "product_variation_discount_final_price",
  },
  {
    header: "Total Price",
    id: "Total Price",
    accessorKey: "product_variation_final_price",
  },
  {
    header: "Status",
    id: "Status",
    accessorKey: "status",
    cell: ({ row }) => (
      <span className="text-xs text-nowrap capitalize px-2 py-1 border-1 border-neutral-500 rounded-full text-neutral-800 bg-neutral-50">
        {row.original.status}
      </span>
    ),
  },
  {
    header: "Created At",
    id: "Created At",
    accessorKey: "created_at",
    cell: ({ row }) => dateFormater(new Date(row.original.created_at)),
  },
  {
    header: "Updated At",
    id: "Updated At",
    accessorKey: "updated_at",
    cell: ({ row }) =>
      row.original.updated_at
        ? dateFormater(new Date(row.original.updated_at))
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
        searchUsing="Product Name"
        dataTableExtract={
          <DataTableExtract data={orders || []} name="orders" />
        }
        refetch={refetch}
      />
      <div className="flex justify-between">
        <DataTableFacetedFilter
          column={table.getColumn("Status")}
          options={[
            "pending",
            "confirmed",
            "out for delivery",
            "delivered",
            "return approved",
            "out for pickup",
            "picked up",
            "refunded",
          ].map((status) => ({
            label: status[0].toUpperCase() + status.slice(1),
            value: status,
          }))}
          title="Status"
        />
      </div>
      <DataTable table={table} columnSpan={columns.length} />
      <DataTablePagination table={table} />
    </div>
  );
};

export default OrderTable;
