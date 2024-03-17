import { FC } from "react";
import { UseFormReturn } from "react-hook-form";
import { CreateProductType } from "./create-product-form-schema";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

const ProductMetaDetailsFormComponent: FC<{
  form: UseFormReturn<CreateProductType>;
}> = ({ form }) => {
  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex flex-col">
        <h2 className="text-lg font-medium">Product Meta Details</h2>
        <p className="text-xs text-slate-500">
          Input meta details for SEO optimization
        </p>
      </div>
      <div className="flex w-full flex-col gap-6">
        <FormField
          control={form.control}
          name="meta_title"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel className="text-black">Meta title</FormLabel>
              <FormControl>
                <Input type="text" {...field} />
              </FormControl>
              <FormMessage />
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
                    field.value.length > 250 ? "text-red-500" : "",
                  )}
                >
                  {field.value.length} / 250
                </p>
              </FormLabel>
              <FormControl>
                <Textarea
                  className="max-h-[9rem] min-h-[9rem] resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};

export default ProductMetaDetailsFormComponent;
