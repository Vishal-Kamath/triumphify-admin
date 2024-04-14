"use client";

import ConfirmDelete from "@/components/misc/confirmDelete";
import { Button, buttonVariants } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { invalidateAllLeads } from "@/lib/lead";
import { cn } from "@/lib/utils";
import axios from "axios";
import { Trash2 } from "lucide-react";
import { FC, useState } from "react";
import { AiOutlineLoading } from "react-icons/ai";

const DeleteLeadsButton: FC<{ leadId: string; leadName: string }> = ({
  leadId,
  leadName,
}) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  function deleteLead() {
    setLoading(true);
    axios
      .delete(`${process.env.ENDPOINT}/api/leads/${leadId}`, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      })
      .then((res) => {
        setLoading(false);
        invalidateAllLeads();
        toast({
          title: res.data.title,
          description: res.data.description,
          variant: res.data.type,
        });
      })
      .catch((err) => {
        setLoading(false);
        if (!err.response?.data) return;
        toast({
          title: "Error",
          description: err.response.data.description,
          variant: err.response.data.type,
        });
      });
  }
  return loading ? (
    <Button
      disabled
      variant="ghost"
      className="text-slate-600 animate-spin hover:bg-red-50 hover:text-red-700"
    >
      <AiOutlineLoading className="size-4" />
    </Button>
  ) : (
    <ConfirmDelete
      confirmText={leadName}
      deleteFn={deleteLead}
      className={cn(
        buttonVariants({ variant: "ghost" }),
        "text-slate-600 hover:bg-red-50 hover:text-red-700"
      )}
    >
      <Trash2 className="size-4" />
    </ConfirmDelete>
  );
};

export default DeleteLeadsButton;
