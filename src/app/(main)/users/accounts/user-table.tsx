"use client";

import { FC, useMemo } from "react";
import {
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
import { IconButton, Tooltip } from "@mui/material";
import { Refresh } from "@mui/icons-material";

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
  const table = useMaterialReactTable({
    columns,
    data: users || [],
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

  return <MaterialReactTable table={table} />;
};

export default UserTable;
