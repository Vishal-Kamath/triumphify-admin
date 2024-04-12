import PrivilageProvider from "@/components/providers/privilage.provider";
import { FC } from "react";

const ActionsDetailsPage: FC = () => {
  return (
    <PrivilageProvider path="/employees/actions/:id">
      <div>
        <h1>Actions Details</h1>
      </div>
    </PrivilageProvider>
  );
};

export default ActionsDetailsPage;
