import { Employee } from "@/@types/employee";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { dateFormater } from "@/utils/dateFormater";
import { MoreHorizontal } from "lucide-react";
import { MRT_ColumnDef } from "material-react-table";
import Link from "next/link";

export const columns: MRT_ColumnDef<Employee>[] = [
  {
    header: "Username",
    accessorKey: "username",
    enableHiding: false,
    enableSorting: true,
  },
  {
    header: "Email",
    accessorKey: "email",
  },
  {
    header: "Role",
    id: "role",
    accessorKey: "role",
    filterVariant: "select",
    filterSelectOptions: ["Admin", "Employee"],
    Cell: ({ row }) => {
      return (
        <Badge
          className={cn(
            "capitalize",
            row.original.role === "admin"
              ? "bg-blue-100 text-blue-600 hover:bg-blue-200 border-1 border-blue-500"
              : "bg-green-100 text-green-600 hover:bg-green-200 border-1 border-green-500"
          )}
        >
          {row.original.role}
        </Badge>
      );
    },
  },
  {
    header: "Rate ($/hr)",
    accessorKey: "rate",
    filterVariant: "range-slider",
    filterFn: "betweenInclusive",
    muiFilterSliderProps: ({ table }) => {
      let min = 0;
      let max = 0;
      table.getCoreRowModel().rows.forEach((row) => {
        if (row.original.rate < min) min = row.original.rate;
        if (row.original.rate > max) max = row.original.rate;
      });

      return {
        marks: true,
        min,
        max,
        valueLabelFormat: (value) =>
          value.toLocaleString("en-US", {
            style: "currency",
            currency: "USD",
          }),
      };
    },
    accessorFn: (originalRow) => Number(originalRow.rate),
    Cell: ({ cell }) =>
      cell.getValue<number>().toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
      }),
  },
  {
    header: "Status",
    accessorFn: (originalRow) =>
      originalRow.status === "active" ? "true" : "false", //must be strings
    id: "isActive",
    filterVariant: "checkbox",
    Cell: ({ cell }) => (cell.getValue() === "true" ? "Active" : "Inactive"),
    size: 170,
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
        href={`/employees/details/${row.getValue("id")}`}
        className={cn(buttonVariants({ variant: "ghost" }))}
      >
        <MoreHorizontal />
      </Link>
    ),
  },
];
