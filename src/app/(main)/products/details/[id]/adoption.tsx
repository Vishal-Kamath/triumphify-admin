import { ProductTotalSalesType } from "@/lib/sales";
import { cn } from "@/lib/utils";
import { MoveRight, TrendingDown, TrendingUp } from "lucide-react";
import { FC } from "react";

const ProductSalesAdoption: FC<{
  sales_total: ProductTotalSalesType;
  previous_sales_total: ProductTotalSalesType;
}> = ({ sales_total, previous_sales_total }) => {
  const getColor = (
    field:
      | "total_sales"
      | "total_discounted_price"
      | "total_revenue"
      | "total_units_sold"
  ) => {
    return sales_total[field] === previous_sales_total[field]
      ? "text-slate-500"
      : sales_total[field] > previous_sales_total[field]
        ? "text-green-500"
        : "text-red-500";
  };

  const TrendIcon: FC<{
    field:
      | "total_sales"
      | "total_discounted_price"
      | "total_revenue"
      | "total_units_sold";
    className?: string;
  }> = ({ field, className }) => {
    return sales_total[field] ===
      previous_sales_total[field] ? null : sales_total[field] >
      previous_sales_total[field] ? (
      <TrendingUp className={className} strokeWidth={3} />
    ) : (
      <TrendingDown className={className} strokeWidth={3} />
    );
  };

  const SalesElement: FC<{
    field:
      | "total_sales"
      | "total_discounted_price"
      | "total_revenue"
      | "total_units_sold";
  }> = ({ field }) => (
    <div className="text-slate-500 flex flex-col gap-2">
      <h4 className="text-sm md:text-[16px] font-medium">
        {field === "total_sales"
          ? "Total Sales"
          : field === "total_units_sold"
            ? "Total Units Sold"
            : field === "total_discounted_price"
              ? "Total Discounted Given"
              : "Total Revenue Generated"}
      </h4>
      <div className="flex gap-2 text-sm items-center font-semibold">
        <span className="text-lg md:text-xl text-slate-800">
          {field !== "total_units_sold" ? "$" : ""}
          {sales_total[field]}
        </span>

        {(sales_total[field] > previous_sales_total[field] &&
          previous_sales_total[field]) ||
        (sales_total[field] < previous_sales_total[field] &&
          sales_total[field]) ? (
          <span className={getColor(field)}>
            {Math.round(
              sales_total[field] > previous_sales_total[field]
                ? (sales_total[field] / previous_sales_total[field]) * 100
                : (previous_sales_total[field] / sales_total[field]) * 100
            )}
            %
          </span>
        ) : null}
        <TrendIcon className={cn("size-5", getColor(field))} field={field} />
      </div>
    </div>
  );

  return (
    <div className="h-full max-w-xl w-full grid grid-cols-2 gap-x-6 gap-y-9">
      <SalesElement field="total_sales" />
      <SalesElement field="total_units_sold" />
      <SalesElement field="total_discounted_price" />
      <SalesElement field="total_revenue" />
    </div>
  );
};

export default ProductSalesAdoption;
