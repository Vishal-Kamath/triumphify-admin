"use client";

import AvatarElement from "@/components/misc/avatar-element";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useUser } from "@/lib/user";
import { cn } from "@/lib/utils";
import { dateFormater } from "@/utils/dateFormater";
import { Check, X } from "lucide-react";
import { useParams } from "next/navigation";
import { FC } from "react";

const AccountUserDetails: FC = () => {
  const id = useParams()["id"] as string;
  const { data: user, isLoading, refetch } = useUser(id);

  return (
    <div className="flex flex-col gap-6 lg:gap-9">
      <div className="flex items-center gap-6 lg:px-3">
        <AvatarElement
          className="h-24 w-24 text-3xl max-lg:hidden"
          username={user?.username}
          image={user?.image || ""}
        />
        <div className="flex flex-col gap-1">
          <h1 className="text-lg font-semibold text-slate-900 lg:text-2xl">
            {user?.username}
          </h1>
          <div className="flex gap-2">
            <span className="max-w-[500px] truncate text-slate-600">
              {user?.email && user?.email.length > 30
                ? user?.email.slice(0, 27) + "..."
                : user?.email}
            </span>
            <Badge
              variant="outline"
              className={cn(
                user?.emailVerified
                  ? "border-green-500 bg-green-50 text-green-500"
                  : "border-yellow-500 bg-yellow-50 text-yellow-500",
                "w-fit font-medium max-lg:hidden"
              )}
            >
              {user?.emailVerified ? "Verified" : "Not Verified"}
            </Badge>
            <Badge
              variant="outline"
              className={cn(
                user?.emailVerified
                  ? "border-green-500 bg-green-50 text-green-500"
                  : "border-yellow-500 bg-yellow-50 text-yellow-500",
                "w-fit font-medium lg:hidden"
              )}
            >
              {user?.emailVerified ? (
                <Check className="h-3 w-3" />
              ) : (
                <X className="h-3 w-3" />
              )}
            </Badge>
          </div>
        </div>
      </div>
      <Separator />
      <div className="flex flex-col gap-6 lg:gap-9">
        <h3 className="text-lg font-medium text-slate-500">
          Personal Information
        </h3>
        <div className="grid grid-cols-2 gap-x-3 gap-y-6 lg:grid-cols-3">
          <div className="flex w-full flex-col gap-2">
            <h6 className="font-medium text-slate-600">Email</h6>
            <span className="text-sm text-slate-500">{user?.email}</span>
          </div>
          <div className="flex w-full flex-col gap-2">
            <h6 className="font-medium text-slate-600">Username</h6>
            <span className="text-sm text-slate-500">{user?.username}</span>
          </div>
          <div className="flex w-full flex-col gap-2">
            <h6 className="font-medium text-slate-600">Mobile number</h6>
            <span className="text-sm text-slate-500">
              {user?.tel ? user?.tel : "NA"}
            </span>
          </div>
          <div className="flex w-full flex-col gap-2">
            <h6 className="font-medium text-slate-600">Gender</h6>
            <span className="text-sm text-slate-500">
              {user?.gender ? user?.gender : "NA"}
            </span>
          </div>
          <div className="flex w-full flex-col gap-2">
            <h6 className="font-medium text-slate-600">Date of Birth</h6>
            <span className="text-sm text-slate-500">
              {user?.dateOfBirth
                ? dateFormater(new Date(user?.dateOfBirth))
                : "NA"}
            </span>
          </div>
          <div className="w-full"></div>
        </div>
      </div>
    </div>
  );
};

export default AccountUserDetails;
