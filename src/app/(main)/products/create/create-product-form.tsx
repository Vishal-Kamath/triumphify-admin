"use client";

import { Form } from "@/components/ui/form";
import { ChangeEvent, FC, useState } from "react";
import { useForm } from "react-hook-form";
import {
  CreateProductType,
  createProductSchema,
} from "./create-product-form-schema";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";

import ProductImagesFormComponent from "./product-images-form";
import ProductDetailsFormComponent from "./product-details-form";
import ProductMetaDetailsFormComponent from "./product-meta-details-form";
import { AiOutlineLoading } from "react-icons/ai";
import ProductVariationsFormComponent from "./product-variations-form";
import axios from "axios";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import ProductAccordianForm from "./product-accordian-form";
import ProductDescriptionForm from "./product-description-form";
import { invalidateAllProducts } from "@/lib/products";

const CreateProductForm: FC = () => {
  const { toast } = useToast();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const form = useForm<CreateProductType>({
    resolver: zodResolver(createProductSchema),
    defaultValues: {
      name: "",
      brand_name: "",
      category_id: "",
      description: "",
      product_accordians: [],

      product_images: [],

      variations: [],

      meta_title: "",
      meta_description: "",
      meta_keywords: "",
    },
  });

  const [productImages, setProductImages] = useState<string[]>([]);
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    const images = form.getValues("product_images");
    form.setValue("product_images", images.concat(files));

    const imagePromises: Promise<string>[] = files.map((file: File) => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64String = reader.result;
          resolve(base64String?.toString() || "");
        };

        reader.readAsDataURL(file);
      });
    });

    Promise.all(imagePromises).then((newImages) => {
      setProductImages((images) => images.concat(newImages));
    });

    // empty files
    // e.target.value = "";
  };

  function deleteImage(index: number) {
    const images = form.getValues("product_images");
    form.setValue(
      "product_images",
      images.filter((_, i) => i !== index),
    );
    setProductImages((images) => images.filter((_, i) => i !== index));
  }

  function handleOnSubmit(values: CreateProductType) {
    setLoading(true);
    const product_images = values.product_images.map((image, index) => ({
      name: image.name,
      type: image.type,
      size: image.size,
      lastModified: image.lastModified,
      base64: productImages[index],
    }));

    const attributes = Array.from(
      new Set(
        values.variations.map((variant) => variant.key.split(" - ")).flat(),
      ),
    ).map((key) => ({
      key,
      parent: key.split(":")[0],
      value: key.split(":")[1],
    }));

    axios
      .post(
        `${process.env.ENDPOINT}/api/products`,
        {
          name: values.name,
          brand_name: values.brand_name,
          category_id: values.category_id,
          description: values.description,
          product_accordians: values.product_accordians,
          product_images,

          attributes,
          variations: values.variations,

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
        invalidateAllProducts();
        router.push("/products/details");
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
        onSubmit={form.handleSubmit(handleOnSubmit)}
        className="flex w-full flex-col gap-12"
      >
        <ProductImagesFormComponent
          productImages={productImages}
          form={form}
          deleteImage={deleteImage}
          handleFileChange={handleFileChange}
        />

        <div className="flex w-full gap-6 max-md:flex-col">
          <ProductDetailsFormComponent form={form} />
          <ProductMetaDetailsFormComponent form={form} />
        </div>
        <div className="flex w-full gap-6 max-md:flex-col">
          <ProductDescriptionForm form={form} />
          <ProductAccordianForm form={form} />
        </div>
        <ProductVariationsFormComponent form={form} />

        {loading ? (
          <Button disabled className="my-6 ml-auto w-full max-w-[15rem]">
            <AiOutlineLoading className="mr-2 h-4 w-4 animate-spin" />
            Please wait..
          </Button>
        ) : (
          <Button type="submit" className="my-6 ml-auto w-full max-w-[15rem]">
            Create
          </Button>
        )}
      </form>
    </Form>
  );
};

export default CreateProductForm;
