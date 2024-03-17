import { Cart } from "@/@types/cart";
import { Order } from "@/@types/order";
import { ProductReview } from "@/@types/product";
import { User } from "@/@types/user";
import { queryClient } from "@/components/providers/reactquery.provider";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const getUsers = (): Promise<User[] & { type?: string }> =>
  axios
    .get<{ data: User[] & { type?: string } }>(
      `${process.env.ENDPOINT}/api/user`,
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      },
    )
    .then((res) => res.data.data);

export const useUsers = () =>
  useQuery({
    queryKey: ["users"],
    queryFn: getUsers,
  });

const getUser = (id: string): Promise<User & { type?: string }> =>
  axios
    .get<{ data: User & { type?: string } }>(
      `${process.env.ENDPOINT}/api/user/${id}`,
      {
        withCredentials: true,
      },
    )
    .then((res) => res.data.data)
    .catch((err) => err.response.data);

export const useUser = (id: string) =>
  useQuery({
    queryKey: ["users", id],
    queryFn: () => getUser(id),
  });

const getUserOrders = (id: string): Promise<Order[] & { type?: string }> =>
  axios
    .get(`${process.env.ENDPOINT}/api/user/${id}/orders`, {
      withCredentials: true,
    })
    .then((res) => res.data.data)
    .catch((err) => err.response.data);

export const useUserOrders = (id: string) =>
  useQuery({
    queryKey: ["users", id, "orders"],
    queryFn: () => getUserOrders(id),
  });

const getUserReviews = (
  id: string,
): Promise<ProductReview[] & { type?: string }> =>
  axios
    .get(`${process.env.ENDPOINT}/api/user/${id}/reviews`, {
      withCredentials: true,
    })
    .then((res) => res.data.data)
    .catch((err) => err.response.data);

export const useUserReviews = (id: string) =>
  useQuery({
    queryKey: ["users", id, "reviews"],
    queryFn: () => getUserReviews(id),
  });


interface UserStats {
  total_returned_orders_price: string | null;
  total_cancelled_orders_price: string | null;
  total_orders_price: string | null;
  total_orders_placed: string | null;
  total_amount_spent: string | null;
}
const getUserStats = (id: string): Promise<UserStats & { type?: string }> =>
  axios
    .get(`${process.env.ENDPOINT}/api/user/${id}/stats`, {
      withCredentials: true,
    })
    .then((res) => res.data.data)
    .catch((err) => err.response.data);

export const useUserStats = (id: string) =>
  useQuery({
    queryKey: ["users", id, "stats"],
    queryFn: () => getUserStats(id),
  });

interface UserTop {
  user_id: string;
  user_username: string | null;
  user_email: string;
  user_image: string | null;
  total_spent: string | null;
}
const getUserTop = (): Promise<UserTop[] & { type?: string }> =>
  axios
    .get(`${process.env.ENDPOINT}/api/user/top`, {
      withCredentials: true,
    })
    .then((res) => res.data.data)
    .catch((err) => err.response.data);

export const useUserTop = () =>
  useQuery({
    queryKey: ["users", "top"],
    queryFn: getUserTop,
  });

interface NewUser {
  date: Date;
  count: number;
}
const getNewUser = (
  month: number,
  year: number,
): Promise<NewUser[] & { type?: string }> =>
  axios
    .get(
      `${process.env.ENDPOINT}/api/user/newUsers?month=${month}&year=${year}`,
      {
        withCredentials: true,
      },
    )
    .then((res) => res.data.data)
    .catch((err) => err.response.data);

export const useNewUser = (month: number, year: number) =>
  useQuery({
    queryKey: ["users", "new", month, year],
    queryFn: () => getNewUser(month, year),
  });

export const invalidateUsers = () => {
  queryClient.invalidateQueries({
    queryKey: ["users"],
  });
};
export const invalidateUser = (id: string) => {
  queryClient.invalidateQueries({
    queryKey: ["users", id],
  });
};
