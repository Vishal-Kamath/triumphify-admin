"use client";

import {
  MRT_ColumnDef,
  MRT_Row,
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import { FC, useMemo, useState } from "react";
import { dateFormater } from "@/utils/dateFormater";
import { Button, IconButton, Tooltip } from "@mui/material";
import { FileDownload, Refresh } from "@mui/icons-material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { capitalize } from "lodash";
import Link from "next/link";
import { ExternalLink, MoreHorizontal, PencilLine, Trash2 } from "lucide-react";
import AvatarElement from "@/components/misc/avatar-element";
import { useMe } from "@/lib/auth";
import { handleExtract } from "@/utils/extract";
import { invalidateAllActions, useActions } from "@/lib/lead";
import { useToast } from "@/components/ui/use-toast";
import axios from "axios";
import ConfirmDelete from "@/components/misc/confirmDelete";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

const DeleteActionsButton: FC<{ actionId: string; actionName: string }> = ({
  actionId,
  actionName,
}) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  function deleteAction() {
    setLoading(true);
    axios
      .delete(`${process.env.ENDPOINT}/api/leads/actions/${actionId}`, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      })
      .then((res) => {
        setLoading(false);
        invalidateAllActions();
        toast({
          title: res.data.title,
          description: res.data.description,
          variant: res.data.type,
        });
      })
      .catch((err) => {
        setLoading(false);
        toast({
          title: err?.response?.data?.title || "Error",
          description: err?.response?.data?.description,
          variant: err?.response?.data?.type || "error",
        });
      });
  }

  return (
    <ConfirmDelete
      className={cn(
        buttonVariants({ variant: "ghost" }),
        "text-slate-500 size-9 p-0 flex justify-center items-center hover:text-red-800 hover:bg-red-50"
      )}
      confirmText={actionName}
      deleteFn={deleteAction}
    >
      <Trash2 className="size-4" />
    </ConfirmDelete>
  );
};

const ActionsTable: FC = () => {
  const { data: actions, isLoading, refetch, isRefetching } = useActions();
  const { data: me } = useMe();

  const handleExportRows = (rows: MRT_Row<Action>[]) => {
    const rowData = rows.map((row) => row.original);
    handleExtract("actions-data", rowData);
  };

  const handleExportData = () => {
    if (!actions) return;
    handleExtract("actions-data", actions);
  };

  const columns = useMemo<MRT_ColumnDef<Action>[]>(
    () => [
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
        Cell(props) {
          return (
            <div className="text-wrap max-h-28 overflow-y-auto min-w-[300px] max-w-[300px] scrollbar-thin">
              {props.row.getValue("subject")}
            </div>
          );
        },
      },
      {
        id: "body",
        header: "Body",
        accessorKey: "body",
        Cell(props) {
          return (
            <div className="text-wrap max-h-28 overflow-y-auto min-w-[300px] max-w-[300px] scrollbar-thin">
              {props.row.getValue("body")}
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
        enableSorting: false,
        enableColumnFilter: false,
        Cell: ({ row }) => (
          <div className="flex gap-2">
            <Link
              href={`/employees/actions/${row.original.id}`}
              className={cn(
                buttonVariants({ variant: "ghost" }),
                "text-slate-500 size-9 p-0 flex justify-center items-center hover:text-slate-800"
              )}
            >
              <PencilLine className="size-4" />
            </Link>
            <DeleteActionsButton
              actionId={row.original.id}
              actionName={row.original.title}
            />
          </div>
        ),
      },
    ],
    [actions]
  );
  const table = useMaterialReactTable({
    columns,
    data: actions || [],
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

export default ActionsTable;