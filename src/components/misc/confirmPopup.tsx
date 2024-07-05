"use client";

import { FC, ReactNode, useState } from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
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

const ConfirmPopover: FC<{
  confirmText: string;
  fcTitle?: string;
  fcDescription?: string;
  fcButton?: string;

  className?: string;
  children: ReactNode;
  deleteFn: VoidFunction;
}> = ({
  confirmText,
  fcButton,
  fcDescription,
  fcTitle,
  className,
  children,
  deleteFn,
}) => {
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
          <AlertDialogTitle>
            {fcTitle ? fcTitle : "Are you sure you want to delete?"}
          </AlertDialogTitle>
          <AlertDialogDescription className="select-none">
            {fcDescription
              ? fcDescription
              : "This is action will delete the item permanently"}
            . Enter the following text &ldquo;{confirmText}&rdquo; to proceed.
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
                {fcButton ? fcButton : "Delete"}
              </Button>
            </div>
          </form>
        </Form>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ConfirmPopover;
