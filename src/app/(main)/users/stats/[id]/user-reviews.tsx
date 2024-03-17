"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUserReviews } from "@/lib/user";
import { RefreshCw } from "lucide-react";
import { useParams } from "next/navigation";
import { useState } from "react";
import {
  LuChevronLeft,
  LuChevronRight,
  LuChevronsLeft,
  LuChevronsRight,
} from "react-icons/lu";
import ReviewComponent from "./review-component";
import Pagination from "@/components/misc/pagination";

const AccountUserReviews = () => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const id = useParams()["id"] as string;

  const { data: reviews, isLoading, refetch } = useUserReviews(id);

  const filterReviews = reviews?.filter((review, index) =>
    review.review_title.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil((filterReviews?.length || 1) / 3);

  const filterReviewsPaginated = filterReviews?.slice((page - 1) * 3, page * 3);
  return (
    <div className="flex flex-col gap-6 lg:gap-9">
      <h3 className="text-lg font-medium text-slate-500">User Reviews</h3>
      <div className="flex flex-col gap-6">
        <div className="flex gap-3">
          <Input
            placeholder="Search on Review title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Button
            variant="secondary"
            className="group active:bg-purple-100"
            onClick={() => refetch()}
          >
            <RefreshCw className="h-3 w-3 group-active:animate-spin " />
          </Button>
        </div>
        <div className="flex flex-col gap-3">
          {filterReviewsPaginated?.map((review) => (
            <ReviewComponent key={review.id} review={review} />
          ))}
          {
            // Loading
            isLoading && (
              <div className="flex justify-center">
                <RefreshCw className="h-6 w-6 animate-spin" />
              </div>
            )
          }
          {filterReviewsPaginated?.length === 0 && (
            <div className="flex justify-center py-12 text-lg font-medium text-slate-500">
              No reviews found
            </div>
          )}
        </div>

        {/* Pagination */}
        <Pagination page={page} setPage={setPage} totalPages={totalPages} />
      </div>
    </div>
  );
};

export default AccountUserReviews;
