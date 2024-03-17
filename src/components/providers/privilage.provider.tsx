"use client";

import { isServer } from "@tanstack/react-query";
import { FC, ReactNode } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { usePrivilage } from "@/lib/privilage";

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
          className="flex items-center justify-center py-10"
        >
          <h1 className="text-center text-xl font-medium">
            {privilage.description}
          </h1>
        </DialogContent>
      </Dialog>
    );
  }
  if (isLoading) return <div>Loading...</div>;
  return children;
};

export default PrivilageProvider;
