import { Order } from "@/@types/order";
import Image from "next/image";
import { FC } from "react";

const OrderListBreakdown: FC<{ all_orders?: Order[] }> = ({ all_orders }) => {
  if (!all_orders) return null;
  return (
    <table className="border-collapse select-none overflow-x-auto border-1 text-sm max-lg:block [&>*>*>*]:border-1 [&>*>*]:border-1 [&>*]:border-1">
      <thead className="bg-slate-50 font-medium">
        <tr>
          <th colSpan={5} className="p-3 text-left">
            Order Breakdown
          </th>
        </tr>
        <tr>
          <th className="p-3 text-left">Details</th>
          <th className="p-3">Quantity</th>
          <th className="p-3">Discount(%)</th>
          <th className="p-3">Price (per unit)</th>
          <th className="p-3">Total</th>
        </tr>
      </thead>
      <tbody>
        {all_orders.map((order, index) => (
          <tr key={index + order.id}>
            <td className="w-full min-w-[20rem] p-3">
              <div className="flex gap-3">
                <Image
                  src={order.product_image || ""}
                  alt={order.product_name}
                  width={300}
                  height={300}
                  className="aspect-auto max-h-[5rem] w-fit object-contain"
                />
                <div className="flex flex-col">
                  <span className="font-medium text-slate-700">
                    {order.product_name}
                  </span>
                  <span className="text-slate-500">
                    {order.product_brand_name}
                  </span>
                </div>
              </div>
            </td>
            <th className="w-full p-3">{order.product_quantity}</th>
            <th className="w-full p-3">{order.product_variation_discount}%</th>
            <th className="w-full p-3">{order.product_variation_price}</th>
            <th className="w-full p-3">
              {order.product_variation_price * order.product_quantity -
                order.product_variation_price *
                  (order.product_variation_discount / 100) *
                  order.product_quantity}
            </th>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default OrderListBreakdown;
