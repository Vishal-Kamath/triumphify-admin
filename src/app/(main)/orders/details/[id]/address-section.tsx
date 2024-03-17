import { OrderDetails } from "@/@types/order";
import { Button } from "@/components/ui/button";
import { FC } from "react";

const OrderAddressSection: FC<{ order_details?: OrderDetails }> = ({
  order_details,
}) => {
  if (!order_details) return null;
  return (
    <div className="h-full w-full lg:max-w-xs">
      <div className="flex h-fit w-full flex-col gap-4 lg:sticky lg:max-w-xs">
        <div className="flex rounded-lg border-1 border-slate-200 bg-white max-sm:flex-col lg:flex-col">
          {/* shipping address */}
          <div className="flex w-full flex-col gap-3 border-b-1 border-slate-200 p-4 max-lg:sm:border-b-0 max-lg:sm:border-r-1">
            <h3 className="text-sm font-semibold text-slate-600 underline">
              Shipping Address
            </h3>
            <div className="flex flex-col">
              <h5 className="font-medium text-slate-900">
                {order_details.shipping_address_name}
              </h5>
              <div className="flex items-center gap-2 text-slate-500">
                <span className="text-xs">
                  {order_details.shipping_address_email}
                </span>
                <span>&#8226;</span>
                <span className="text-xs">
                  {order_details.shipping_address_tel}
                </span>
              </div>
              <div className="mt-2 flex flex-col gap-1 text-xs text-slate-600">
                <p>{order_details.shipping_address_street_address}</p>
                <div className="flex flex-wrap items-center gap-3">
                  <span>{order_details.shipping_address_city}</span>
                  <span>&#8226;</span>
                  <span>{order_details.shipping_address_state}</span>
                  <span>&#8226;</span>
                  <span>{order_details.shipping_address_country}</span>
                  <span>&#8226;</span>
                  <span>{order_details.shipping_address_zip}</span>
                </div>
              </div>
            </div>
          </div>
          {/* billing address */}
          <div className="flex w-full flex-col gap-3 p-4">
            <h3 className="text-sm font-semibold text-slate-600 underline">
              Billing Address
            </h3>
            <div className="flex flex-col">
              <h5 className="font-medium text-slate-900">
                {order_details.billing_address_name}
              </h5>
              <div className="flex items-center gap-2 text-slate-500">
                <span className="text-xs">
                  {order_details.billing_address_email}
                </span>
                <span>&#8226;</span>
                <span className="text-xs">
                  {order_details.billing_address_tel}
                </span>
              </div>
              <div className="mt-2 flex flex-col gap-1 text-xs text-slate-600">
                <p>{order_details.billing_address_street_address}</p>
                <div className="flex flex-wrap items-center gap-3">
                  <span>{order_details.billing_address_city}</span>
                  <span>&#8226;</span>
                  <span>{order_details.billing_address_state}</span>
                  <span>&#8226;</span>
                  <span>{order_details.billing_address_country}</span>
                  <span>&#8226;</span>
                  <span>{order_details.billing_address_zip}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Button variant="outline" className="mx-auto w-full max-w-xs">
          Download Invoice
        </Button>
      </div>
    </div>
  );
};

export default OrderAddressSection;
