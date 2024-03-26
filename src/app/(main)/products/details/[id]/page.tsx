"use client";

import { FC, Suspense } from "react";
import ProductsDisplaySection from "./product-display-section";

const UpdateProductPage: FC = () => {
  return (
    <div className="flex flex-col px-6 w-full gap-16 py-9">
      <Suspense>
        <ProductsDisplaySection />
      </Suspense>
    </div>
  );
};

export default UpdateProductPage;
