import React, { useEffect, useRef } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { CategorySalesType } from "@/lib/sales";
import { dateFormater } from "@/utils/dateFormater";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function CategoryLineChart({
  sales,
}: {
  sales: CategorySalesType[];
}) {
  const chartRef = useRef<ChartJS<"line">>(null);

  const options: ChartOptions<"line"> = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback(tickValue, index, ticks) {
            return `$${Math.round(Number(tickValue))}`;
          },
        },
      },
    },
    interaction: {
      intersect: false,
      mode: "index" as const,
    },
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
      tooltip: {
        callbacks: {
          title: function (tooltipItems) {
            return dateFormater(
              new Date(sales[tooltipItems[0].dataIndex].created_date)
            );
          },
        },
      },
    },
  };

  const labels = sales.map((sale) => new Date(sale.created_date).getDate());

  const data = {
    labels,
    datasets: [
      {
        label: "Total Discounted Price",
        data: sales.map((sale) => sale.total_discounted_price),
        borderColor: "rgb(54, 162, 235)",
        backgroundColor: "rgb(54, 162, 235)",
        borderWidth: 2,
      },
      {
        label: "Total Sales",
        data: sales.map(
          (sale) => sale.total_sales + sale.total_discounted_price
        ),
        borderColor: "rgb(75, 192, 192)",
        backgroundColor: "rgb(75, 192, 192)",
        borderWidth: 2,
      },
      {
        label: "Total Revenue",
        data: sales.map((sale) => sale.total_sales),
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgb(255, 99, 132)",
        borderWidth: 2,
      },
    ],
  };

  return (
    <div className="w-full max-w-full overflow-auto">
      <Line
        width={1800}
        height={600}
        ref={chartRef}
        className="w-full max-w-6xl mx-auto text-xs h-full max-lg:min-w-[60rem] max-lg:min-h-[20rem]"
        options={options}
        data={data}
      />
    </div>
  );
}
