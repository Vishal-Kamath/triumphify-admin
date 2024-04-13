import { Employee } from "@/@types/employee";
import { dateFormater } from "@/utils/dateFormater";
import { MRT_ColumnDef } from "material-react-table";

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
];
