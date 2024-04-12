import PrivilageProvider from "@/components/providers/privilage.provider";
import { FC } from "react";
import CategoryCharts from "./category/category-charts";
import TabComponent from "@/components/misc/component";
import SalesCharts from "./sales/charts";

const AnalyticsPage: FC = () => {
  return (
    <PrivilageProvider path="/analytics">
      <TabComponent className="gap-16">
        <SalesCharts />
        <CategoryCharts />
      </TabComponent>
    </PrivilageProvider>
  );
};

export default AnalyticsPage;
