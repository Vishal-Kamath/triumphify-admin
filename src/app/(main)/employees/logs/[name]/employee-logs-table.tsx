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
import { Employee, EmployeeLog } from "@/@types/employee";
import { useEmployeeLog, useEmployees, useSuperadmins } from "@/lib/employee";
import { handleExtract } from "@/utils/extract";
import { useParams } from "next/navigation";

function findEmployee(employeeId: string | null, employees: Employee[]) {
  const employee = employees.find((employee) => employee.id === employeeId);
  return employee;
}

const EmployeeLogsTable: FC = () => {
  const name = useParams()["name"] as string;
  const { data: logs, isLoading, refetch, isRefetching } = useEmployeeLog(name);
  const { data: employees } = useEmployees();
  const { data: superAdmins } = useSuperadmins();
  const totalEmployeesList = employees?.concat(superAdmins || []);

  const handleExportRows = (rows: MRT_Row<EmployeeLog>[]) => {
    const rowData = rows
      .map((row) => row.original)
      .map((row) => {
        row.employee_id =
          findEmployee(row.employee_id, totalEmployeesList || [])?.username ||
          row.employee_id;
        return row;
      }) as any;
    handleExtract("logs-data", rowData);
  };

  const handleExportData = () => {
    if (!logs) return;
    handleExtract(
      "logs-data",
      logs.map((row) => {
        row.employee_id =
          findEmployee(row.employee_id, totalEmployeesList || [])?.username ||
          row.employee_id;
        return row;
      })
    );
  };

  const columns = useMemo<MRT_ColumnDef<EmployeeLog>[]>(
    () => [
      {
        header: "Employee",
        accessorKey: "employee_id",
        filterVariant: "select",
        filterSelectOptions:
          totalEmployeesList?.map((employee) => ({
            label: employee.username || "NA",
            value: employee.id,
          })) || [],
        accessorFn: (originalRow) => originalRow.employee_id,
        Cell: ({ row }) => {
          const employee = findEmployee(
            row.original.employee_id,
            totalEmployeesList || []
          );
          return employee ? (
            <div className="flex flex-col">
              <h4 className="text-sm text-slate-800">{employee.username}</h4>
              <p className="truncate text-xs text-slate-500">
                {employee.email}
              </p>
            </div>
          ) : (
            "Not Found"
          );
        },
      },
      {
        header: "Role",
        accessorKey: "employee_role",
        filterVariant: "select",
        filterSelectOptions: ["Superadmin", "Admin", "Employee"],
      },
      {
        header: "Message",
        accessorKey: "message",
      },
      {
        header: "Type",
        accessorKey: "type",
      },
      {
        header: "Created At",
        accessorKey: "created_at",
        filterVariant: "date-range",
        accessorFn: (originalRow) => new Date(originalRow.created_at),
        Cell: ({ row }) => dateFormater(new Date(row.getValue("created_at"))),
      },
    ],
    [logs, totalEmployeesList]
  );
  const table = useMaterialReactTable({
    columns,
    data: logs || [],
    muiTablePaperProps: ({ table }) => ({
      elevation: 0,
      style: {
        zIndex: table.getState().isFullScreen ? 1000 : undefined,
      },
    }),
    renderTopToolbarCustomActions: ({ table }) => (
      <div className="flex gap-2">
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
              !table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()
            }
            onClick={() => handleExportRows(table.getSelectedRowModel().rows)}
          >
            <FileDownload className="-translate-y-2" />
          </IconButton>
        </Tooltip>
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
    enableRowSelection: true,
  });
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <MaterialReactTable table={table} />
    </LocalizationProvider>
  );
};

export default EmployeeLogsTable;