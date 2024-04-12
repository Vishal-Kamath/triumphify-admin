import PrivilageProvider from "@/components/providers/privilage.provider";
import { FC } from "react";
import EditActionForm from "./edit-action-form";
import LogsList from "./logs";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

const ActionsDetailsPage: FC = () => {
  return (
    <PrivilageProvider path="/employees/actions/:id">
      <div className="flex w-full max-md:flex-col h-full max-w-6xl mx-auto px-6 py-6 gap-6">
        <div className="w-full md:max-w-lg relative">
          <div className="sticky max-md:border-b-1 pb-6 md:pr-6 md:border-r-1 flex-col flex gap-6 items-center top-20 left-0">
            <div className="flex flex-col gap-2 w-full">
              <h2 className="text-xl font-semibold">Edit Action</h2>
              <Link
                href={"/employees/actions"}
                className="flex gap-1 hover:text-slate-900 text-slate-600 underline items-center text-xs"
              >
                <ArrowLeft className="size-3" />
                <span>Back</span>
              </Link>
            </div>
            <EditActionForm />
          </div>
        </div>
        <LogsList />
      </div>
    </PrivilageProvider>
  );
};

export default ActionsDetailsPage;
