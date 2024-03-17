import { Category } from "@/@types/category";
import { queryClient } from "@/components/providers/reactquery.provider";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const getAllCategories = (): Promise<Category[] & { type?: string }> =>
  axios
    .get<{ data: Category[]; type: "success" | "error" }>(
      `${process.env.ENDPOINT}/api/categories/`,
      { withCredentials: true },
    )
    .then((res) => res.data.data)
    .catch((err) => err.response.data);

export const useCategories = () =>
  useQuery({
    queryKey: ["categories"],
    queryFn: getAllCategories,
    retry: 0,
    staleTime: 1000 * 60 * 15,
  });

const getCategory = (id: string): Promise<Category & { type?: string }> =>
  axios
    .get(`${process.env.ENDPOINT}/api/categories/${id}`, {
      withCredentials: true,
    })
    .then((res) => res.data.data)
    .catch((err) => err.response.data);

export const useCategory = (id: string) =>
  useQuery({
    queryKey: ["categories", id],
    queryFn: () => getCategory(id),
    retry: 0,
    staleTime: 1000 * 60 * 15,
  });

export const invalidateAllCategories = () =>
  queryClient.invalidateQueries({ queryKey: ["categories"] });

export const invalidateCategory = (id: string) =>
  queryClient.invalidateQueries({ queryKey: ["categories", id] });
