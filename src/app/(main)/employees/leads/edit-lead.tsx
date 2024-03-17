import { NotificationType } from "@/@types/notification";
import { DateInput } from "@/components/date-picker/date-picker-input";
import { Button, buttonVariants } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PhoneInput } from "@/components/ui/phone-input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useToast } from "@/components/ui/use-toast";
import { useEmployees } from "@/lib/employee";
import { invalidateAllLeads } from "@/lib/lead";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { format } from "date-fns";
import { CalendarIcon, ChevronsUpDown, PencilLine, X } from "lucide-react";
import { FC, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { AiOutlineLoading } from "react-icons/ai";
import { z } from "zod";

const updateLead = z.object({
  name: z.string(),
  email: z.string(),
  tel: z.string(),
  assigned: z.string().nullable(),
  source: z.string(),
  status: z.enum(["pending", "converted", "rejected"]),
  last_contacted: z.date().nullable(),
});
type UpdateLead = z.infer<typeof updateLead>;

const EditLead: FC<Lead> = (leads) => {
  const { toast } = useToast();

  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const { data: employees, isLoading, refetch } = useEmployees();

  const form = useForm<UpdateLead>({
    resolver: zodResolver(updateLead),
    defaultValues: {
      name: "",
      email: "",
      tel: "",
      assigned: null,
      source: "",
      status: "pending",
      last_contacted: null,
    },
  });

  useEffect(() => {
    form.setValue("name", leads.name);
    form.setValue("email", leads.email);
    form.setValue("assigned", leads.assigned);
    form.setValue(
      "last_contacted",
      leads.last_contacted ? new Date(leads.last_contacted) : null
    );
    form.setValue("source", leads.source);
    form.setValue("status", leads.status);
    form.setValue("tel", leads.tel);
  }, [leads]);

  function onSubmit(values: UpdateLead) {
    setLoading(true);
    axios
      .post<NotificationType>(
        `${process.env.ENDPOINT}/api/leads/${leads.id}`,
        {
          ...values,
          assigned: values.assigned === "NA" ? null : values.assigned,
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
        setOpen(false);
        form.reset();
        invalidateAllLeads();
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

  if (isLoading || !employees) return null;

  const name = form.watch("name");
  const email = form.watch("email");
  const assigned = form.watch("assigned");
  const last_contacted = form.watch("last_contacted");
  const source = form.watch("source");
  const status = form.watch("status");
  const tel = form.watch("tel");

  const buttonIsEnabled =
    name.trim() !== leads.name ||
    email.trim() !== leads.email ||
    assigned !== leads.assigned ||
    (last_contacted === null && leads.last_contacted !== null) ||
    (last_contacted &&
      new Date(last_contacted).toDateString() !==
        new Date(leads.last_contacted || "").toDateString()) ||
    source.trim() !== leads.source ||
    status.trim() !== leads.status ||
    tel.trim() !== leads.tel;

  const findAssignedEmployee = !!assigned
    ? employees?.find((employee) => employee.id === assigned) || null
    : null;

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        className={cn(
          buttonVariants({ variant: "ghost" }),
          "text-slate-500 hover:text-slate-800"
        )}
      >
        <PencilLine className="w-4 h-4" />
      </SheetTrigger>
      <SheetContent className="py-16 overflow-y-auto max-h-screen scrollbar-none">
        <Button
          variant="ghost"
          onClick={() => setOpen(false)}
          className="absolute top-16 right-2"
        >
          <X className="size-4" />
        </Button>
        <SheetHeader>
          <SheetTitle>Edit Lead</SheetTitle>
          <SheetDescription>
            Make changes to your leads here. Click update when you&apos;re done.
          </SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form
            className="flex flex-col gap-6 mt-3"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel className="text-black">Name</FormLabel>
                  <FormControl>
                    <Input type="text" placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel className="text-black">Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="johndoe@email.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="assigned"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel className="text-black">Assigned</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value || undefined}
                      value={field.value || undefined}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Assigned" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {employees.map((employee) => (
                          <SelectItem key={employee.id} value={employee.id}>
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
            <FormField
              control={form.control}
              name="tel"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel className="text-black">Mobile Number</FormLabel>
                  <FormControl>
                    <PhoneInput international defaultCountry="US" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="source"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel className="text-black">Source</FormLabel>
                  <FormControl>
                    <Input type="text" placeholder="Source" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Role</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Roles" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="converted">Converted</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="last_contacted"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel className="text-black">Date of birth</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <DateInput
                        value={field.value || undefined}
                        onChange={(date) =>
                          form.setValue("last_contacted", date)
                        }
                      />
                      <Calendar
                        mode="single"
                        selected={field.value || undefined}
                        onSelect={(date) =>
                          form.setValue("last_contacted", date || null)
                        }
                        initialFocus
                        defaultMonth={field.value || undefined}
                        month={field.value || undefined}
                        onMonthChange={(date) =>
                          form.setValue("last_contacted", date)
                        }
                        ISOWeek
                      />
                      <div className="w-full px-3 pb-3">
                        <Button
                          type="button"
                          variant="ghost"
                          onClick={() => form.setValue("last_contacted", null)}
                          className="w-full"
                        >
                          Clear Input
                        </Button>
                      </div>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                onClick={() => setOpen(false)}
                variant="ghost"
              >
                Close
              </Button>
              {loading ? (
                <Button disabled>
                  <AiOutlineLoading className="mr-2 h-4 w-4 animate-spin" />
                  Please wait..
                </Button>
              ) : (
                <Button disabled={!buttonIsEnabled} type="submit">
                  Update changes
                </Button>
              )}
            </div>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
};

export default EditLead;
