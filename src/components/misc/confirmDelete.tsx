"use client";

import { FC, ReactNode, useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

const ConfirmDelete: FC<{
  confirmText: string;
  className?: string;
  children: ReactNode;
  deleteFn: VoidFunction;
}> = ({ confirmText, className, children, deleteFn }) => {
  const [open, setOpen] = useState(false);

  const schema = z.object({
    input: z.string().refine((value) => value === confirmText, "Invalid input"),
  });

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      input: "",
    },
  });

  function handleClick(values: z.infer<typeof schema>) {
    if (values.input === confirmText) {
      deleteFn();
      setOpen(false);
    }
  }

  return (
    <AlertDialog
      defaultOpen={open}
      open={open}
      onOpenChange={(open) => setOpen(open)}
    >
      <AlertDialogTrigger className={className} type="button">
        {children}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure you want to delete?</AlertDialogTitle>
          <AlertDialogDescription className="select-none">
            This is action will delete the item permanently. Enter the text
            &ldquo;{confirmText}&rdquo; to delete
          </AlertDialogDescription>
        </AlertDialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleClick)}
            className="flex flex-col gap-6"
          >
            <FormField
              control={form.control}
              name="input"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input type="text" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="link"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant="secondary"
                type="submit"
                className="hover:bg-red-500 hover:text-white"
              >
                Delete
              </Button>
            </div>
          </form>
        </Form>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ConfirmDelete;
