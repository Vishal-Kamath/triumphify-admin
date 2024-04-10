import { DataTableFacetedFilter } from "@/components/data-table/data-table-faceted-filter";
import { useEmployees, useSuperadmins } from "@/lib/employee";
import { Column } from "@tanstack/react-table";
import { FC } from "react";

interface EmployeeLogsFilterProps {
  column?: Column<any, any>;
}
const EmployeeLogsDataTableFacetedFilter: FC<EmployeeLogsFilterProps> = ({
  column,
}) => {
  const { data: employees, isLoading } = useEmployees();
  const { data: superadmins, isLoading: isSupAdminLoading } = useSuperadmins();
  if (isLoading || !employees || isSupAdminLoading || !superadmins) return null;

  return (
    <DataTableFacetedFilter
      column={column}
      title={"Employee"}
      options={employees.concat(superadmins).map((employee) => ({
        label: employee.username!,
        value: employee.id,
      }))}
    />
  );
};

export default EmployeeLogsDataTableFacetedFilter;
