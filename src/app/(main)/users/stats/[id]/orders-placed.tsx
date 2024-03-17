"use client";

import { Input } from "@/components/ui/input";
import { useUserOrders } from "@/lib/user";
import { useParams } from "next/navigation";
import { FC, useState } from "react";
import OrderComponent from "./order-component";
import { Button } from "@/components/ui/button";
import {
  LuChevronLeft,
  LuChevronRight,
  LuChevronsLeft,
  LuChevronsRight,
} from "react-icons/lu";
import { RefreshCw } from "lucide-react";
import Pagination from "@/components/misc/pagination";

const AccountOrdersPlaced: FC = () => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const id = useParams()["id"] as string;
  const { data: orders, isLoading, refetch } = useUserOrders(id);

  const orderFiltered = orders?.filter((order, index) => {
    return (
      order.id.toLowerCase().includes(search.toLowerCase()) ||
      order.product_name.toLowerCase().includes(search.toLowerCase())
    );
  });

  const totalPages = Math.ceil((orderFiltered?.length || 1) / 3);

  const filterOrdersPaginated = orderFiltered?.slice((page - 1) * 3, page * 3);

  return (
    <div className="flex flex-col gap-6 lg:gap-9">
      <h3 className="text-lg font-medium text-slate-500">Order History</h3>
      <div className="flex flex-col gap-6">
        <div className="flex gap-3">
          <Input
            placeholder="Search on product name or order Id..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Button
            variant="secondary"
            className="group active:bg-purple-100"
            onClick={() => refetch()}
          >
            <RefreshCw className="h-3 w-3 group-active:animate-spin " />
          </Button>
        </div>

        <div className="flex flex-col gap-3">
          {filterOrdersPaginated?.map((order) => (
            <OrderComponent key={order.id} order={order} />
          ))}
          {
            // Loading
            isLoading && (
              <div className="flex justify-center">
                <RefreshCw className="h-6 w-6 animate-spin" />
              </div>
            )
          }
          {filterOrdersPaginated?.length === 0 && (
            <div className="flex justify-center py-12 text-lg font-medium text-slate-500">
              No orders found
            </div>
          )}
        </div>

        {/* Pagination */}
        <Pagination page={page} setPage={setPage} totalPages={totalPages} />
      </div>
    </div>
  );
};

export default AccountOrdersPlaced;
