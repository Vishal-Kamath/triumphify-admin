import { Employee } from "@/@types/employee";
import { Badge } from "@/components/ui/badge";
import { FC } from "react";

const WelcomeUserSection: FC<{ employee: Employee }> = ({ employee }) => {
  return (
    <div className="flex flex-col gap-2">
      <h1 className="flex w-fit gap-2 text-2xl font-semibold">
        <span>Welcome</span>
        <span className="bg-gradient-to-br bg-clip-text text-transparent from-purple-950 to-purple-700">
          {employee?.username}
        </span>
      </h1>
      <div className="flex items-center gap-2">
        <Badge className="bg-purple-100 capitalize text-purple-700 hover:bg-purple-100">
          {employee.role}
        </Badge>
        <span className="text-slate-600">{employee?.email}</span>
      </div>
    </div>
  );
};

export default WelcomeUserSection;
