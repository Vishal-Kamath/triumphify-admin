import { Separator } from "@/components/ui/separator";
import { FC } from "react";
import CreateProductForm from "./create-product-form";
import TabComponent from "@/components/misc/component";

const CreateProductPage: FC = () => {
  return (
    <TabComponent>
      <div className="flex flex-col">
        <h3 className="text-xl font-medium">Create New product</h3>
        <p className="text-sm text-gray-500">
          fill in the form below to create new product.
        </p>
      </div>
      <Separator />
      <CreateProductForm />
    </TabComponent>
  );
};

export default CreateProductPage;
