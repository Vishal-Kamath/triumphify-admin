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
import { useToast } from "@/components/ui/use-toast";
import { invalidateGTMId, useGTMId } from "@/lib/configs";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Trash2 } from "lucide-react";
import { FC, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { AiOutlineLoading } from "react-icons/ai";
import { z } from "zod";

const GoogleTagManagerSchema = z.object({
  tagManagerKey: z
    .string()
    .trim()
    .refine((v) => !!v.trim(), { message: "Tag manager key is required" })
    .refine((v) => v.startsWith("GTM-"), {
      message: "Invalid tag manager key",
    }),
});
type GoogleTagManagerType = z.infer<typeof GoogleTagManagerSchema>;

const GTMForm: FC = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const { data: gtm, isLoading } = useGTMId();

  useEffect(() => {
    if (!gtm || isLoading) return;
    form.reset({ tagManagerKey: gtm.gtmId });
  }, [gtm]);

  const form = useForm<GoogleTagManagerType>({
    resolver: zodResolver(GoogleTagManagerSchema),
    defaultValues: {
      tagManagerKey: "",
    },
  });

  function handleOnSubmit(data: GoogleTagManagerType) {
    setLoading(true);

    if (gtm?.gtmId) {
      axios
        .put(
          `${process.env.ENDPOINT}/api/configs/google-tag-manager`,
          {
            gtmId: data.tagManagerKey,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
            withCredentials: true,
          },
        )
        .then((res) => {
          setLoading(false);
          invalidateGTMId();
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
    } else {
      axios
        .post(
          `${process.env.ENDPOINT}/api/configs/google-tag-manager`,
          {
            gtmId: data.tagManagerKey,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
            withCredentials: true,
          },
        )
        .then((res) => {
          setLoading(false);
          invalidateGTMId();
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
  }

  function handleDeleteGTMId() {
    const doesUserWantsToDelete = window.confirm(
      "Are you sure you want to delete GTM Id",
    );
    if (!doesUserWantsToDelete) return;

    setDeleteLoading(true);
    axios
      .delete(`${process.env.ENDPOINT}/api/configs/google-tag-manager`, {
        withCredentials: true,
      })
      .then((res) => {
        setDeleteLoading(false);
        invalidateGTMId();
        toast({
          title: "Success",
          description: res.data.description,
          variant: res.data.type,
        });
      })
      .catch((err) => {
        setDeleteLoading(false);
        if (!err.response?.data) return;
        toast({
          title: "Error",
          description: err.response.data.description,
          variant: err.response.data.type,
        });
      });
  }

  return (
    <Form {...form}>
      <form
        id="google_tag_manager_form"
        onSubmit={form.handleSubmit(handleOnSubmit)}
        className="flex flex-col gap-3"
      >
        <FormField
          name="tagManagerKey"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-black">Tag manager key</FormLabel>
              <FormControl>
                <Input type="text" placeholder="GTM-XXXXXXXX" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {gtm?.gtmId ? (
          loading ? (
            <div className="mt-3 flex gap-3">
              <Button
                disabled
                type="button"
                variant="destructive"
                className="ml-auto w-full max-w-[15rem]"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </Button>
              <Button
                disabled
                type="button"
                className="ml-auto w-full max-w-[15rem]"
              >
                <AiOutlineLoading className="mr-2 h-4 w-4 animate-spin" />
                Please wait..
              </Button>
            </div>
          ) : deleteLoading ? (
            <div className="mt-3 flex gap-3">
              <Button
                disabled
                type="button"
                variant="destructive"
                className="ml-auto w-full max-w-[15rem]"
              >
                <AiOutlineLoading className="mr-2 h-4 w-4 animate-spin" />
                Please wait..
              </Button>
              <Button
                disabled
                type="button"
                className="ml-auto w-full max-w-[15rem]"
              >
                Update
              </Button>
            </div>
          ) : (
            <div className="mt-3 flex gap-3">
              <Button
                type="button"
                variant="destructive"
                className="ml-auto w-full max-w-[15rem]"
                onClick={handleDeleteGTMId}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </Button>
              <Button type="submit" className="ml-auto w-full max-w-[15rem]">
                Update
              </Button>
            </div>
          )
        ) : loading ? (
          <Button
            disabled
            type="button"
            className="ml-auto mt-3 w-full max-w-[15rem]"
          >
            <AiOutlineLoading className="mr-2 h-4 w-4 animate-spin" />
            Please wait..
          </Button>
        ) : (
          <Button type="submit" className="ml-auto mt-3 w-full max-w-[15rem]">
            Save
          </Button>
        )}
      </form>
    </Form>
  );
};

export default GTMForm;
