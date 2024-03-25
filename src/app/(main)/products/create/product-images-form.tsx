import { ChangeEvent, FC } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Trash2, UploadCloud } from "lucide-react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { CreateProductType } from "./create-product-form-schema";
import { FormField, FormMessage } from "@/components/ui/form";

const ProductImagesFormComponent: FC<{
  productImages: string[];
  form: UseFormReturn<CreateProductType>;

  deleteImage: (index: number) => void;
  handleFileChange: (e: ChangeEvent<HTMLInputElement>) => void;
}> = ({ productImages, form, deleteImage, handleFileChange }) => {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col">
        <h2 className="text-lg font-medium">Product Images</h2>
        <p className="text-xs text-slate-500">
          Select your products display images
        </p>
      </div>

      <FormField
        control={form.control}
        name="product_images"
        render={({ field }) => (
          <>
            <Carousel
              opts={{
                align: "start",
                direction: "ltr",
                dragFree: true,
              }}
            >
              <CarouselContent className="px-1">
                {productImages.map((image, index) => (
                  <CarouselItem
                    key={index}
                    className="relative cursor-grab active:cursor-grabbing sm:basis-1/2 lg:basis-1/3 xl:basis-1/4"
                  >
                    <Image
                      src={image}
                      alt="product image"
                      className="h-full w-full aspect-[4/5] rounded-lg border-1 object-contain"
                      width={500}
                      height={500}
                    />
                    <button
                      type="button"
                      onClick={() => deleteImage(index)}
                      className="absolute right-2 top-2 rounded-md bg-slate-300 bg-opacity-20 p-2 text-slate-500 hover:bg-red-100 hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </CarouselItem>
                ))}
                <CarouselItem className="sm:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                  <div className="relative flex aspect-[4/5] w-full flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 text-slate-300 hover:border-fuchsia-500 hover:bg-fuchsia-50 hover:text-fuchsia-500">
                    <UploadCloud className="h-20 w-20" />
                    <span className="text-lg font-semibold">
                      Drop or upload an image
                    </span>
                    <Input
                      onChange={handleFileChange}
                      name="product_images"
                      className="absolute z-10 h-full w-full cursor-pointer opacity-0"
                      type="file"
                      multiple
                    />
                  </div>
                </CarouselItem>
              </CarouselContent>
            </Carousel>
            <FormMessage />
          </>
        )}
      />
    </div>
  );
};

export default ProductImagesFormComponent;
