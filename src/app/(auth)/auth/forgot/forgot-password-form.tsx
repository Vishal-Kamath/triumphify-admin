"use client";

import { FC, useState } from "react";
import { useForm } from "react-hook-form";
import {
  ForgotPasswordEnterEmailType,
  forgotPaswordEnterEmailSchema,
} from "./forgot-password-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AiOutlineLoading } from "react-icons/ai";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import axios from "axios";
import { useToast } from "@/components/ui/use-toast";

const ForgotPasswordForm: FC = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const form = useForm<ForgotPasswordEnterEmailType>({
    resolver: zodResolver(forgotPaswordEnterEmailSchema),
    defaultValues: {
      email: "",
    },
  });

  function onSubmit(values: ForgotPasswordEnterEmailType) {
    axios
      .post(
        `${process.env.ENDPOINT}/api/auth/password/send-reset-link`,
        values,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        },
      )
      .then((res) => {
        setLoading(false);
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

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex w-full max-w-sm flex-col items-center gap-6"
      >
        <div className="flex w-full flex-col items-center gap-2">
          <h2 className="text-2xl font-semibold text-slate-950">
            Forgot Password?
          </h2>
          <p className="text-sm text-gray-500">
            Enter your email and we will send you a reset link.
          </p>
        </div>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormControl>
                <Input
                  type="email"
                  placeholder="johndoe@gmail.com"
                  {...field}
                />
              </FormControl>
              <FormMessage></FormMessage>
            </FormItem>
          )}
        />
        {loading ? (
          <Button disabled className="w-full">
            <AiOutlineLoading className="mr-2 h-4 w-4 animate-spin" />
            Please wait..
          </Button>
        ) : (
          <Button type="submit" className="w-full">
            Send link
          </Button>
        )}
        <Separator className="relative">
          <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-2 text-sm text-gray-400">
            OR
          </span>
        </Separator>
        <div className="flex gap-1 text-sm text-gray-500">
          <span>Back to</span>
          <Link
            href="/auth/login"
            className="font-semibold hover:text-foreground hover:underline"
          >
            Login
          </Link>
        </div>
      </form>
    </Form>
  );
};

export default ForgotPasswordForm;
