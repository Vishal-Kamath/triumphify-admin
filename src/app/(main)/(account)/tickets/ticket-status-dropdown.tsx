"use client";

import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { invalidateAllTickets, invalidateTicket } from "@/lib/ticket";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { FC, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const statusStyle = {
  pending: "bg-yellow-50/50 text-yellow-600 border-yellow-600",
  completed: "bg-green-50/50 text-green-600 border-green-600",
  failed: "bg-red-50/50 text-red-600 border-red-600",
};

const zstatus = z.object({
  status: z.enum(["pending", "completed", "failed"]),
});
type zStatus = z.infer<typeof zstatus>;

const TicketStatusDropdown: FC<{
  ticket: Ticket;
  id: string;
  all?: boolean;
}> = ({ ticket, id, all }) => {
  const { toast } = useToast();

  const form = useForm<zStatus>({
    resolver: zodResolver(zstatus),
    defaultValues: {
      status: "pending",
    },
  });

  useEffect(() => {
    if (ticket) {
      form.setValue("status", ticket.status);
    }
  }, [ticket]);

  function onSelect(status: string | undefined) {
    if (!status) return;
    if (status === ticket?.status) return;

    axios
      .put(
        `${process.env.ENDPOINT}/api/tickets/${id}`,
        {
          status,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      )
      .then((res) => {
        all ? invalidateAllTickets() : invalidateTicket(id);
        toast({
          title: res.data.title,
          description: res.data.description,
          variant: res.data.type,
        });
      })
      .catch((err) => {
        toast({
          title: err?.response?.data?.title || "Error",
          description: err?.response?.data?.description,
          variant: err?.response?.data?.type || "error",
        });
      });
  }

  if (!ticket) return null;

  return (
    <Form {...form}>
      <form>
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormControl>
                <Select
                  onValueChange={(value) => value && onSelect(value)}
                  value={form.getValues("status") || undefined}
                  defaultValue={form.getValues("status") || undefined}
                >
                  <FormControl>
                    <SelectTrigger
                      className={cn(
                        "h-8 text-xs rounded-full",
                        statusStyle[field.value]
                      )}
                    >
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};

export default TicketStatusDropdown;
