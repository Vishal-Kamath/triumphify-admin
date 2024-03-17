import { Separator } from "@/components/ui/separator";
import { FC } from "react";
import CreateCategoryForm from "./create-category-form";
import Link from "next/link";
import { MoveLeft } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import TabComponent from "@/components/misc/component";

const CreateProductCategory: FC = () => {
  return (
    <TabComponent>
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <Link
            href="/products/categories"
            className={buttonVariants({ variant: "ghost" })}
          >
            <MoveLeft />
          </Link>
          <h3 className="text-xl font-medium">Create New Category</h3>
        </div>
        <p className="text-sm text-gray-500">
          Input category details to create a new category
        </p>
      </div>
      <Separator />
      <CreateCategoryForm />
    </TabComponent>
  );
};

export default CreateProductCategory;
