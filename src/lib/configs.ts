import { queryClient } from "@/components/providers/reactquery.provider";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const getGTMId = (): Promise<{ gtmId: string; type: string }> =>
  axios
    .get<{ data: { gtmId: string }; type: string }>(
      `${process.env.ENDPOINT}/api/configs/google-tag-manager`,
      { withCredentials: true },
    )
    .then((res) => res.data.data)
    .catch((err) => err.response.data);

export const useGTMId = () =>
  useQuery({
    queryKey: ["config", "gtmId"],
    queryFn: getGTMId,
    retry: 0,
    staleTime: 1000 * 60 * 15,
  });

export const invalidateGTMId = () =>
  queryClient.invalidateQueries({ queryKey: ["config", "gtmId"] });
