"use client";

import { isServer } from "@tanstack/react-query";
import { FC, ReactNode } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { usePrivilage } from "@/lib/privilage";
import Logo from "../misc/logo";
import Link from "next/link";
import { ShieldAlert } from "lucide-react";

const PrivilageProvider: FC<{ path: string; children: ReactNode }> = ({
  path,
  children,
}) => {
  const { data: privilage, isLoading } = usePrivilage(path);
  if (!privilage) return null;
  if (!isLoading && !isServer && !!privilage && privilage.data === "denied") {
    return (
      <Dialog open={true}>
        <DialogContent
          closeable={false}
          className="flex items-center justify-start gap-6 flex-col py-9"
        >
          {/* <Logo className="w-[12.5rem]" /> */}

          <div className="flex w-full gap-3 justify-center items-center text-red-700">
            <ShieldAlert className="size-12" />
            <h1 className="text-4xl font-semibold">Unauthorized!!</h1>
          </div>
          <p className="text-center text-slate-700">
            You do not have the necessary permissions to access this resource
            with your current role. Please contact your administrator for
            assistance.
          </p>
          <Link
            href="/"
            className="text-blue-600 text-xs underline underline-offset-2 hover:text-blue-900"
          >
            Back to Home
          </Link>
        </DialogContent>
      </Dialog>
    );
  }
  if (isLoading) return <div>Loading...</div>;
  return children;
};

export default PrivilageProvider;
