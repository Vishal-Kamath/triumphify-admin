import { Product, ProductDetails } from "@/@types/product";
import { queryClient } from "@/components/providers/reactquery.provider";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const getProducts = (): Promise<Product[] & { type?: string }> =>
  axios
    .get<{ data: Product[] & { type?: string } }>(
      `${process.env.ENDPOINT}/api/products/`,
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      },
    )
    .then((res) => res.data.data)
    .catch((err) => err.response.data);

export const useProducts = () =>
  useQuery({
    queryKey: ["products"],
    queryFn: getProducts,
    retry: 0,
    staleTime: 1000 * 60 * 15,
  });

const getProduct = (id: string): Promise<ProductDetails & { type?: string }> =>
  axios
    .get(`${process.env.ENDPOINT}/api/products/${id}`, {
      withCredentials: true,
    })
    .then((res) => res.data.data)
    .catch((err) => err.response.data);

export const useProduct = (id: string) =>
  useQuery({
    queryKey: ["products", id],
    queryFn: () => getProduct(id),
    retry: 0,
    staleTime: 1000 * 60 * 15,
  });

export const invalidateAllProducts = () => {
  queryClient.invalidateQueries({
    queryKey: ["products"],
  });
};
