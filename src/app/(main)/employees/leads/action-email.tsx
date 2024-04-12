"use client";

import AvatarElement from "@/components/misc/avatar-element";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Table } from "@tanstack/react-table";
import axios from "axios";
import { ChevronDown, Plus, Trash2, X } from "lucide-react";
import { FC, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { AiOutlineLoading } from "react-icons/ai";
import { z } from "zod";

const TriggerActionSchema = z.object({
  action: z.string(),

  title: z
    .string()
    .max(100)
    .refine((value) => !!value.trim(), "Field Required"),
  subject: z
    .string()
    .max(100)
    .refine((value) => !!value.trim(), "Field Required"),
  body: z.string().refine((value) => !!value.trim(), "Field Required"),

  receivers: z
    .object({
      userName: z.string(),
      email: z.string().email(),
    })
    .array(),
});
type TriggerActionType = z.infer<typeof TriggerActionSchema>;

const LeadsActionButton: FC<{ table: Table<any> }> = ({ table }) => {
  const { toast } = useToast();
  const selectedRowsModel = table.getFilteredSelectedRowModel();

  const selectedRows = selectedRowsModel.rows.map(
    (row) => row.original
  ) as Lead[];

  const [popupOpen, setPopupOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const form = useForm<TriggerActionType>({
    resolver: zodResolver(TriggerActionSchema),
    defaultValues: {
      action: "",
      title: "",
      subject: "",
      body: "",
      receivers: selectedRows.map((row) => ({
        userName: row.name,
        email: row.email,
      })),
    },
  });

  useEffect(() => {
    form.setValue(
      "receivers",
      selectedRows.map((row) => ({
        userName: row.name,
        email: row.email,
      }))
    );
  }, [JSON.stringify(selectedRows)]);

  useEffect(() => {
    if (!dialogOpen) {
      form.reset();
    }
  }, [dialogOpen]);

  function deleteSelection(index: number) {
    const id = selectedRowsModel.rows[index].id;
    table.getRow(id).toggleSelected(false);
  }

  function onSubmit(values: TriggerActionType) {
    setLoading(true);
    axios
      .post(`${process.env.ENDPOINT}/api/leads/actions/trigger`, values, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      })
      .then((res) => {
        setLoading(false);
        form.reset();
        setDialogOpen(false);
        toast({
          title: res.data.title || "Success",
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

  return (
    <Dialog
      open={dialogOpen}
      onOpenChange={(open) => {
        setDialogOpen(open);
        !open && setPopupOpen(false);
      }}
    >
      <DialogTrigger className={buttonVariants({ variant: "outline" })}>
        Action
      </DialogTrigger>
      <DialogContent
        closeable
        className="isolate max-h-screen overflow-y-auto min-h-fit scrollbar-none flex flex-col gap-6"
      >
        <div className="flex flex-col gap-2">
          <DialogTitle>Trigger Action</DialogTitle>
          <DialogDescription>
            Send automated email to the selected users
          </DialogDescription>
        </div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-6"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem className="relative z-20 flex flex-col">
                  <Button
                    variant="ghost"
                    type="button"
                    onClick={() => setPopupOpen(!popupOpen)}
                    disabled={!selectedRows.length}
                    className="flex z-0 w-full h-12 rounded-md hover:bg-blue-50 gap-6 items-center"
                  >
                    {!!selectedRows.length ? (
                      <>
                        <span className="text-teal-600 font-bold">
                          {selectedRows.length}
                        </span>

                        <div className="flex gap-7 isolate flex-row-reverse">
                          {selectedRows
                            .slice(0, 5)
                            .reverse()
                            .map((user, index) => (
                              <div key={user.name + index} className="relative">
                                <AvatarElement
                                  image={""}
                                  username={user.name}
                                  className={cn("absolute -translate-y-1/2")}
                                  elementClassName="border-2"
                                />
                              </div>
                            ))}
                        </div>

                        {popupOpen ? (
                          <X className="size-4 ml-auto" />
                        ) : (
                          <ChevronDown className="size-4 ml-auto" />
                        )}
                      </>
                    ) : (
                      "No items Selected"
                    )}
                  </Button>
                  <FormMessage />
                  {popupOpen && !!selectedRows.length ? (
                    <div
                      style={{
                        minHeight:
                          selectedRows.length < 4
                            ? `${3.5 * selectedRows.length}rem`
                            : "14rem",
                      }}
                      className={cn(
                        "absolute bg-white rounded-md shadow-md top-14 right-0 max-w-[20rem] w-full h-full border-1 flex max-h-[14rem] overflow-y-auto p-0 flex-col gap-0"
                      )}
                    >
                      {selectedRows.map((user, index) => (
                        <div
                          key={user.name + index}
                          className="flex items-center h-14 shrink-0 px-3 z-0 w-full gap-3"
                        >
                          <AvatarElement image={""} username={user.name} />

                          <div className="flex flex-col">
                            <span>{user.name}</span>
                            <span className="text-xs text-slate-500">
                              {user.email}
                            </span>
                          </div>

                          <Button
                            variant="ghost"
                            type="button"
                            onClick={() => deleteSelection(index)}
                            className="size-6 hover:bg-red-50 hover:text-red-600 text-slate-500 ml-auto p-0"
                          >
                            <Trash2 className="size-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : null}
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="action"
              render={({ field }) => (
                <FormItem className="z-10">
                  <FormLabel className="text-slate-800">Action</FormLabel>
                  <FormControl>
                    <Select
                      onOpenChange={(open) => open && setPopupOpen(false)}
                      onValueChange={(value) => {
                        if (!value) return;
                        field.onChange(value);
                      }}
                      value={field.value}
                    >
                      <SelectTrigger className="">
                        <SelectValue placeholder="Action" />
                      </SelectTrigger>
                      <SelectContent className="isolate z-[1000]">
                        <SelectItem value="new">
                          <div className="flex items-center text-slate-800 gap-2">
                            <Plus className="size-4" />
                            <span>Create New Action</span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-800">Title</FormLabel>
                  <FormControl>
                    <Input
                      disabled={form.watch("action") !== "new"}
                      maxLength={100}
                      placeholder="Action Title"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="subject"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-800">Subject</FormLabel>
                  <FormControl>
                    <Input
                      disabled={form.watch("action") !== "new"}
                      maxLength={100}
                      placeholder="Email Subject"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="body"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-800">Body</FormLabel>
                  <FormControl>
                    <Textarea
                      disabled={form.watch("action") !== "new"}
                      maxLength={100}
                      placeholder="Email Body"
                      className="min-h-[7.5rem] max-h-[15rem]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {loading ? (
              <Button disabled className="mt-6 max-w-[15rem] ml-auto w-full">
                <AiOutlineLoading className="mr-2 h-4 w-4 animate-spin" />
                Please wait..
              </Button>
            ) : (
              <Button
                type="submit"
                className="mt-6 max-w-[15rem] ml-auto w-full"
              >
                Submit
              </Button>
            )}
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default LeadsActionButton;
