"use client";

import { Dispatch, FC, SetStateAction, useState } from "react";
import LineChart from "./line-chart";
import BarChart from "./bar-chart";
import { SelectMonth, months } from "@/components/misc/select-month";
import { ChevronsUpDown, RefreshCw } from "lucide-react";
import { dateFormater } from "@/utils/dateFormater";
import { convertUTCDateToLocalDate } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import SalesAdoption from "./adoption";
import { useSales } from "@/lib/sales";
import { Button } from "@/components/ui/button";

const SalesCharts: FC = () => {
  const date = new Date();
  const [month, setMonth] = useState(date.getMonth());
  const [year, setYear] = useState(date.getFullYear());

  const [tempMonth, setTempMonth] = useState(date.getMonth());
  const [tempYear, setTempYear] = useState(date.getFullYear());

  const start_date = convertUTCDateToLocalDate(new Date(year, month, 1));
  const end_date = convertUTCDateToLocalDate(
    new Date(year, Number(month) + 1, 0)
  );

  const [open, setOpen] = useState(false);

  const [chartType, setChartType] = useState<
    "history" | "cancelled" | "returned"
  >("history");

  const {
    data: salesData,
    isLoading,
    refetch,
  } = useSales(chartType, month, year);

  if (isLoading || isLoading) return <div>Loading...</div>;

  return (
    <div className="flex flex-col gap-9 w-full h-full">
      <div className="flex max-lg:flex-col items-center gap-6">
        <div className="flex flex-col w-full gap-1">
          <h2 className="text-2xl font-semibold">Total Sales</h2>
          <p className="text-sm text-gray-600 font-normal italic">
            {"From "}
            {dateFormater(start_date)}
            {" - "}
            {dateFormater(end_date)}
          </p>
        </div>
        <div className="w-full flex gap-2 justify-end">
          <SelectType chartType={chartType} setChatType={setChartType} />
          <SelectMonth
            align="end"
            month={tempMonth}
            year={tempYear}
            onMonthChange={setTempMonth}
            onYearChange={setTempYear}
            open={open}
            setOpen={(open) => {
              setOpen(open);
            }}
            apply={() => {
              setMonth(tempMonth);
              setYear(tempYear);
              setOpen(false);
            }}
            className="flex w-full md:max-w-[10rem] items-center justify-center gap-2 rounded-md border-1 border-slate-300 px-3 h-10 text-sm text-slate-500 hover:text-slate-600"
          >
            <span>
              {months[month]} {year}
            </span>
            <ChevronsUpDown className="h-4 w-4" />
          </SelectMonth>
          <Button
            variant="secondary"
            className="group active:bg-purple-100"
            onClick={() => refetch()}
          >
            <RefreshCw className="h-3 w-3 group-active:animate-spin " />
          </Button>
        </div>
      </div>
      {salesData?.sales ? (
        <LineChart sales={salesData.sales || []} />
      ) : (
        <div className="w-full h-full relative">
          <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center text-xl bg-gray-400/10 text-slate-500">
            No Data
          </div>
          <LineChart sales={[]} />
        </div>
      )}
      <div className="flex flex-col gap-6">
        <h4 className="text-xl text-start w-full font-semibold max-w-6xl mx-auto">
          Sales Adoption
        </h4>
        <div className="flex w-full max-lg:flex-col items-center gap-9 max-w-6xl mx-auto">
          {salesData &&
          salesData.sales_total &&
          salesData.previous_sales_total ? (
            <>
              <BarChart
                sales_total={salesData.sales_total}
                previous_sales_total={salesData.previous_sales_total}
              />
              <SalesAdoption
                sales_total={salesData.sales_total}
                previous_sales_total={salesData.previous_sales_total}
              />
            </>
          ) : (
            "No Data"
          )}
        </div>
      </div>
    </div>
  );
};

export default SalesCharts;

const SelectType: FC<{
  chartType: "history" | "cancelled" | "returned";
  setChatType: Dispatch<SetStateAction<"history" | "cancelled" | "returned">>;
}> = ({ chartType, setChatType }) => {
  return (
    <Select
      onValueChange={(value) =>
        value && setChatType(value as "history" | "cancelled" | "returned")
      }
      value={chartType}
    >
      <SelectTrigger className="w-full md:max-w-[10rem]">
        <SelectValue placeholder="Type" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="history">History</SelectItem>
        <SelectItem value="cancelled">Cancelled</SelectItem>
        <SelectItem value="returned">Returned</SelectItem>
      </SelectContent>
    </Select>
  );
};
