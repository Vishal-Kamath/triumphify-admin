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
import { FileDownload, Refresh } from "@mui/icons-material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import Link from "next/link";
import { ExternalLink, MoreHorizontal } from "lucide-react";
import AvatarElement from "@/components/misc/avatar-element";
import { useTickets } from "@/lib/ticket";
import { useEmployees } from "@/lib/employee";
import { useMe } from "@/lib/auth";
import { handleExtract } from "@/utils/extract";
import { Employee } from "@/@types/employee";
import TicketStatusDropdown from "./ticket-status-dropdown";

function findEmployee(employeeId: string | null, employees: Employee[]) {
  const employee = employees.find((employee) => employee.id === employeeId);
  return employee;
}

const AdminTicketsTable: FC = () => {
  const {
    data: tickets,
    isLoading,
    refetch,
    isRefetching,
  } = useTickets("pending");
  const { data: employees } = useEmployees();
  const { data: me } = useMe();

  const handleExportRows = (rows: MRT_Row<Ticket>[]) => {
    const rowData = rows
      .map((row) => row.original)
      .map((row) => {
        row.assigned =
          findEmployee(row.assigned, employees || [])?.username || row.assigned;
        return row;
      }) as any;
    handleExtract("tickets-data", rowData);
  };

  const handleExportData = () => {
    if (!tickets) return;
    handleExtract(
      "tickets-data",
      tickets.map((row) => {
        row.assigned =
          findEmployee(row.assigned, employees || [])?.username || row.assigned;
        return row;
      })
    );
  };

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
        header: "Assigned To",
        accessorKey: "assigned",
        filterVariant: "select",
        filterSelectOptions:
          employees
            ?.map((employee) => ({
              label: employee.username || "NA",
              value: employee.id,
            }))
            .concat({
              label: "Not Assigned",
              value: "NA",
            }) || [],
        accessorFn: (originalRow) => originalRow.assigned,
        Cell: ({ row }) => {
          const employee = findEmployee(row.original.assigned, employees || []);
          return employee ? (
            <div className="flex flex-col">
              <h4 className="text-sm text-slate-800">{employee.username}</h4>
              <p className="truncate text-xs text-slate-500">
                {employee.email}
              </p>
            </div>
          ) : (
            "Not Assigned"
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
            href={`/employees/tickets/${row.original.id}?redirect=${encodeURIComponent("/")}`}
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

export default AdminTicketsTable;
