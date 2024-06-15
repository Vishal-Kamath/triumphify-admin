"use client";

import {
  MRT_ColumnDef,
  MRT_Row,
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import { FC, useMemo } from "react";
import { dateFormater } from "@/utils/dateFormater";
import { invalidateAllBlogs, useBlogs } from "@/lib/blogs";
import { Button, IconButton, Tooltip } from "@mui/material";
import { FileDownload, Refresh } from "@mui/icons-material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Employee } from "@/@types/employee";
import { useEmployees, useSuperadmins } from "@/lib/employee";
import { useMe } from "@/lib/auth";
import { handleExtract } from "@/utils/extract";
import Image from "next/image";
import { PencilLine, Trash2 } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import ConfirmDelete from "@/components/misc/confirmDelete";
import axios from "axios";
import { useToast } from "@/components/ui/use-toast";

const DeleteBlogButton: FC<{ id: string; title: string }> = ({ id, title }) => {
  const { toast } = useToast();
  function deleteBlog() {
    axios
      .delete(`${process.env.ENDPOINT}/api/blogs/${id}`, {
        withCredentials: true,
      })
      .then((res) => {
        invalidateAllBlogs();
        toast({
          title: "Success",
          description: res.data.description,
          variant: res.data.type,
        });
      })
      .catch((err) => {
        if (!err.response?.data) return;
        toast({
          title: "Error",
          description: err.response.data.description,
          variant: err.response.data.type,
        });
      });
  }

  return (
    <ConfirmDelete
      className="flex aspect-square h-10 w-10 items-center justify-center rounded-md hover:bg-red-100 hover:text-red-500"
      confirmText={title}
      deleteFn={deleteBlog}
    >
      <Trash2 className="h-4 w-4" />
    </ConfirmDelete>
  );
};

function findEmployee(employeeId: string | null, employees: Employee[]) {
  const employee = employees.find((employee) => employee.id === employeeId);
  return employee;
}

const BlogsTable: FC = () => {
  const { data: blogs, isLoading, refetch, isRefetching } = useBlogs();
  const { data: employees } = useEmployees();
  const { data: superAdmins } = useSuperadmins();
  const totalEmployeesList = employees?.concat(superAdmins || []);
  const { data: me } = useMe();

  const handleExportRows = (rows: MRT_Row<Blog>[]) => {
    const rowData = rows
      .map((row) => row.original)
      .map((row) => {
        row.created_by =
          findEmployee(row.created_by, totalEmployeesList || [])?.username ||
          row.created_by;
        return row;
      }) as any;
    handleExtract("blogs-data", rowData);
  };

  const handleExportData = () => {
    if (!blogs) return;
    handleExtract(
      "blogs-data",
      blogs.map((row) => {
        row.created_by =
          findEmployee(row.created_by, totalEmployeesList || [])?.username ||
          row.created_by;
        return row;
      }),
    );
  };

  const columns = useMemo<MRT_ColumnDef<Blog>[]>(
    () => [
      {
        header: "Image",
        accessorKey: "image",
        Cell: ({ row }) => {
          return row.getValue("image") ? (
            <Image
              src={row.getValue("image")}
              alt={row.getValue("title")}
              className="h-full min-h-24 w-full max-w-[10rem]"
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
        header: "Title",
        accessorKey: "title",
        enableHiding: false,
      },
      // {
      //   header: "Status",
      //   accessorKey: "status",
      //   filterVariant: "select",
      //   filterSelectOptions: ["New", "Pending", "Converted", "Rejected"],
      //   Cell: ({ row }) => {
      //     return (
      //       <Badge
      //         className={
      //           row.original.status ? statusStyles[row.original.status] : ""
      //         }
      //       >
      //         {row.original.status}
      //       </Badge>
      //     );
      //   },
      // },
      {
        header: "Created by",
        accessorKey: "created_by",
        filterVariant: "select",
        filterSelectOptions:
          totalEmployeesList
            ?.map((employee) => ({
              label: employee.username || "NA",
              value: employee.id,
            }))
            .concat({
              label: "Not Available",
              value: "NA",
            }) || [],
        accessorFn: (originalRow) => originalRow.created_by,
        Cell: ({ row }) => {
          const employee = findEmployee(
            row.original.created_by,
            totalEmployeesList || [],
          );
          return employee ? (
            <div className="flex flex-col">
              <h4 className="text-sm text-slate-800">{employee.username}</h4>
              <p className="truncate text-xs text-slate-500">
                {employee.email}
              </p>
            </div>
          ) : (
            "Not Available"
          );
        },
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
          <div className="flex items-center">
            <Link
              href={`/blog/${row.getValue("id")}`}
              className={cn(buttonVariants({ variant: "ghost" }))}
            >
              <PencilLine className="h-4 w-4" />
            </Link>
            <DeleteBlogButton id={row.original.id} title={row.original.title} />
          </div>
        ),
      },
    ],
    [blogs, totalEmployeesList],
  );
  const table = useMaterialReactTable({
    columns,
    data: blogs || [],
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
                display: "none",
                "@media (max-width: 768px)": {
                  display: "block",
                },
                height: "40px",
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
                display: "none",
                "@media (max-width: 768px)": {
                  display: "block",
                },
                height: "40px",
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

export default BlogsTable;
