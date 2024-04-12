import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export interface SalesType {
  category_id: string;
  category_name: string;
  total_units_sold: number;
  total_discounted_price: number;
  total_sales: number;
}
export interface TotalSalesType {
  total_units_sold: number;
  total_discounted_price: number;
  total_sales: number;
  total_revenue: number;
}

export type SalesReturnType = {
  sales: SalesType[];
  sales_total: TotalSalesType;
  previous_sales_total: TotalSalesType;
};
const getSales = (
  type: "history" | "cancelled" | "returned",
  month: number,
  year: number
): Promise<CategorySalesReturnType & { type: string }> =>
  axios
    .get<{ data: CategorySalesReturnType & { type: string } }>(
      `${process.env.ENDPOINT}/api/sales?month=${month}&year=${year}&type=${type}`,
      { withCredentials: true }
    )
    .then((res) => res.data.data)
    .catch((err) => err.response.data);

export const useSales = (
  type: "history" | "cancelled" | "returned",
  month: number,
  year: number
) =>
  useQuery({
    queryKey: ["sales", type, month, year],
    queryFn: () => getSales(type, month, year),
    retry: 0,
    staleTime: 1000 * 60 * 15,
  });

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


  export interface ProductSalesType {
    product_id: string;
    product_name: string;
    created_date: Date;
    total_units_sold: number;
    total_discounted_price: number;
    total_sales: number;
  }
  export interface ProductTotalSalesType {
    total_units_sold: number;
    total_discounted_price: number;
    total_sales: number;
    total_revenue: number;
  }

  export type ProductSalesReturnType = {
    sales: ProductSalesType[];
    sales_total: ProductTotalSalesType;
    previous_sales_total: ProductTotalSalesType;
  };
  const getProductSales = (
    type: "history" | "cancelled" | "returned",
    productId: string,
    month: number,
    year: number
  ): Promise<ProductSalesReturnType & { type: string }> =>
    axios
      .get<{ data: ProductSalesReturnType & { type: string } }>(
        `${process.env.ENDPOINT}/api/sales/product/${productId}?month=${month}&year=${year}&type=${type}`,
        { withCredentials: true }
      )
      .then((res) => res.data.data)
      .catch((err) => err.response.data);

  export const useProductSales = (
    type: "history" | "cancelled" | "returned",
    productId: string,
    month: number,
    year: number
  ) =>
    useQuery({
      queryKey: ["sales", "product", productId, type, month, year],
      queryFn: () => getProductSales(type, productId, month, year),
      retry: 0,
      staleTime: 1000 * 60 * 15,
    });