"use client";

import { invalidateAllProducts, useProduct } from "@/lib/products";
import { useParams, useRouter } from "next/navigation";
import { ChangeEvent, FC, useEffect, useState } from "react";
import {
  UpdateProductType,
  updateProductSchema,
} from "./update-product-form-schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import UpdateProductImagesFormComponent from "./update-product-images";
import { Button } from "@/components/ui/button";
import { AiOutlineLoading } from "react-icons/ai";
import UpdateProductDetailsFormComponent from "./update-product-details-form";
import UpdateProductMetaDetailsFormComponent from "./update-meta-details-form";
import UpdateProductVariationsFormComponent from "./update-product-variations-form";
import UpdateProductAccordianForm from "./update-product-accordian-form";
import UpdateProductDescriptionForm from "./update-product-description-form";
import axios from "axios";
import { useToast } from "@/components/ui/use-toast";

const UpdateProductForm: FC = () => {
  const { toast } = useToast();
  const router = useRouter();

  const id = useParams()["id"] as string;
  const { data: product } = useProduct(id);
  const [loading, setLoading] = useState(false);

  const form = useForm<UpdateProductType>({
    resolver: zodResolver(updateProductSchema),
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

  useEffect(() => {
    if (product) {
      form.setValue("name", product.name);
      form.setValue("brand_name", product.brand_name);
      form.setValue("category_id", product.category_id);
      form.setValue("description", product.description);
      form.setValue("product_accordians", product.product_accordians || []);
      form.setValue("product_images", product.product_images || []);
      setProductImages((product.product_images || []) as string[]);

      form.setValue("variations", product.variations);

      form.setValue("meta_title", product.meta_title);
      form.setValue("meta_description", product.meta_description);
      form.setValue("meta_keywords", product.meta_keywords);
    }
  }, [product]);

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

  const onSubmit = (values: UpdateProductType) => {
    setLoading(true);

    const product_images = values.product_images.map((image, index) => {
      if (typeof image === "string") {
        return image;
      } else {
        return {
          name: image.name,
          type: image.type,
          size: image.size,
          lastModified: image.lastModified,
          base64: productImages[index],
        };
      }
    });

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
        `${process.env.ENDPOINT}/api/products/${id}`,
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
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex w-full flex-col gap-12"
      >
        <UpdateProductImagesFormComponent
          productImages={productImages}
          form={form}
          deleteImage={deleteImage}
          handleFileChange={handleFileChange}
        />

        <div className="flex w-full gap-6 max-md:flex-col">
          <UpdateProductDetailsFormComponent form={form} />
          <UpdateProductMetaDetailsFormComponent form={form} />
        </div>
        <div className="flex w-full gap-6 max-md:flex-col">
          <UpdateProductDescriptionForm form={form} />
          <UpdateProductAccordianForm form={form} />
        </div>
        <UpdateProductVariationsFormComponent form={form} />

        {loading ? (
          <Button disabled className="my-6 ml-auto w-full max-w-[15rem]">
            <AiOutlineLoading className="mr-2 h-4 w-4 animate-spin" />
            Please wait..
          </Button>
        ) : (
          <Button type="submit" className="my-6 ml-auto w-full max-w-[15rem]">
            Update
          </Button>
        )}
      </form>
    </Form>
  );
};

export default UpdateProductForm;
