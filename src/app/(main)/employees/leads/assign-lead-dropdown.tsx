import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useEmployees } from "@/lib/employee";
import { ChevronsUpDown } from "lucide-react";
import { FC } from "react";

const AssignLeadsDropdown: FC<{ assignedTo: string | null }> = ({
  assignedTo,
}) => {
  const { data: employees, isLoading } = useEmployees();
  if (isLoading || !employees) return null;
  const findAssignedEmployee = !!assignedTo
    ? employees.find((employee) => employee.id === assignedTo) || null
    : null;

  return findAssignedEmployee ? findAssignedEmployee.username : "Unassigned";
};

export default AssignLeadsDropdown;
