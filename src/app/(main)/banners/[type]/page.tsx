import { FC } from "react";
import BannerTable from "./banner-table";
import PrivilageProvider from "@/components/providers/privilage.provider";
import { Separator } from "@/components/ui/separator";

const MainBannerPage: FC<{
  params: { type: "main" | "sub" };
}> = ({ params }) => {
  return (
    <PrivilageProvider path="/banners/:type">
      <main className="flex h-full min-h-full w-full flex-col gap-6 bg-white p-6">
        <h2 className="text-lg font-semibold leading-none">
          {params.type[0].toUpperCase() + params.type.slice(1)} Banner Details
        </h2>
        <Separator />
        <div className="h-full">
          <BannerTable type={params.type} />
        </div>
      </main>
    </PrivilageProvider>
  );
};

export default MainBannerPage;
