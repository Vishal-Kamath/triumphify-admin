import { queryClient } from "@/components/providers/reactquery.provider";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

interface Privilage {
  data: "denied" | "granted";
  description: string;
  type: "error" | "success";
}

const getPrivilage = (path: string): Promise<Privilage & { type?: string }> =>
  axios
    .post<Privilage>(
      `${process.env.ENDPOINT}/api/employees/privilages`,
      {
        path,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
    )
    .then((res) => res.data)
    .catch((err) => err.response.data);

export const usePrivilage = (path: string) =>
  useQuery({
    queryKey: ["privilage", path],
    queryFn: () => getPrivilage(path),
    retry: 0,
    staleTime: 1000 * 60 * 15,
  });

export const invalidateAllPrivilages = () =>
  queryClient.invalidateQueries({ queryKey: ["privilage"] });
