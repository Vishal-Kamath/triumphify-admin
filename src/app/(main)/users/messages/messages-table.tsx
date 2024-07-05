"use client";

import {
  MRT_ColumnDef,
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import { FC, useContext, useMemo } from "react";
import EditLead from "./edit-lead";
import { Badge } from "@/components/ui/badge";
import { dateFormater } from "@/utils/dateFormater";
import { useLeads } from "@/lib/lead";
import { Button, IconButton, Tooltip } from "@mui/material";
import { Refresh } from "@mui/icons-material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { capitalize } from "lodash";
import {
  ConversationWithLastMessageAndUser,
  Socket,
} from "@/components/providers/socket.provider";
import { User } from "@/@types/user";
import Link from "next/link";

const statusStyles = {
  new: "bg-blue-50 border-1 border-blue-500 hover:bg-blue-50 text-blue-600 capitalize",
  ongoing:
    "bg-yellow-50 border-1 border-yellow-500 hover:bg-yellow-50 text-yellow-600 capitalize",
  closed:
    "bg-orange-50 border-1 border-orange-500 hover:bg-orange-50 text-orange-600 capitalize",
};

const MessagesTable: FC = () => {
  const { conversations, getConversationsList } = useContext(Socket);

  const columns = useMemo<MRT_ColumnDef<ConversationWithLastMessageAndUser>[]>(
    () => [
      {
        header: "Username",
        accessorKey: "user.username",
        enableHiding: false,
      },
      {
        header: "Email",
        accessorKey: "user.email",
        enableHiding: false,
      },
      {
        header: "Message",
        accessorKey: "lastMessage.message",
        enableHiding: false,
        Cell: ({ row }) =>
          row.original.lastMessage ? (
            <div className="flex flex-col">
              <span className="font-semibold">
                {row.original.lastMessage.sender === "operator"
                  ? "You"
                  : "Customer"}
              </span>
              <span className="truncate text-slate-700">
                {row.original.lastMessage.msg}
              </span>
            </div>
          ) : null,
      },
      {
        header: "Status",
        accessorKey: "status",
        filterVariant: "select",
        filterSelectOptions: ["New", "Ongoing", "Closed"],
        Cell: ({ row }) => {
          return (
            <Badge
              className={
                row.original.status ? statusStyles[row.original.status] : ""
              }
            >
              {row.original.status}
            </Badge>
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
        accessorKey: "room",
        header: "",
        enableHiding: false,
        enableSorting: false,
        enableColumnFilter: false,
        Cell: ({ row }) => (
          <Link href={`/users/messages/${row.original.room}`}>
            <Button variant="contained">Join</Button>
          </Link>
        ),
      },
    ],
    [conversations],
  );
  const table = useMaterialReactTable({
    columns,
    data: conversations || [],
    muiTablePaperProps: ({ table }) => ({
      elevation: 0,
      style: {
        zIndex: table.getState().isFullScreen ? 1000 : undefined,
      },
    }),
    renderTopToolbarCustomActions: () => (
      <Tooltip arrow title="Refresh Data">
        <IconButton onClick={() => getConversationsList()}>
          <Refresh />
        </IconButton>
      </Tooltip>
    ),
  });
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <MaterialReactTable table={table} />
    </LocalizationProvider>
  );
};

export default MessagesTable;
