import { DataTableFacetedFilter } from "@/components/data-table/data-table-faceted-filter";
import { useEmployees } from "@/lib/employee";
import { Column } from "@tanstack/react-table";
import { FC } from "react";

interface AssignedToFilterProps {
  column?: Column<any, any>;
}
const AssignedToDataTableFacetedFilter: FC<AssignedToFilterProps> = ({
  column,
}) => {
  const { data: employees, isLoading } = useEmployees();
  if (isLoading || !employees) return null;
  return (
    <DataTableFacetedFilter
      column={column}
      title={"Assigned"}
      options={employees
        .map((employee) => ({
          label: employee.username!,
          value: employee.id,
        }))
        .concat([{ label: "Unassigned", value: "NA" }])}
    />
  );
};

export default AssignedToDataTableFacetedFilter;
