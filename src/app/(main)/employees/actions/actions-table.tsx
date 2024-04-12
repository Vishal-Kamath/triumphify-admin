"use client";

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
import { FC, useState } from "react";
import DataTable from "@/components/data-table/data-table";
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton";
import { DataTablePagination } from "@/components/data-table/data-table-pagination";
import DataTableToolbar from "@/components/data-table/data-table-toolbar";
import DataTableExtract from "@/components/data-table/data-table-extract";
import { invalidateAllActions, useActions } from "@/lib/lead";
import { Button, buttonVariants } from "@/components/ui/button";
import { PencilLine, Trash2 } from "lucide-react";
import ConfirmDelete from "@/components/misc/confirmDelete";
import { cn } from "@/lib/utils";
import axios from "axios";
import { useToast } from "@/components/ui/use-toast";
import Link from "next/link";

const DeleteActionsButton: FC<{ actionId: string; actionName: string }> = ({
  actionId,
  actionName,
}) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  function deleteAction() {
    setLoading(true);
    axios
      .delete(`${process.env.ENDPOINT}/api/leads/actions/${actionId}`, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      })
      .then((res) => {
        setLoading(false);
        invalidateAllActions();
        toast({
          title: res.data.title,
          description: res.data.description,
          variant: res.data.type,
        });
      })
      .catch((err) => {
        setLoading(false);
        toast({
          title: err?.response?.data?.title || "Error",
          description: err?.response?.data?.description,
          variant: err?.response?.data?.type || "error",
        });
      });
  }

  return (
    <ConfirmDelete
      className={cn(
        buttonVariants({ variant: "ghost" }),
        "text-slate-500 size-9 p-0 flex justify-center items-center hover:text-red-800 hover:bg-red-50"
      )}
      confirmText={actionName}
      deleteFn={deleteAction}
    >
      <Trash2 className="size-4" />
    </ConfirmDelete>
  );
};

const columns: ColumnDef<Action>[] = [
  {
    id: "id",
    header: "Id",
    accessorKey: "id",
  },
  {
    id: "title",
    header: "Title",
    accessorKey: "title",
  },
  {
    id: "subject",
    header: "Subject",
    accessorKey: "subject",
  },
  {
    id: "body",
    header: "Body",
    accessorKey: "body",
    cell(props) {
      return (
        <div className="truncate max-w-[300px]">
          {props.row.getValue("body")}
        </div>
      );
    },
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
    header: "Actions",
    id: "actions",
    cell: ({ row }) => (
      <div className="flex gap-2">
        <Link
          href={`/employees/actions/${row.original.id}`}
          className={cn(
            buttonVariants({ variant: "ghost" }),
            "text-slate-500 size-9 p-0 flex justify-center items-center hover:text-slate-800"
          )}
        >
          <PencilLine className="size-4" />
        </Link>
        <DeleteActionsButton
          actionId={row.original.id}
          actionName={row.original.title}
        />
      </div>
    ),
  },
];

const ActionsTable: FC = () => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  const { data: actions, isLoading, refetch } = useActions();

  const table = useReactTable({
    data: actions || [],
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
        searchUsing="title"
        dataTableExtract={
          <DataTableExtract data={actions || []} name="actions" />
        }
        refetch={refetch}
      />
      <DataTable table={table} columnSpan={columns.length} />
      <DataTablePagination table={table} />
    </div>
  );
};

export default ActionsTable;
