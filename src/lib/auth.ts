import { Employee } from "@/@types/employee";
import { queryClient } from "@/components/providers/reactquery.provider";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const getMe = (): Promise<Employee & { type?: string }> =>
  axios
    .get<{ data: Employee & { type?: string } }>(
      `${process.env.ENDPOINT}/api/employees/details`,
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      },
    )
    .then((res) => res.data.data)
    .catch((err) => err.response.data);

export const useMe = () =>
  useQuery({
    queryKey: ["user-details"],
    queryFn: getMe,
    retry: 0,
    staleTime: 1000 * 60 * 15,
  });

export const invalidateUserData = () => {
  queryClient.invalidateQueries({
    queryKey: ["user-details"],
  });
};
