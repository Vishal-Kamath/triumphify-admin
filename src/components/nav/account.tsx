"use client";

import { useMe } from "@/lib/auth";
import { FC } from "react";
import { Skeleton } from "../ui/skeleton";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Link from "next/link";

const colors = [
  "bg-red-100 text-red-800",
  "bg-purple-100 text-purple-800",
  "bg-green-100 text-green-800",
  "bg-sky-100 text-sky-800",
];

const UserAccount: FC = () => {
  const { data: user, isLoading } = useMe();

  if (isLoading || !user)
    return (
      <div className="flex w-full items-center space-x-4 border-b-1 border-slate-200 px-2 py-4">
        <Skeleton className="h-12 w-12 flex-shrink-0 rounded-full" />
        <div className="w-full space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      </div>
    );
  return (
    <Link
      href="/"
      className="flex w-full items-center space-x-4 border-b-1 border-slate-200 px-2 py-4 hover:bg-gray-50"
    >
      <Avatar className="h-12 w-12 flex-shrink-0 rounded-full font-semibold">
        <AvatarFallback className={colors[(user.username?.length || 4) % 4]}>
          {user.username
            ?.split(" ")
            .map((val) => val[0])
            .slice(0, 2)
            .join("")}
        </AvatarFallback>
      </Avatar>
      <div className="flex w-full flex-col gap-1">
        <h2 className="text-sm font-medium leading-none text-black">
          {user.username && user.username?.length > 15
            ? user.username.slice(0, 15) + "..."
            : user.username}
        </h2>
        <p className="text-xs capitalize leading-none text-gray-600">
          {user.role}
        </p>
      </div>
    </Link>
  );
};

export default UserAccount;
