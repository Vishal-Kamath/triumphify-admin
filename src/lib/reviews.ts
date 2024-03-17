import {
  ProductReview,
  ProductReviewStats,
  ProductReviewTableType,
} from "@/@types/product";
import { queryClient } from "@/components/providers/reactquery.provider";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const getReviews = (): Promise<ProductReviewTableType[] & { type?: string }> =>
  axios
    .get<{ data: ProductReviewTableType[] & { type?: string } }>(
      `${process.env.ENDPOINT}/api/products/reviews`,
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      },
    )
    .then((res) => res.data.data)
    .catch((err) => err.response.data);

export const useReviews = () =>
  useQuery({
    queryKey: ["reviews"],
    queryFn: getReviews,
    retry: 0,
    staleTime: 1000 * 60 * 15,
  });

const getAllProductReviewsStats = (
  id: string,
  start: Date,
  end: Date,
): Promise<ProductReviewStats & { type: string }> =>
  axios
    .get<{ data: ProductReviewStats & { type: string } }>(
      `${process.env.ENDPOINT}/api/products/reviews/${id}/stats?start=${start}&end=${end}`,
      {
        withCredentials: true,
      },
    )
    .then((res) => res.data.data)
    .catch((err) => err.response.data);

export const useProductReviewsStats = (id: string, start: Date, end: Date) =>
  useQuery({
    queryKey: ["reviews", id, "stats", start, end],
    queryFn: () => getAllProductReviewsStats(id, start, end),
    retry: 0,
    staleTime: 1000 * 60 * 15,
  });

const getAllProductReviews = (
  id: string,
  start: Date,
  end: Date,
): Promise<ProductReview[] & { type: string }> =>
  axios
    .get<{ data: ProductReview[] & { type: string } }>(
      `${process.env.ENDPOINT}/api/products/reviews/${id}?start=${start}&end=${end}`,
      {
        withCredentials: true,
      },
    )
    .then((res) => res.data.data)
    .catch((err) => err.response.data);

export const useProductReviews = (id: string, start: Date, end: Date) =>
  useQuery({
    queryKey: ["reviews", id, start, end],
    queryFn: () => getAllProductReviews(id, start, end),
    retry: 0,
    staleTime: 1000 * 60 * 15,
  });

export const invalidateProductReviews = (
  id: string,
  start: Date,
  end: Date,
) => {
  queryClient.invalidateQueries({
    queryKey: ["reviews", id, start, end],
  });
};
