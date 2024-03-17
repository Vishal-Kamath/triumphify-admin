"use client";

import TabComponent from "@/components/misc/component";
import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useOrder } from "@/lib/orders";
import { MoveLeft } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { FC } from "react";
import OrderAddressSection from "./address-section";
import OrderProductSection from "./product-section";
import OrderListBreakdown from "./order-list-breakdown";

const OrderPage: FC = () => {
  const id = useParams()["id"] as string;
  const { data, isLoading } = useOrder(id);

  return (
    <TabComponent>
      <div className="flex justify-between gap-2 max-md:flex-col">
        <div className="flex items-center gap-3">
          <Link
            href="/orders/details"
            className={buttonVariants({ variant: "ghost" })}
          >
            <MoveLeft />
          </Link>
          <h3 className="text-xl font-medium">Order Details</h3>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className=" text-gray-500">order id:</span>
          <span className="rounded-sm bg-slate-100 px-2 py-1">
            {data?.order_details.id}
          </span>
        </div>
      </div>
      <Separator />
      <div className="flex flex-col gap-6">
        <div className="flex gap-4 max-lg:flex-col">
          <OrderAddressSection order_details={data?.order_details} />
          <OrderProductSection order={data?.order} />
        </div>
        <OrderListBreakdown all_orders={data?.all_orders} />
      </div>
    </TabComponent>
  );
};

export default OrderPage;
