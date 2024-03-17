"use client";

import { useMe } from "@/lib/auth";
import { isServer } from "@tanstack/react-query";
import { FC, ReactNode } from "react";
import { Dialog, DialogClose, DialogContent } from "@/components/ui/dialog";
import LoginForm from "@/app/(auth)/auth/login/login-form";

const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const { data, isLoading, isFetched } = useMe();

  // if (isLoading) return <div>Loading...</div>;

  if (
    !isLoading &&
    isFetched &&
    !isServer &&
    data !== undefined &&
    data?.type === "error"
  ) {
    return (
      <Dialog open={true}>
        <DialogContent
          closeable={false}
          className="flex items-center justify-center py-10"
        >
          <LoginForm inline={true} />
        </DialogContent>
      </Dialog>
    );
  }

  return children;
};

export default AuthProvider;
