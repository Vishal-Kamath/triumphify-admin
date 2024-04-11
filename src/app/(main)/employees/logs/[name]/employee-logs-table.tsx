"use client";

import { EmployeeLog } from "@/@types/employee";
import DataTable from "@/components/data-table/data-table";
import DataTableExtract from "@/components/data-table/data-table-extract";
import { DataTablePagination } from "@/components/data-table/data-table-pagination";
import DataTableToolbar from "@/components/data-table/data-table-toolbar";
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton";
import { useEmployeeLog } from "@/lib/employee";
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
import { useParams } from "next/navigation";
import { FC, useState } from "react";
import { RxCaretSort } from "react-icons/rx";
import EmployeeLogsDataTableFacetedFilter from "./employee-filter";
import EmployeeDetailsFromId from "./employee-from-id";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CalendarIcon, ChevronDownIcon, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataTableFacetedFilter } from "@/components/data-table/data-table-faceted-filter";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";

const columns: ColumnDef<EmployeeLog>[] = [
  {
    header: "Id",
    accessorKey: "id",
  },
  {
    header: "Employee Id",
    accessorKey: "employee_id",
    cell: ({ row }) => {
      return <EmployeeDetailsFromId employee_id={row.original.employee_id} />;
    },
  },
  {
    header: "Role",
    accessorKey: "employee_role",
    cell: ({ row }) => row.original.employee_role.replaceAll("-", ""),
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
    header: ({ column }) => {
      return (
        <button
          className="flex items-center gap-2 border-none bg-transparent p-0 outline-none focus:outline-none"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Created At
          <RxCaretSort className="ml-2 h-4 w-4" />
        </button>
      );
    },
    accessorKey: "created_at",
    cell: ({ row }) => dateFormater(new Date(row.getValue("created_at")), true),
  },
];

const EmployeeLogsTable: FC = () => {
  const name = useParams()["name"] as string;

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  const [startDate, setStartDate] = useState(
    new Date(new Date().setMonth(new Date().getMonth() - 1))
  );
  const [endDate, setEndDate] = useState(new Date());

  const {
    data: logs,
    isLoading,
    refetch,
  } = useEmployeeLog(name, startDate, endDate);
  logs?.map((log) => {
    if (log.employee_role === "superadmin") {
      log.employee_role = "supera-dmin";
    }
  });

  const table = useReactTable({
    data: logs || [],
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
  });

  return isLoading ? (
    <DataTableSkeleton columnCount={columns.length} />
  ) : (
    <div className="flex w-full flex-col gap-4">
      <div className="flex items-center justify-between gap-4 max-md:flex-col">
        <div className="flex w-full items-center justify-start gap-2">
          <EmployeeLogsDataTableFacetedFilter
            column={table.getColumn("employee_id")}
          />
          <DataTableFacetedFilter
            column={table.getColumn("employee_role")}
            title={"Role"}
            options={[
              {
                label: "Superadmin",
                value: "supera-dmin",
              },
              {
                label: "Admin",
                value: "admin",
              },
              {
                label: "Employee",
                value: "employee",
              },
            ]}
          />
        </div>

        <div className="w-full overflow-x-auto">
          <div className="flex w-full min-w-fit items-center justify-end gap-2">
            <DataTableExtract
              data={logs || []}
              name={name.replace(".csv", "")}
            />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  Columns <ChevronDownIcon className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {table
                  .getAllColumns()
                  .filter((column) => column.getCanHide())
                  .map((column) => {
                    return (
                      <DropdownMenuCheckboxItem
                        key={column.id}
                        className="capitalize"
                        checked={column.getIsVisible()}
                        onCheckedChange={(value) =>
                          column.toggleVisibility(!!value)
                        }
                      >
                        {column.id}
                      </DropdownMenuCheckboxItem>
                    );
                  })}
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              variant="secondary"
              className="group active:bg-purple-100"
              onClick={() => refetch()}
            >
              <RefreshCw className="h-3 w-3 group-active:animate-spin " />
            </Button>
          </div>
        </div>
      </div>
      <div className="flex justify-end">
        <div className={cn("grid gap-2")}>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="date"
                variant={"outline"}
                className={cn(
                  "w-[300px] justify-start text-left font-normal",
                  !startDate || (!endDate && "text-muted-foreground")
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {startDate ? (
                  endDate ? (
                    <>
                      {format(startDate, "LLL dd, y")} -{" "}
                      {format(endDate, "LLL dd, y")}
                    </>
                  ) : (
                    format(startDate, "LLL dd, y")
                  )
                ) : (
                  <span>Pick a date</span>
                )}
                <RxCaretSort className="ml-auto h-4 w-4 text-slate-600" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={startDate}
                selected={{
                  from: startDate,
                  to: endDate,
                }}
                onSelect={(date) => {
                  date?.from && setStartDate(date.from);
                  date?.to && setEndDate(date.to);
                }}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
      <DataTable table={table} columnSpan={columns.length} />
      <DataTablePagination table={table} />
    </div>
  );
};

export default EmployeeLogsTable;
