import { ChangeEvent, FC } from "react";
import BlogTextSettings from "./text-settings";
import AutoResizingTextarea from "@/components/ui/auto-resize-textarea";
import { cn } from "@/lib/utils";

const textStyles = {
  h1: "text-3xl pt-4",
  h2: "text-2xl pt-3",
  text: "text-xl pt-2",
};

const BlogText: FC<{
  value: string;
  type: "h1" | "h2" | "text";
  onChange: (event: ChangeEvent<HTMLTextAreaElement>) => void;
  changeTextType: (type: "h1" | "h2" | "text") => void;
  deleteSection: () => void;
}> = ({ value, type, onChange, changeTextType, deleteSection }) => {
  return (
    <div className="group relative w-full">
      <AutoResizingTextarea
        placeholder="Tell us more..."
        className={cn(
          "w-full border-none font-serif font-medium outline-none",
          textStyles[type],
        )}
        value={value}
        onChange={onChange}
      />
      <BlogTextSettings
        type={type}
        changeTextType={changeTextType}
        deleteSection={deleteSection}
      />
    </div>
  );
};

export default BlogText;
