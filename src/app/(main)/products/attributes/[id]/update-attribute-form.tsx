"use client";

import { FC, KeyboardEvent, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  UpdateAttributeType,
  updateAttributeFormSchema,
} from "./update-attribute-form-schema";
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
import { Button, buttonVariants } from "@/components/ui/button";
import { AiOutlineLoading } from "react-icons/ai";
import { Plus, Trash2 } from "lucide-react";
import axios from "axios";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { invalidateAllAttributes, useAttribute } from "@/lib/attributes";
import { useParams, useRouter } from "next/navigation";
import { v4 as uuid } from "uuid";

const UpdateAttributeForm: FC = () => {
  const router = useRouter();
  const { toast } = useToast();
  const id = useParams()["id"] as string;

  const { data: attribute, isLoading } = useAttribute(id);

  const [loading, setLoading] = useState(false);
  const [tempValue, setTempValue] = useState("");

  const form = useForm<UpdateAttributeType>({
    resolver: zodResolver(updateAttributeFormSchema),
    defaultValues: {
      name: "",
      values: [],
    },
  });

  useEffect(() => {
    if (!attribute) return;
    form.setValue("name", attribute.name);
    form.setValue("values", Array.from(attribute.values));
  }, [attribute]);

  async function onSubmit(values: UpdateAttributeType) {
    if (!!tempValue.trim()) {
      values.values.push({
        id: uuid(),
        name: tempValue.trim(),
      });
    }

    setLoading(true);
    axios
      .put(`${process.env.ENDPOINT}/api/attributes/${id}`, values, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      })
      .then((res) => {
        setLoading(false);
        toast({
          title: res.data.title,
          description: res.data.description,
          variant: res.data.type,
        });
        invalidateAllAttributes();
        router.push("/products/attributes");
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

  function updateValue(value: string, index: number) {
    const values = form.getValues("values");
    values[index].name = value;
    form.setValue("values", values);
  }

  function removeValue(index: number) {
    const values = form.getValues("values");
    form.setValue(
      "values",
      values.filter((_, i) => i !== index),
    );
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.code === "Enter") {
      e.preventDefault();
      addToValues();
      e.currentTarget.focus();
    }
  }

  function addToValues() {
    if (!tempValue.trim()) {
      toast({
        title: "Warning",
        description: "fill in some value",
        variant: "warning",
      });
      return;
    }

    const value = form.getValues("values");
    value.push({
      id: uuid(),
      name: tempValue.trim(),
    });

    setTempValue("");
    form.setValue("values", value);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex w-full flex-col gap-6"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="max-w-lg">
              <FormLabel className="text-black">Name</FormLabel>
              <FormControl>
                <Input type="text" {...field} />
              </FormControl>
              <FormMessage />
              <FormDescription className="text-xs">
                attribute display name.
              </FormDescription>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="values"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-black">Values</FormLabel>
              <div className="flex flex-wrap gap-3">
                {form.watch("values").map((value, index) => (
                  <div
                    key={value.id + index}
                    className="roundex-md flex h-10 w-full max-w-[15rem] overflow-hidden rounded-md border-1 border-slate-300 pl-2 pr-0 focus-within:border-slate-400"
                  >
                    <input
                      type="text"
                      value={value.name}
                      className="h-full w-full border-none outline-none"
                      onChange={(e) => updateValue(e.target.value, index)}
                    />
                    <button
                      type="button"
                      onClick={(e) => removeValue(index)}
                      className="flex h-10 w-10 flex-shrink-0 items-center justify-center bg-red-50 text-red-600 hover:bg-red-100"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                <Input
                  type="text"
                  value={tempValue}
                  className="max-w-[15rem]"
                  onChange={(e) => setTempValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
                <Button
                  className={cn(
                    buttonVariants({ variant: "secondary" }),
                    "gap-2 hover:bg-fuchsia-100 hover:text-fuchsia-700",
                  )}
                  type="button"
                  onClick={addToValues}
                >
                  <Plus className="h-4 w-4" />
                  <span>Add</span>
                </Button>
              </div>
              <FormMessage />
              <FormDescription className="text-xs">
                Array of attribute values.
              </FormDescription>
            </FormItem>
          )}
        />
        {loading ? (
          <Button disabled className="my-6 max-w-[15rem]">
            <AiOutlineLoading className="mr-2 h-4 w-4 animate-spin" />
            Please wait..
          </Button>
        ) : (
          <Button type="submit" className="my-6 max-w-[15rem]">
            Update
          </Button>
        )}
      </form>
    </Form>
  );
};

export default UpdateAttributeForm;
