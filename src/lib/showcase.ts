import { Showcase } from "@/@types/product";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export interface ShowcaseProduct {
  id: string;
  name: string;
  slug: string;
  brand_name: string;
  product_images: unknown;
  showcases: number;
  created_at: Date;
  updated_at: Date | null;
}

const getShowcaseProductList = async (): Promise<
  ShowcaseProduct[] & { type?: string }
> =>
  axios
    .get<{ data: ShowcaseProduct[] & { type?: string } }>(
      `${process.env.ENDPOINT}/api/showcases`,
      {
        withCredentials: true,
      },
    )
    .then((res) => res.data.data)
    .catch((err) => err.response.data);

export const useShowcaseProductList = () =>
  useQuery({
    queryKey: ["showcase"],
    queryFn: getShowcaseProductList,
    retry: 0,
    staleTime: 1000 * 60 * 15,
  });

const getShowcases = async (
  id: string,
): Promise<Showcase[] & { type?: string }> =>
  axios
    .get<{ data: Showcase[] & { type?: string } }>(
      `${process.env.ENDPOINT}/api/showcases/${id}`,
      {
        withCredentials: true,
      },
    )
    .then((res) => res.data.data)
    .catch((err) => err.response.data);

export const useShowcases = (id: string) =>
  useQuery({
    queryKey: ["showcase", id],
    queryFn: () => getShowcases(id),
    retry: 0,
    staleTime: 1000 * 60 * 15,
  });
