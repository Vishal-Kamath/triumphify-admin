import { Separator } from "@/components/ui/separator";
import { FC } from "react";
import ReviewsTable from "./reviews-table";

const ProductReviewsPage: FC = () => {
  return (
    <main className="flex h-full min-h-full w-full flex-col gap-6 bg-white p-6">
      <h2 className="text-lg font-semibold leading-none">Product Reviews</h2>
      <Separator />
      <div className="h-full">
        <ReviewsTable />
      </div>
    </main>
  );
};

export default ProductReviewsPage;
