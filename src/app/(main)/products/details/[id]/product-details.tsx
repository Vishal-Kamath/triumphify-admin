import { Product } from "@/@types/product";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { FC } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

const ProductDetails: FC<{ product: Product }> = ({ product }) => {
  const pathname = usePathname();
  const redirect = useSearchParams().get("redirect");

  return (
    <div className="flex w-full flex-col gap-6 pt-12 lg:w-2/3">
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <p className="text-sm font-light text-slate-600">
            {product.brand_name}
          </p>
        </div>
        <h3 className="break-words text-2xl font-semibold lg:text-3xl">
          {product.name}
        </h3>
      </div>

      <div className="text-sm text-gray-900">{product.description}</div>

      <Accordion type="single" collapsible>
        {product.product_accordians &&
          product.product_accordians.map((description, index) => (
            <AccordionItem
              key={description.title + index}
              value={"item" + index}
            >
              <AccordionTrigger>{description.title}</AccordionTrigger>
              <AccordionContent className="text-xs">
                {description.description}
              </AccordionContent>
            </AccordionItem>
          ))}
      </Accordion>
    </div>
  );
};

export default ProductDetails;
