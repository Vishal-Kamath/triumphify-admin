"use client";

import { useOrder } from "@/lib/orders";
import { notFound, useParams } from "next/navigation";
import { FC, Suspense } from "react";
import { isServer } from "@tanstack/react-query";
import OrderProductDetails from "./order-details";
import OrderAddressSection from "./order-addresses";
import OrderStatus from "./order-status";
import OrderGroupDetails from "./order-group-details";
import CancelOrderForm from "./cancel-order";

const OrderDetails: FC = () => {
  const id = useParams()["id"] as string;
  const { data, isError, isLoading, isFetched } = useOrder(id);

  if (
    !isLoading &&
    isFetched &&
    !isServer &&
    data !== undefined &&
    data?.type === "error"
  ) {
    return notFound();
  }

  if (!data) return null;
  return (
    <Suspense>
      <main className="px-4 py-6 max-w-6xl w-full mx-auto relative flex gap-5 pb-24 max-lg:flex-col-reverse">
        <OrderAddressSection order_details={data.order_details} />
        <div className="flex flex-col gap-12 pt-3">
          <OrderProductDetails order={data.order} />
          <OrderStatus order={data.order} />
          <OrderGroupDetails all_orders={data.all_orders} />
          <CancelOrderForm
            order_id={data.order.id}
            isCancelled={data.order.cancelled}
          />
        </div>
      </main>
    </Suspense>
  );
};

export default OrderDetails;
