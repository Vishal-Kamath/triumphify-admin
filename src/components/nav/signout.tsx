"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import axios from "axios";
import { FC, useState } from "react";
import { useToast } from "../ui/use-toast";
import { useRouter } from "next/navigation";
import { invalidateUserData } from "@/lib/auth";
import { LogOut } from "lucide-react";
import { invalidateAllPrivilages } from "@/lib/privilage";

const SignOutButton: FC = () => {
  const { toast } = useToast();
  const router = useRouter();

  const [open, setOpen] = useState(false);

  const onSignOut = () => {
    axios
      .get(`${process.env.ENDPOINT}/api/auth/signout`, {
        withCredentials: true,
      })
      .then((res) => {
        toast({
          title: res.data.title,
          description: res.data.description,
          variant: res.data.type,
        });
        invalidateUserData();
        invalidateAllPrivilages();
        router.replace("/auth/login");
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
    <AlertDialog>
      <AlertDialogTrigger className="group group flex w-full items-center justify-start gap-3 rounded-lg p-2 text-gray-800 hover:bg-red-50 hover:text-red-800">
        <LogOut className="h-5 w-5 text-slate-500 group-hover:text-red-800" />
        <span>Log Out</span>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Do you want to Sign out?</AlertDialogTitle>
          <AlertDialogDescription>
            This is action will sign you out and log your shift
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={onSignOut}
            className="hover:bg-destructive"
          >
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default SignOutButton;
