import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export interface CategorySalesType {
  category_id: string;
  category_name: string;
  created_date: Date;
  total_units_sold: number;
  total_discounted_price: number;
  total_sales: number;
}
export interface CategoryTotalSalesType {
  total_units_sold: number;
  total_discounted_price: number;
  total_sales: number;
  total_revenue: number;
}

export type CategorySalesReturnType = {
  sales: CategorySalesType[];
  sales_total: CategoryTotalSalesType;
  previous_sales_total: CategoryTotalSalesType;
};
const getCategorySales = (
  type: "history" | "cancelled" | "returned",
  categoryId: string,
  month: number,
  year: number
): Promise<CategorySalesReturnType & { type: string }> =>
  axios
    .get<{ data: CategorySalesReturnType & { type: string } }>(
      `${process.env.ENDPOINT}/api/sales/category/${categoryId}?month=${month}&year=${year}&type=${type}`,
      { withCredentials: true }
    )
    .then((res) => res.data.data)
    .catch((err) => err.response.data);

export const useCategorySales = (
  type: "history" | "cancelled" | "returned",
  categoryId: string,
  month: number,
  year: number
) =>
  useQuery({
    queryKey: ["sales", "category", categoryId, type, month, year],
    queryFn: () => getCategorySales(type, categoryId, month, year),
    retry: 0,
    staleTime: 1000 * 60 * 15,
  });

interface ProductSalesType {
  product_id: string;
  product_name: string;
  product_images: string[];
  total_units_sold: string;
  total_discounted_price: string;
  total_sales: string;
}
const getProductSales = (
  type: "history" | "cancelled" | "returned",
  start: Date,
  end: Date
): Promise<ProductSalesType[] & { type: string }> =>
  axios
    .get<{ data: ProductSalesType[] & { type: string } }>(
      `${process.env.ENDPOINT}/api/sales/product?start=${start}&end=${end}&type=${type}`,
      { withCredentials: true }
    )
    .then((res) => res.data.data)
    .catch((err) => err.response.data);

export const useProductSales = (
  type: "history" | "cancelled" | "returned",
  start: Date,
  end: Date
) =>
  useQuery({
    queryKey: ["sales", "product", type, start, end],
    queryFn: () => getProductSales(type, start, end),
    retry: 0,
    staleTime: 1000 * 60 * 15,
  });
