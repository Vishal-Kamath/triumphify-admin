"use client";

import { Product } from "@/@types/product";
import DataTable from "@/components/data-table/data-table";
import { DataTablePagination } from "@/components/data-table/data-table-pagination";
import DataTableToolbar from "@/components/data-table/data-table-toolbar";
import ConfirmDelete from "@/components/misc/confirmDelete";
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton";
import { buttonVariants } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { invalidateAllProducts, useProducts } from "@/lib/products";
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
import axios from "axios";
import { ExternalLink, PencilLine, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { FC, useState } from "react";
import { RxCaretSort } from "react-icons/rx";
import ProductMoreDropdown from "./more-dropdown";

const columns: ColumnDef<Product>[] = [
  {
    header: "Image",
    accessorKey: "product_images",
    cell: ({ row }) => {
      return (row.getValue("product_images") as string[]).length ? (
        <Image
          src={(row.getValue("product_images") as string[])[0]}
          alt={row.getValue("name")}
          className="w-full max-w-[10rem]"
          width={200}
          height={200}
        />
      ) : (
        "N/A"
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
          Name
          <RxCaretSort className="ml-2 h-4 w-4" />
        </button>
      );
    },
    accessorKey: "name",
    enableHiding: false,
    enableSorting: true,
  },
  {
    header: "Brand Name",
    accessorKey: "brand_name",
  },
  {
    header: "Category",
    accessorKey: "category",
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
      <ProductMoreDropdown
        id={row.original.id}
        name={row.original.name}
        slug={row.original.slug}
      />
    ),
  },
];

const ProductsTable: FC = () => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  const { data: products, isLoading, refetch } = useProducts();

  const table = useReactTable({
    data: products || [],
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
      <DataTable table={table} columnSpan={columns.length} />
      <DataTablePagination table={table} />
    </div>
  );
};

export default ProductsTable;
