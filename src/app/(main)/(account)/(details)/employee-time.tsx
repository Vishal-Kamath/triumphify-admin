import { TimeLogContext } from "@/components/providers/time.log.provider";
import { Clock4 } from "lucide-react";
import { FC, useContext } from "react";

function padZero(num: number) {
  return num.toString().padStart(2, "0");
}

const day = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const EmployeeTime: FC = () => {
  const { time } = useContext(TimeLogContext);

  // return time;
  const hours = padZero(Math.floor(time / (60 * 60)));
  const minutes = padZero(Math.floor((time % (60 * 60)) / 60));
  const seconds = padZero(time % 60);

  const timeString = `${hours}h ${minutes}m ${seconds}s`;

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-center gap-2 text-xl">
        <Clock4 className="size-6 text-green-600" strokeWidth={3} />
        <span className="text-green-500 font-bold text-nowrap">
          {timeString}
        </span>
      </div>
    </div>
  );
};

export default EmployeeTime;
