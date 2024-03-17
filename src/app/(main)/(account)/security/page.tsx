"use client";

import { useToast } from "@/components/ui/use-toast";
import { FC, useState } from "react";
import { useForm } from "react-hook-form";
import {
  ChangePasswordType,
  changePasswordSchema,
} from "./change-password-form-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AiOutlineLoading } from "react-icons/ai";
import axios from "axios";
import { NotificationType } from "@/@types/notification";
import _ from "lodash";

const ChangePasswordForm: FC = () => {
  const { toast } = useToast();

  const [loading, setLoading] = useState(false);

  const form = useForm<ChangePasswordType>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  const onSubmit = (values: ChangePasswordType) => {
    setLoading(true);
    axios
      .put<NotificationType>(
        `${process.env.ENDPOINT}/api/employees/update/password`,
        _.omit(values, ["confirmNewPassword"]),
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
  };

  return (
    <main className="flex h-full w-full flex-col gap-6 bg-white p-6 shadow-sm max-lg:pb-12 lg:rounded-lg lg:border-1 lg:border-slate-200">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex w-full flex-col gap-9"
        >
          <FormField
            control={form.control}
            name="currentPassword"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel className="text-black">Current Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="******" {...field} />
                </FormControl>
                <FormMessage />
                <FormDescription className="text-xs">
                  For your security, you must confirm your current password to
                  make changes to your account.
                </FormDescription>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="newPassword"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel className="text-black">New Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="******" {...field} />
                </FormControl>
                <FormMessage />
                <FormDescription className="text-xs">
                  Enter a new password for your account.
                </FormDescription>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmNewPassword"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel className="text-black">
                  Confirm New Password
                </FormLabel>
                <FormControl>
                  <Input type="password" placeholder="******" {...field} />
                </FormControl>
                <FormMessage />
                <FormDescription className="text-xs">
                  Confirm your new password to make changes to your account.
                </FormDescription>
              </FormItem>
            )}
          />
          {loading ? (
            <Button disabled className="sm:max-w-xs">
              <AiOutlineLoading className="mr-2 h-4 w-4 animate-spin" />
              Please wait..
            </Button>
          ) : (
            <Button type="submit" className="sm:max-w-xs">
              Change Password
            </Button>
          )}
        </form>
      </Form>
    </main>
  );
};

export default ChangePasswordForm;
