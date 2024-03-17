"use client";

import { useShowcases } from "@/lib/showcase";
import { useParams } from "next/navigation";
import { FC } from "react";
import UpdateTemplateAForm from "./update-template-A-form";
import UpdateTemplateBForm from "./update-template-B-form";
import UpdateTemplateCForm from "./update-template-C-form";

const ExistingShowcasesForm: FC = () => {
  const id = useParams()["id"] as string;
  const { data: showcases, refetch } = useShowcases(id);

  return (
    <div className="flex flex-col gap-6">
      {showcases?.map((showcase) => {
        if (showcase.template === "A") {
          return (
            <UpdateTemplateAForm
              key={showcase.id}
              content={showcase.content}
              refetch={refetch}
              templateId={showcase.id}
            />
          );
        } else if (showcase.template === "B") {
          return (
            <UpdateTemplateBForm
              key={showcase.id}
              content={showcase.content}
              templateId={showcase.id}
            />
          );
        } else if (showcase.template === "C") {
          return (
            <UpdateTemplateCForm
              key={showcase.id}
              content={showcase.content}
              templateId={showcase.id}
            />
          );
        }
      })}
    </div>
  );
};

export default ExistingShowcasesForm;
