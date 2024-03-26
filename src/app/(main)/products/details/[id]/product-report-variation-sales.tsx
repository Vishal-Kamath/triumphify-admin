import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useVariationSale } from "@/lib/orders";
import { useProduct } from "@/lib/products";
import { cn } from "@/lib/utils";
import { dateFormater } from "@/utils/dateFormater";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useParams } from "next/navigation";
import { Dispatch, FC, SetStateAction, useState } from "react";
import { RxCaretSort } from "react-icons/rx";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const OrderAnalyticsDateRange: FC<{
  startDate: Date;
  setStartDate: Dispatch<SetStateAction<Date>>;
  endDate: Date;
  setEndDate: Dispatch<SetStateAction<Date>>;
}> = ({ startDate, setStartDate, endDate, setEndDate }) => {
  return (
    <div className="flex w-full justify-end">
      <div className={cn("grid gap-2")}>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              id="date"
              variant={"outline"}
              className={cn(
                "w-[300px] justify-start text-left font-normal",
                !startDate || (!endDate && "text-muted-foreground")
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {startDate ? (
                endDate ? (
                  <>
                    {format(startDate, "LLL dd, y")} -{" "}
                    {format(endDate, "LLL dd, y")}
                  </>
                ) : (
                  format(startDate, "LLL dd, y")
                )
              ) : (
                <span>Pick a date</span>
              )}
              <RxCaretSort className="ml-auto h-4 w-4 text-slate-600" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={startDate}
              selected={{
                from: startDate,
                to: endDate,
              }}
              onSelect={(date) => {
                date?.from && setStartDate(date.from);
                date?.to && setEndDate(date.to);
              }}
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

const OrderVariationSale: FC<{
  id: string;
  type: "history" | "cancelled" | "returned";
  startDate: Date;
  endDate: Date;
}> = ({ id, type, startDate, endDate }) => {
  const { data: variations, isLoading: isVariationLoading } = useVariationSale(
    id,
    type,
    startDate,
    endDate
  );
  const { data: product, isLoading } = useProduct(id);

  if (isLoading || isVariationLoading) return <div>Loading...</div>;
  if (!product || !id || !startDate || !endDate) return null;

  return (
    <div className="flex w-full flex-col mb-6">
      <div className="rounded-t-md w-full border-1 border-b-0 bg-slate-50 p-3 font-medium">
        Sales from {dateFormater(startDate)} to {dateFormater(endDate)}
      </div>
      <table className="border-collapse w-full max-w-full select-none overflow-x-auto border-1 text-sm scrollbar-thin max-lg:block [&>*>*>*]:border-1 [&>*>*]:border-1 [&>*]:border-1">
        <thead className="bg-slate-50 font-medium">
          <tr className="text-xs">
            <th className="p-3 text-left">Variation</th>
            <th className="p-3">Units sold</th>
            <th className="p-3">Discounted</th>
            <th className="p-3">Total Revenue</th>
          </tr>
        </thead>
        <tbody>
          {product.variations.map((variation, index) => {
            const attrKeys = Object.keys(variation.combinations).sort();
            const attrValues = attrKeys.map(
              (key) => variation.combinations[key]
            );
            const findInVariation = variations?.find(
              (variant) =>
                Object.keys(variant.variation_key)
                  .sort()
                  .map((key) => variant.variation_key[key])
                  .join(" - ") === attrValues.join(" - ")
            );

            return (
              <tr key={index + variation.id}>
                <td className="min-w-28 w-full break-words p-3">
                  {attrValues.join(" - ")}
                </td>

                <td className="w-full min-w-[7.5rem] text-center p-3 text-xs">
                  {findInVariation ? findInVariation.total_units_sold : 0}
                </td>
                <td className="w-full min-w-[7.5rem] text-center p-3 text-xs">
                  {findInVariation ? findInVariation.total_discounted_price : 0}
                </td>
                <td className="w-full min-w-[7.5rem] text-center p-3 text-xs">
                  {findInVariation ? findInVariation.total_sales : 0}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

const OrderVariationSaleBar: FC<{
  id: string;
  type: "history" | "cancelled" | "returned";
  reportFor: "Total Units Sold" | "Total Discounted Price" | "Total Sales";
  startDate: Date;
  endDate: Date;
}> = ({ id, type, reportFor, startDate, endDate }) => {
  const { data: variations, isLoading: isVariationLoading } = useVariationSale(
    id,
    type,
    startDate,
    endDate
  );
  const { data: product, isLoading } = useProduct(id);

  if (isLoading || isVariationLoading) return <div>Loading...</div>;
  if (!product || !id || !startDate || !endDate) return null;

  const product_varations = product.variations.map((variation, index) => {
    const attrKeys = Object.keys(variation.combinations).sort();
    const attrValues = attrKeys.map((key) => variation.combinations[key]);

    const findInVariation = variations?.find(
      (variant) =>
        Object.keys(variant.variation_key)
          .sort()
          .map((key) => variant.variation_key[key])
          .join(" - ") === attrValues.join(" - ")
    );

    return {
      name: attrValues.join(" - "),
      total_units_sold: findInVariation ? findInVariation.total_units_sold : 0,
      total_discounted_price: findInVariation
        ? findInVariation.total_discounted_price
        : 0,
      total_sales: findInVariation ? findInVariation.total_sales : 0,
    };
  });

  const options = {
    responsive: true,
  };

  const labels = product_varations.map((variation) => variation.name);
  const datasets = [
    {
      label: "Total Units Sold",
      data: product_varations.map((variation) => variation.total_units_sold),
      backgroundColor: "rgb(255, 99, 132)",
    },
    {
      label: "Total Discounted Price",
      data: product_varations.map(
        (variation) => variation.total_discounted_price
      ),
      backgroundColor: "rgb(54, 162, 235)",
    },
    {
      label: "Total Sales",
      data: product_varations.map((variation) => variation.total_sales),
      backgroundColor: "rgb(75, 192, 192)",
    },
  ].filter((data) => data.label === reportFor);
  const data = {
    labels,
    datasets,
  };

  return <Bar options={options} data={data} />;
};

const ProductVariationSales: FC<{
  type: "history" | "cancelled" | "returned";
}> = ({ type }) => {
  const id = useParams()["id"] as string;
  const { data: product } = useProduct(id);

  const [startDate, setStartDate] = useState(
    new Date(new Date().setMonth(new Date().getMonth() - 1))
  );
  const [endDate, setEndDate] = useState(new Date());

  const [reportFor, setReportFor] = useState<
    "Total Units Sold" | "Total Discounted Price" | "Total Sales"
  >("Total Sales");

  return (
    <div className="flex w-full gap-6">
      <div className="flex w-full h-full flex-col gap-6">
        <OrderVariationSale
          type={type}
          id={id}
          startDate={startDate}
          endDate={endDate}
        />
      </div>
      <div className="flex w-full justify-end h-full flex-col gap-6">
        <div className="flex gap-3">
          <Select
            value={reportFor}
            onValueChange={(val) =>
              val &&
              setReportFor(
                val as
                  | "Total Units Sold"
                  | "Total Discounted Price"
                  | "Total Sales"
              )
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Total Units Sold">Total Units Sold</SelectItem>
              <SelectItem value="Total Discounted Price">
                Total Discounted Price
              </SelectItem>
              <SelectItem value="Total Sales">Total Sales</SelectItem>
            </SelectContent>
          </Select>
          <OrderAnalyticsDateRange
            startDate={startDate}
            setStartDate={setStartDate}
            endDate={endDate}
            setEndDate={setEndDate}
          />
        </div>
        <OrderVariationSaleBar
          id={id}
          type={type}
          reportFor={reportFor}
          startDate={startDate}
          endDate={endDate}
        />
      </div>
    </div>
  );
};

export default ProductVariationSales;
