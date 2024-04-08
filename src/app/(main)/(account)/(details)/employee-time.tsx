import { TimeLogContext } from "@/components/providers/time.log.provider";
import { Clock4 } from "lucide-react";
import { FC, useContext } from "react";
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
import { useSession } from "@/lib/session";

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

const EmployeeTime: FC = () => {
  const { time } = useContext(TimeLogContext);
  const { data: session } = useSession();

  const todayDate = new Date();
  const today = new Date(
    todayDate.getFullYear(),
    todayDate.getMonth(),
    todayDate.getDate(),
    0,
    0,
    0
  );
  const datasets: ChartDataset<"bar">[] = [
    {
      label: "Time Spent",
      data:
        session?.map((s) => {
          const isToday =
            today.toDateString() === new Date(s.date).toDateString();
          return isToday ? time + s.time : s.time;
        }) ?? Array(7).fill(0),
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

  const findTodayTime =
    session?.find(
      (s) => today.toDateString() === new Date(s.date).toDateString()
    )?.time || 0;
  const timeString = formatedTime(time + findTodayTime);

  return (
    <div className="flex flex-col gap-9 w-full max-w-md">
      <div className="flex items-center justify-start gap-2 text-lg md:text-xl">
        <h3 className="text-lg lg:text-xl text-transparent bg-clip-text bg-gradient-to-br from-slate-950 to-slate-500 font-semibold">
          Time
        </h3>
        <Clock4 className="size-4 md:size-6 text-green-600" strokeWidth={3} />
        <span className="text-green-500 font-bold text-nowrap">
          {timeString}
        </span>
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
