import PrivilageProvider from "@/components/providers/privilage.provider";
import { FC } from "react";
import CategoryCharts from "./category/category-charts";
import TabComponent from "@/components/misc/component";

const AnalyticsPage: FC = () => {
  return (
    <PrivilageProvider path="/analytics">
      <TabComponent>
        <CategoryCharts />
      </TabComponent>
    </PrivilageProvider>
  );
};

export default AnalyticsPage;
