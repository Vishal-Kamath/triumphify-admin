"use client";

import { ProductReviewTableType } from "@/@types/product";
import { DataTablePagination } from "@/components/data-table/data-table-pagination";
import DataTableToolbar from "@/components/data-table/data-table-toolbar";
import DataTable from "@/components/data-table/data-table";
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton";
import { buttonVariants } from "@/components/ui/button";
import { useReviews } from "@/lib/reviews";
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
import { numberFormater } from "@/utils/numberFormater";

const columns: ColumnDef<ProductReviewTableType>[] = [
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
    cell: ({ row }) => (
      <div className="flex gap-3 items-center">
        <Image
          src={(row.original.product_images as string[])[0]}
          alt={row.getValue("name")}
          className="size-14 object-contain flex-shrink-0"
          width={200}
          height={200}
        />
        <div className="flex flex-col gap-1">
          <h3>{row.original.product_name}</h3>
          <Link
            href={`/products/details/${row.original.product_id}?redirect=${encodeURIComponent("/products/reviews")}`}
            className="text-xs flex gap-1 text-slate-500 hover:underline hover:text-slate-800"
          >
            <span>View Product</span>
            <ExternalLink className="size-3" />
          </Link>
        </div>
      </div>
    ),
    accessorKey: "product_name",
    enableHiding: false,
    enableSorting: true,
  },
  {
    header: ({ column }) => {
      return (
        <button
          className="flex items-center gap-2 border-none bg-transparent p-0 outline-none focus:outline-none"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Total Reviews
          <RxCaretSort className="ml-2 h-4 w-4" />
        </button>
      );
    },
    id: "Total Reviews",
    accessorKey: "count",
    cell: ({ row }) => {
      return numberFormater(Number(row.original.count));
    },
  },
  {
    header: ({ column }) => {
      return (
        <button
          className="flex items-center gap-2 border-none bg-transparent p-0 outline-none focus:outline-none"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Average Rating
          <RxCaretSort className="ml-2 h-4 w-4" />
        </button>
      );
    },
    id: "Average Rating",
    accessorKey: "avg_rating",
    cell: ({ row }) => {
      return Number(row.original.avg_rating).toFixed(1);
    },
  },
  {
    accessorKey: "id",
    header: "",
    enableHiding: false,
    enableSorting: false,
    cell: ({ row }) => (
      <div className="flex">
        <Link
          href={`/products/reviews/${row.original.product_id}`}
          className={cn(buttonVariants({ variant: "ghost" }))}
        >
          <MoreHorizontal className="h-4 w-4" />
        </Link>
      </div>
    ),
  },
];

const ReviewsTable: FC = () => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  const { data: reviews, isLoading, refetch } = useReviews();

  const table = useReactTable({
    data: reviews || [],
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

export default ReviewsTable;
