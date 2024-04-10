"use client";

import { FC, useState } from "react";
import { useForm } from "react-hook-form";
import {
  ResetPasswordType,
  resetPaswordSchema,
} from "./reset-password-form-schema";
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
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import { useToast } from "@/components/ui/use-toast";
import { invalidateUserData } from "@/lib/auth";
import { invalidateAllPrivilages } from "@/lib/privilage";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

const ResetPasswordForm: FC = () => {
  const { toast } = useToast();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();

  const form = useForm<ResetPasswordType>({
    resolver: zodResolver(resetPaswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  function onSubmit(values: ResetPasswordType) {
    setLoading(true);
    axios
      .post(
        `${process.env.ENDPOINT}/api/auth/password/reset`,
        {
          password: values.password,
          token: searchParams.get("token"),
          otp: searchParams.get("otp"),
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
        toast({
          title: res.data.title,
          description: res.data.description,
          variant: res.data.type,
        });
        invalidateUserData();
        invalidateAllPrivilages();
        router.replace("/");
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
            Reset Password
          </h2>
          <p className="text-sm text-gray-500">
            Enter your new login password below.
          </p>
        </div>
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel className="text-black">Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="******" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel className="text-black">Confirm Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="******" {...field} />
              </FormControl>
              <FormMessage />
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
            Reset
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

export default ResetPasswordForm;
