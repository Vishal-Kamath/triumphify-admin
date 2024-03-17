import { Attribute } from "@/@types/attribute";
import { queryClient } from "@/components/providers/reactquery.provider";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const getAllAttributes = (): Promise<Attribute[] & { type?: string }> =>
  axios
    .get(`${process.env.ENDPOINT}/api/attributes/`, { withCredentials: true })
    .then((res) => res.data.data)
    .catch((err) => err.response.data);

export const useAttributes = () =>
  useQuery({
    queryKey: ["attributes"],
    queryFn: getAllAttributes,
    retry: 0,
    staleTime: 1000 * 60 * 15,
  });

const getAttribute = (id: string): Promise<Attribute & { type?: string }> =>
  axios
    .get(`${process.env.ENDPOINT}/api/attributes/${id}`, {
      withCredentials: true,
    })
    .then((res) => res.data.data)
    .catch((err) => err.response.data);

export const useAttribute = (id: string) =>
  useQuery({
    queryKey: ["attributes", id],
    queryFn: () => getAttribute(id),
    retry: 0,
    staleTime: 1000 * 60 * 15,
  });

export const invalidateAllAttributes = () =>
  queryClient.invalidateQueries({ queryKey: ["attributes"] });

export const invalidateAttribute = (id: string) =>
  queryClient.invalidateQueries({ queryKey: ["attributes", id] });
