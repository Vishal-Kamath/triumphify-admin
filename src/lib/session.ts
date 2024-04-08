import { useQuery } from "@tanstack/react-query";
import axios from "axios";

interface EmployeeSession {
  date: string;
  padding: boolean;
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

const getEmployeeSession = (
  id: string
): Promise<EmployeeSession[] & { type?: string }> =>
  axios
    .get<{ data: EmployeeSession[] & { type?: string } }>(
      `${process.env.ENDPOINT}/api/session/${id}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
    )
    .then((res) => res.data.data)
    .catch((err) => err.response.data);

export const useEmployeeSession = (id: string) =>
  useQuery({
    queryKey: ["session", id],
    queryFn: () => getEmployeeSession(id),
    retry: 0,
    staleTime: 1000 * 60 * 15,
    refetchInterval: 60 * 1000,
  });