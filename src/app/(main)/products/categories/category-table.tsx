"use client";

import { Category } from "@/@types/category";
import DataTable from "@/components/data-table/data-table";
import { DataTablePagination } from "@/components/data-table/data-table-pagination";
import DataTableToolbar from "@/components/data-table/data-table-toolbar";
import ConfirmDelete from "@/components/misc/confirmDelete";
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton";
import { buttonVariants } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { invalidateAllCategories, useCategories } from "@/lib/categories";
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
import { PencilLine, Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { FC, useState } from "react";
import { RxCaretSort } from "react-icons/rx";

const CategoryTable: FC = () => {
  const { toast } = useToast();

  const handleDeleteCategory = (id: string) => {
    axios
      .delete(`${process.env.ENDPOINT}/api/categories/${id}`, {
        withCredentials: true,
      })
      .then((res) => {
        toast({
          title: res.data.title,
          description: res.data.description,
          variant: res.data.type,
        });
        invalidateAllCategories();
      })
      .catch((err) => {
        toast({
          title: err?.response?.data?.title || "Error",
          description: err?.response?.data?.description,
          variant: err?.response?.data?.type || "error",
        });
      });
  };

  const columns: ColumnDef<Category>[] = [
    {
      header: "Image",
      accessorKey: "category_image",
      cell: ({ row }) => {
        return row.getValue("category_image") ? (
          <Image
            src={row.getValue("category_image")}
            alt={row.getValue("name")}
            className="size-14 flex-shrink-0 object-contain"
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
      header: "Description",
      accessorKey: "description",
      cell: ({ row }) => (
        <div className="text-xs max-w-sm">
          {row.getValue("description") || "N/A"}
        </div>
      ),
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
            href={`/products/categories/${row.getValue("id")}`}
            className={cn(buttonVariants({ variant: "ghost" }))}
          >
            <PencilLine className="h-4 w-4" />
          </Link>
          <ConfirmDelete
            className="flex aspect-square h-10 w-10 items-center justify-center rounded-md hover:bg-red-100 hover:text-red-500"
            confirmText={row.getValue("name")}
            deleteFn={() => handleDeleteCategory(row.getValue("id"))}
          >
            <Trash2 className="h-4 w-4" />
          </ConfirmDelete>
        </div>
      ),
    },
  ];
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  const { data: categories, isLoading, refetch } = useCategories();

  const table = useReactTable({
    data: categories || [],
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
        searchUsing="name"
        actionNodes={
          <Link
            href="/products/categories/create"
            className={cn(
              buttonVariants({ variant: "secondary" }),
              "gap-2 hover:bg-fuchsia-100 hover:text-fuchsia-700"
            )}
          >
            <Plus className="h-4 w-4" />
            <span>Create</span>
          </Link>
        }
        refetch={refetch}
      />
      <DataTable table={table} columnSpan={columns.length} />
      <DataTablePagination table={table} />
    </div>
  );
};

export default CategoryTable;
