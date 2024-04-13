"use client";

import { FC, useMemo } from "react";
import {
  MRT_Row,
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
} from "material-react-table";
import { User } from "@/@types/user";
import AvatarElement from "@/components/misc/avatar-element";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { dateFormater } from "@/utils/dateFormater";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import { useUsers } from "@/lib/user";
import { Box, Button, IconButton, Tooltip } from "@mui/material";
import { Refresh, FileDownload } from "@mui/icons-material";
import { mkConfig, generateCsv, download } from "export-to-csv";

const csvConfig = mkConfig({
  fieldSeparator: ",",
  decimalSeparator: ".",
  filename: "users-data",
  useKeysAsHeaders: true,
});

const UserTable: FC = () => {
  const columns = useMemo<MRT_ColumnDef<User>[]>(
    () => [
      {
        header: "Email",
        Cell: ({ row }) => (
          <div className="flex gap-3">
            <AvatarElement
              username={row.original.username}
              image={row.original.image}
              className="h-12 w-12"
            />
            <div className="flex flex-col gap-1">
              <span className="max-w-[500px] truncate">
                {row.original.email.length > 30
                  ? row.original.email.slice(0, 27) + "..."
                  : row.original.email}
              </span>
              <Badge
                variant="outline"
                className={cn(
                  row.original.emailVerified
                    ? "border-green-500 bg-green-50 text-green-500"
                    : "border-yellow-500 bg-yellow-50 text-yellow-500",
                  "w-fit font-medium"
                )}
              >
                {row.original.emailVerified ? "Verified" : "Not Verified"}
              </Badge>
            </div>
          </div>
        ),
        accessorKey: "email",
        enableHiding: false,
      },
      {
        header: "Name",
        accessorKey: "username",
        Cell: ({ row }) => row.getValue("username") || "N/A",
      },
      {
        header: "Date of Birth",
        accessorKey: "dateOfBirth",
        Cell: ({ row }) => dateFormater(new Date(row.getValue("dateOfBirth"))),
      },
      {
        header: "Gender",
        accessorKey: "gender",
      },
      {
        header: "Created At",
        accessorKey: "created_at",
        Cell: ({ row }) => dateFormater(new Date(row.getValue("created_at"))),
      },
      {
        header: "Updated At",
        accessorKey: "updated_at",
        Cell: ({ row }) =>
          row.getValue("updated_at")
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
          <div className="flex">
            <Link
              href={`/users/accounts/${row.getValue("id")}`}
              className={cn(buttonVariants({ variant: "ghost" }))}
            >
              <MoreHorizontal className="h-4 w-4" />
            </Link>
          </div>
        ),
      },
    ],
    []
  );

  const { data: users, refetch, isRefetching, isLoading } = useUsers();
  const handleExportRows = (rows: MRT_Row<User>[]) => {
    const rowData = rows.map((row) => row.original);
    const csv = generateCsv(csvConfig)(rowData);
    download(csvConfig)(csv);
  };

  const handleExportData = () => {
    if (!users) return;
    const csv = generateCsv(csvConfig)(users);
    download(csvConfig)(csv);
  };

  const table = useMaterialReactTable({
    columns,
    data: users || [],
    muiTablePaperProps: ({ table }) => ({
      elevation: 0,
      style: {
        zIndex: table.getState().isFullScreen ? 1000 : undefined,
      },
    }),
    renderTopToolbarCustomActions: ({ table }) => (
      <>
        <Box
          sx={{
            display: "flex",
            gap: "16px",
            padding: "8px",
            flexWrap: "wrap",
          }}
        >
          <Button onClick={handleExportData} startIcon={<FileDownload />}>
            Export All Data
          </Button>
          <Button
            disabled={
              !table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()
            }
            onClick={() => handleExportRows(table.getSelectedRowModel().rows)}
            startIcon={<FileDownload />}
          >
            Export Selected Rows
          </Button>
          <Tooltip arrow title="Refresh Data">
            <IconButton onClick={() => refetch()}>
              <Refresh />
            </IconButton>
          </Tooltip>
        </Box>
      </>
    ),
    state: {
      showProgressBars: isRefetching,
      isLoading,
    },
    enableRowSelection: true,
  });

  return <MaterialReactTable table={table} />;
};

export default UserTable;
