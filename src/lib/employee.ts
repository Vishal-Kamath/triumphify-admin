import { Employee, EmployeeLog, EmployeeLogList } from "@/@types/employee";
import { queryClient } from "@/components/providers/reactquery.provider";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const getEmployees = (): Promise<Employee[] & { type?: string }> =>
  axios
    .get<{ data: Employee[] }>(`${process.env.ENDPOINT}/api/employees`, {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    })
    .then((res) => res.data.data);

export const useEmployees = () =>
  useQuery({
    queryKey: ["employees"],
    queryFn: getEmployees,
    retry: 0,
    staleTime: 1000 * 60 * 15,
  });

  const getSuperadmins = (): Promise<Employee[] & { type?: string }> =>
    axios
      .get<{ data: Employee[] }>(
        `${process.env.ENDPOINT}/api/employees/superadmins`,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      )
      .then((res) => res.data.data);

  export const useSuperadmins = () =>
    useQuery({
      queryKey: ["employees", "superadmins"],
      queryFn: getSuperadmins,
      retry: 0,
      staleTime: 1000 * 60 * 15,
    });

const getEmployee = (id: string): Promise<Employee & { type?: string }> =>
  axios
    .get(`${process.env.ENDPOINT}/api/employees/details/${id}`, {
      withCredentials: true,
    })
    .then((res) => res.data.data)
    .catch((err) => err.response.data);

export const useEmployee = (id: string) =>
  useQuery({
    queryKey: ["employee-details", id],
    queryFn: () => getEmployee(id),
    retry: 0,
    staleTime: 1000 * 60 * 15,
  });

export const invalidateAllEmployees = () =>
  queryClient.invalidateQueries({ queryKey: ["employees"] });

export const invalidateAllEmployee = (id: string) =>
  queryClient.invalidateQueries({ queryKey: ["employee-details", id] });

const getLogsList = (): Promise<EmployeeLogList & { type?: string }> =>
  axios
    .get(`${process.env.ENDPOINT}/api/employees/logs`, {
      withCredentials: true,
    })
    .then((res) => res.data.data)
    .catch((err) => err.response.data);

export const useEmployeeLogs = () =>
  useQuery({
    queryKey: ["employee-logs"],
    queryFn: getLogsList,
    retry: 0,
    staleTime: 1000 * 60 * 15,
  });

const getEmployeeLog = (
  name: string
): Promise<EmployeeLog[] & { type?: string }> =>
  axios
    .get(`${process.env.ENDPOINT}/api/employees/logs/${name}`, {
      withCredentials: true,
    })
    .then((res) => res.data.data)
    .catch((err) => err.response.data);

export const useEmployeeLog = (name: string) =>
  useQuery({
    queryKey: ["employee-log", name],
    queryFn: () => getEmployeeLog(name),
    retry: 0,
    staleTime: 1000 * 60 * 15,
  });
