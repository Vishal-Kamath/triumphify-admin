"use client";

import { useUserTop } from "@/lib/user";
import { FC, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  LuChevronLeft,
  LuChevronRight,
  LuChevronsLeft,
  LuChevronsRight,
} from "react-icons/lu";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import AvatarElement from "@/components/misc/avatar-element";
import Pagination from "@/components/misc/pagination";

ChartJS.register(ArcElement, Tooltip, Legend);

const TopUsers: FC = () => {
  const { data: topUsers } = useUserTop();
  const [page, setPage] = useState(1);

  const totalPages = Math.ceil((topUsers?.length || 1) / 5);
  const filterUsersPaginated = topUsers?.slice((page - 1) * 3, page * 3);
  if (!topUsers) return null;

  return (
    <div className="flex w-full flex-col gap-6 lg:gap-9">
      <h3 className="text-lg font-medium text-slate-500">Top Users</h3>
      <div className="flex w-full flex-col overflow-x-auto">
        {filterUsersPaginated?.map((user) => (
          <Link
            href={`/users/accounts/${user.user_id}?redirect=${encodeURIComponent("/users/stats")}`}
            key={user.user_id}
            className="flex items-center gap-3 border-b-1 border-slate-300 p-3 last:border-b-0 hover:bg-slate-50"
          >
            <AvatarElement
              username={user.user_username}
              image={user.user_image}
              className="h-12 w-12"
            />
            <div className="flex sm:min-w-[20rem] max-w-xs flex-col gap-1">
              <h4 className="text-sm font-medium">{user.user_username}</h4>
              <span className="text-xs text-slate-500">{user.user_email}</span>
            </div>
            <div className="ml-auto">&#36;{user.total_spent || 0}</div>
          </Link>
        ))}
      </div>
      {/* Pagination */}
      <Pagination page={page} setPage={setPage} totalPages={totalPages} />
    </div>
  );
};

export default TopUsers;
