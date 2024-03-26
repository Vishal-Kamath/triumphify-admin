"use client";

import { Separator } from "@/components/ui/separator";
import { FC } from "react";
import UpdateProductForm from "./update-product-form";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { MoveLeft } from "lucide-react";
import TabComponent from "@/components/misc/component";
import { useSearchParams } from "next/navigation";

const UpdateProductPage: FC = () => {
  const redirect =
    (useSearchParams().get("redirect") as string | undefined) ||
    "/products/details";

  return (
    <TabComponent>
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <Link
            href={redirect}
            className={buttonVariants({ variant: "ghost" })}
          >
            <MoveLeft />
          </Link>
          <h3 className="text-xl font-medium">Update Product</h3>
        </div>
        <p className="text-sm text-gray-500">
          fill in the form below to create new product.
        </p>
      </div>
      <Separator />
      <UpdateProductForm />
    </TabComponent>
  );
};

export default UpdateProductPage;
