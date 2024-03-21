import { useEmployees } from "@/lib/employee";
import { FC } from "react";

const AssignedTo: FC<{ assignedTo: string | null }> = ({ assignedTo }) => {
  const { data: employees, isLoading } = useEmployees();
  if (isLoading || !employees) return null;
  const findAssignedEmployee = !!assignedTo
    ? employees.find((employee) => employee.id === assignedTo) || null
    : null;

  return findAssignedEmployee ? findAssignedEmployee.username : "Unassigned";
};

export default AssignedTo;
