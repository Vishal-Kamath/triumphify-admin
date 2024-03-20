import { FC } from "react";
import BannerTable from "./banner-table";
import PrivilageProvider from "@/components/providers/privilage.provider";

const MainBannerPage: FC<{
  params: { type: "main" | "sub" };
}> = ({ params }) => {
  return (
    <PrivilageProvider path="/banners/:type">
      <main className="flex h-full flex-col bg-white">
        <div className="flex h-12 w-full items-center justify-between border-b-1 border-slate-300 px-6">
          <h2 className="text-lg font-semibold">
            {params.type[0].toUpperCase() + params.type.slice(1)} Banner Details
          </h2>
        </div>
        <div className="p-6">
          <BannerTable type={params.type} />
        </div>
      </main>
    </PrivilageProvider>
  );
};

export default MainBannerPage;
