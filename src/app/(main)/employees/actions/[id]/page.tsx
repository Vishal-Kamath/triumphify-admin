import PrivilageProvider from "@/components/providers/privilage.provider";
import { FC } from "react";
import EditActionForm from "./edit-action-form";

const ActionsDetailsPage: FC = () => {
  return (
    <PrivilageProvider path="/employees/actions/:id">
      <div className="flex w-full h-full max-w-6xl mx-auto p-6 gap-6">
        <EditActionForm />
      </div>
    </PrivilageProvider>
  );
};

export default ActionsDetailsPage;
