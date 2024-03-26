import { Order, OrderDetails } from "@/@types/order";
import { queryClient } from "@/components/providers/reactquery.provider";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const getAllOrders = (): Promise<Order[]> =>
  axios
    .get<{ data: Order[]; type: string }>(
      `${process.env.ENDPOINT}/api/employee/orders`,
      { withCredentials: true }
    )
    .then((res) => res.data.data)
    .catch((err) => err.response.data);

export const useOrders = () =>
  useQuery({
    queryKey: ["orders"],
    queryFn: getAllOrders,
    retry: 0,
    staleTime: 1000 * 60 * 15,
  });

export const invalidateAllOrders = () => {
  queryClient.invalidateQueries({
    queryKey: ["orders"],
  });
};

interface GetOrderById {
  order: Order;
  order_details: OrderDetails;
  all_orders: Order[];
}
const getOrder = (orderId: string): Promise<GetOrderById & { type: string }> =>
  axios
    .get<{ data: GetOrderById & { type: string } }>(
      `${process.env.ENDPOINT}/api/employee/orders/${orderId}`,
      { withCredentials: true }
    )
    .then((res) => res.data.data)
    .catch((err) => err.response.data);

export const useOrder = (orderId: string) =>
  useQuery({
    queryKey: ["orders", orderId],
    queryFn: () => getOrder(orderId),
    retry: 0,
    staleTime: 1000 * 60 * 15,
  });

export const invalidateOrder = (orderId: string) => {
  queryClient.invalidateQueries({
    queryKey: ["orders", orderId],
  });
};

export interface AnalyticsListType {
  product_id: string;
  product_name: string;
  product_description: string | null;
  product_image: string | null;
  total_units_sold: string | null;
  total_discounted_price: string | null;
  total_sales: string | null;
}
[];
const getAnalyticsList = (): Promise<AnalyticsListType[] & { type: string }> =>
  axios
    .get<{ data: AnalyticsListType[] & { type: string } }>(
      `${process.env.ENDPOINT}/api/orders/analytics`,
      { withCredentials: true },
    )
    .then((res) => res.data.data)
    .catch((err) => err.response.data);

export const useAnalyticsList = () =>
  useQuery({
    queryKey: ["analytics"],
    queryFn: getAnalyticsList,
    retry: 0,
    staleTime: 1000 * 60 * 15,
  });

interface VariationSaleType {
  variation_key: Record<string, string>;
  total_units_sold: string | null;
  total_discounted_price: string | null;
  total_sales: string | null;
}
[];
const getVariationSale = (
  id: string,
  type: "history" | "cancelled" | "returned",
  start: Date,
  end: Date
): Promise<VariationSaleType[] & { type: string }> =>
  axios
    .get<{ data: VariationSaleType[] & { type: string } }>(
      `${process.env.ENDPOINT}/api/orders/analytics/${id}/variations?start=${start}&end=${end}&type=${type}`,
      { withCredentials: true }
    )
    .then((res) => res.data.data)
    .catch((err) => err.response.data);

export const useVariationSale = (
  id: string,
  type: "history" | "cancelled" | "returned",
  start: Date,
  end: Date
) =>
  useQuery({
    queryKey: ["analytics", id, "variations", type, start, end],
    queryFn: () => getVariationSale(id, type, start, end),
    retry: 0,
    staleTime: 1000 * 60 * 15,
  });