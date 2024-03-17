import { FC } from "react";
import ProductShowcaseTable from "./showcase-table";
import { Separator } from "@/components/ui/separator";

const ShowcasePage: FC = () => {
  return (
    <main className="flex h-full min-h-full w-full flex-col gap-6 bg-white p-6">
      <h2 className="text-lg font-semibold leading-none">Product Showcases</h2>
      <Separator />
      <div className="h-full">
        <ProductShowcaseTable />
      </div>
    </main>
  );
};

export default ShowcasePage;
