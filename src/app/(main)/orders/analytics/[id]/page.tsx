"use client";

import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useProduct } from "@/lib/products";
import { cn } from "@/lib/utils";
import { ExternalLink, MoveLeft } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { FC, useState } from "react";
import OrderAnalyticsDateRange from "./date-range";
import OrderVariationSale from "./variation-sales";

const ProductAnalyticsPage: FC = () => {
  const id = useParams()["id"] as string;
  const { data: product } = useProduct(id);

  const [startDate, setStartDate] = useState(
    new Date(new Date().setMonth(new Date().getMonth() - 1)),
  );
  const [endDate, setEndDate] = useState(new Date());

  return (
    <main className="flex h-full min-h-full w-full flex-col gap-6 bg-white p-6">
      <div className="flex items-center gap-2">
        <Link
          href="/orders/analytics"
          className={cn(buttonVariants({ variant: "ghost" }))}
        >
          <MoveLeft className="h-6 w-6" />
        </Link>
        <h2 className="text-lg font-semibold leading-none">{product?.name}</h2>
        <Link href={`/products/details/${id}`}>
          <ExternalLink className="h-4 w-4" />
        </Link>
      </div>
      <Separator />
      <div className="flex h-full flex-col gap-6">
        <OrderAnalyticsDateRange
          startDate={startDate}
          setStartDate={setStartDate}
          endDate={endDate}
          setEndDate={setEndDate}
        />
        <div className="flex gap-6">
          <OrderVariationSale id={id} startDate={startDate} endDate={endDate} />
        </div>
      </div>
    </main>
  );
};

export default ProductAnalyticsPage;
