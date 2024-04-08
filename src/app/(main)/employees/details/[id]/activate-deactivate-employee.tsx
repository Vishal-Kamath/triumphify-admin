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
    const doesAdminWantToDeactivateOrActivae = window.confirm(
      `Are you sure you want to ${employee?.status === "active" ? "deactivate" : "activate"} this employee?`
    );
    if (!doesAdminWantToDeactivateOrActivae) return;
    axios
      .get(
        `${process.env.ENDPOINT}/api/employees/${employee?.id}/status/${employee?.status === "active" ? "deactive" : "active"}`,
        { withCredentials: true }
      )
      .then((res) => {
        invalidateAllEmployee(employee?.id || "");
      });
  }

  return (
    <div className="relative isolate flex w-full max-w-lg flex-col gap-3 rounded-md border-1 border-red-200 p-4 pt-6">
      <div
        style={{
          backgroundImage: "url('/cancel-bg.svg')",
          backgroundSize: "4.5rem",
          backgroundRepeat: "repeat",
        }}
        className="absolute left-0 top-0 -z-10 h-full w-full opacity-[3%]"
      ></div>
      <h3 className="font-medium text-red-700">
        {employee?.status === "active"
          ? "Deactivate Employee"
          : "Activate Employee"}
      </h3>
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
        <Button
          disabled
          variant="destructive"
          className="ml-auto max-w-xs mt-4"
        >
          <AiOutlineLoading className="mr-2 h-4 w-4 animate-spin" />
          Please wait..
        </Button>
      ) : (
        <Button
          type="submit"
          className="ml-auto max-w-xs mt-4"
          variant="destructive"
          onClick={handleActivateDeactivate}
        >
          {employee?.status === "active" ? "Deactivate" : "Activate"}
        </Button>
      )}
    </div>
  );
};

export default ActivateDeactivateEmployee;
