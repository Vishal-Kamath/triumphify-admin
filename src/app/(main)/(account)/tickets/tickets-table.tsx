"use client";

import {
  MRT_ColumnDef,
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import { FC, useMemo } from "react";
import { dateFormater } from "@/utils/dateFormater";
import { IconButton, Tooltip } from "@mui/material";
import { Refresh } from "@mui/icons-material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { capitalize } from "lodash";
import Link from "next/link";
import { ExternalLink, MoreHorizontal } from "lucide-react";
import AvatarElement from "@/components/misc/avatar-element";
import { useTickets } from "@/lib/ticket";
import TicketStatusDropdown from "./ticket-status-dropdown";

const EmployeeTicketsTable: FC = () => {
  const {
    data: tickets,
    isLoading,
    refetch,
    isRefetching,
  } = useTickets("pending");

  const columns = useMemo<MRT_ColumnDef<Ticket>[]>(
    () => [
      {
        header: "User",
        accessorKey: "user_username",
        enableHiding: false,
        Cell: ({ row }) => {
          return (
            <div className="flex h-full min-w-[15rem] items-start gap-3">
              <AvatarElement
                image={row.original.user_image}
                username={row.original.user_username}
              />

              <div className="flex flex-col">
                <h3 className="font-medium">{row.original.user_username}</h3>
                <Link
                  href={`/users/accounts/${row.original.user_id}?redirect=${encodeURIComponent("/users/tickets")}`}
                  className="text-xs flex gap-1 text-slate-500 hover:underline hover:text-slate-800"
                >
                  <span>View User</span>
                  <ExternalLink className="size-3" />
                </Link>
              </div>
            </div>
          );
        },
      },
      {
        header: "Ticket",
        id: "Ticket",
        accessorKey: "title",
        Cell: ({ row }) => {
          return (
            <div className="flex w-full min-w-[24rem] max-w-sm overflow-y-auto max-h-14 flex-col gap-1">
              <h3 className="text-[16px] font-medium">{row.original.title}</h3>
              <p className="text-xs w-full truncate text-wrap h-full text-slate-500">
                {row.original.description}
              </p>
            </div>
          );
        },
      },
      {
        header: "Status",
        accessorKey: "status",
        filterVariant: "select",
        filterSelectOptions: ["Pending", "Completed", "Failed"],
        Cell: ({ row }) => {
          return (
            <TicketStatusDropdown
              id={row.original.id}
              ticket={row.original}
              all
            />
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
          <Link
            href={`/users/tickets/${row.original.id}?redirect=${encodeURIComponent("/")}`}
            className="flex items-center gap-2"
          >
            <MoreHorizontal className="size-4" />
          </Link>
        ),
      },
    ],
    [tickets]
  );
  const table = useMaterialReactTable({
    columns,
    data: tickets || [],
    muiTablePaperProps: ({ table }) => ({
      elevation: 0,
      style: {
        zIndex: table.getState().isFullScreen ? 1000 : undefined,
      },
    }),
    renderTopToolbarCustomActions: () => (
      <Tooltip arrow title="Refresh Data">
        <IconButton onClick={() => refetch()}>
          <Refresh />
        </IconButton>
      </Tooltip>
    ),
    state: {
      showProgressBars: isRefetching,
      isLoading,
    },
    enableFullScreenToggle: false,
  });
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <MaterialReactTable table={table} />
    </LocalizationProvider>
  );
};

export default EmployeeTicketsTable;
