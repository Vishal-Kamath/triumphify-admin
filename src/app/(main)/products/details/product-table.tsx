"use client";

import {
  MRT_ColumnDef,
  MRT_Row,
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import { FC, useMemo } from "react";
import { dateFormater } from "@/utils/dateFormater";
import { Button, IconButton, Tooltip } from "@mui/material";
import { FileDownload, Refresh } from "@mui/icons-material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useMe } from "@/lib/auth";
import { handleExtract } from "@/utils/extract";
import { useProducts } from "@/lib/products";
import { Product } from "@/@types/product";
import Image from "next/image";
import ProductMoreDropdown from "./more-dropdown";

const ProductsTable: FC = () => {
  const { data: products, isLoading, refetch, isRefetching } = useProducts();
  const { data: me } = useMe();

  const handleExportRows = (rows: MRT_Row<Product>[]) => {
    const rowData = rows.map((row) => row.original);
    handleExtract("products-data", rowData);
  };

  const handleExportData = () => {
    if (!products) return;
    handleExtract("products-data", products);
  };

  const columns = useMemo<MRT_ColumnDef<Product>[]>(
    () => [
      {
        header: "Image",
        accessorKey: "product_images",
        Cell: ({ row }) => {
          return (row.getValue("product_images") as string[]).length ? (
            <Image
              src={(row.getValue("product_images") as string[])[0]}
              alt={row.getValue("name")}
              className="w-full min-h-24 h-full max-w-[10rem]"
              width={200}
              height={200}
            />
          ) : (
            "N/A"
          );
        },
        enableHiding: false,
        enableColumnFilter: false,
        enableColumnFilterModes: false,
        enableSorting: false,
      },
      {
        header: "Name",
        accessorKey: "name",
        enableHiding: false,
      },
      {
        header: "Description",
        accessorKey: "description",
        Cell(props) {
          return (
            <div className="text-wrap max-h-28 overflow-y-auto min-w-[300px] max-w-[300px] scrollbar-thin">
              {props.row.getValue("description")}
            </div>
          );
        },
      },
      {
        header: "Brand Name",
        accessorKey: "brand_name",
      },
      {
        header: "Category",
        accessorKey: "category",
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
          <ProductMoreDropdown
            id={row.original.id}
            name={row.original.name}
            slug={row.original.slug}
          />
        ),
      },
    ],
    [products]
  );
  const table = useMaterialReactTable({
    columns,
    data: products || [],
    muiTablePaperProps: ({ table }) => ({
      elevation: 0,
      style: {
        zIndex: table.getState().isFullScreen ? 1000 : undefined,
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

export default ProductsTable;