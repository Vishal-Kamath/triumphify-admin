import { FC } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { useCategories } from "@/lib/categories";
import { UpdateProductType } from "./update-product-form-schema";

const UpdateProductDetailsFormComponent: FC<{
  form: UseFormReturn<UpdateProductType>;
}> = ({ form }) => {
  const { data: categories } = useCategories();
  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex flex-col">
        <h2 className="text-lg font-medium">Product Details</h2>
        <p className="text-xs text-slate-500">Input your products details</p>
      </div>
      <div className="flex w-full flex-col gap-6">
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
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="brand_name"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel className="text-black">Brand name</FormLabel>
              <FormControl>
                <Input type="text" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="category_id"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel className="text-black">Category</FormLabel>
              <FormControl>
                <Select
                  value={form.watch("category_id")}
                  // defaultValue={field.value}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories?.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};

export default UpdateProductDetailsFormComponent;
