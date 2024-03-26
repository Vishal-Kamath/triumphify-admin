import { useMe } from "@/lib/auth";
import { FC } from "react";
import ProductVariationSales from "./product-report-variation-sales";
import { Separator } from "@/components/ui/separator";

const ProductReport: FC<{ type: "history" | "cancelled" }> = () => {
  const { data: me, isLoading } = useMe();
  if (isLoading) return <div>Loading...</div>;
  if (!me || me.role !== "superadmin") return null;

  return (
    <div className="flex flex-col gap-12">
      <div className="flex flex-col gap-9">
        <div className="flex flex-col gap-1">
          <h2 className="text-xl font-semibold">Sales History</h2>
          <Separator />
        </div>
        <ProductVariationSales type="history" />
      </div>
      <div className="flex flex-col gap-9">
        <div className="flex flex-col gap-1">
          <h2 className="text-xl font-semibold">Cancelled Sales History</h2>
          <Separator />
        </div>
        <ProductVariationSales type="cancelled" />
      </div>
    </div>
  );
};

export default ProductReport;
