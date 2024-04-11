"use client";

import { useNewUser } from "@/lib/user";
import { FC, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
  ChartData,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { dateFormater } from "@/utils/dateFormater";
import { SelectMonth, months } from "@/components/misc/select-month";
import { ChevronsUpDown } from "lucide-react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const NewUsers: FC = () => {
  const date = new Date();
  const [month, setMonth] = useState(date.getMonth());
  const [year, setYear] = useState(date.getFullYear());

  const [tempMonth, setTempMonth] = useState(date.getMonth());
  const [tempYear, setTempYear] = useState(date.getFullYear());

  const [open, setOpen] = useState(false);

  const { data: newUsers, isLoading, refetch } = useNewUser(month, year);
  if (!newUsers) return null;

  const options: ChartOptions<"bar"> = {
    responsive: true,
    scales: {
      x: {
        title: {
          display: true,
          text: "Date",
        },
      },
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
        title: {
          display: true,
          text: "New Users",
        },
      },
    },
  };

  const labels = newUsers?.map((data) => new Date(data.date).getDate());

  const data: ChartData<"bar"> = {
    labels,
    datasets: [
      {
        label: "Monthly new commers",
        data: newUsers?.map((data) => data.count),
        backgroundColor: "rgba(53, 162, 235, 0.5)",
        minBarLength: 4,
      },
    ],
  };

  return (
    <div className="flex w-full flex-col gap-6 lg:gap-9">
      <div className="flex justify-between gap-3">
        <h3 className="text-lg font-medium text-slate-500">New commers</h3>
        <SelectMonth
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
          className="flex items-center justify-center gap-2 rounded-full border-1 border-slate-300 px-3 py-1 text-sm text-slate-500 hover:text-slate-600"
        >
          <span>
            {months[month]} {year}
          </span>
          <ChevronsUpDown className="h-4 w-4" />
        </SelectMonth>
      </div>
      <div className="w-full max-w-[30rem] mx-auto">
        <Bar redraw={true} updateMode="resize" options={options} data={data} />
      </div>
    </div>
  );
};

export default NewUsers;
