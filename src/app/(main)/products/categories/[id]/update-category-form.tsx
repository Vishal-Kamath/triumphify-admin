"use client";

import { ChangeEvent, FC, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  UpdateCategoryType,
  updateCategoryFormSchema,
} from "./update-category-form-schema";
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
import { Button } from "@/components/ui/button";
import { AiOutlineLoading } from "react-icons/ai";
import { Textarea } from "@/components/ui/textarea";
import { Trash2, UploadCloud } from "lucide-react";
import Image from "next/image";
import axios from "axios";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import {
  invalidateAllCategories,
  invalidateCategory,
  useCategory,
} from "@/lib/categories";
import { useParams, useRouter } from "next/navigation";

const UpdateCategoryForm: FC = () => {
  const router = useRouter();
  const { toast } = useToast();
  const id = useParams()["id"] as string;

  const { data: category, isLoading } = useCategory(id);

  const [loading, setLoading] = useState(false);
  const [imageBase64, setImageBase64] = useState("");

  const form = useForm<UpdateCategoryType>({
    resolver: zodResolver(updateCategoryFormSchema),
    defaultValues: {
      name: "",
      description: "",
      category_image: "",
      meta_title: "",
      meta_description: "",
      meta_keywords: "",
    },
  });

  useEffect(() => {
    form.setValue("name", category?.name || "");
    form.setValue("description", category?.description || "");
    form.setValue("category_image", category?.category_image || "");
    form.setValue("meta_title", category?.meta_title || "");
    form.setValue("meta_description", category?.meta_description || "");
    form.setValue("meta_keywords", category?.meta_keywords || "");

    setImageBase64(category?.category_image || "");
  }, [category]);

  function convertFileToBase64(file: File) {
    const reader = new FileReader();
    reader.onloadend = () => {
      setImageBase64(reader.result?.toString() || "");
    };
    reader.readAsDataURL(file);
  }

  async function uploadImage(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files as FileList;
    convertFileToBase64(file[0]);
    form.setValue("category_image", Array.from(e.target.files || []));
  }

  function deleteImage() {
    form.setValue("category_image", []);
    setImageBase64("");
  }

  async function onSubmit(values: UpdateCategoryType) {
    setLoading(true);
    const category_image =
      typeof values.category_image === "string"
        ? values.category_image
        : {
            name: values.category_image[0].name,
            type: values.category_image[0].type,
            size: values.category_image[0].size,
            lastModified: values.category_image[0].lastModified,
            base64: imageBase64,
          };
    axios
      .put(
        `${process.env.ENDPOINT}/api/categories/${id}`,
        {
          name: values.name,
          description: values.description,
          category_image,
          meta_title: values.meta_title,
          meta_description: values.meta_description,
          meta_keywords: values.meta_keywords,
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
        toast({
          title: res.data.title,
          description: res.data.description,
          variant: res.data.type,
        });
        invalidateAllCategories();
        router.push("/products/categories");
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
        className="flex w-full gap-6 max-lg:flex-col"
      >
        <div className="flex w-full max-w-xs flex-col gap-6">
          <FormField
            control={form.control}
            name="category_image"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel className="text-black">Category Image</FormLabel>
                <FormControl>
                  {!field.value[0] ? (
                    <div className="relative flex aspect-[4/5] w-full flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 text-slate-300 hover:border-fuchsia-500 hover:bg-fuchsia-50 hover:text-fuchsia-500">
                      <UploadCloud className="h-20 w-20" />
                      <span className="text-lg font-semibold">
                        Drop or upload an image
                      </span>
                      <Input
                        onChange={uploadImage}
                        required
                        name="category_image"
                        className="absolute z-10 h-full w-full cursor-pointer opacity-0"
                        type="file"
                      />
                    </div>
                  ) : (
                    <div className="flex flex-col gap-6">
                      {imageBase64 ? (
                        <Image
                          src={imageBase64}
                          alt="image"
                          className="aspect-[4/5] h-full w-full rounded-md border-1 object-contain"
                          width={500}
                          height={500}
                        />
                      ) : null}
                      <Button
                        variant="secondary"
                        className="w-full gap-2 hover:bg-destructive hover:text-white"
                        onClick={deleteImage}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span>Delete</span>
                      </Button>
                    </div>
                  )}
                </FormControl>
                <FormMessage />
                <FormDescription className="text-xs">
                  Supported file types: JPEG, JPG, PNG, WEBP
                </FormDescription>
              </FormItem>
            )}
          />
        </div>
        <div className="flex h-full w-full flex-col justify-between gap-6">
          <div className="flex w-full gap-6 max-md:flex-col">
            <div className="flex w-full max-w-xl flex-col gap-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel className="text-black">Name</FormLabel>
                    <FormControl>
                      <Input type="text" {...field} />
                    </FormControl>
                    <FormMessage />
                    <FormDescription className="text-xs">
                      category display name.
                    </FormDescription>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel className="flex items-baseline justify-between">
                      <p className="text-black">Description</p>
                      <p
                        className={cn(
                          "text-xs font-light",
                          field.value.length > 500 ? "text-red-500" : "",
                        )}
                      >
                        {field.value.length} / 500
                      </p>
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        className="max-h-[15rem] min-h-[12.5rem]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                    <FormDescription className="text-xs">
                      category description.
                    </FormDescription>
                  </FormItem>
                )}
              />
            </div>
            <div className="flex w-full max-w-xl flex-col gap-6">
              <FormField
                control={form.control}
                name="meta_title"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel className="text-black">Meta Title</FormLabel>
                    <FormControl>
                      <Input type="text" {...field} />
                    </FormControl>
                    <FormMessage />
                    <FormDescription className="text-xs">
                      category display name.
                    </FormDescription>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="meta_description"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel className="flex items-baseline justify-between">
                      <p className="text-black">Meta Description</p>
                      <p
                        className={cn(
                          "text-xs font-light",
                          field.value.length > 100 ? "text-red-500" : "",
                        )}
                      >
                        {field.value.length} / 100
                      </p>
                    </FormLabel>
                    <FormControl>
                      <Textarea className="max-h-[10rem]" {...field} />
                    </FormControl>
                    <FormMessage />
                    <FormDescription className="text-xs">
                      category display name.
                    </FormDescription>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="meta_keywords"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel className="text-black">Meta Keywords</FormLabel>
                    <FormControl>
                      <Input type="text" {...field} />
                    </FormControl>
                    <FormMessage />
                    <FormDescription className="text-xs">
                      category display name.
                    </FormDescription>
                  </FormItem>
                )}
              />
            </div>
          </div>
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
        </div>
      </form>
    </Form>
  );
};

export default UpdateCategoryForm;
