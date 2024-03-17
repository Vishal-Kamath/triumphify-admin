import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { MoveLeft } from "lucide-react";
import Link from "next/link";
import { FC } from "react";
import UpdateMainBannerForm from "./update-banner-form";

const CreateMainBannerPage: FC<{
  params: { type: "main" | "sub" };
}> = ({ params }) => {
  return (
    <div className="h-full min-h-screen w-full p-6 pb-12">
      <main className="flex h-full w-full flex-col gap-6 rounded-lg border-1 border-slate-200 bg-white p-6 shadow-md">
        <div className="flex items-center gap-3">
          <Link
            href={`/banners/${params.type}`}
            className={buttonVariants({ variant: "ghost" })}
          >
            <MoveLeft />
          </Link>
          <div className="flex flex-col">
            <h3 className="text-xl font-medium">Update Banner</h3>
            <p className="text-sm text-gray-500">
              Input banner details to create a new banner
            </p>
          </div>
        </div>
        <Separator />
        <UpdateMainBannerForm />
      </main>
    </div>
  );
};

export default CreateMainBannerPage;
