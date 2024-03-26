import { useMe } from "@/lib/auth";
import { FC } from "react";
import ProductVariationSales from "./product-report-variation-sales";

const ProductReport: FC = () => {
  const { data: me, isLoading } = useMe();
  if (isLoading) return <div>Loading...</div>;
  if (!me || me.role !== "superadmin") return null;

  return (
    <div className="flex flex-col gap-6">
      <ProductVariationSales />
    </div>
  );
};

export default ProductReport;
