import { Separator } from "@/components/ui/separator";
import { FC } from "react";
import OrderTable from "./order-table";

const OrderDetailsPage: FC = () => {
  return (
    <main className="flex h-full min-h-full w-full flex-col gap-2 bg-white p-6">
      <div className="flex flex-col gap-6">
        <h2 className="text-lg font-semibold leading-none">Order Details</h2>
        <Separator />
      </div>
      <div className="h-full">
        <OrderTable />
      </div>
    </main>
  );
};

export default OrderDetailsPage;
