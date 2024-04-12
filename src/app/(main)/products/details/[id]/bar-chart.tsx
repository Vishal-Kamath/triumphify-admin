import { ProductSalesType, ProductTotalSalesType } from "@/lib/sales";
import { FC } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
  ChartDataset,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const ProductBarChart: FC<{
  sales_total: ProductTotalSalesType;
  previous_sales_total: ProductTotalSalesType;
}> = ({ sales_total, previous_sales_total }) => {
  const labels = ["Total Sales", "Total Discounted Price", "Total Revenue"];

  const datasets: ChartDataset<"bar">[] = [
    {
      label: "Preivous Month",
      data: [
        previous_sales_total.total_sales,
        previous_sales_total.total_discounted_price,
        previous_sales_total.total_revenue,
      ],
      borderRadius: 10,
      borderWidth: 2,
      borderColor: "#94a3b8",
      backgroundColor: "#94a3b888",
    },
    {
      label: "Current Month",
      data: [
        sales_total.total_sales,
        sales_total.total_discounted_price,
        sales_total.total_revenue,
      ],
      borderRadius: 10,
      borderWidth: 2,
      borderColor: [
        "rgb(75, 192, 192)",
        "rgb(54, 162, 235)",
        "rgb(255, 99, 132)",
      ],
      backgroundColor: [
        "rgb(75, 192, 192, 0.5)",
        "rgb(54, 162, 235, 0.5)",
        "rgb(255, 99, 132, 0.5)",
      ],
    },
  ];

  const options: ChartOptions<"bar"> = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          count: 5,
        },
      },
    },
    interaction: {
      mode: "index" as const,
      intersect: false,
    },

    plugins: {
      legend: {
        display: false,
      },
    },
  };
  return (
    <div className="w-full max-w-xl">
      <Bar options={options} data={{ labels, datasets }} className="w-full" />
    </div>
  );
};

export default ProductBarChart;
