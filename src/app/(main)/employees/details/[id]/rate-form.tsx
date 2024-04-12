"use client";

import { Employee } from "@/@types/employee";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { invalidateAllEmployee, invalidateAllEmployees } from "@/lib/employee";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Dispatch, FC, SetStateAction, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { AiOutlineLoading } from "react-icons/ai";
import { z } from "zod";

const rateSchema = z.object({
  rate: z.number().positive(),
});
type RateType = z.infer<typeof rateSchema>;

const EmployeeRateForm: FC<{
  employee: Employee;
  setRate: Dispatch<SetStateAction<number>>;
}> = ({ employee, setRate }) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const form = useForm<RateType>({
    resolver: zodResolver(rateSchema),
    defaultValues: {
      rate: 0,
    },
  });

  useEffect(() => {
    if (employee) {
      form.setValue("rate", Number(employee.rate));
    }
  }, [employee]);

  const rate = form.watch("rate");
  useEffect(() => {
    setRate(Number(rate));
  }, [rate]);

  function onSubmit(values: RateType) {
    setLoading(true);
    axios
      .patch(
        `${process.env.ENDPOINT}/api/employees/details/${employee.id}`,
        values,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      )
      .then((res) => {
        setLoading(false);
        invalidateAllEmployee(employee.id);
        invalidateAllEmployees();
        toast({
          title: "Success",
          description: res.data.description,
          variant: res.data.type,
        });
      })
      .catch((err) => {
        setLoading(false);
        if (!err.response?.data) return;
        toast({
          title: "Error",
          description: err.response.data.description,
          variant: err.response.data.type,
        });
      });
  }

  const isEnabled = Number(employee.rate) !== Number(form.watch("rate"));

  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-6"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          control={form.control}
          name="rate"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-slate-800">
                Employee Hourly Rate (&#36;/hr)
              </FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Employee Hourly rate"
                  value={field.value.toString()}
                  onChange={(e) =>
                    field.onChange(parseFloat(e.target.value.toString()) || 0)
                  }
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {loading ? (
          <Button disabled className="ml-auto max-w-[10rem]">
            <AiOutlineLoading className="mr-2 h-4 w-4 animate-spin" />
            Please wait..
          </Button>
        ) : (
          <Button
            disabled={!isEnabled}
            type="submit"
            className="ml-auto max-w-[10rem]"
          >
            Update
          </Button>
        )}
      </form>
    </Form>
  );
};

export default EmployeeRateForm;
