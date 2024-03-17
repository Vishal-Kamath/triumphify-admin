import { Banner } from "@/@types/banner";
import { queryClient } from "@/components/providers/reactquery.provider";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const getBanners = (
  type: "main" | "sub",
): Promise<Banner[] & { type?: string }> =>
  axios
    .get<{ data: Banner[] & { type?: string } }>(
      `${process.env.ENDPOINT}/api/banners/${type}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      },
    )
    .then((res) => res.data.data)
    .catch((err) => err.response.data);

export const useBanners = (type: "main" | "sub") =>
  useQuery({
    queryKey: ["banner", type],
    queryFn: () => getBanners(type),
    retry: 0,
    staleTime: 1000 * 60 * 15,
  });

const getBanner = (id: string): Promise<Banner & { type?: string }> =>
  axios
    .get(`${process.env.ENDPOINT}/api/banners/${id}`, {
      withCredentials: true,
    })
    .then((res) => res.data.data)
    .catch((err) => err.response.data);

export const useBanner = (type: "main" | "sub", id: string) =>
  useQuery({
    queryKey: ["banner", type, id],
    queryFn: () => getBanner(id),
    retry: 0,
    staleTime: 1000 * 60 * 15,
  });

export const invalidateAllBanners = (type: "main" | "sub") => {
  queryClient.invalidateQueries({
    queryKey: ["banner", type],
  });
};
