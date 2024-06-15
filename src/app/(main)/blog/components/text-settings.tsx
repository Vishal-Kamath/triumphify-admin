import { cn } from "@/lib/utils";
import { Heading1, Heading2, Type, X } from "lucide-react";
import { FC } from "react";

const BlogTextSettings: FC<{
  type: "h1" | "h2" | "text";
  changeTextType: (type: "h1" | "h2" | "text") => void;
  deleteSection: () => void;
}> = ({ type, changeTextType, deleteSection }) => {
  return (
    <div className="mb-4 mt-2 hidden gap-3 group-focus-within:flex">
      <button
        onClick={() => changeTextType("h1")}
        disabled={type === "h1"}
        className={cn(
          "flex h-8 w-8 items-center justify-center rounded-full border-1",
          type === "h1"
            ? "border-gray-400 bg-gray-200 text-gray-700"
            : "border-gray-400 text-sm text-gray-400 hover:border-gray-600 hover:text-gray-700",
        )}
      >
        <Heading1 className="h-4 w-4" />
      </button>
      <button
        onClick={() => changeTextType("h2")}
        disabled={type === "h2"}
        className={cn(
          "flex h-8 w-8 items-center justify-center rounded-full border-1",
          type === "h2"
            ? "border-gray-400 bg-gray-200 text-gray-700"
            : "border-gray-400 text-sm text-gray-400 hover:border-gray-600 hover:text-gray-700",
        )}
      >
        <Heading2 className="h-4 w-4" />
      </button>
      <button
        onClick={() => changeTextType("text")}
        disabled={type === "text"}
        className={cn(
          "flex h-8 w-8 items-center justify-center rounded-full border-1",
          type === "text"
            ? "border-gray-400 bg-gray-200 text-gray-700"
            : "border-gray-400 text-sm text-gray-400 hover:border-gray-600 hover:text-gray-700",
        )}
      >
        <Type className="h-4 w-4" />
      </button>
      <button
        onClick={deleteSection}
        className="flex h-8 w-8 items-center justify-center rounded-full border-1 border-gray-400 text-gray-400 hover:border-red-600 hover:bg-red-100 hover:text-red-700"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
};

export default BlogTextSettings;
