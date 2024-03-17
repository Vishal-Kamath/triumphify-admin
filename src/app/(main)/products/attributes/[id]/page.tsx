import { Separator } from "@/components/ui/separator";
import { FC } from "react";
import Link from "next/link";
import { MoveLeft } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import UpdateAttributeForm from "./update-attribute-form";
import TabComponent from "@/components/misc/component";

const CreateProductAttribute: FC = () => {
  return (
    <TabComponent>
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <Link
            href="/products/attributes"
            className={buttonVariants({ variant: "ghost" })}
          >
            <MoveLeft />
          </Link>
          <h3 className="text-xl font-medium">Update Attribute</h3>
        </div>
        <p className="text-sm text-gray-500">
          Input attribute details to update a new attribute
        </p>
      </div>
      <Separator />
      <UpdateAttributeForm />
    </TabComponent>
  );
};

export default CreateProductAttribute;
