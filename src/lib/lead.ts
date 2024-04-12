import { queryClient } from "@/components/providers/reactquery.provider";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const getleads = (
  status?: Lead["status"]
): Promise<Lead[] & { type: string }> =>
  axios
    .get<{ data: Lead[] & { type: string } }>(
      `${process.env.ENDPOINT}/api/leads${status ? `?status=${status}` : ""}`,
      { withCredentials: true }
    )
    .then((res) => res.data.data)
    .catch((err) => err.response.data);

export const useLeads = (status?: Lead["status"]) =>
  useQuery({
    queryKey: ["leads", status],
    queryFn: () => getleads(status),
    retry: 0,
    staleTime: 1000 * 60 * 15,
    refetchInterval: 1000 * 3,
  });

export const invalidateAllLeads = () =>
  queryClient.invalidateQueries({ queryKey: ["leads"] });


const getAllActions = (): Promise<Action[] & { type: string }> =>
  axios
    .get<{ data: Action[] & { type: string } }>(
      `${process.env.ENDPOINT}/api/leads/actions`,
      { withCredentials: true }
    )
    .then((res) => res.data.data)
    .catch((err) => err.response.data);

export const useActions = () =>
  useQuery({
    queryKey: ["leads", "actions"],
    queryFn: getAllActions,
    retry: 0,
    staleTime: 1000 * 60 * 15,
    refetchInterval: 1000 * 3,
  });
