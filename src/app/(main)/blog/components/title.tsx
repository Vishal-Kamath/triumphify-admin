import AutoResizingTextarea from "@/components/ui/auto-resize-textarea";
import { cn } from "@/lib/utils";
import { ChangeEvent, FC } from "react";

const BlogTitle: FC<{
  value: string;
  onChange: (event: ChangeEvent<HTMLTextAreaElement>) => void;
}> = ({ value, onChange }) => {
  return (
    <div className="group relative w-full">
      <AutoResizingTextarea
        placeholder="Tell us more..."
        className={cn(
          "w-full border-none font-serif font-medium outline-none",
          "pb-2 pt-6 text-4xl",
        )}
        value={value}
        onChange={onChange}
      />
    </div>
  );
};

export default BlogTitle;
