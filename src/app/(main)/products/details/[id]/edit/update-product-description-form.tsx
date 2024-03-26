import { FC } from "react";
import { UseFormReturn } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { UpdateProductType } from "./update-product-form-schema";

const UpdateProductDescriptionForm: FC<{
  form: UseFormReturn<UpdateProductType>;
}> = ({ form }) => {
  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex flex-col">
        <h2 className="text-lg font-medium">Product Description</h2>
        <p className="text-xs text-slate-500">
          Input description for your product
        </p>
      </div>

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
                  field.value.length > 750 ? "text-red-500" : "",
                )}
              >
                {field.value.length} / 750
              </p>
            </FormLabel>
            <FormControl>
              <Textarea className="max-h-[15rem] min-h-[9rem]" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default UpdateProductDescriptionForm;
