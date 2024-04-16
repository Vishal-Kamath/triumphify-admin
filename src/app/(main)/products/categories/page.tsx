import { FC } from "react";
import CategoryTable from "./category-table";
import { Separator } from "@/components/ui/separator";

const ProductCategoriesPage: FC = () => {
  return (
    <main className="flex h-full min-h-full w-full flex-col gap-2 bg-white p-6">
      <div className="flex flex-col gap-6">
        <h2 className="text-lg font-semibold leading-none">Category Details</h2>
        <Separator />
      </div>
      <div className="h-full">
        <CategoryTable />
      </div>
    </main>
  );
};

export default ProductCategoriesPage;
