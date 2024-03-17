"use client";

import { FC } from "react";
import { Button, ButtonProps } from "@/components/ui/button";
import { handleExtract } from "@/utils/extract";
import { dateFormater } from "@/utils/dateFormater";
import { cn } from "@/lib/utils";
import { useMe } from "@/lib/auth";

interface DataTableExtract extends ButtonProps {
  data: any[];
  name: string;
}
const DataTableExtract: FC<DataTableExtract> = ({
  data,
  name,
  className,
  ...props
}) => {
  const { data: me, isLoading } = useMe();

  return isLoading || !me || me.role === "employee" ? null : (
    <Button
      className={cn("w-[5rem]", className)}
      variant="outline"
      onClick={() =>
        handleExtract(
          `${name}_${dateFormater(new Date()).replaceAll(" ", "_").replaceAll(",", "")}`,
          data
        )
      }
      {...props}
    >
      Extract
    </Button>
  );
};

export default DataTableExtract;
