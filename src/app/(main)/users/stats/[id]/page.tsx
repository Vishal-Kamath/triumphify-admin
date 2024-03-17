"use client";

import { Separator } from "@/components/ui/separator";
import { MoveLeft } from "lucide-react";
import Link from "next/link";
import { FC } from "react";
import AccountUserDetails from "./user-details";
import { useParams } from "next/navigation";
import AccountOrdersPlaced from "./orders-placed";
import AccountUserReviews from "./user-reviews";
import AccountUserStats from "./user-stats";

const UserDetailsPage: FC = () => {
  const id = useParams()["id"] as string;
  return (
    <div className="h-full w-full bg-white pb-24 pt-6 lg:pt-9">
      <main className="mx-auto flex max-w-4xl flex-col gap-6 px-6 lg:gap-9">
        <div className="flex flex-col gap-4">
          <div className="flex justify-between gap-3 max-md:flex-col">
            <div className="flex items-center gap-6 text-slate-600">
              <Link href="/users/stats">
                <MoveLeft className="h-6 w-6 " />
              </Link>
              <h2 className="text-lg font-semibold leading-none">
                User Details
              </h2>
            </div>
            <span className="w-fit rounded-sm bg-slate-100 px-3 py-1 text-xs">
              {id}
            </span>
          </div>
          <Separator />
        </div>
        <AccountUserDetails />
        <Separator />
        <AccountUserStats />
        <Separator />
        <AccountOrdersPlaced />
        <Separator />
        <AccountUserReviews />
      </main>
    </div>
  );
};

export default UserDetailsPage;
