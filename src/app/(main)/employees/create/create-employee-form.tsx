"use client";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { FC, useState } from "react";
import { useForm } from "react-hook-form";
import {
  CreateNewEmployeeType,
  createNewEmployeeSchema,
} from "./create-employee-form-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AiOutlineLoading } from "react-icons/ai";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import axios from "axios";
import { useToast } from "@/components/ui/use-toast";
import _ from "lodash";
import { invalidateAllEmployees } from "@/lib/employee";

const CreateEmployeeForm: FC = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const form = useForm<CreateNewEmployeeType>({
    resolver: zodResolver(createNewEmployeeSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "employee",
    },
  });

  const handleSubmit = (values: CreateNewEmployeeType) => {
    setLoading(true);
    axios
      .post(
        `${process.env.ENDPOINT}/api/employees/create`,
        _.omit(values, ["confirmPassword"]),
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        },
      )
      .then((res) => {
        setLoading(false);
        form.reset();
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
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="flex w-full max-w-xl flex-col gap-6"
      >
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
              <FormDescription className="text-xs">
                employees official email address.
              </FormDescription>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel className="text-black">Username</FormLabel>
              <FormControl>
                <Input type="text" placeholder="John Doe" {...field} />
              </FormControl>
              <FormMessage />
              <FormDescription className="text-xs">
                This is employee display name. It can be real name or a
                pseudonym.
              </FormDescription>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel className="text-black">Role</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="employee">Employee</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
              <FormDescription className="text-xs">
                employees designated job role.
              </FormDescription>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel className="text-black">New Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="******" {...field} />
              </FormControl>
              <FormMessage />
              <FormDescription className="text-xs">
                Enter a password for employees account.
              </FormDescription>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel className="text-black">Confirm New Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="******" {...field} />
              </FormControl>
              <FormMessage />
              <FormDescription className="text-xs">
                Confirm your new password.
              </FormDescription>
            </FormItem>
          )}
        />
        {loading ? (
          <Button disabled className="mt-6 max-w-[15rem]">
            <AiOutlineLoading className="mr-2 h-4 w-4 animate-spin" />
            Please wait..
          </Button>
        ) : (
          <Button type="submit" className="mt-6 max-w-[15rem]">
            Create
          </Button>
        )}
      </form>
    </Form>
  );
};

export default CreateEmployeeForm;
