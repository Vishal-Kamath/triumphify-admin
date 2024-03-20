"use client";

import { FC, ReactNode, useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { CreateProductType } from "./create-product-form-schema";
import { ChevronDownIcon, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const Accordian: FC<{
  title: string;
  setTitle: (input: string) => void;
  description: string;
  setDescription: (input: string) => void;
  deletefn: VoidFunction;
}> = ({ title, setTitle, description, setDescription, deletefn }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="mx-auto flex w-full flex-col overflow-hidden border-b-1 border-slate-200">
      <div className="flex w-full gap-2 items-center justify-between">
        <input
          placeholder="Title"
          maxLength={100}
          className="w-full border-none px-2 py-3 outline-none"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <button
          type="button"
          onClick={deletefn}
          className="flex aspect-square h-full items-center p-2 hover:bg-red-50 rounded-md justify-center border-none text-gray-600 outline-none hover:text-red-500"
        >
          <Trash2 className="h-4 w-4 shrink-0" />
        </button>
        <button
          type="button"
          onClick={() => setOpen((open) => !open)}
          className="flex aspect-square h-full items-center p-2 hover:bg-slate-50 rounded-md justify-center border-none outline-none"
        >
          <ChevronDownIcon
            className={cn(
              "h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200",
              open ? "-rotate-180" : ""
            )}
          />
        </button>
      </div>
      <div className="w-full">
        <textarea
          maxLength={500}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
          className={cn(
            "max-h-[10rem] min-h-[7.5rem] w-full border-none p-2 text-xs outline-none",
            !open ? "hidden" : ""
          )}
        />
      </div>
    </div>
  );
};

const ProductAccordianForm: FC<{
  form: UseFormReturn<CreateProductType>;
}> = ({ form }) => {
  const descriptions = form.watch("product_accordians");

  const [tempTitle, setTempTitle] = useState("");
  const [tempDescription, setTempDescription] = useState("");
  const [tempOpen, setTempOpen] = useState(false);

  const handleTitle = (index: number) => (value: string) => {
    descriptions[index].title = value;
    const newDescription = Array.from(descriptions);
    form.setValue("product_accordians", newDescription);
  };

  const handleDescription = (index: number) => (value: string) => {
    descriptions[index].description = value;
    const newDescription = Array.from(descriptions);
    form.setValue("product_accordians", newDescription);
  };

  const handleDelete = (index: number) => {
    const newDescription = descriptions.filter((_, i) => i !== index);
    form.setValue("product_accordians", newDescription);
  };

  const handleCreate = () => {
    if (!tempTitle.trim() || !tempDescription.trim()) return;

    descriptions.push({
      title: tempTitle,
      description: tempDescription,
    });
    const newDescription = Array.from(descriptions);
    form.setValue("product_accordians", newDescription);
    setTempTitle("");
    setTempDescription("");
  };

  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex flex-col">
        <h2 className="text-lg font-medium">Product Accordian</h2>
        <p className="text-xs text-slate-500">
          Generate descriptive accordians for your product
        </p>
      </div>

      <div className="flex flex-col">
        {descriptions.map((description, index) => (
          <Accordian
            key={index}
            title={description.title}
            setTitle={handleTitle(index)}
            description={description.description}
            setDescription={handleDescription(index)}
            deletefn={() => handleDelete(index)}
          />
        ))}

        <div className="mx-auto flex w-full flex-col overflow-hidden border-b-1 border-slate-200">
          <div className="flex w-full items-center justify-between gap-3">
            <input
              maxLength={100}
              placeholder="Title"
              className="w-full border-none px-2 py-3 outline-none"
              value={tempTitle}
              onChange={(e) => setTempTitle(e.target.value)}
            />

            <button
              type="button"
              onClick={() => setTempOpen((open) => !open)}
              className="flex aspect-square h-full items-center p-2 hover:bg-slate-50 rounded-md justify-center border-none outline-none"
            >
              <ChevronDownIcon
                className={cn(
                  "h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200",
                  tempOpen ? "-rotate-180" : ""
                )}
              />
            </button>
          </div>
          <div className="w-full">
            <textarea
              maxLength={500}
              value={tempDescription}
              onChange={(e) => setTempDescription(e.target.value)}
              placeholder="Description"
              className={cn(
                "max-h-[10rem] min-h-[7.5rem] w-full border-none p-2 text-xs outline-none",
                !tempOpen ? "hidden" : ""
              )}
            />
          </div>
        </div>
      </div>
      <Button
        onClick={handleCreate}
        type="button"
        variant="secondary"
        className="ml-auto"
      >
        Create
      </Button>
    </div>
  );
};

export default ProductAccordianForm;
