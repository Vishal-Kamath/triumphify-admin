import { FC } from "react";
import ProductsTable from "./product-table";
import { Separator } from "@/components/ui/separator";

const ProductDetailsPage: FC = () => {
  return (
    <main className="flex h-full min-h-full w-full flex-col gap-2 bg-white p-6">
      <div className="flex flex-col gap-6">
        <h2 className="text-lg font-semibold leading-none">Product Details</h2>
        <Separator />
      </div>
      <div className="h-full">
        <ProductsTable />
      </div>
    </main>
  );
};

export default ProductDetailsPage;
