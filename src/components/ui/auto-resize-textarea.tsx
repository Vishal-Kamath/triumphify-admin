import { cn } from "@/lib/utils";
import React, { useRef, useEffect, ComponentProps } from "react";

const AutoResizingTextarea: React.FC<ComponentProps<"textarea">> = ({
  className,
  value,
  ...props
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const adjustHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto"; // Reset the height
      textarea.style.height = `${textarea.scrollHeight}px`; // Set the height to the scrollHeight
    }
  };

  useEffect(() => {
    adjustHeight(); // Adjust height on mount
  }, [value]);

  return (
    <textarea
      ref={textareaRef}
      value={value}
      className={cn(
        "w-full resize-none overflow-hidden rounded-md border border-gray-300 p-2",
        className,
      )}
      rows={1}
      {...props}
    />
  );
};

export default AutoResizingTextarea;
