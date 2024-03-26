import { Separator } from "@/components/ui/separator";
import { FC } from "react";

const AnalyticsPage: FC = () => {
  return (
    <main className="flex h-full min-h-full w-full flex-col gap-6 bg-white p-6">
      <h2 className="text-lg font-semibold leading-none">Order Analytics</h2>
      <Separator />
    </main>
  );
};

export default AnalyticsPage;
