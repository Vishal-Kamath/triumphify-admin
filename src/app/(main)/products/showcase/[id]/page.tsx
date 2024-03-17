import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { MoveLeft } from "lucide-react";
import Link from "next/link";
import { FC } from "react";
import CreateShowCaseForm from "./showcase-form";
import ExistingShowcasesForm from "./existing-showcase-form";
import TabComponent from "@/components/misc/component";

const CreateProductShowcase: FC = () => {
  return (
    <TabComponent className="max-md:bg-slate-100 max-md:p-0">
      <div className="flex flex-col gap-6 max-md:pt-6 bg-white">
        <div className="flex items-center px-3 gap-3">
          <Link
            href={`/products/showcase`}
            className={buttonVariants({ variant: "ghost" })}
          >
            <MoveLeft />
          </Link>
          <div className="flex flex-col">
            <h3 className="text-xl font-medium">Product showcase</h3>
            <p className="text-sm text-gray-500">
              fill in the form below to create new product showcase.
            </p>
          </div>
        </div>
        <Separator className="max-md:bg-slate-300" />
      </div>
      <ExistingShowcasesForm />
      <CreateShowCaseForm />
    </TabComponent>
  );
};

export default CreateProductShowcase;
