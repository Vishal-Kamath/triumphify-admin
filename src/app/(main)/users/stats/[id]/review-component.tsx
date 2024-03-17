import { ProductReview } from "@/@types/product";
import AvatarElement from "@/components/misc/avatar-element";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { dateFormater } from "@/utils/dateFormater";
import { Check, Clock4, ExternalLink, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FC } from "react";
import { FaStar } from "react-icons/fa";

const ReviewComponent: FC<{ review: ProductReview }> = ({ review }) => {
  const pathname = usePathname();
  return (
    <div className="flex w-full flex-col gap-9">
      <div className="flex items-start gap-6">
        <AvatarElement
          image={review.user_image}
          username={review.user_username}
          className="h-14 w-14"
        />
        <div className="flex flex-col gap-1">
          <div className="flex justify-between">
            <h4 className="text-xl font-semibold">{review.user_username}</h4>
            <div className="flex gap-3">
              <Link
                href={`/products/details/${review.product_id}?redirect=${encodeURIComponent(pathname)}`}
                className="ml-auto flex h-7 w-7 items-center justify-center rounded-full border-1 border-slate-200 text-slate-500 hover:border-slate-500 hover:text-slate-700"
              >
                <ExternalLink className="h-4 w-4" />
              </Link>
              <Badge
                variant="outline"
                className={cn(
                  review.status === "approved"
                    ? "border-green-500 bg-green-50 text-green-500"
                    : review.status === "pending"
                      ? "border-yellow-500 bg-yellow-50 text-yellow-500"
                      : "border-red-500 bg-red-50 text-red-500",
                  "w-fit font-medium"
                )}
              >
                {review.status === "approved" ? (
                  <Check className="h-3 w-3 lg:hidden" />
                ) : review.status === "pending" ? (
                  <Clock4 className="h-3 w-3 lg:hidden" />
                ) : (
                  <X className="h-3 w-3 lg:hidden" />
                )}
                <span className="capitalize max-lg:hidden">
                  {review.status}
                </span>
              </Badge>
            </div>
          </div>
          <p className="text-xs text-slate-400">
            on{" "}
            {dateFormater(
              new Date(review.updated_at || review.created_at),
              true,
              true
            )}
          </p>
          <div className="mt-2 flex items-center gap-2">
            {[1, 2, 3, 4, 5].map((rating, index) => (
              <FaStar
                key={index}
                className={cn(
                  "h-4 w-4",
                  rating <= review.rating ? "text-yellow-400" : "text-slate-200"
                )}
              />
            ))}
          </div>
          <h5 className="mt-6 text-[16px] font-medium text-slate-800 max-lg:hidden">
            {review.review_title}
          </h5>
          <p className="text-sm text-slate-600 max-lg:hidden">
            {review.review_description}
          </p>
        </div>
      </div>
      <div className="flex flex-col gap-2 lg:hidden">
        <h5 className="text-[16px] font-medium text-slate-800">
          {review.review_title}
        </h5>
        <p className="mt-1 text-sm text-slate-600">
          {review.review_description}
        </p>
      </div>
      <Separator />
    </div>
  );
};

export default ReviewComponent;
