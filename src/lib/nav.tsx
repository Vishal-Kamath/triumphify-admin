import { useQuery } from "@tanstack/react-query";
import axios from "axios";

type Nav = {
  leads?: string;
  orders?: string;
  tickets?: string;
};
const getNav = (): Promise<Nav & { type: string }> =>
  axios
    .get<{ data: Nav & { type: string } }>(`${process.env.ENDPOINT}/api/nav`, {
      withCredentials: true,
    })
    .then((res) => res.data.data)
    .catch((err) => err.response.data);

export const useNav = () =>
  useQuery({
    queryKey: ["nav"],
    queryFn: getNav,
    retry: 0,
    staleTime: 1000 * 60 * 15,
    refetchInterval: 1000 * 3,
  });
