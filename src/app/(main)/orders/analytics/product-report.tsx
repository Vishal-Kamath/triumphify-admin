// "use client";

// import { Button } from "@/components/ui/button";
// import { Calendar } from "@/components/ui/calendar";
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from "@/components/ui/popover";
// import { cn } from "@/lib/utils";
// import { dateFormater } from "@/utils/dateFormater";
// import { format } from "date-fns";
// import { CalendarIcon } from "lucide-react";
// import { Dispatch, FC, SetStateAction, useState } from "react";
// import { RxCaretSort } from "react-icons/rx";
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   Title,
//   Tooltip,
//   Legend,
// } from "chart.js";
// import { Bar } from "react-chartjs-2";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { useProductSales } from "@/lib/sales";
// import Link from "next/link";
// import Image from "next/image";

// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   Title,
//   Tooltip,
//   Legend
// );

// const OrderAnalyticsDateRange: FC<{
//   startDate: Date;
//   setStartDate: Dispatch<SetStateAction<Date>>;
//   endDate: Date;
//   setEndDate: Dispatch<SetStateAction<Date>>;
// }> = ({ startDate, setStartDate, endDate, setEndDate }) => {
//   return (
//     <Popover>
//       <PopoverTrigger className="w-full md:min-w-[300px]" asChild>
//         <Button
//           id="date"
//           variant={"outline"}
//           className={cn(
//             "w-full md:min-w-[300px] justify-start text-left font-normal",
//             !startDate || (!endDate && "text-muted-foreground")
//           )}
//         >
//           <CalendarIcon className="mr-2 h-4 w-4" />
//           {startDate ? (
//             endDate ? (
//               <>
//                 {format(startDate, "LLL dd, y")} -{" "}
//                 {format(endDate, "LLL dd, y")}
//               </>
//             ) : (
//               format(startDate, "LLL dd, y")
//             )
//           ) : (
//             <span>Pick a date</span>
//           )}
//           <RxCaretSort className="ml-auto h-4 w-4 text-slate-600" />
//         </Button>
//       </PopoverTrigger>
//       <PopoverContent className="w-auto p-0" align="start">
//         <Calendar
//           initialFocus
//           mode="range"
//           defaultMonth={startDate}
//           selected={{
//             from: startDate,
//             to: endDate,
//           }}
//           onSelect={(date) => {
//             date?.from && setStartDate(date.from);
//             date?.to && setEndDate(date.to);
//           }}
//           numberOfMonths={2}
//         />
//       </PopoverContent>
//     </Popover>
//   );
// };

// const OrderVariationSale: FC<{
//   type: "history" | "cancelled" | "returned";
//   startDate: Date;
//   endDate: Date;
// }> = ({ type, startDate, endDate }) => {
//   const { data: sales, isLoading } = useProductSales(type, startDate, endDate);

//   if (isLoading) return <div>Loading...</div>;
//   if (!sales || !startDate || !endDate) return null;

//   return (
//     <div className="flex w-full flex-col mb-6">
//       <div className="rounded-t-md w-full border-1 border-b-0 bg-slate-50 p-3 font-medium">
//         Sales from {dateFormater(startDate)} to {dateFormater(endDate)}
//       </div>
//       <table className="border-collapse w-full max-w-full select-none overflow-x-auto border-1 text-sm scrollbar-thin max-lg:block [&>*>*>*]:border-1 [&>*>*]:border-1 [&>*]:border-1">
//         <thead className="bg-slate-50 font-medium">
//           <tr className="text-xs">
//             <th className="p-3 text-left">Category</th>
//             <th className="p-3">Units sold</th>
//             <th className="p-3">Discounted</th>
//             <th className="p-3">Total Revenue</th>
//           </tr>
//         </thead>
//         <tbody>
//           {sales.map((sale, index) => {
//             return (
//               <tr key={index + sale.product_id}>
//                 <td className="min-w-28 w-full break-words p-3">
//                   <div className="flex gap-2 items-center">
//                     <Image
//                       src={sale.product_images[0]}
//                       alt={sale.product_name}
//                       width={100}
//                       height={100}
//                       className="size-16 object-contain"
//                     />
//                     <div className="flex flex-col">
//                       <h3>{sale.product_name}</h3>
//                       <Link
//                         href={`/products/details/${sale.product_id}?redirect=${encodeURIComponent("/orders/analytics")}`}
//                         className="text-xs underline hover:text-slate-800 text-slate-500"
//                       >
//                         View Product
//                       </Link>
//                     </div>
//                   </div>
//                 </td>

//                 <td className="w-full min-w-[7.5rem] text-center p-3 text-xs">
//                   {sale ? sale.total_units_sold : 0}
//                 </td>
//                 <td className="w-full min-w-[7.5rem] text-center p-3 text-xs">
//                   {sale ? sale.total_discounted_price : 0}
//                 </td>
//                 <td className="w-full min-w-[7.5rem] text-center p-3 text-xs">
//                   {sale ? sale.total_sales : 0}
//                 </td>
//               </tr>
//             );
//           })}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// const OrderVariationSaleBar: FC<{
//   type: "history" | "cancelled" | "returned";
//   reportFor: "Total Units Sold" | "Total Discounted Price" | "Total Sales";
//   startDate: Date;
//   endDate: Date;
// }> = ({ type, reportFor, startDate, endDate }) => {
//   const { data: sales, isLoading } = useProductSales(type, startDate, endDate);

//   if (isLoading || isLoading) return <div>Loading...</div>;
//   if (!sales || !startDate || !endDate) return null;

//   const options = {
//     responsive: true,
//   };

//   const labels = sales.map((sale) => sale.product_name);
//   const datasets = [
//     {
//       label: "Total Units Sold",
//       data: sales.map((sale) => sale.total_units_sold),
//       backgroundColor: "rgb(255, 99, 132)",
//     },
//     {
//       label: "Total Discounted Price",
//       data: sales.map((sale) => sale.total_discounted_price),
//       backgroundColor: "rgb(54, 162, 235)",
//     },
//     {
//       label: "Total Sales",
//       data: sales.map((sale) => sale.total_sales),
//       backgroundColor: "rgb(75, 192, 192)",
//     },
//   ].filter((data) => data.label === reportFor);
//   const data = {
//     labels,
//     datasets,
//   };

//   return <Bar options={options} data={data} />;
// };

// const ProductSalesReport: FC<{
//   type: "history" | "cancelled" | "returned";
// }> = ({ type }) => {
//   const [startDate, setStartDate] = useState(
//     new Date(new Date().setMonth(new Date().getMonth() - 1))
//   );
//   const [endDate, setEndDate] = useState(new Date());

//   const [reportFor, setReportFor] = useState<
//     "Total Units Sold" | "Total Discounted Price" | "Total Sales"
//   >("Total Sales");

//   return (
//     <div className="flex max-lg:flex-col w-full gap-6">
//       <div className="flex w-full h-full flex-col gap-6">
//         <OrderVariationSale
//           type={type}
//           startDate={startDate}
//           endDate={endDate}
//         />
//       </div>
//       <div className="flex w-full justify-end h-full flex-col gap-6">
//         <div className="flex gap-3 max-md:flex-col">
//           <Select
//             value={reportFor}
//             onValueChange={(val) =>
//               val &&
//               setReportFor(
//                 val as
//                   | "Total Units Sold"
//                   | "Total Discounted Price"
//                   | "Total Sales"
//               )
//             }
//           >
//             <SelectTrigger>
//               <SelectValue placeholder="Select type" />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="Total Units Sold">Total Units Sold</SelectItem>
//               <SelectItem value="Total Discounted Price">
//                 Total Discounted Price
//               </SelectItem>
//               <SelectItem value="Total Sales">Total Sales</SelectItem>
//             </SelectContent>
//           </Select>
//           <OrderAnalyticsDateRange
//             startDate={startDate}
//             setStartDate={setStartDate}
//             endDate={endDate}
//             setEndDate={setEndDate}
//           />
//         </div>
//         <OrderVariationSaleBar
//           type={type}
//           reportFor={reportFor}
//           startDate={startDate}
//           endDate={endDate}
//         />
//       </div>
//     </div>
//   );
// };

// export default ProductSalesReport;
