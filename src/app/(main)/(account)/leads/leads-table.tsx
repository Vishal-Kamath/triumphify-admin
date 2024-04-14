"use client";

import {
  MRT_ColumnDef,
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import { FC, useMemo } from "react";
import EditLead from "./edit-lead";
import { Badge } from "@/components/ui/badge";
import { dateFormater } from "@/utils/dateFormater";
import { useLeads } from "@/lib/lead";
import { IconButton, Tooltip } from "@mui/material";
import { Refresh } from "@mui/icons-material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { capitalize } from "lodash";

const statusStyles = {
  new: "bg-blue-50 border-1 border-blue-500 hover:bg-blue-50 text-blue-600 capitalize",
  pending:
    "bg-yellow-50 border-1 border-yellow-500 hover:bg-yellow-50 text-yellow-600 capitalize",
  converted:
    "bg-green-50 border-1 border-green-500 hover:bg-green-50 text-green-600 capitalize",
  rejected:
    "bg-red-50 border-1 border-red-500 hover:bg-red-50 text-red-600 capitalize",
};

const EmployeeLeadsTable: FC = () => {
  const { data: leads, isLoading, refetch, isRefetching } = useLeads("pending");

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
        Cell: ({ row }) => <EditLead {...row.original} />,
      },
    ],
    [leads]
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
  });
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <MaterialReactTable table={table} />
    </LocalizationProvider>
  );
};

export default EmployeeLeadsTable;
