"use client";

import ConfirmDelete from "@/components/misc/confirmDelete";
import { buttonVariants } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/use-toast";
import useMediaQuery from "@/lib/hooks/use-media-query";
import { invalidateAllProducts } from "@/lib/products";
import { cn } from "@/lib/utils";
import axios from "axios";
import {
  ExternalLink,
  Eye,
  GalleryVertical,
  MoreHorizontal,
  PencilLine,
  Star,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { FC, useState } from "react";

const DropdownContent: FC<{ id: string; name: string; slug: string }> = ({
  id,
  name,
  slug,
}) => {
  const { toast } = useToast();

  const handleDeleteProduct = (id: string) => {
    axios
      .delete(`${process.env.ENDPOINT}/api/products/${id}`, {
        withCredentials: true,
      })
      .then((res) => {
        toast({
          title: res.data.title,
          description: res.data.description,
          variant: res.data.type,
        });
        invalidateAllProducts();
      })
      .catch((err) => {
        toast({
          title: err?.response?.data?.title || "Error",
          description: err?.response?.data?.description,
          variant: err?.response?.data?.type || "error",
        });
      });
  };

  return (
    <>
      <Link
        href={"/products/details/" + id}
        className={cn(
          buttonVariants({ variant: "ghost" }),
          "justify-start w-full pl-3 gap-3 text-slate-600"
        )}
      >
        <Eye className="h-4 w-4" />
        <span>View</span>
      </Link>
      <Link
        href={"/products/details/" + id + "/edit"}
        className={cn(
          buttonVariants({ variant: "ghost" }),
          "justify-start w-full pl-3 gap-3 text-slate-600"
        )}
      >
        <PencilLine className="h-4 w-4" />
        <span>Edit</span>
      </Link>
      <Link
        href={"/products/reviews/" + id}
        className={cn(
          buttonVariants({ variant: "ghost" }),
          "justify-start w-full pl-3 gap-3 text-slate-600"
        )}
      >
        <Star className="h-4 w-4" />
        <span>Reviews</span>
      </Link>
      <Link
        href={"/products/showcase/" + id}
        className={cn(
          buttonVariants({ variant: "ghost" }),
          "justify-start w-full pl-3 gap-3 text-slate-600"
        )}
      >
        <GalleryVertical className="h-4 w-4" />
        <span>Showcases</span>
      </Link>
      <a
        href={`${process.env.APP_WEBSITE}/products/${slug}/buy`}
        target="_blank"
        className={cn(
          buttonVariants({ variant: "ghost" }),
          "justify-start w-full pl-3 gap-3 text-slate-600"
        )}
      >
        <ExternalLink className="h-4 w-4" />
        <span>Visit</span>
      </a>
      <ConfirmDelete
        className={cn(
          buttonVariants({ variant: "ghost" }),
          "justify-start w-full pl-3 gap-3 text-slate-600 hover:bg-red-50 hover:text-red-700"
        )}
        confirmText={name}
        deleteFn={() => handleDeleteProduct(id)}
      >
        <Trash2 className="h-4 w-4" />
        <span>Delete</span>
      </ConfirmDelete>
    </>
  );
};

const ProductMoreDropdown: FC<{ id: string; name: string; slug: string }> = ({
  id,
  name,
  slug,
}) => {
  const { isMobile } = useMediaQuery();
  const [open, setOpen] = useState(false);

  return isMobile ? (
    <Drawer open={open} onOpenChange={(open) => setOpen(open)}>
      <DrawerTrigger className="outline-none text-slate-500 hover:text-slate-800">
        <MoreHorizontal className="size-6" />
      </DrawerTrigger>
      <DrawerContent className="flex w-full flex-col">
        <DropdownContent id={id} name={name} slug={slug} />
      </DrawerContent>
    </Drawer>
  ) : (
    <DropdownMenu open={open} onOpenChange={(open) => setOpen(open)}>
      <DropdownMenuTrigger className="outline-none text-slate-500 hover:text-slate-800">
        <MoreHorizontal className="size-6" />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="min-w-[10rem] w-full flex flex-col"
        align="end"
      >
        <DropdownContent id={id} name={name} slug={slug} />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ProductMoreDropdown;
