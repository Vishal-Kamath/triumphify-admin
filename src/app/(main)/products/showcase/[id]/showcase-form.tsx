"use client";

import Image from "next/image";
import { FC, useState } from "react";
import ShowcaseTemplateA from "./template-A-form";
import ShowcaseTemplateB from "./template-B-form";
import ShowcaseTemplateC from "./template-C-form";

const CreateShowCaseForm: FC = () => {
  const [template, setTemplate] = useState<"A" | "B" | "C">("A");

  return (
    <div className="flex h-full flex-col gap-6">
      {template === "A" ? (
        <ShowcaseTemplateA />
      ) : template === "B" ? (
        <ShowcaseTemplateB />
      ) : template === "C" ? (
        <ShowcaseTemplateC />
      ) : null}
      <div className="mx-auto bg-white flex w-full max-w-5xl px-6 flex-col items-center justify-center gap-12 md:gap-20 rounded-lg border-1 py-12 shadow-md">
        <h3 className="text-3xl md:text-5xl font-semibold leading-none text-purple-900">
          Choose a template
        </h3>

        <div className="grid max-w-3xl grid-cols-1 md:grid-cols-3 gap-12">
          <Image
            src="/assets/template-a.svg"
            width={500}
            height={500}
            className="cursor-pointer transition-all duration-300 ease-in-out hover:scale-110 max-md:max-w-[20rem]"
            onClick={() => setTemplate("A")}
            alt="template-a"
          />
          <Image
            src="/assets/template-b.svg"
            width={500}
            height={500}
            className="cursor-pointer transition-all duration-300 ease-in-out hover:scale-110 max-md:max-w-[20rem]"
            onClick={() => setTemplate("B")}
            alt="template-a"
          />
          <Image
            src="/assets/template-c.svg"
            width={500}
            height={500}
            className="cursor-pointer transition-all duration-300 ease-in-out hover:scale-110 max-md:max-w-[20rem]"
            onClick={() => setTemplate("C")}
            alt="template-a"
          />
        </div>
      </div>
    </div>
  );
};

export default CreateShowCaseForm;
