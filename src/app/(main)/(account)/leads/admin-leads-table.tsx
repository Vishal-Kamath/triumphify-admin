"use client";

import {
  MRT_ColumnDef,
  MRT_Row,
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import { FC, useMemo } from "react";
import EditLead from "./admin-edit-lead";
import { Badge } from "@/components/ui/badge";
import { dateFormater } from "@/utils/dateFormater";
import { useLeads } from "@/lib/lead";
import { Button, IconButton, Tooltip } from "@mui/material";
import { FileDownload, Refresh } from "@mui/icons-material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { capitalize } from "lodash";
import { Employee } from "@/@types/employee";
import { useEmployees } from "@/lib/employee";
import DeleteLeadsButton from "./delete-leads";
import { useMe } from "@/lib/auth";
import { handleExtract } from "@/utils/extract";

const statusStyles = {
  new: "bg-blue-50 border-1 border-blue-500 hover:bg-blue-50 text-blue-600 capitalize",
  pending:
    "bg-yellow-50 border-1 border-yellow-500 hover:bg-yellow-50 text-yellow-600 capitalize",
  converted:
    "bg-green-50 border-1 border-green-500 hover:bg-green-50 text-green-600 capitalize",
  rejected:
    "bg-red-50 border-1 border-red-500 hover:bg-red-50 text-red-600 capitalize",
};

function findEmployee(employeeId: string | null, employees: Employee[]) {
  const employee = employees.find((employee) => employee.id === employeeId);
  return employee;
}

const AdminLeadsTable: FC = () => {
  const { data: leads, isLoading, refetch, isRefetching } = useLeads("pending");
  const { data: employees } = useEmployees();
  const { data: me } = useMe();

  const handleExportRows = (rows: MRT_Row<Lead>[]) => {
    const rowData = rows
      .map((row) => row.original)
      .map((row) => {
        row.tel = row.tel.replaceAll("+", "");
        row.assigned =
          findEmployee(row.assigned, employees || [])?.username || row.assigned;
        return row;
      }) as any;
    handleExtract("leads-data", rowData);
  };

  const handleExportData = () => {
    if (!leads) return;
    handleExtract(
      "leads-data",
      leads.map((row) => {
        row.tel = row.tel.replaceAll("+", "");
        row.assigned =
          findEmployee(row.assigned, employees || [])?.username || row.assigned;
        return row;
      })
    );
  };

  const columns = useMemo<MRT_ColumnDef<Lead>[]>(
    () => [
      {
        header: "Username",
        accessorKey: "name",
        enableHiding: false,
      },
      {
        header: "Email",
        accessorKey: "email",
        enableHiding: false,
      },
      {
        header: "Mobile Number",
        accessorKey: "tel",
      },
      {
        header: "Status",
        accessorKey: "status",
        filterVariant: "select",
        filterSelectOptions: ["New", "Pending", "Converted", "Rejected"],
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
        header: "Source",
        accessorKey: "source",
        filterVariant: "select",
        filterSelectOptions:
          Array.from(new Set(leads?.map((lead) => lead.source))).map((val) =>
            capitalize(val)
          ) || [],
        Cell: ({ row }) => capitalize(row.original.source),
      },
      {
        header: "Last Contacted At",
        accessorKey: "last_contacted",
        filterVariant: "date-range",
        accessorFn: (originalRow) =>
          originalRow.last_contacted
            ? new Date(originalRow.last_contacted)
            : "null",
        Cell: ({ row }) =>
          row.getValue("last_contacted") !== "null"
            ? dateFormater(new Date(row.getValue("last_contacted")))
            : "N/A",
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
          <div className="items-center flex">
            <EditLead {...row.original} />
            <DeleteLeadsButton
              leadName={row.original.name || "Delete Lead"}
              leadId={row.original.id}
            />
          </div>
        ),
      },
    ],
    [leads, employees]
  );
  const table = useMaterialReactTable({
    columns,
    data: leads || [],
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
    enableFullScreenToggle: false,
  });
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <MaterialReactTable table={table} />
    </LocalizationProvider>
  );
};

export default AdminLeadsTable;
