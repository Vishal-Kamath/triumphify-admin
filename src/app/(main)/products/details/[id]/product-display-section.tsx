"use client";

import { useProduct } from "@/lib/products";
import { useParams, usePathname, useSearchParams } from "next/navigation";
import { FC } from "react";
import ProductImages from "./products-image";
import ProductDetails from "./product-details";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { MoveLeft, PencilLine } from "lucide-react";
import ProductVariations from "./product-variations";

const ProductsDisplaySection: FC = () => {
  const id = useParams()["id"] as string;
  const { data: product, isLoading } = useProduct(id);

  const pathname = usePathname();
  const redirect =
    (useSearchParams().get("redirect") as string | undefined) ||
    "/products/details";

  if (isLoading) return <div>Loading...</div>;
  return product ? (
    <div className="max-w-6xl w-full mx-auto flex flex-col gap-6">
      <div className="flex justify-between items-center gap-6">
        <Link
          className={cn(
            buttonVariants({ variant: "ghost" }),
            "w-fit rounded-full gap-2"
          )}
          href={redirect}
        >
          <MoveLeft className="size-4" />
          <span>Back</span>
        </Link>
        <Link
          className="text-sm flex gap-1 text-slate-500 hover:text-blue-700 items-center"
          href={
            pathname +
            "/edit" +
            (redirect
              ? `?redirect=${encodeURIComponent(pathname + "?redirect=" + encodeURIComponent(redirect))}`
              : "")
          }
        >
          <PencilLine className="size-4" />
          <span>Edit</span>
        </Link>
      </div>
      <ProductVariations product={product} />
      <div className="flex items-start gap-9 max-lg:flex-col">
        <ProductImages name={product.name} images={product.product_images} />
        <ProductDetails product={product} />
      </div>
    </div>
  ) : null;
};

export default ProductsDisplaySection;
