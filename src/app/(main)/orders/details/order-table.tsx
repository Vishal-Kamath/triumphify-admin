"use client";

import {
  MRT_ColumnDef,
  MRT_Row,
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import { FC, useEffect, useMemo, useRef } from "react";
import { dateFormater } from "@/utils/dateFormater";
import { Button, IconButton, Tooltip } from "@mui/material";
import { FileDownload, Refresh } from "@mui/icons-material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useMe } from "@/lib/auth";
import { handleExtract } from "@/utils/extract";
import Image from "next/image";
import { useOrders } from "@/lib/orders";
import { Order } from "@/@types/order";
import Link from "next/link";
import { ExternalLink, PencilLine } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { capitalize } from "lodash";
import { useNav } from "@/lib/nav";
import AvatarElement from "@/components/misc/avatar-element";

const OrdersTable: FC = () => {
  const { data: orders, isLoading, refetch, isRefetching } = useOrders();
  const { data: nav, isLoading: isNavLoading } = useNav();
  const { data: me } = useMe();

  const orderNav = useRef(0);
  const ticketNav = useRef(0);
  const navString = JSON.stringify(nav);
  useEffect(() => {
    if (!isNavLoading && nav) {
      const { orders, tickets } = nav;
      if (
        Number(orders) !== orderNav.current ||
        Number(tickets) !== ticketNav.current
      ) {
        orderNav.current = Number(orders);
        ticketNav.current = Number(tickets);
        refetch();
      }
    }
  }, [navString]);

  const handleExportRows = (rows: MRT_Row<Order>[]) => {
    const rowData = rows.map((row) => row.original);
    handleExtract("orders-data", rowData);
  };

  const handleExportData = () => {
    if (!orders) return;
    handleExtract("orders-data", orders);
  };

  const columns = useMemo<MRT_ColumnDef<Order>[]>(
    () => [
      {
        header: "Product",
        accessorKey: "product_name",
        Cell: ({ row }) => (
          <div className="flex gap-3 min-w-[15rem] items-center">
            <Image
              src={row.original.product_image || ""}
              alt={row.original.product_name}
              className="size-14 object-contain flex-shrink-0"
              width={200}
              height={200}
            />
            <div className="flex flex-col gap-1">
              <h3>{row.original.product_name}</h3>
              <Link
                href={`/products/details/${row.original.product_id}?redirect=${encodeURIComponent("/orders/details")}`}
                className="text-xs flex gap-1 text-slate-500 hover:underline hover:text-slate-800"
              >
                <span>View Product</span>
                <ExternalLink className="size-3" />
              </Link>
            </div>
          </div>
        ),
        enableHiding: false,
      },
      {
        header: "Quantity",
        id: "Quantity",
        accessorKey: "product_quantity",
        filterVariant: "range-slider",
        filterFn: "betweenInclusive",
        muiFilterSliderProps: ({ table }) => {
          let min = 0;
          let max = 0;
          table.getCoreRowModel().rows.forEach((row) => {
            if (Math.floor(row.original.product_quantity) < min)
              min = Math.floor(row.original.product_quantity);
            if (Math.ceil(row.original.product_quantity) > max)
              max = Math.ceil(row.original.product_quantity);
          });

          return {
            marks: true,
            min,
            max,
          };
        },
        accessorFn: (originalRow) => Number(originalRow.product_quantity),
      },
      {
        header: "Product Price",
        id: "Product Price",
        accessorKey: "product_variation_price",
        filterVariant: "range-slider",
        filterFn: "betweenInclusive",
        muiFilterSliderProps: ({ table }) => {
          let min = 0;
          let max = 0;
          table.getCoreRowModel().rows.forEach((row) => {
            if (Math.floor(row.original.product_variation_price) < min)
              min = Math.floor(row.original.product_variation_price);
            if (Math.ceil(row.original.product_variation_price) > max)
              max = Math.ceil(row.original.product_variation_price);
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
        accessorFn: (originalRow) =>
          Number(originalRow.product_variation_price),
        Cell: ({ cell }) =>
          cell.getValue<number>().toLocaleString("en-US", {
            style: "currency",
            currency: "USD",
          }),
      },
      {
        header: "Discount",
        id: "Discount",
        accessorKey: "product_variation_discount_final_price",
        filterVariant: "range-slider",
        filterFn: "betweenInclusive",
        muiFilterSliderProps: ({ table }) => {
          let min = 0;
          let max = 0;
          table.getCoreRowModel().rows.forEach((row) => {
            if (
              Math.floor(row.original.product_variation_discount_final_price) <
              min
            )
              min = Math.floor(
                row.original.product_variation_discount_final_price
              );
            if (
              Math.ceil(row.original.product_variation_discount_final_price) >
              max
            )
              max = Math.ceil(
                row.original.product_variation_discount_final_price
              );
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
        accessorFn: (originalRow) =>
          Number(originalRow.product_variation_discount_final_price),
        Cell: ({ cell }) =>
          cell.getValue<number>().toLocaleString("en-US", {
            style: "currency",
            currency: "USD",
          }),
      },
      {
        header: "Total Price",
        id: "Total Price",
        accessorKey: "product_variation_final_price",
        filterVariant: "range-slider",
        filterFn: "betweenInclusive",
        muiFilterSliderProps: ({ table }) => {
          let min = 0;
          let max = 0;
          table.getCoreRowModel().rows.forEach((row) => {
            if (Math.floor(row.original.product_variation_final_price) < min)
              min = Math.floor(row.original.product_variation_final_price);
            if (Math.ceil(row.original.product_variation_final_price) > max)
              max = Math.ceil(row.original.product_variation_final_price);
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
        accessorFn: (originalRow) =>
          Number(originalRow.product_variation_final_price),
        Cell: ({ cell }) =>
          cell.getValue<number>().toLocaleString("en-US", {
            style: "currency",
            currency: "USD",
          }),
      },
      {
        header: "Status",
        id: "Status",
        accessorKey: "status",
        filterVariant: "select",
        filterSelectOptions: [
          "pending",
          "confirmed",
          "out for delivery",
          "delivered",
          "return approved",
          "out for pickup",
          "picked up",
          "refunded",
          "cancelled",
        ].map((status) => ({
          label: capitalize(status),
          value: status,
        })),
        accessorFn: (originalRow) =>
          originalRow.cancelled ? "cancelled" : originalRow.status,
        Cell: ({ row }) =>
          row.original.cancelled ? (
            <span className="text-xs text-nowrap capitalize px-2 py-1 border-1 border-red-500 rounded-full text-red-800 bg-red-50">
              Cancelled
            </span>
          ) : (
            <span className="text-xs text-nowrap capitalize px-2 py-1 border-1 border-neutral-500 rounded-full text-neutral-800 bg-neutral-50">
              {row.original.status}
            </span>
          ),
      },
      {
        header: "Users",
        accessorKey: "user_username",
        Cell: ({ row }) => (
          <div className="flex gap-3 min-w-[15rem] items-center">
            <AvatarElement
              image={row.original.user_image}
              username={row.original.user_username || ""}
            />
            <div className="flex flex-col gap-1">
              <h3>{row.original.user_username}</h3>
              <Link
                href={`/users/accounts/${row.original.user_id}?redirect=${encodeURIComponent("/orders/details")}`}
                className="text-xs flex gap-1 text-slate-500 hover:underline hover:text-slate-800"
              >
                <span>View User</span>
                <ExternalLink className="size-3" />
              </Link>
            </div>
          </div>
        ),
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
        enableColumnFilter: false,
        enableSorting: false,
        Cell: ({ row }) => (
          <Link
            href={`/orders/details/${row.getValue("id")}`}
            className={cn(buttonVariants({ variant: "ghost" }))}
          >
            <PencilLine className="h-4 w-4" />
          </Link>
        ),
      },
    ],
    [orders]
  );
  const table = useMaterialReactTable({
    columns,
    data: orders || [],
    muiTablePaperProps: ({ table }) => ({
      elevation: 0,
      style: {
        zIndex: table.getState().isFullScreen ? 1000 : undefined,
      },
    }),
    muiTableBodyRowProps: ({ row }) => ({
      sx: {
        backgroundColor: row.original.notifications ? "#fde68a" : null,
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
      isLoading,
    },
    enableRowSelection: me?.role === "superadmin",
  });
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <MaterialReactTable table={table} />
    </LocalizationProvider>
  );
};

export default OrdersTable;