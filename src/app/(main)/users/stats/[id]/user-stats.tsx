import { useUserStats } from "@/lib/user";
import { useParams } from "next/navigation";
import { FC } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

const AccountUserStats: FC = () => {
  const id = useParams()["id"] as string;
  const { data: stats } = useUserStats(id);

  return (
    <div className="flex flex-col gap-6 lg:gap-9">
      <h3 className="text-lg font-medium text-slate-500">User Stats</h3>
      <div className="flex gap-12 max-lg:flex-col lg:gap-6">
        <div className="flex h-full w-full flex-col justify-center gap-6">
          <div className="flex gap-6">
            <div className="flex w-full flex-col gap-2">
              <h6 className="font-medium text-slate-600">Total Amount Spend</h6>
              <span className="text-lg text-green-500">
                &#36;{stats?.total_amount_spent || 0}
              </span>
            </div>
            <div className="flex w-full flex-col gap-2">
              <h6 className="font-medium text-slate-600">Total orders</h6>
              <span className="text-sm text-slate-500">
                &#36;{stats?.total_orders_price || 0}
              </span>
            </div>
          </div>
          <div className="flex gap-6">
            <div className="flex w-full flex-col gap-2">
              <h6 className="font-medium text-slate-600">
                Total orders cancelled
              </h6>
              <span className="text-sm text-slate-500">
                &#36;{stats?.total_cancelled_orders_price || 0}
              </span>
            </div>
            <div className="flex w-full flex-col gap-2">
              <h6 className="font-medium text-slate-600">
                Total orders returned
              </h6>
              <span className="text-sm text-slate-500">
                &#36;{stats?.total_returned_orders_price || 0}
              </span>
            </div>
          </div>
        </div>
        <div className="w-full max-w-xs max-lg:mx-auto">
          <Pie
            data={{
              labels: ["Total Orders", "Total Cancelled", "Total Returned"],
              datasets: [
                {
                  label: "Orders",
                  data: [
                    stats?.total_orders_price || 0,
                    stats?.total_cancelled_orders_price || 0,
                    stats?.total_returned_orders_price || 0,
                  ],
                  backgroundColor: [
                    "rgba(75, 192, 192, 0.2)",
                    "rgba(255, 159, 64, 0.2)",
                    "rgba(255, 99, 132, 0.2)",
                  ],
                  borderColor: [
                    "rgba(75, 192, 192, 1)",
                    "rgba(255, 159, 64, 1)",
                    "rgba(255, 99, 132, 1)",
                  ],
                  borderWidth: 1,
                  borderRadius: 5,
                },
              ],
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default AccountUserStats;
