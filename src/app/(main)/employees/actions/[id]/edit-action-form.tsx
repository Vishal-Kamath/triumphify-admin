"use client";

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
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { invalidateAllActions, useAction } from "@/lib/lead";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { FC, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { AiOutlineLoading } from "react-icons/ai";
import { z } from "zod";

const actionSchema = z.object({
  title: z
    .string()
    .max(100)
    .refine((value) => !!value.trim(), "Field Required"),
  subject: z
    .string()
    .max(100)
    .refine((value) => !!value.trim(), "Field Required"),
  body: z.string().refine((value) => !!value.trim(), "Field Required"),
});
type ActionType = z.infer<typeof actionSchema>;

const EditActionForm: FC = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const id = useParams()["id"] as string;
  const { data, isLoading } = useAction(id);

  const form = useForm<ActionType>({
    resolver: zodResolver(actionSchema),
    defaultValues: {
      title: "",
      subject: "",
      body: "",
    },
  });

  useEffect(() => {
    if (data && data.action) {
      form.setValue("title", data.action.title);
      form.setValue("subject", data.action.subject);
      form.setValue("body", data.action.body);
    }
  }, [data]);

  function onSubmit(values: ActionType) {
    setLoading(true);
    axios
      .put(`${process.env.ENDPOINT}/api/leads/actions/${id}`, values, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      })
      .then((res) => {
        setLoading(false);
        invalidateAllActions();
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

  if (!data && isLoading) return <div>Loading...</div>;
  if (!data) return <div>Not Found</div>;

  const { action, logs } = data;

  const isEnabled =
    form.watch("title").trim() !== action.title.trim() ||
    form.watch("body").trim() !== action.body.trim() ||
    form.watch("subject").trim() !== action.subject.trim();

  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-6 max-w-md w-full"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div className="flex flex-col gap-2">
          <h2 className="text-xl font-semibold">Edit Action</h2>
          <Link
            href={"/employees/actions"}
            className="flex gap-1 hover:text-slate-900 text-slate-600 underline items-center text-xs"
          >
            <ArrowLeft className="size-3" />
            <span>Back</span>
          </Link>
        </div>
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-slate-800">Title</FormLabel>
              <FormControl>
                <Input type="text" placeholder="Action title" {...field} />
              </FormControl>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="subject"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-slate-800">Email Subject</FormLabel>
              <FormControl>
                <Input type="text" placeholder="Email Subject" {...field} />
              </FormControl>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="body"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-slate-800">Email Body</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Email body"
                  className="min-h-[7.5rem] max-h-[15rem]"
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />

        {loading ? (
          <Button disabled className="w-full max-w-[15rem] ml-auto">
            <AiOutlineLoading className="mr-2 h-4 w-4 animate-spin" />
            Please wait..
          </Button>
        ) : (
          <Button
            disabled={!isEnabled}
            type="submit"
            className="w-full max-w-[15rem] ml-auto"
          >
            Update Action
          </Button>
        )}
      </form>
    </Form>
  );
};

export default EditActionForm;
