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
import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { PencilLine, Trash2 } from "lucide-react";
import ConfirmDelete from "@/components/misc/confirmDelete";
import { useToast } from "@/components/ui/use-toast";
import axios from "axios";
import { invalidateAllAttributes, useAttributes } from "@/lib/attributes";
import { Attribute } from "@/@types/attribute";

const AttributesTable: FC = () => {
  const { toast } = useToast();

  const handleDeleteAttribute = (id: string) => {
    axios
      .delete(`${process.env.ENDPOINT}/api/attributes/${id}`, {
        withCredentials: true,
      })
      .then((res) => {
        toast({
          title: res.data.title,
          description: res.data.description,
          variant: res.data.type,
        });
        invalidateAllAttributes();
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
    data: attributes,
    isLoading,
    refetch,
    isRefetching,
  } = useAttributes();
  const { data: me } = useMe();

  const handleExportRows = (rows: MRT_Row<Attribute>[]) => {
    const rowData = rows.map((row) => row.original);
    handleExtract("attributes-data", rowData);
  };

  const handleExportData = () => {
    if (!attributes) return;
    handleExtract("attributes-data", attributes);
  };

  const columns = useMemo<MRT_ColumnDef<Attribute>[]>(
    () => [
      {
        header: "Name",
        accessorKey: "name",
        enableHiding: false,
      },
      {
        header: "Values",
        accessorKey: "values",
        accessorFn: (originalRow) =>
          originalRow.values.map((val) => val.name).join(", "),
        Cell: ({ row }) => {
          return (
            <div className="text-wrap max-h-28 overflow-y-auto min-w-[300px] max-w-[300px] scrollbar-thin">
              {row.getValue("values")}
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
              href={`/products/attributes/${row.getValue("id")}`}
              className={cn(buttonVariants({ variant: "ghost" }))}
            >
              <PencilLine className="h-4 w-4" />
            </Link>
            <ConfirmDelete
              className="flex aspect-square h-10 w-10 items-center justify-center rounded-md hover:bg-red-100 hover:text-red-500"
              confirmText={row.getValue("name")}
              deleteFn={() => handleDeleteAttribute(row.getValue("id"))}
            >
              <Trash2 className="h-4 w-4" />
            </ConfirmDelete>
          </div>
        ),
      },
    ],
    [attributes]
  );
  const table = useMaterialReactTable({
    columns,
    data: attributes || [],
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
            <Link href="/products/attributes/create">
              <Button
                startIcon={<Add />}
                sx={{
                  "@media (max-width: 768px)": {
                    display: "none",
                  },
                }}
              >
                Add Attribute
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

            <Link href="/products/attributes/create">
              <Tooltip
                sx={{
                  "display": "none",
                  "@media (max-width: 768px)": {
                    display: "block",
                  },
                  "height": "40px",
                }}
                arrow
                title="Add Attribute"
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

export default AttributesTable;