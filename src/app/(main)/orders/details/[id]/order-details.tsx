import { Order } from "@/@types/order";
import { MoveLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { FC } from "react";

const OrderProductDetails: FC<{ order?: Order }> = ({ order }) => {
  const redirect = useSearchParams().get("redirect");

  if (!order) return null;

  const variations = Object.keys(order.product_variation_combinations)
    .sort()
    .map((key) => `${key}: ${order.product_variation_combinations[key]}`);

  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex items-center justify-end gap-3 text-sm max-lg:text-xs">
        <Link
          href={redirect ? redirect : `/orders/history`}
          className="mr-auto px-3 lg:hidden"
        >
          <MoveLeft className="h-4 w-4" />
        </Link>
        <span>Order id:</span>
        <span className="rounded-sm bg-slate-50 px-2 py-1">{order.id}</span>
      </div>
      {/* Product */}
      <div className="flex gap-6 rounded-lg border-1 border-slate-200 p-4 max-sm:flex-col lg:max-xl:flex-col">
        <Image
          src={order.product_image || ""}
          alt={order.product_name}
          width={600}
          height={800}
          className="aspect-auto w-full object-contain object-center sm:max-lg:max-w-[10rem] xl:max-w-[10rem]"
        />
        <div className="flex flex-col gap-3">
          <div className="flex flex-col">
            <h4 className="text-lg font-semibold leading-none">
              {order.product_name}
            </h4>
            <p className="text-slate-500">{order.product_brand_name}</p>
          </div>
          <p className="text-xs text-slate-600">
            {order.product_description &&
            order.product_description?.length > 250
              ? order.product_description?.slice(0, 247) + "..."
              : order.product_description}
          </p>
          <div className="flex flex-wrap gap-2 text-xs">
            {variations.map((variation, index) => (
              <span
                className="rounded-full border-1 border-slate-700 bg-slate-50 px-2 py-1"
                key={variation + index}
              >
                {variation}
              </span>
            ))}
            <span className="rounded-full border-1 border-slate-700 bg-slate-50 px-2 py-1">
              Quantity: {order.product_quantity}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderProductDetails;
