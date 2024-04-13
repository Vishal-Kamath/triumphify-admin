"use client";

import { FC, useMemo } from "react";
import { useEmployees } from "@/lib/employee";
import { useMe } from "@/lib/auth";
import { columns as superadminColumns } from "./superadmin-column-def";
import { columns as adminColumns } from "./admin-column-def";
import { mkConfig, generateCsv, download } from "export-to-csv";
import {
  MRT_ColumnDef,
  MRT_Row,
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import { Employee } from "@/@types/employee";
import { Button, IconButton, Tooltip } from "@mui/material";
import { Refresh, FileDownload } from "@mui/icons-material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

const csvConfig = mkConfig({
  fieldSeparator: ",",
  decimalSeparator: ".",
  filename: "employees-data",
  useKeysAsHeaders: true,
});

const EmployeesTable: FC = () => {
  const { data: me, isLoading: isMeLoading } = useMe();
  const { data: employees, isLoading, refetch, isRefetching } = useEmployees();

  const columns = useMemo<MRT_ColumnDef<Employee>[]>(
    () => (me?.role === "superadmin" ? superadminColumns : adminColumns),
    []
  );

  const handleExportRows = (rows: MRT_Row<Employee>[]) => {
    const rowData = rows.map((row) => row.original);
    const csv = generateCsv(csvConfig)(rowData);
    download(csvConfig)(csv);
  };

  const handleExportData = () => {
    if (!employees) return;
    const csv = generateCsv(csvConfig)(employees);
    download(csvConfig)(csv);
  };

  const table = useMaterialReactTable({
    columns,
    data: employees || [],
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
      isLoading: isLoading || isMeLoading,
    },
    enableRowSelection: me?.role === "superadmin",
  });

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <MaterialReactTable table={table} />
    </LocalizationProvider>
  );
};

export default EmployeesTable;
