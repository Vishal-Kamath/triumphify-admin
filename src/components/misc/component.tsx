import { cn } from "@/lib/utils";
import { FC, HTMLAttributes } from "react";

interface TabProps extends HTMLAttributes<HTMLDivElement> {}
const TabComponent: FC<TabProps> = ({ className, children, ...props }) => {
  return (
    <div className="h-full w-full bg-slate-50 lg:p-6 lg:pb-12">
      <main
        className={cn(
          "flex h-full w-full flex-col gap-6 bg-white p-6 shadow-md max-lg:pb-12 lg:rounded-lg lg:border-1 lg:border-slate-200",
          className
        )}
        {...props}
      >
        {children}
      </main>
    </div>
  );
};

export default TabComponent;
