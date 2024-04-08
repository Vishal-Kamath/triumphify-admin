import { useQuery } from "@tanstack/react-query";
import axios from "axios";

interface CategorySalesType {
  category_id: string;
  category_name: string;
  total_units_sold: string;
  total_discounted_price: string;
  total_sales: string;
}
const getCategorySales = (
  type: "history" | "cancelled" | "returned",
  start: Date,
  end: Date
): Promise<CategorySalesType[] & { type: string }> =>
  axios
    .get<{ data: CategorySalesType[] & { type: string } }>(
      `${process.env.ENDPOINT}/api/sales/category?start=${start}&end=${end}&type=${type}`,
      { withCredentials: true }
    )
    .then((res) => res.data.data)
    .catch((err) => err.response.data);

export const useCategorySales = (
  type: "history" | "cancelled" | "returned",
  start: Date,
  end: Date
) =>
  useQuery({
    queryKey: ["sales", "category", type, start, end],
    queryFn: () => getCategorySales(type, start, end),
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
