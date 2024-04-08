import { useQuery } from "@tanstack/react-query";
import axios from "axios";

interface EmployeeSession {
  date: string;
  time: number;
}
const getSession = (): Promise<EmployeeSession[] & { type?: string }> =>
  axios
    .get<{ data: EmployeeSession[] & { type?: string } }>(
      `${process.env.ENDPOINT}/api/session`,
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
    )
    .then((res) => res.data.data)
    .catch((err) => err.response.data);

export const useSession = () =>
  useQuery({
    queryKey: ["session", "account"],
    queryFn: getSession,
    retry: 0,
    staleTime: 1000 * 60 * 15,
  });
