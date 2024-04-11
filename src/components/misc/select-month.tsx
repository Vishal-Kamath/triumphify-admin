import { FC, ReactNode, useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { ChevronLeft } from "lucide-react";
import { Button } from "../ui/button";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";
import { cn } from "@/lib/utils";

type Month =
  | "January"
  | "February"
  | "March"
  | "April"
  | "May"
  | "June"
  | "July"
  | "August"
  | "September"
  | "October"
  | "November"
  | "December";

export const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

interface SelectMonthProps {
  month?: number;
  onMonthChange?: (month: number) => void;
  year?: number;
  onYearChange?: (year: number) => void;
  apply: () => void;
  open: boolean;
  setOpen: (open: boolean) => void;
  className?: string;
  children: ReactNode;
  align?: "center" | "end" | "start";
}
export const SelectMonth: FC<SelectMonthProps> = ({
  month: defaultMonth,
  onMonthChange,
  year: defaultYear,
  onYearChange,
  apply,
  open,
  setOpen,
  children,
  className,
  align,
}) => {
  const max = new Date().getFullYear();
  const [month, setMonth] = useState(defaultMonth || new Date().getMonth());
  const [year, setYear] = useState(defaultYear || new Date().getFullYear());

  function changeMonth(month: number) {
    setMonth(month);
    onMonthChange && onMonthChange(month);
  }

  function changeYear(year: number) {
    setYear(year);
    onYearChange && onYearChange(year);
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger className={className}>{children}</PopoverTrigger>
      <PopoverContent align={align} className="flex flex-col gap-3">
        <div className="flex justify-between gap-3">
          <Button
            aria-label="Go to previous page"
            variant="outline"
            className="size-8 p-0 shrink-0"
            onClick={() => setYear(year - 1)}
          >
            <LuChevronLeft className="size-4" aria-hidden="true" />
          </Button>
          <input
            type="number"
            value={year}
            onChange={(e) => changeYear(Number(e.target.value))}
            className="bg-transparent text-center outline-none border-b-1 border-slate-200 hover:border-slate-300 focus-within:border-slate-600 focus-within:hover:border-slate-600"
          />
          <Button
            aria-label="Go to next page"
            variant="outline"
            className="size-8 p-0 shrink-0"
            onClick={() => setYear(year + 1)}
            disabled={year === max}
          >
            <LuChevronRight className="size-4" aria-hidden="true" />
          </Button>
        </div>
        <div className="grid grid-cols-3 text-slate-600">
          {months.map((m, index) => (
            <Button
              key={m}
              variant="ghost"
              className={cn(
                "text-sm",
                index === month &&
                  "border-1 border-purple-400 bg-purple-100 text-purple-700 hover:bg-purple-200"
              )}
              onClick={() => changeMonth(index)}
            >
              {m}
            </Button>
          ))}
        </div>
        <div className="flex justify-end">
          <Button variant="secondary" onClick={apply}>
            Apply
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};
