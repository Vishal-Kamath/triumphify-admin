import { FC } from "react";
import CreateEmployeeForm from "./create-employee-form";
import { Separator } from "@/components/ui/separator";
import TabComponent from "@/components/misc/component";
import PrivilageProvider from "@/components/providers/privilage.provider";

const CreateNewEmployee: FC = () => {
  return (
    <PrivilageProvider path="/employees/create">
      <TabComponent className="max-w-md max-lg:mx-auto">
        <div className="flex flex-col">
          <h3 className="text-xl font-medium">Create New Employee</h3>
          <p className="text-sm text-gray-500">
            Input employee details to create a new employee
          </p>
        </div>
        <Separator />
        <CreateEmployeeForm />
      </TabComponent>
    </PrivilageProvider>
  );
};

export default CreateNewEmployee;
