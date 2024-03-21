import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { MoveLeft } from "lucide-react";
import Link from "next/link";
import { FC } from "react";
import UpdateMainBannerForm from "./update-banner-form";
import PrivilageProvider from "@/components/providers/privilage.provider";
import TabComponent from "@/components/misc/component";

const CreateMainBannerPage: FC<{
  params: { type: "main" | "sub" };
}> = ({ params }) => {
  return (
    <PrivilageProvider path="/banners/:type/:id">
      <TabComponent>
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
      </TabComponent>
    </PrivilageProvider>
  );
};

export default CreateMainBannerPage;
