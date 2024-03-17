"use client";

import { ChangeEvent, FC, useState } from "react";
import { useForm } from "react-hook-form";
import {
  CreateBannerFormType,
  createBannerFormSchema,
} from "./create-banner-form-schema";
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
import { Trash2, UploadCloud } from "lucide-react";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { AiOutlineLoading } from "react-icons/ai";
import { Switch } from "@/components/ui/switch";
import axios from "axios";
import { invalidateAllBanners } from "@/lib/banners";

const CreateMainBannerForm: FC<{ type: "main" | "sub" }> = ({ type }) => {
  const router = useRouter();
  const { toast } = useToast();

  const [loading, setLoading] = useState(false);
  const [imageBase64Desktop, setImageBase64Desktop] = useState("");
  const [imageBase64Mobile, setImageBase64Mobile] = useState("");

  const imageSetter = (
    type: "banner_image_desktop" | "banner_image_mobile",
    value: string,
  ) => {
    if (type === "banner_image_desktop") {
      setImageBase64Desktop(value);
    } else {
      setImageBase64Mobile(value);
    }
  };

  const form = useForm<CreateBannerFormType>({
    resolver: zodResolver(createBannerFormSchema),
    defaultValues: {
      link: "",
      is_published: true,
      banner_image_desktop: [],
      banner_image_mobile: [],
    },
  });

  const convertFileToBase64 =
    (type: "banner_image_desktop" | "banner_image_mobile") => (file: File) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        imageSetter(type, reader.result?.toString() || "");
      };
      reader.readAsDataURL(file);
    };

  const uploadImage =
    (type: "banner_image_desktop" | "banner_image_mobile") =>
    (e: ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files as FileList;
      convertFileToBase64(type)(file[0]);
      form.setValue(type, Array.from(e.target.files || []));
    };

  const deleteImage =
    (type: "banner_image_desktop" | "banner_image_mobile") => () => {
      form.setValue(type, []);
      imageSetter(type, "");
    };

  async function onSubmit(values: CreateBannerFormType) {
    setLoading(true);
    axios
      .post(
        `${process.env.ENDPOINT}/api/banners/${type}`,
        {
          banner_image_desktop: {
            name: values.banner_image_desktop[0].name,
            type: values.banner_image_desktop[0].type,
            size: values.banner_image_desktop[0].size,
            lastModified: values.banner_image_desktop[0].lastModified,
            base64: imageBase64Desktop,
          },
          banner_image_mobile: {
            name: values.banner_image_mobile[0].name,
            type: values.banner_image_mobile[0].type,
            size: values.banner_image_mobile[0].size,
            lastModified: values.banner_image_mobile[0].lastModified,
            base64: imageBase64Mobile,
          },
          link: values.link,
          is_published: values.is_published,
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
        invalidateAllBanners(type);
        router.push(`/banners/${type}`);
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
        className="flex w-full flex-col gap-9"
      >
        <div className="flex w-full gap-6">
          <FormField
            control={form.control}
            name="banner_image_desktop"
            render={({ field }) => (
              <FormItem className="w-full max-w-xl">
                <FormLabel className="text-black">
                  Category Desktop Image
                </FormLabel>
                <FormControl>
                  {!field.value[0] ? (
                    <div className="relative flex aspect-[2/1] w-full flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 text-slate-300 hover:border-fuchsia-500 hover:bg-fuchsia-50 hover:text-fuchsia-500">
                      <UploadCloud className="h-20 w-20" />
                      <span className="text-lg font-semibold">
                        Drop or upload an image
                      </span>
                      <Input
                        onChange={uploadImage("banner_image_desktop")}
                        required
                        name="banner_image_desktop"
                        className="absolute z-10 h-full w-full cursor-pointer opacity-0"
                        type="file"
                      />
                    </div>
                  ) : (
                    <div className="flex flex-col gap-6">
                      {imageBase64Desktop ? (
                        <Image
                          src={imageBase64Desktop}
                          alt="image"
                          className="aspect-[2/1] h-full w-full rounded-md border-1 object-contain"
                          width={500}
                          height={500}
                        />
                      ) : null}
                      <Button
                        variant="secondary"
                        className="w-full gap-2 hover:bg-destructive hover:text-white"
                        onClick={deleteImage("banner_image_desktop")}
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
          <FormField
            control={form.control}
            name="banner_image_mobile"
            render={({ field }) => (
              <FormItem className="w-full max-w-xl">
                <FormLabel className="text-black">
                  Category Mobile Image
                </FormLabel>
                <FormControl>
                  {!field.value[0] ? (
                    <div className="relative flex aspect-[2/1] w-full flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 text-slate-300 hover:border-fuchsia-500 hover:bg-fuchsia-50 hover:text-fuchsia-500">
                      <UploadCloud className="h-20 w-20" />
                      <span className="text-lg font-semibold">
                        Drop or upload an image
                      </span>
                      <Input
                        onChange={uploadImage("banner_image_mobile")}
                        required
                        name="banner_image_mobile"
                        className="absolute z-10 h-full w-full cursor-pointer opacity-0"
                        type="file"
                      />
                    </div>
                  ) : (
                    <div className="flex flex-col gap-6">
                      {imageBase64Mobile ? (
                        <Image
                          src={imageBase64Mobile}
                          alt="image"
                          className="aspect-[2/1] h-full w-full rounded-md border-1 object-contain"
                          width={500}
                          height={500}
                        />
                      ) : null}
                      <Button
                        variant="secondary"
                        className="w-full gap-2 hover:bg-destructive hover:text-white"
                        onClick={deleteImage("banner_image_mobile")}
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
        <div className="flex w-full max-w-xl flex-col gap-6">
          <FormField
            control={form.control}
            name="link"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel className="text-black">Link</FormLabel>
                <FormControl>
                  <Input type="text" {...field} />
                </FormControl>
                <FormMessage />
                <FormDescription className="text-xs">
                  Redirect link.
                </FormDescription>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="is_published"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                <div className="space-y-0.5">
                  <FormLabel>Banner Publish</FormLabel>
                  <FormDescription className="text-xs">
                    Only Published Banners will appear on users feed.
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    className="data-[state=checked]:bg-purple-700"
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
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
              Create
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
};

export default CreateMainBannerForm;
