import { ProductDetails } from "@/@types/product";
import { cn } from "@/lib/utils";
import { FC } from "react";

const ProductVariations: FC<{ product: ProductDetails }> = ({ product }) => {
  return (
    <div className="flex w-full flex-col mb-6">
      <div className="rounded-t-md w-full border-1 border-b-0 bg-slate-50 p-3 font-medium">
        Product Variations
      </div>
      <table className="border-collapse w-full max-w-full select-none overflow-x-auto border-1 text-sm scrollbar-thin max-lg:block [&>*>*>*]:border-1 [&>*>*]:border-1 [&>*]:border-1">
        <thead className="bg-slate-50 font-medium">
          <tr className="text-xs">
            <th className="p-3 text-left">Combination</th>
            <th className="p-3">Quantity</th>
            <th className="p-3">Discount (%)</th>
            <th className="p-3">Price (&#36;)</th>
          </tr>
        </thead>
        <tbody>
          {product.variations.map((variation, index) => {
            const attrKeys = Object.keys(variation.combinations).sort();
            const attrValues = attrKeys.map(
              (key) => variation.combinations[key]
            );
            return (
              <tr key={index + variation.id}>
                <td className="min-w-28 w-full break-words p-3">
                  {attrValues.join(" - ")}
                </td>

                <td
                  className={cn(
                    "w-full min-w-[15rem] font-medium text-center p-3 text-sm",
                    variation.quantity < 10
                      ? "text-red-600"
                      : variation.quantity < 30
                        ? "text-yellow-500"
                        : ""
                  )}
                >
                  {variation.quantity}
                </td>
                <td className="w-full min-w-[15rem] text-center p-3 text-xs">
                  {variation.discount}%
                </td>
                <td className="w-full min-w-[15rem] text-center p-3 text-xs">
                  &#36;{variation.price}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default ProductVariations;
