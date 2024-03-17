"use client";

import { Banner } from "@/@types/banner";
import DataTable from "@/components/data-table/data-table";
import DataTableExtract from "@/components/data-table/data-table-extract";
import { DataTablePagination } from "@/components/data-table/data-table-pagination";
import DataTableToolbar from "@/components/data-table/data-table-toolbar";
import ConfirmDelete from "@/components/misc/confirmDelete";
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton";
import { buttonVariants } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { invalidateAllBanners, useBanners } from "@/lib/banners";
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
import { MoreHorizontal, Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { FC, useState } from "react";

const BannerTable: FC<{ type: "main" | "sub" }> = ({ type }) => {
  const { toast } = useToast();

  const handleDeleteBanner = (id: string) => {
    axios
      .delete(`${process.env.ENDPOINT}/api/banners/${id}`, {
        withCredentials: true,
      })
      .then((res) => {
        toast({
          title: res.data.title,
          description: res.data.description,
          variant: res.data.type,
        });
        invalidateAllBanners(type);
      })
      .catch((err) => {
        toast({
          title: err?.response?.data?.title || "Error",
          description: err?.response?.data?.description,
          variant: err?.response?.data?.type || "error",
        });
      });
  };

  const columns: ColumnDef<Banner>[] = [
    {
      header: "Desktop Image",
      accessorKey: "banner_image_desktop",
      cell: ({ row }) => {
        return row.getValue("banner_image_desktop") ? (
          <Image
            src={row.getValue("banner_image_desktop")}
            alt={row.getValue("name")}
            className="w-full max-w-sm"
            width={200}
            height={200}
          />
        ) : (
          "N/A"
        );
      },
    },
    {
      header: "Mobile Image",
      accessorKey: "banner_image_mobile",
      cell: ({ row }) => {
        return row.getValue("banner_image_mobile") ? (
          <Image
            src={row.getValue("banner_image_mobile")}
            alt={row.getValue("name")}
            className="w-full max-w-sm"
            width={200}
            height={200}
          />
        ) : (
          "N/A"
        );
      },
    },
    {
      header: "Published",
      accessorKey: "is_published",
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
        <div className="flex gap-2">
          <Link
            href={`/banners/${type}/${row.getValue("id")}`}
            className={cn(buttonVariants({ variant: "ghost" }))}
          >
            <MoreHorizontal />
          </Link>
          <ConfirmDelete
            className="flex aspect-square h-10 w-10 items-center justify-center rounded-md hover:bg-red-100 hover:text-red-500"
            confirmText="Delete banner"
            deleteFn={() => handleDeleteBanner(row.getValue("id"))}
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

  const { data: banners, isLoading, refetch } = useBanners(type);

  const table = useReactTable({
    data: banners || [],
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
            href={`/banners/${type}/create`}
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

export default BannerTable;
