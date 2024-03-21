import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { useEmployees } from "@/lib/employee";
import { invalidateTicket, useTicket } from "@/lib/ticket";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useParams } from "next/navigation";
import { FC, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const zassigned = z.object({
  assigned: z.string().nullable(),
});
type zAssigned = z.infer<typeof zassigned>;

const TicketAssignedToDropdown: FC = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const id = useParams()["id"] as string;
  const { data: ticket, isLoading: ticketIsLoading } = useTicket(id);
  const { data: employees, isLoading } = useEmployees();

  const form = useForm<zAssigned>({
    resolver: zodResolver(zassigned),
    defaultValues: {
      assigned: "NA",
    },
  });

  useEffect(() => {
    if (ticket && employees && !isLoading && !ticketIsLoading) {
      const findAssignedEmployeeId = !!ticket?.assigned
        ? employees.find((employee) => employee.id === ticket.assigned)?.id ||
          "NA"
        : "NA";
      form.setValue("assigned", findAssignedEmployeeId);
    }
  }, [ticket, isLoading, employees, ticketIsLoading]);

  function onSelect(value: string | undefined) {
    if (!value) return;
    if (value === ticket?.assigned) return;

    setLoading(true);
    axios
      .patch(
        `${process.env.ENDPOINT}/api/tickets/${id}`,
        {
          assigned: value === "NA" ? null : value,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      )
      .then((res) => {
        setLoading(false);
        invalidateTicket(id);
        toast({
          title: res.data.title,
          description: res.data.description,
          variant: res.data.type,
        });
      })
      .catch((err) => {
        setLoading(false);
        toast({
          title: err?.response?.data?.title || "Error",
          description: err?.response?.data?.description,
          variant: err?.response?.data?.type || "error",
        });
      });
  }

  if (isLoading || ticketIsLoading || !employees) return null;
  if (!ticket) return null;

  return (
    <Form {...form}>
      <form>
        <FormField
          control={form.control}
          name="assigned"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel className="text-slate-700">Assigned to</FormLabel>
              <FormControl>
                <Select
                  onValueChange={onSelect}
                  value={form.getValues("assigned") || undefined}
                  defaultValue={form.getValues("assigned") || undefined}
                >
                  <FormControl>
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder="Assigned" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {employees.map((employee) => (
                      <SelectItem
                        key={employee.id}
                        value={employee.id.toString()}
                      >
                        <div className="flex flex-col w-full text-start items-start">
                          <span className="text-sm text-slate-800">
                            {employee.username}
                          </span>
                          <span className="text-xs text-slate-500">
                            {employee.email}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                    <SelectItem value={"NA"}>Unassign</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};

export default TicketAssignedToDropdown;
