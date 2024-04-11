"use client";

import { Dispatch, FC, SetStateAction, useEffect, useState } from "react";

import { CategorySalesReturnType, useCategorySales } from "@/lib/sales";
import CategoryLineChart from "./line-chart";
import CategoryBarChart from "./bar-chart";
import { SelectMonth, months } from "@/components/misc/select-month";
import { ChevronsUpDown } from "lucide-react";
import { dateFormater } from "@/utils/dateFormater";
import { convertUTCDateToLocalDate } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCategories } from "@/lib/categories";
import { Category } from "@/@types/category";
import CategorySalesAdoption from "./adoption";

const CategoryCharts: FC = () => {
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

  // Category
  const { data: categories, isLoading: isCategoryLoading } = useCategories();
  const [category, setCategory] = useState<Category>();

  useEffect(() => {
    if (!isCategoryLoading && categories && !category)
      setCategory(categories[0]);
  }, [categories, isCategoryLoading]);

  const [chartType, setChartType] = useState<
    "history" | "cancelled" | "returned"
  >("history");

  const { data: salesData, isLoading } = useCategorySales(
    chartType,
    category?.id || "",
    month,
    year
  );

  if (isLoading || isLoading || isCategoryLoading) return <div>Loading...</div>;
  if (!salesData) return <div>No Data</div>;
  const { sales, sales_total, previous_sales_total } =
    salesData as CategorySalesReturnType;

  return (
    <div className="flex flex-col gap-9 w-full h-full">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-1">
          <h2 className="text-2xl font-semibold">
            Category Sales - {category?.name || "No Category Selected"}
          </h2>
          <p className="text-sm text-gray-600 font-normal italic">
            {"From "}
            {dateFormater(start_date)}
            {" - "}
            {dateFormater(end_date)}
          </p>
        </div>
        <div className="flex w-full max-md:flex-col gap-6 justify-between items-start">
          <div className="w-full">
            <SelectCategory
              category={category?.id || ""}
              categories={categories || []}
              setCategory={setCategory}
            />
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
                setMonth(tempMonth);
                setYear(tempYear);
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
          </div>
        </div>
      </div>
      <CategoryLineChart sales={sales || []} />
      <div className="flex flex-col gap-6">
        <h4 className="text-xl text-start w-full font-semibold max-w-6xl mx-auto">
          Category Sales Adoption
        </h4>
        <div className="flex w-full max-lg:flex-col items-center gap-9 max-w-6xl mx-auto">
          <CategoryBarChart
            sales_total={sales_total}
            previous_sales_total={previous_sales_total}
          />
          <CategorySalesAdoption
            sales_total={sales_total}
            previous_sales_total={previous_sales_total}
          />
        </div>
      </div>
    </div>
  );
};

export default CategoryCharts;

const SelectCategory: FC<{
  categories: Category[];
  category: string;
  setCategory: Dispatch<SetStateAction<Category | undefined>>;
}> = ({ categories, category, setCategory }) => {
  return (
    <Select
      onValueChange={(value) => {
        const category = categories.find((c) => c.id === value);
        if (!category) return;
        setCategory(category);
      }}
      value={category}
    >
      <SelectTrigger className="w-full md:max-w-[20rem] min-w-[10rem]">
        <SelectValue placeholder="Category" />
      </SelectTrigger>
      <SelectContent>
        {categories?.map((category) => (
          <SelectItem key={category.id} value={category.id}>
            {category.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

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
