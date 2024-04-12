"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import { dateFormater } from "@/utils/dateFormater";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { MoreHorizontal, Trash2 } from "lucide-react";
import { RxCaretSort } from "react-icons/rx";
import { FC, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import DataTable from "@/components/data-table/data-table";
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton";
import { DataTablePagination } from "@/components/data-table/data-table-pagination";
import DataTableToolbar from "@/components/data-table/data-table-toolbar";
import DataTableExtract from "@/components/data-table/data-table-extract";
import { Badge } from "@/components/ui/badge";
import { DataTableFacetedFilter } from "@/components/data-table/data-table-faceted-filter";
import { invalidateAllLeads, useLeads } from "@/lib/lead";
import AssignLeadsDropdown from "./assign-lead-dropdown";
import AssignedToDataTableFacetedFilter from "./assigned-to-filter";
import EditLead from "./edit-lead";
import { useToast } from "@/components/ui/use-toast";
import axios from "axios";
import { AiOutlineLoading } from "react-icons/ai";
import ConfirmDelete from "@/components/misc/confirmDelete";
import LeadsActionButton from "./action-email";
import { Checkbox } from "@/components/ui/checkbox";
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

const DeleteLeadsButton: FC<{ leadId: string; leadName: string }> = ({
  leadId,
  leadName,
}) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  function deleteLead() {
    setLoading(true);
    axios
      .delete(`${process.env.ENDPOINT}/api/leads/${leadId}`, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      })
      .then((res) => {
        setLoading(false);
        invalidateAllLeads();
        toast({
          title: res.data.title,
          description: res.data.description,
          variant: res.data.type,
        });
      })
      .catch((err) => {
        setLoading(false);
        if (!err.response?.data) return;
        toast({
          title: "Error",
          description: err.response.data.description,
          variant: err.response.data.type,
        });
      });
  }
  return loading ? (
    <Button
      disabled
      variant="ghost"
      className="text-slate-600 animate-spin hover:bg-red-50 hover:text-red-700"
    >
      <AiOutlineLoading className="size-4" />
    </Button>
  ) : (
    <ConfirmDelete
      confirmText={leadName}
      deleteFn={deleteLead}
      className={cn(
        buttonVariants({ variant: "ghost" }),
        "text-slate-600 hover:bg-red-50 hover:text-red-700"
      )}
    >
      <Trash2 className="size-4" />
    </ConfirmDelete>
  );
};

const columns: ColumnDef<Lead>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    header: ({ column }) => {
      return (
        <button
          className="flex items-center gap-2 border-none bg-transparent p-0 outline-none focus:outline-none"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Username
          <RxCaretSort className="ml-2 h-4 w-4" />
        </button>
      );
    },
    accessorKey: "name",
    enableHiding: false,
    enableSorting: true,
  },
  {
    header: "Email",
    accessorKey: "email",
  },
  {
    header: "Mobile Number",
    accessorKey: "tel",
  },
  {
    header: "Assigned to",
    accessorKey: "assigned",
    cell: ({ row }) => {
      return <AssignLeadsDropdown assignedTo={row.original.assigned} />;
    },
  },
  {
    header: "Status",
    accessorKey: "status",
    cell: ({ row }) => {
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
    header: "Source",
    accessorKey: "source",
  },
  {
    header: "Last Contacted At",
    accessorKey: "last_contacted",
    cell: ({ row }) =>
      row.getValue("last_contacted")
        ? dateFormater(new Date(row.getValue("last_contacted")))
        : "N/A",
  },
  {
    header: "Created At",
    accessorKey: "created_at",
    id: "created_at",
    cell: ({ row }) => dateFormater(new Date(row.getValue("created_at"))),
  },
  {
    header: "Updated At",
    accessorKey: "updated_at",
    cell: ({ row }) =>
      row.getValue("updated_at")
        ? dateFormater(new Date(row.getValue("updated_at")))
        : "N/A",
  },
  {
    accessorKey: "id",
    header: "",
    enableHiding: false,
    enableSorting: false,
    cell: ({ row }) => (
      <div className="items-center flex">
        <EditLead {...row.original} />
        <DeleteLeadsButton
          leadName={row.original.name || "Delete Lead"}
          leadId={row.original.id}
        />
      </div>
    ),
  },
];

const LeadsTable: FC = () => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  const { data: leads, isLoading, refetch } = useLeads();

  const sourceFilters = Array.from(new Set(leads?.map((lead) => lead.source)));

  const table = useReactTable({
    data: leads || [],
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    state: {
      sorting,
      columnFilters,
      columnVisibility,
    },
    initialState: {
      columnVisibility: {
        created_at: false,
        updated_at: false,
      },
    },
  });

  return isLoading ? (
    <DataTableSkeleton columnCount={columns.length} />
  ) : (
    <div className="flex w-full flex-col gap-4">
      <DataTableToolbar
        table={table}
        searchUsing="name"
        dataTableExtract={<DataTableExtract data={leads || []} name="leads" />}
        refetch={refetch}
      />
      <div className="flex gap-3">
        <AssignedToDataTableFacetedFilter
          column={table.getColumn("assigned")}
        />
        <DataTableFacetedFilter
          title="Status"
          column={table.getColumn("status")}
          options={[
            {
              label: "New",
              value: "new",
            },
            {
              label: "Pending",
              value: "pending",
            },
            {
              label: "Converted",
              value: "converted",
            },
            {
              label: "Rejected",
              value: "rejected",
            },
          ]}
        />
        <DataTableFacetedFilter
          title="Source"
          column={table.getColumn("source")}
          options={sourceFilters.map((source) => ({
            label: capitalize(source),
            value: source,
          }))}
        />
        <LeadsActionButton table={table} />
      </div>
      <DataTable table={table} columnSpan={columns.length} />
      <DataTablePagination table={table} />
    </div>
  );
};

export default LeadsTable;
