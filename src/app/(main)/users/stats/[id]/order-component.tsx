import { Order } from "@/@types/order";
import { dateFormater } from "@/utils/dateFormater";
import {
  Clock4,
  Coins,
  LucideIcon,
  MailCheck,
  MessageCircleReply,
  MessageCircleX,
  Package,
  PackageCheck,
  PackageOpen,
  PackageX,
  Truck,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { FC } from "react";

function generateOrderDisplay(order: Order): {
  message: string;
  icon: LucideIcon;
} {
  if (order.request_cancel)
    return { message: "Order cancellation requested", icon: MessageCircleX };
  if (order.request_return)
    return { message: "Order return requested", icon: MessageCircleReply };
  if (order.cancelled) return { message: "Order cancelled", icon: PackageX };

  // normal orders
  if (!order.cancelled && !order.returned) {
    if (order.status === "pending")
      return { message: "Your order is being processed", icon: PackageOpen };
    if (order.status === "confirmed")
      return { message: "Your order is confirmed", icon: Package };
    if (order.status === "out for delivery")
      return { message: "Order is out for delivery", icon: Truck };
    if (order.status === "delivered")
      return { message: "Order delivered", icon: PackageCheck };
  }

  // return orders
  if (!order.cancelled && order.returned) {
    if (order.status === "return approved")
      return { message: "Order return has been approved", icon: MailCheck };
    if (order.status === "out for pickup")
      return { message: "Order return is out for pickup", icon: Truck };
    if (order.status === "picked up")
      return { message: "Order picked up", icon: PackageCheck };
    if (order.status === "refunded")
      return { message: "Order has been successfully refunded", icon: Coins };
  }

  return { message: "Something went wrong", icon: X };
}

const OrderComponent: FC<{ order: Order }> = ({ order }) => {
  const orderDisplay = generateOrderDisplay(order);

  return (
    <Link
      href={`/orders/details/${order.id}`}
      className="flex w-full flex-col gap-3 rounded-lg bg-purple-50/60 p-3 hover:shadow-md hover:shadow-purple-500/25"
    >
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-purple-200 bg-white text-purple-500">
          <orderDisplay.icon className="h-4 w-4" />
        </div>

        <div className="flex flex-col">
          <h5 className="font-medium">{orderDisplay.message}</h5>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Clock4 className="h-3 w-3" />
            <p>
              {dateFormater(
                new Date(
                  order.updated_at ? order.updated_at : order.created_at,
                ),
              )}
            </p>
          </div>
        </div>
      </div>

      <div className="flex gap-6 rounded-md border-1 border-purple-200 bg-white p-3">
        <Image
          src={order.product_image || ""}
          alt={order.product_brand_name}
          width={300}
          height={500}
          className="max-h-32 max-w-32 object-contain object-left"
        />
        <div className="flex flex-col">
          <h6 className="text-sm font-medium">{order.product_name}</h6>
          <p className="text-xs text-slate-500">{order.product_brand_name}</p>

          <div className="mt-4 flex flex-wrap gap-3 text-xs text-slate-500">
            {Object.keys(order.product_variation_combinations).map(
              (key, index) => (
                <span
                  key={key + index}
                  className="border-r-2 border-slate-300 pr-3 capitalize"
                >
                  {key}: {order.product_variation_combinations[key]}
                </span>
              ),
            )}
            <span>Quantity: {order.product_quantity}</span>
          </div>

          {!!order?.product_variation_discount ? (
            <div className="mt-auto flex items-baseline gap-2 text-xs">
              <span>
                &#36;
                {order?.product_variation_price *
                  ((100 - (order?.product_variation_discount || 0)) / 100) *
                  order.product_quantity}
              </span>
              <s className="text-gray-500">
                &#36;
                {order?.product_variation_price * order.product_quantity}
              </s>
              <span className="font-bold text-green-600">
                ({order?.product_variation_discount}% OFF)
              </span>
            </div>
          ) : (
            <span className="mt-auto text-xs">
              &#36;{order?.product_variation_price}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
};

export default OrderComponent;
