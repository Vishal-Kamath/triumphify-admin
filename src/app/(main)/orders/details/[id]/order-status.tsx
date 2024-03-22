import { Order } from "@/@types/order";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { invalidateAllOrders } from "@/lib/orders";
import { cn } from "@/lib/utils";
import axios from "axios";
import { FC, useEffect, useState } from "react";
import { AiOutlineLoading } from "react-icons/ai";
import { z } from "zod";

const validStatus = z.enum([
  "pending",
  "confirmed",
  "out for delivery",
  "delivered",
  "return approved",
  "out for pickup",
  "picked up",
  "refunded",
]);

const OrderStatus: FC<{ order?: Order }> = ({ order }) => {
  const currentStatusesArray = !order?.returned
    ? ["pending", "confirmed", "out for delivery", "delivered"]
    : ["return approved", "out for pickup", "picked up", "refunded"];

  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(
    order ? currentStatusesArray.indexOf(order.status) : -1
  );
  const [currentStatus, setCurrentStatus] = useState<string | undefined>(
    order?.status
  );

  useEffect(() => {
    if (!!order) {
      setCurrentStep(currentStatusesArray.indexOf(order.status));
      setCurrentStatus(order.status);
    }
  }, [order]);

  function onSubmit() {
    if (!currentStatus) {
      return toast({
        title: "Please select a status",
        variant: "warning",
      });
    }

    try {
      const status = validStatus.parse(currentStatus);

      setLoading(true);
      axios
        .patch(
          `${process.env.ENDPOINT}/api/employee/orders/${order?.id}`,
          { status },
          {
            headers: {
              "Content-Type": "application/json",
            },
            withCredentials: true,
          }
        )
        .then((res) => {
          setLoading(false);
          invalidateAllOrders();
          toast({
            title: res.data.title,
            description: res.data.description,
            variant: res.data.type,
          });
        })
        .catch((err) => {
          setLoading(false);
          if (!err.response?.data) return;
          toast({
            title: "Error",
            description: err.response.data.description,
            variant: err.response.data.type,
          });
        });
    } catch (error) {
      toast({
        title: "An error occurred",
        variant: "error",
      });
    }
  }

  if (!order) return null;
  const isDisabled = currentStatus === order.status;

  return (
    <div className="flex w-full flex-col gap-6 px-3">
      <h3 className="font-medium">Update Order Status</h3>

      <div className="overflow-x-auto overflow-y-visible scrollbar-none">
        <div className="mx-auto flex h-16 w-full min-w-[32rem] max-w-3xl items-center  text-[10px]">
          {currentStatusesArray.map((step, index) => (
            <div
              className="step-item relative flex w-full flex-col items-center justify-center gap-1"
              key={step + index}
            >
              {/* dash */}
              <div
                className={cn(
                  "absolute right-1/2 top-[8px] -z-10 h-[1px] w-full",
                  index === 0 && "hidden",
                  index <= currentStep ? "bg-purple-500" : "bg-slate-300"
                )}
              ></div>

              {/* content */}
              <div className="relative group size-4">
                <div
                  className={cn(
                    "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 outline  outline-2 rounded-full ",
                    index <= currentStep
                      ? "size-3 bg-purple-600 outline-offset-2 outline-purple-600"
                      : "size-4 bg-white outline-slate-300 group-hover:outline-purple-300 group-hover:bg-purple-300"
                  )}
                ></div>
                <input
                  type="checkbox"
                  id={step}
                  className="size-4 cursor-pointer absolute top-0 opacity-0 left-0 z-10 accent-purple-600"
                  checked={index <= currentStep}
                  onChange={(e) => {}}
                  onClick={(e) => {
                    if (!step) return;
                    setCurrentStatus(step);
                    setCurrentStep(index);
                  }}
                />
              </div>
              <div className="px-[2px] text-center text-gray-600">{step}</div>
            </div>
          ))}
        </div>
      </div>

      {loading ? (
        <Button disabled className="ml-auto max-w-[15rem]">
          <AiOutlineLoading className="mr-2 h-4 w-4 animate-spin" />
          Please wait..
        </Button>
      ) : (
        <Button
          onClick={onSubmit}
          disabled={isDisabled}
          className="ml-auto max-w-[15rem]"
        >
          <span>Update Status</span>
        </Button>
      )}
    </div>
  );
};

export default OrderStatus;
