import { Separator } from "@/components/ui/separator";
import { FC } from "react";
// import CategorySalesReport from "./category-report";
import ProductSalesReport from "./product-report";

const AnalyticsPage: FC = () => {
  return (
    <main className="flex h-full min-h-full w-full flex-col gap-6 bg-white p-6">
      <h2 className="text-lg font-semibold leading-none">Order Analytics</h2>
      <Separator />
      <div className="flex flex-col gap-9">
        <div className="flex flex-col gap-2">
          <h2 className="text-lg font-semibold">Product Sales</h2>
          <Separator />
        </div>
        <ProductSalesReport type="history" />
      </div>
      <div className="flex flex-col gap-9">
        <div className="flex flex-col gap-2">
          <h2 className="text-lg font-semibold">Category Sales History</h2>
          <Separator />
        </div>
        {/* <CategorySalesReport type="history" /> */}
      </div>
      <div className="flex flex-col gap-9">
        <div className="flex flex-col gap-2">
          <h2 className="text-lg font-semibold">
            Category Cancelled Sales History
          </h2>
          <Separator />
        </div>
        {/* <CategorySalesReport type="cancelled" /> */}
      </div>
    </main>
  );
};

export default AnalyticsPage;
