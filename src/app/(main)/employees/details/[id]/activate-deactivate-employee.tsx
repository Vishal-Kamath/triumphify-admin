import { Employee } from "@/@types/employee";
import { Button } from "@/components/ui/button";
import { invalidateAllEmployee } from "@/lib/employee";
import axios from "axios";
import { FC, useState } from "react";
import { AiOutlineLoading } from "react-icons/ai";

const ActivateDeactivateEmployee: FC<{ employee?: Employee }> = ({
  employee,
}) => {
  const [loading, setLoading] = useState(false);

  function handleActivateDeactivate() {
    axios
      .get(
        `${process.env.ENDPOINT}/api/employees/${employee?.id}/status/${employee?.status === "active" ? "deactive" : "active"}`,
        { withCredentials: true },
      )
      .then((res) => {
        invalidateAllEmployee(employee?.id || "");
      });
  }

  return (
    <div className="flex w-full max-w-lg flex-col gap-3 rounded-md border-1 border-slate-300 p-4 pt-6 hover:shadow-sm">
      <h4 className="font-semibold text-slate-700">
        {employee?.status === "active"
          ? "Deactivate Employee"
          : "Activate Employee"}
      </h4>
      {employee?.status === "active" ? (
        <p className="text-xs text-slate-500">
          This process will not delete the employee or the employee data. This
          will only deactivate the account, preventing it from further use
        </p>
      ) : (
        <p className="text-xs text-slate-500">
          This process will activate the employee account, allowing the employee
          to use the system again.
        </p>
      )}

      {loading ? (
        <Button disabled className="ml-auto max-w-xs">
          <AiOutlineLoading className="mr-2 h-4 w-4 animate-spin" />
          Please wait..
        </Button>
      ) : (
        <Button
          type="submit"
          className="ml-auto max-w-xs"
          onClick={handleActivateDeactivate}
        >
          {employee?.status === "active" ? "Deactivate" : "Activate"}
        </Button>
      )}
    </div>
  );
};

export default ActivateDeactivateEmployee;
