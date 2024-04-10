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
        className="flex w-full max-w-sm flex-col items-start gap-6"
      >
        <div className="flex w-full flex-col items-start gap-2">
          <h2 className="text-2xl font-semibold text-slate-700">
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
          <Button
            disabled
            variant="outline"
            className="w-full text-slate-700 bg-fuchsia-100/30 hover:bg-fuchsia-100/50 hover:border-fuchsia-300 hover:text-fuchsia-800"
          >
            <AiOutlineLoading className="mr-2 h-4 w-4 animate-spin" />
            Please wait..
          </Button>
        ) : (
          <Button
            type="submit"
            variant="outline"
            className="w-full text-slate-700 bg-fuchsia-100/30 hover:bg-fuchsia-100/50 hover:border-fuchsia-300 hover:text-fuchsia-800"
          >
            Send link
          </Button>
        )}
        <div className="flex w-full max-w-sm items-center gap-3">
          <Separator className="w-full shrink bg-gray-200" />
          <span className="text-nowrap text-xs font-medium text-gray-500">
            OR
          </span>
          <Separator className="w-full shrink bg-gray-200" />
        </div>
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
