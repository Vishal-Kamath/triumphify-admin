import { ProductReview } from "@/@types/product";
import DataTable from "@/components/data-table/data-table";
import DataTableExtract from "@/components/data-table/data-table-extract";
import { DataTablePagination } from "@/components/data-table/data-table-pagination";
import DataTableToolbar from "@/components/data-table/data-table-toolbar";
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useToast } from "@/components/ui/use-toast";
import { invalidateProductReviews, useProductReviews } from "@/lib/reviews";
import { cn } from "@/lib/utils";
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
import axios from "axios";
import { CalendarIcon, ExternalLink } from "lucide-react";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { Dispatch, FC, SetStateAction, useState } from "react";
import { FaStar } from "react-icons/fa";
import { addDays, format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { RxCaretSort } from "react-icons/rx";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DataTableFacetedFilter } from "@/components/data-table/data-table-faceted-filter";
import AvatarElement from "@/components/misc/avatar-element";

const ProductReviewsTable: FC<{
  startDate: Date;
  setStartDate: Dispatch<SetStateAction<Date>>;
  endDate: Date;
  setEndDate: Dispatch<SetStateAction<Date>>;
}> = ({ startDate, setStartDate, endDate, setEndDate }) => {
  const { toast } = useToast();
  const pathname = usePathname();

  const id = useParams()["id"] as string;

  function tooglePinned(pinned: boolean, reviewId: string) {
    axios
      .patch(
        `${process.env.ENDPOINT}/api/products/reviews/pinned/${reviewId}`,
        {
          pinned,
        },
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        invalidateProductReviews(id, startDate, endDate);
      })
      .catch((err) => {
        toast({
          title: err?.response?.data?.title || "Error",
          description: err?.response?.data?.description,
          variant: err?.response?.data?.type || "error",
        });
      });
  }

  function setStatus(
    status: "pending" | "approved" | "rejected",
    reviewId: string
  ) {
    axios
      .patch(
        `${process.env.ENDPOINT}/api/products/reviews/status/${reviewId}`,
        {
          status,
        },
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        invalidateProductReviews(id, startDate, endDate);
      })
      .catch((err) => {
        toast({
          title: err?.response?.data?.title || "Error",
          description: err?.response?.data?.description,
          variant: err?.response?.data?.type || "error",
        });
      });
  }

  const columns: ColumnDef<ProductReview>[] = [
    {
      id: "pinned",
      header: "Pinned",
      accessorKey: "pinned",
      cell: ({ row }) => {
        return (
          <Checkbox
            checked={row.original.pinned}
            onCheckedChange={(value) => tooglePinned(!!value, row.original.id)}
            aria-label="Select row"
          />
        );
      },
      enableSorting: false,
      enableHiding: false,
    },
    {
      header: "User",
      accessorKey: "user_username",
      id: "user",
      cell: ({ row }) => {
        return (
          <div className="flex h-full items-start gap-3">
            <AvatarElement
              image={row.original.user_image}
              username={row.original.user_username}
            />

            <div className="flex flex-col">
              <h3 className="font-medium">{row.original.user_username}</h3>
              <Link
                href={`/users/accounts/${row.original.user_id}`}
                className="text-xs flex gap-1 text-slate-500 hover:underline hover:text-slate-800"
              >
                <span>View User</span>
                <ExternalLink className="size-3" />
              </Link>
            </div>
          </div>
        );
      },
    },
    {
      header: "Review",
      cell: ({ row }) => {
        return (
          <div className="flex w-full min-w-[24rem] max-w-sm flex-col gap-1">
            <h3 className="text-[16px] font-medium">
              {row.original.review_title}
            </h3>
            <p className="text-xs text-slate-500">
              {row.original.review_description}
            </p>
          </div>
        );
      },
    },
    {
      header: ({ column }) => {
        return (
          <button
            className="flex items-center gap-2 border-none bg-transparent p-0 outline-none focus:outline-none"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Rating
            <RxCaretSort className="ml-2 h-4 w-4" />
          </button>
        );
      },
      accessorKey: "rating",
      enableHiding: false,
      enableSorting: true,
      cell: ({ row }) => {
        return (
          <div className="flex max-w-sm gap-1">
            {[1, 2, 3, 4, 5].map((rating, index) => (
              <FaStar
                key={rating}
                className={cn(
                  "h-4 w-4",
                  rating <= row.original.rating
                    ? "fill-yellow-500"
                    : "fill-slate-300"
                )}
              />
            ))}
          </div>
        );
      },
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: ({ row }) => {
        return (
          <div className="flex">
            <Select
              value={row.original.status}
              onValueChange={(value: "pending" | "approved" | "rejected") =>
                value && setStatus(value, row.original.id)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        );
      },
      enableHiding: false,
    },
  ];

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const {
    data: reviews,
    isLoading,
    refetch,
  } = useProductReviews(id, startDate, endDate);

  const [showPinned, setShowPinned] = useState(false);
  const filterReviews = showPinned
    ? reviews?.filter((review) => review.pinned)
    : reviews;

  const table = useReactTable({
    data: reviews || [],
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
      <DataTableToolbar
        table={table}
        searchUsing="user_username"
        refetch={refetch}
        dataTableExtract={
          <DataTableExtract
            data={filterReviews || []}
            name={`reviews-from-${dateFormater(startDate)}-to-${endDate}`}
          />
        }
      />
      <div className="flex justify-between gap-3 max-lg:flex-col">
        <div className="flex gap-3">
          <Button
            variant="secondary"
            onClick={() => {
              setShowPinned(!showPinned);
              table
                .getColumn("pinned")
                ?.setFilterValue(!showPinned || undefined);
            }}
            className={cn(
              showPinned
                ? "border-1 max-lg:w-full max-w-[15rem] border-purple-400 bg-purple-100 hover:bg-purple-200"
                : ""
            )}
          >
            Pinned
          </Button>
          <DataTableFacetedFilter
            column={table.getColumn("status")}
            title="Status"
            options={[
              {
                label: "Approved",
                value: "approved",
              },
              {
                label: "Pending",
                value: "pending",
              },
              {
                label: "Rejected",
                value: "rejected",
              },
            ]}
          />
        </div>
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

export default ProductReviewsTable;
