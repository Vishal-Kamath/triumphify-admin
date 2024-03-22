import { queryClient } from "@/components/providers/reactquery.provider";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const getTickets = (
  status?: Ticket["status"]
): Promise<Ticket[] & { type: string }> =>
  axios
    .get<{ data: Ticket[] & { type: string } }>(
      `${process.env.ENDPOINT}/api/tickets${status ? `?status=${status}` : ""}`,
      { withCredentials: true }
    )
    .then((res) => res.data.data)
    .catch((err) => err.response.data);

export const useTickets = (status?: Ticket["status"]) =>
  useQuery({
    queryKey: ["tickets", status],
    queryFn: () => getTickets(status),
    retry: 0,
    staleTime: 1000 * 60 * 15,
  });

export const invalidateAllTickets = () =>
  queryClient.invalidateQueries({ queryKey: ["tickets"] });

const getTicket = (id: string): Promise<Ticket & { type: string }> =>
  axios
    .get<{ data: Ticket & { type: string } }>(
      `${process.env.ENDPOINT}/api/tickets/${id}`,
      { withCredentials: true }
    )
    .then((res) => res.data.data)
    .catch((err) => err.response.data);

export const useTicket = (id: string) =>
  useQuery({
    queryKey: ["tickets", id],
    queryFn: () => getTicket(id),
    retry: 0,
    staleTime: 1000 * 60 * 15,
  });

export const invalidateTicket = (id: string) =>
  queryClient.invalidateQueries({ queryKey: ["tickets", id] });


const getTicketChats = (id: string): Promise<TicketChat[] & { type: string }> =>
  axios
    .get<{ data: TicketChat[] & { type: string } }>(
      `${process.env.ENDPOINT}/api/tickets/${id}/chat`,
      { withCredentials: true }
    )
    .then((res) => res.data.data)
    .catch((err) => err.response.data);

export const useTicketChats = (id: string) =>
  useQuery({
    queryKey: ["tickets", "chats", id],
    queryFn: () => getTicketChats(id),
    retry: 0,
    staleTime: 1000 * 3,
    refetchInterval: 1000 * 3,
  });

export const invalidateTicketChats = (id: string) =>
  queryClient.invalidateQueries({ queryKey: ["tickets", "chats", id] });