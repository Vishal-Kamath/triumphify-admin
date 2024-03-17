import { FC, ReactElement, ReactNode } from "react";
import { Input } from "@/components/ui/input";
import { Table } from "@tanstack/react-table";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { ChevronDownIcon, RefreshCw } from "lucide-react";
import { QueryObserverResult, RefetchOptions } from "@tanstack/react-query";

const DataTableToolbar: FC<{
  table: Table<any>;
  dataTableExtract?: ReactNode;
  refetch: (
    options?: RefetchOptions | undefined,
  ) => Promise<QueryObserverResult<any[], Error>>;
  searchUsing: string;
  actionNodes?: ReactNode;
  children?: ReactNode;
}> = ({
  table,
  dataTableExtract,
  actionNodes,
  children,
  searchUsing,
  refetch,
}) => {
  return (
    <>
      <div className="flex items-center justify-between gap-4 max-md:flex-col">
        <div className="flex w-full items-center justify-start gap-2">
          <Input
            placeholder={`Filter ${searchUsing.replaceAll("_", " ")}...`}
            value={
              (table.getColumn(searchUsing)?.getFilterValue() as string) ?? ""
            }
            onChange={(event) =>
              table.getColumn(searchUsing)?.setFilterValue(event.target.value)
            }
            className="w-full lg:max-w-sm"
          />
          {actionNodes}
        </div>

        <div className="w-full overflow-x-auto">
          <div className="flex w-full min-w-fit items-center justify-end gap-2">
            {dataTableExtract}
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
      {children}
    </>
  );
};

export default DataTableToolbar;
