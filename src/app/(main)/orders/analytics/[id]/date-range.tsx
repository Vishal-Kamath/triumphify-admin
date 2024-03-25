import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Dispatch, FC, SetStateAction } from "react";
import { RxCaretSort } from "react-icons/rx";

const OrderAnalyticsDateRange: FC<{
  startDate: Date;
  setStartDate: Dispatch<SetStateAction<Date>>;
  endDate: Date;
  setEndDate: Dispatch<SetStateAction<Date>>;
}> = ({ startDate, setStartDate, endDate, setEndDate }) => {
  return (
    <div className="flex justify-end">
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

export default OrderAnalyticsDateRange;
