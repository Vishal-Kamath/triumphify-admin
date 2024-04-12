import { TimeLogContext } from "@/components/providers/time.log.provider";
import { Clock4 } from "lucide-react";
import { FC, useContext, useRef } from "react";
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
import { useEmployeeSession } from "@/lib/session";
import { Employee } from "@/@types/employee";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function padZero(num: number) {
  return num.toString().padStart(2, "0");
}

function formatedTime(time: number) {
  const hours = padZero(Math.floor(time / (60 * 60)));
  const minutes = padZero(Math.floor((time % (60 * 60)) / 60));
  const seconds = padZero(time % 60);

  return `${hours}h ${minutes}m ${seconds}s`;
}

const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const EmployeeTime: FC<{ employee: Employee; rate: number }> = ({
  employee,
  rate,
}) => {
  const { data: session, refetch } = useEmployeeSession(employee.id);

  const datasets: ChartDataset<"bar">[] = [
    {
      label: "Time Spent",
      data: session?.map((s) => s.time) ?? Array(7).fill(0),
      backgroundColor: "#bbf7d0",
    },
  ];
  const labels = session?.map((s) => days[new Date(s.date).getDay()]) ?? days;
  const options: ChartOptions<"bar"> = {
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          display: false,
        },
        ticks: {
          callback(tickValue, index, ticks) {
            const time = Number(tickValue);
            const hours = Math.floor(time / (60 * 60));
            const minutes = Math.floor((time % (60 * 60)) / 60);
            const seconds = padZero(time % 60);

            if (time < 1800) return `${minutes}m ${seconds}s`;
            if (hours === 0) return `${minutes}m`;
            return `${hours}h ${minutes}m`;
          },
          stepSize: 1800,
        },
      },
    },
    interaction: {
      intersect: false,
      mode: "index",
    },
    plugins: {
      tooltip: {
        callbacks: {
          label(tooltipItem) {
            const datasetLabel = datasets[tooltipItem.datasetIndex].label || "";
            const value = datasets[tooltipItem.datasetIndex].data[
              tooltipItem.dataIndex
            ] as number;
            return `${datasetLabel}: ${formatedTime(value)}`;
          },
        },
      },
      legend: {
        display: false,
      },
    },
  };

  const avgArray = session?.filter((s) => !s.padding);
  const avg = Math.ceil(avgArray?.reduce((acc, s) => acc + s.time, 0) || 0);
  const avgTimeString = formatedTime(avg ? avg / avgArray?.length! : 0);

  const totalTime = session?.reduce((acc, sess) => acc + sess.time, 0) || 0;
  const totalTimeString = formatedTime(totalTime);

  return (
    <div className="flex flex-col gap-9 w-full max-w-md">
      <div className="flex max-md:flex-col justify-between gap-4">
        <div className="flex items-start flex-col gap-1 text-lg md:text-xl">
          <h3 className="text-lg lg:text-xl text-slate-950 font-semibold">
            Weekly Total Time
          </h3>
          <div className="flex items-center justify-start gap-2">
            <Clock4 className="size-4 text-green-600" strokeWidth={3} />
            <span className="text-green-500 text-lg font-bold text-nowrap">
              {totalTimeString}
            </span>
          </div>
        </div>
        <div className="pt-3 font-medium">
          &#36;{Number((rate * totalTime) / 3600).toFixed(2)}
        </div>
      </div>
      <Bar
        options={options}
        data={{
          labels,
          datasets,
        }}
      />
    </div>
  );
};

export default EmployeeTime;
