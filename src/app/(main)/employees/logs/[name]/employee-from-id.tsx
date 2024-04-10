import { useEmployees, useSuperadmins } from "@/lib/employee";
import { FC } from "react";

const EmployeeDetailsFromId: FC<{ employee_id: string | null }> = ({
  employee_id,
}) => {
  const { data: employees, isLoading } = useEmployees();
  const { data: superadmins, isLoading: isSupAdminLoading } = useSuperadmins();
  if (isLoading || !employees || isSupAdminLoading || !superadmins) return null;
  const findAssignedEmployee = !!employee_id
    ? employees.find((employee) => employee.id === employee_id) ||
      superadmins.find((employee) => employee.id === employee_id) ||
      null
    : null;

  return findAssignedEmployee ? (
    <div className="flex flex-col w-full text-start items-start">
      <span className="text-sm text-slate-800">
        {findAssignedEmployee.username}
      </span>
      <span className="text-xs text-slate-500">
        {findAssignedEmployee.email}
      </span>
    </div>
  ) : (
    "Unknown"
  );
};

export default EmployeeDetailsFromId;
