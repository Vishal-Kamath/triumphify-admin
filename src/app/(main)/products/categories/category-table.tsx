"use client";

import {
  MRT_ColumnDef,
  MRT_Row,
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import { FC, useMemo } from "react";
import { dateFormater } from "@/utils/dateFormater";
import { Button, IconButton, Tooltip } from "@mui/material";
import { Add, FileDownload, Refresh } from "@mui/icons-material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useMe } from "@/lib/auth";
import { handleExtract } from "@/utils/extract";
import Image from "next/image";
import { invalidateAllCategories, useCategories } from "@/lib/categories";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { PencilLine, Trash2 } from "lucide-react";
import ConfirmDelete from "@/components/misc/confirmDelete";
import { useToast } from "@/components/ui/use-toast";
import axios from "axios";
import { Category } from "@/@types/category";

const CategoriesTable: FC = () => {
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

  const {
    data: categories,
    isLoading,
    refetch,
    isRefetching,
  } = useCategories();
  const { data: me } = useMe();

  const handleExportRows = (rows: MRT_Row<Category>[]) => {
    const rowData = rows.map((row) => row.original);
    handleExtract("categories-data", rowData);
  };

  const handleExportData = () => {
    if (!categories) return;
    handleExtract("categories-data", categories);
  };

  const columns = useMemo<MRT_ColumnDef<Category>[]>(
    () => [
      {
        header: "Image",
        accessorKey: "category_image",
        Cell: ({ row }) => {
          return (row.getValue("category_image") as string[]).length ? (
            <Image
              src={row.getValue("category_image")}
              alt={row.getValue("name")}
              className="w-full min-h-24 h-full max-w-[10rem]"
              width={200}
              height={200}
            />
          ) : (
            "N/A"
          );
        },
        enableHiding: false,
        enableColumnFilter: false,
        enableColumnFilterModes: false,
        enableSorting: false,
      },
      {
        header: "Name",
        accessorKey: "name",
        enableHiding: false,
      },
      {
        header: "Description",
        accessorKey: "description",
        Cell(props) {
          return (
            <div className="text-wrap max-h-28 overflow-y-auto min-w-[300px] max-w-[300px] scrollbar-thin">
              {props.row.getValue("description")}
            </div>
          );
        },
      },
      {
        header: "Created At",
        accessorKey: "created_at",
        filterVariant: "date-range",
        accessorFn: (originalRow) => new Date(originalRow.created_at),
        Cell: ({ row }) => dateFormater(new Date(row.getValue("created_at"))),
      },
      {
        header: "Updated At",
        accessorKey: "updated_at",
        filterVariant: "date-range",
        accessorFn: (originalRow) =>
          originalRow.updated_at ? new Date(originalRow.updated_at) : "null",
        Cell: ({ row }) =>
          row.getValue("updated_at") !== "null"
            ? dateFormater(new Date(row.getValue("updated_at")))
            : "N/A",
      },
      {
        accessorKey: "id",
        header: "",
        enableHiding: false,
        enableColumnFilter: false,
        enableSorting: false,
        Cell: ({ row }) => (
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
    ],
    [categories]
  );
  const table = useMaterialReactTable({
    columns,
    data: categories || [],
    muiTablePaperProps: ({ table }) => ({
      elevation: 0,
      style: {
        zIndex: table.getState().isFullScreen ? 1000 : undefined,
      },
    }),
    renderTopToolbarCustomActions: ({ table }) => (
      <div className="flex gap-2">
        {me?.role === "superadmin" ? (
          <>
            <Link href="/products/categories/create">
              <Button
                startIcon={<Add />}
                sx={{
                  "@media (max-width: 768px)": {
                    display: "none",
                  },
                }}
              >
                Add Category
              </Button>
            </Link>
            <Button
              onClick={handleExportData}
              className="max-md:hidden"
              startIcon={<FileDownload />}
              sx={{
                "@media (max-width: 768px)": {
                  display: "none",
                },
              }}
            >
              Export All Data
            </Button>
            <Button
              disabled={
                !table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()
              }
              onClick={() => handleExportRows(table.getSelectedRowModel().rows)}
              startIcon={<FileDownload />}
              sx={{
                "@media (max-width: 768px)": {
                  display: "none",
                },
              }}
            >
              Export Selected Rows
            </Button>

            <Link href="/products/categories/create">
              <Tooltip
                sx={{
                  "display": "none",
                  "@media (max-width: 768px)": {
                    display: "block",
                  },
                  "height": "40px",
                }}
                arrow
                title="Add Category"
              >
                <IconButton>
                  <Add className="-translate-y-2" />
                </IconButton>
              </Tooltip>
            </Link>
            <Tooltip
              sx={{
                "display": "none",
                "@media (max-width: 768px)": {
                  display: "block",
                },
                "height": "40px",
              }}
              arrow
              title="Export All Data"
            >
              <IconButton onClick={() => handleExportData()}>
                <FileDownload className="-translate-y-2" />
              </IconButton>
            </Tooltip>
            <Tooltip
              sx={{
                "display": "none",
                "@media (max-width: 768px)": {
                  display: "block",
                },
                "height": "40px",
              }}
              arrow
              title="Export Selected Rows"
            >
              <IconButton
                disabled={
                  !table.getIsSomeRowsSelected() &&
                  !table.getIsAllRowsSelected()
                }
                onClick={() =>
                  handleExportRows(table.getSelectedRowModel().rows)
                }
              >
                <FileDownload className="-translate-y-2" />
              </IconButton>
            </Tooltip>
          </>
        ) : null}
        <Tooltip arrow title="Refresh Data">
          <IconButton
            sx={{
              height: "40px",
            }}
            onClick={() => refetch()}
          >
            <Refresh />
          </IconButton>
        </Tooltip>
      </div>
    ),
    state: {
      showProgressBars: isRefetching,
      isLoading,
    },
    enableRowSelection: me?.role === "superadmin",
  });
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <MaterialReactTable table={table} />
    </LocalizationProvider>
  );
};

export default CategoriesTable;