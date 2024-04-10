"use client";

import { useMe } from "@/lib/auth";
import { isServer } from "@tanstack/react-query";
import { FC, ReactNode } from "react";
import { Dialog, DialogClose, DialogContent } from "@/components/ui/dialog";
import LoginForm from "@/app/(auth)/auth/login/login-form";
import Image from "next/image";
import Logo from "../misc/logo";

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
          className="overflow-hidden sm:rounded-[1.75rem]"
          closeable={false}
        >
          <div className="relative isolate flex flex-col items-center justify-center gap-6 pb-4">
            <Image
              alt="auth background image"
              src="/auth-bg.svg"
              width={500}
              height={500}
              className="fixed left-0 top-0 -z-10 h-full w-full object-cover"
            />
            <Logo className="max-w-[12.5rem]" />
            <LoginForm inline={true} />
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return children;
};

export default AuthProvider;
