"use client";

import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { FC, useState } from "react";
import { useForm } from "react-hook-form";
import { LoginFormSchema, LoginFormType } from "./form-validators";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {} from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { AiOutlineLoading } from "react-icons/ai";
import axios from "axios";
import { NotificationType } from "@/@types/notification";
import { invalidateUserData } from "@/lib/auth";
import Link from "next/link";
import { invalidateAllPrivilages } from "@/lib/privilage";

const LoginForm: FC<{ inline?: boolean }> = ({ inline }) => {
  const { toast } = useToast();
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const form = useForm<LoginFormType>({
    resolver: zodResolver(LoginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function onSubmit(values: LoginFormType) {
    setLoading(true);
    axios
      .post<NotificationType>(
        `${process.env.ENDPOINT}/api/auth/login`,
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
        toast({
          title: res.data.title,
          description: res.data.description,
          variant: res.data.type,
        });
        invalidateUserData();
        invalidateAllPrivilages();
        if (!inline) return router.replace("/");
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
            {inline ? "You seem to be Logged out" : "Welcome back!"}
          </h2>
          <p className="text-sm text-gray-500">
            To login enter your email and password below.
          </p>
        </div>
        <div className="flex w-full flex-col items-center gap-2">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel className="text-black">Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="johndoe@gmail.com"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
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
          <Link
            href="/auth/forgot"
            className="ml-auto text-sm font-semibold hover:text-blue-600 hover:underline"
          >
            forgot password?
          </Link>
        </div>

        {loading ? (
          <Button disabled className="w-full">
            <AiOutlineLoading className="mr-2 h-4 w-4 animate-spin" />
            Please wait..
          </Button>
        ) : (
          <Button type="submit" className="w-full">
            Login
          </Button>
        )}
      </form>
    </Form>
  );
};

export default LoginForm;
