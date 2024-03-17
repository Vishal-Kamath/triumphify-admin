"use client";

import { useVariationSale } from "@/lib/orders";
import { dateFormater } from "@/utils/dateFormater";
import { FC } from "react";

const OrderVariationSale: FC<{
  id: string;
  startDate: Date;
  endDate: Date;
}> = ({ id, startDate, endDate }) => {
  if (!id || !startDate || !endDate) return null;
  const { data: variations } = useVariationSale(id, startDate, endDate);
  return (
    <table className="border-collapse select-none overflow-x-auto border-1 text-sm max-lg:block [&>*>*>*]:border-1 [&>*>*]:border-1 [&>*]:border-1">
      <thead className="bg-slate-50 [&>*>*]:px-4 [&>*>*]:py-3 [&>*>*]:font-medium">
        <tr>
          <th colSpan={5} className="text-left">
            Sales from {dateFormater(startDate)} to {dateFormater(endDate)}
          </th>
        </tr>
        <tr>
          <th className="text-left">Variation</th>
          <th>Units sold</th>
          <th>Discounted</th>
          <th>Total Revenue</th>
        </tr>
      </thead>
      <tbody className="[&>*>*]:px-4 [&>*>*]:py-3">
        {variations?.map((variation, index) => (
          <tr
            key={Object.values(variation.variation_key).join("") + index}
            className="border-b-1 [&>*]:text-center"
          >
            <td className="px-4 py-3 text-left">
              {Object.keys(variation.variation_key)
                .sort()
                .map((key) => variation.variation_key[key])
                .join(" - ")}
            </td>
            <td className="px-4 py-3">{variation.total_units_sold}</td>
            <td className="px-4 py-3">{variation.total_discounted_price}</td>
            <td className="px-4 py-3">{variation.total_sales}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default OrderVariationSale;
