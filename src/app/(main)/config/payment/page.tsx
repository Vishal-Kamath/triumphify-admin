import TabComponent from "@/components/misc/component";
import PrivilageProvider from "@/components/providers/privilage.provider";
import { Separator } from "@/components/ui/separator";
import { FC } from "react";

const PaymentConfigPage: FC = () => {
  return (
    <PrivilageProvider path="/config/payment">
      <TabComponent className="max-w-3xl">
        <div className="flex flex-col">
          <h3 className="text-xl font-medium">Payment Method Configuration</h3>
          <p className="text-sm text-gray-500">
            Configure payment methods api keys and active status.
          </p>
        </div>
        <Separator />
      </TabComponent>
    </PrivilageProvider>
  );
};

export default PaymentConfigPage;
