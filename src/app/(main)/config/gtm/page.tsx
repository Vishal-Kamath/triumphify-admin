import TabComponent from "@/components/misc/component";
import PrivilageProvider from "@/components/providers/privilage.provider";
import { Separator } from "@/components/ui/separator";
import { FC } from "react";

const GTMPage: FC = () => {
  return (
    <PrivilageProvider path="/config/gtm">
      <TabComponent className="h-full">
        <div className="flex flex-col">
          <h3 className="text-xl font-medium">Google Tag Manager</h3>
          <p className="text-sm text-gray-500">
            Input your tag manager key to enable tracking.
          </p>
        </div>
        <Separator />
      </TabComponent>
    </PrivilageProvider>
  );
};

export default GTMPage;
