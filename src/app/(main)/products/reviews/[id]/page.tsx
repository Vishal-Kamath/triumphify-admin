"use client";

import { Separator } from "@/components/ui/separator";
import { useProduct } from "@/lib/products";
import { ExternalLink, MoveLeft } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { FC, useState } from "react";
import ProductReviewStats from "./stats";
import ProductReviewsTable from "./reviews-table";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { useMe } from "@/lib/auth";

const ProductReviewPage: FC = () => {
  const id = useParams()["id"] as string;
  const { data: product } = useProduct(id);

  const { data: me } = useMe();

  const [startDate, setStartDate] = useState(
    new Date(new Date().setMonth(new Date().getMonth() - 1))
  );
  const [endDate, setEndDate] = useState(new Date());

  return (
    <main className="flex h-full min-h-full w-full gap-9 flex-col bg-white p-6">
      <div className="flex items-center gap-2">
        <Link
          href="/products/reviews"
          className={cn(buttonVariants({ variant: "ghost" }))}
        >
          <MoveLeft className="h-6 w-6" />
        </Link>
        <h2 className="text-lg font-semibold leading-none">{product?.name}</h2>
        <Link href={`/products/details/${id}`}>
          <ExternalLink className="h-4 w-4" />
        </Link>
      </div>
      {me && me.role !== "employee" ? (
        <>
          <Separator />
          <ProductReviewStats startDate={startDate} endDate={endDate} />
        </>
      ) : null}
      <Separator />
      <ProductReviewsTable
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
        setEndDate={setEndDate}
      />
    </main>
  );
};

export default ProductReviewPage;
