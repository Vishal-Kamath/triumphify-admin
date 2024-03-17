"use client";

import { TemplateCContent } from "@/@types/product";
import { Button, buttonVariants } from "@/components/ui/button";
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
import { useShowcases } from "@/lib/showcase";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Trash2, UploadCloud } from "lucide-react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { ChangeEvent, FC, useEffect, useState } from "react";
import { UseFormReturn, useForm } from "react-hook-form";
import { AiOutlineLoading } from "react-icons/ai";
import { z } from "zod";

const MAX_FILE_SIZE = 5 * 1080 * 1080;
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

const createShowCaseSchema = z.object({
  title0: z
    .string()
    .max(100)
    .refine((value) => !!value.trim(), "Field is required"),
  description0: z
    .string()
    .max(300)
    .refine((value) => !!value.trim(), "Field is required"),
  template_image0: z
    .array(
      z
        .object({
          name: z
            .string()
            .trim()
            .refine((data) => !!data.trim(), "Field is required"),
          size: z.number(),
          type: z
            .string()
            .trim()
            .refine((data) => !!data.trim(), "Field is required"),
          lastModified: z.number(),
        })
        .refine((value) => value.size < MAX_FILE_SIZE, "File size is too large")
        .refine(
          (value) => ACCEPTED_IMAGE_TYPES.includes(value.type),
          "Invalid file type"
        )
    )
    .or(z.string()),
  title1: z
    .string()
    .max(100)
    .refine((value) => !!value.trim(), "Field is required"),
  description1: z
    .string()
    .max(300)
    .refine((value) => !!value.trim(), "Field is required"),
  template_image1: z
    .array(
      z
        .object({
          name: z
            .string()
            .trim()
            .refine((data) => !!data.trim(), "Field is required"),
          size: z.number(),
          type: z
            .string()
            .trim()
            .refine((data) => !!data.trim(), "Field is required"),
          lastModified: z.number(),
        })
        .refine((value) => value.size < MAX_FILE_SIZE, "File size is too large")
        .refine(
          (value) => ACCEPTED_IMAGE_TYPES.includes(value.type),
          "Invalid file type"
        )
    )
    .or(z.string()),
});
type CreateShowCaseType = z.infer<typeof createShowCaseSchema>;

const UpdateTemplateCForm: FC<{
  content: TemplateCContent;
  templateId: string;
}> = ({ content, templateId }) => {
  const form = useForm<CreateShowCaseType>({
    resolver: zodResolver(createShowCaseSchema),
    defaultValues: {
      title0: "",
      description0: "",
      template_image0: [],
      title1: "",
      description1: "",
      template_image1: [],
    },
  });

  useEffect(() => {
    form.setValue("title0", content.title0);
    form.setValue("description0", content.description0);
    form.setValue("template_image0", content.template_image0);
    form.setValue("title1", content.title1);
    form.setValue("description1", content.description1);
    form.setValue("template_image1", content.template_image1);

    setImageBase64([content.template_image0, content.template_image1]);
  }, [content]);

  const id = useParams()["id"] as string;
  const { refetch } = useShowcases(id);
  const { toast } = useToast();

  const [loading, setLoading] = useState(false);
  const [imageBase64, setImageBase64] = useState<[string, string]>(["", ""]);

  const convertFileToBase64 = (index: 0 | 1) => (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setImageBase64((images) => {
        images[index] = reader.result?.toString() || "";
        return Array.from(images) as [string, string];
      });
    };
    reader.readAsDataURL(file);
  };

  const uploadImage = (index: 0 | 1) => (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files as FileList;
    convertFileToBase64(index)(file[0]);
    form.setValue(`template_image${index}`, Array.from(e.target.files || []));
  };

  const deleteImage = (index: 0 | 1) => () => {
    form.setValue(`template_image${index}`, []);
    setImageBase64((images) => {
      images[index] = "";
      return Array.from(images) as [string, string];
    });
  };

  function handleSubmit(values: CreateShowCaseType) {
    setLoading(true);
    const template_image0 =
      typeof values.template_image0 === "string"
        ? values.template_image0
        : {
            name: values.template_image0[0].name,
            size: values.template_image0[0].size,
            type: values.template_image0[0].type,
            lastModified: values.template_image0[0].lastModified,
            base64: imageBase64[0],
          };
    const template_image1 =
      typeof values.template_image1 === "string"
        ? values.template_image1
        : {
            name: values.template_image1[0].name,
            size: values.template_image1[0].size,
            type: values.template_image1[0].type,
            lastModified: values.template_image1[0].lastModified,
            base64: imageBase64[1],
          };
    axios
      .put(
        `${process.env.ENDPOINT}/api/showcases/C`,
        {
          templateId,
          template: "C",
          product_id: id,
          content: {
            title0: values.title0,
            description0: values.description0,
            template_image0,
            title1: values.title1,
            description1: values.description1,
            template_image1,
          },
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
        form.reset();
        refetch();
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

  function deleteTemplate() {
    const confirmIfUserWantstoDelete = confirm(
      "Are you sure you want to delete this template"
    );

    if (!confirmIfUserWantstoDelete) return;
    axios
      .delete(`${process.env.ENDPOINT}/api/showcases/template/${templateId}`, {
        withCredentials: true,
      })
      .then((res) => {
        toast({
          title: res.data.title,
          description: res.data.description,
          variant: res.data.type,
        });
        refetch();
      })
      .catch((err) => {
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
        onSubmit={form.handleSubmit(handleSubmit)}
        className="mx-auto flex h-fit w-full max-w-5xl bg-white flex-col gap-6 md:rounded-lg border-y-1 max-md:border-slate-300 md:border-1 p-9 shadow-sm"
      >
        <TemplateSection
          direction="left"
          index={0}
          form={form}
          uploadImage={uploadImage}
          deleteImage={deleteImage}
          imageBase64={imageBase64[0]}
        />
        <TemplateSection
          direction="right"
          index={1}
          form={form}
          uploadImage={uploadImage}
          deleteImage={deleteImage}
          imageBase64={imageBase64[1]}
        />
        <div className="flex w-full justify-end gap-6">
          <Button
            type="button"
            onClick={deleteTemplate}
            className={cn(
              buttonVariants({ variant: "secondary" }),
              "w-full max-w-[15rem] hover:bg-red-500 hover:text-white"
            )}
          >
            Delete
          </Button>
          {loading ? (
            <Button disabled className="w-full max-w-[15rem]">
              <AiOutlineLoading className="mr-2 h-4 w-4 animate-spin" />
              Please wait..
            </Button>
          ) : (
            <Button type="submit" className="w-full max-w-[15rem]">
              Update
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
};

const TemplateSection: FC<{
  direction: "left" | "right";
  index: 0 | 1;
  form: UseFormReturn<CreateShowCaseType>;
  uploadImage: (index: 0 | 1) => (e: ChangeEvent<HTMLInputElement>) => void;
  deleteImage: (index: 0 | 1) => () => void;
  imageBase64: string;
}> = ({ direction, index, form, uploadImage, deleteImage, imageBase64 }) => {
  return (
    <div
      className={cn(
        "flex items-center gap-6 max-md:flex-col",
        direction === "left" ? "md:flex-row" : "md:flex-row-reverse"
      )}
    >
      <FormField
        control={form.control}
        name={`template_image${index}`}
        render={({ field }) => (
          <FormItem className="h-full max-h-full w-full">
            <FormControl>
              {!field.value[0] ? (
                <div className="relative flex aspect-video h-full w-full flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 text-slate-300 hover:border-fuchsia-500 hover:bg-fuchsia-50 hover:text-fuchsia-500">
                  <UploadCloud className="h-20 w-20" />
                  <span className="text-lg font-semibold">
                    Drop or upload an image
                  </span>
                  <Input
                    onChange={uploadImage(index)}
                    required
                    name="category_image"
                    className="absolute z-10 h-full w-full cursor-pointer opacity-0"
                    type="file"
                  />
                </div>
              ) : (
                <div className="relative flex h-full w-full flex-col gap-6">
                  {imageBase64 ? (
                    <Image
                      src={imageBase64}
                      alt="product image"
                      className="h-full w-full rounded-lg border-1 object-contain"
                      width={500}
                      height={500}
                    />
                  ) : null}
                  <button
                    type="button"
                    onClick={deleteImage(index)}
                    className="absolute right-2 top-2 rounded-md bg-slate-300 bg-opacity-50 p-2 text-slate-500 hover:bg-red-100 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              )}
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <div className="flex w-full flex-col gap-6">
        <FormField
          control={form.control}
          name={`title${index}`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name={`description${index}`}
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel className="flex items-baseline justify-between">
                <p className="text-black">Description</p>
                <p
                  className={cn(
                    "text-xs font-light",
                    field.value.length > 300 ? "text-red-500" : ""
                  )}
                >
                  {field.value.length} / 300
                </p>
              </FormLabel>
              <FormControl>
                <Textarea className="max-h-[12.5rem]" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};

export default UpdateTemplateCForm;
