import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { invalidateAllBlogs } from "@/lib/blogs";
import { cn } from "@/lib/utils";
import axios from "axios";
import { FC, useState } from "react";
import { AiOutlineLoading } from "react-icons/ai";

const ProductTableLinkUnlinkDropdown: FC<{ id: string; linked?: boolean }> = ({
  id,
  linked,
}) => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  function handleLinkProduct(value: "linked" | "unlinked") {
    setLoading(true);
    axios
      .post(
        `${process.env.ENDPOINT}/api/blogs/${id}/link`,
        { linked_to_main_banner: value === "linked" },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        },
      )
      .then((res) => {
        setLoading(false);
        toast({
          title: res.data.title,
          description: res.data.description,
          variant: res.data.type,
        });
        invalidateAllBlogs();
      })
      .catch((err) => {
        setLoading(false);
        toast({
          title: err?.response?.data?.title || "Error",
          description: err?.response?.data?.description,
          variant: err?.response?.data?.type || "error",
        });
      });
  }

  return !loading ? (
    <Select
      value={linked ? "linked" : "unlinked"}
      onValueChange={handleLinkProduct}
    >
      <SelectTrigger
        className={cn(
          "w-[180px] rounded-md",
          linked ? "border-purple-500 bg-purple-50" : "",
        )}
      >
        <SelectValue placeholder="Linked to Banner" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="linked">Linked</SelectItem>
        <SelectItem value="unlinked">Unlinked</SelectItem>
      </SelectContent>
    </Select>
  ) : (
    <div className="flex h-10 w-[180px] items-center justify-center rounded-md border-1 border-slate-300">
      <AiOutlineLoading className="h-4 w-4 animate-spin" />
      <span>Loading..</span>
    </div>
  );
};

export default ProductTableLinkUnlinkDropdown;
