"use client";

import AvatarElement from "@/components/misc/avatar-element";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipArrow,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useAction } from "@/lib/lead";
import { dateFormaterNotUTC } from "@/utils/dateFormater";
import { useParams } from "next/navigation";
import { FC } from "react";

const LogsList: FC = () => {
  const id = useParams()["id"] as string;
  const { data, isLoading } = useAction(id);
  if (!data && isLoading) return <div>Loading...</div>;
  if (!data) return <div>Not Found</div>;

  const { action, logs } = data;

  return (
    <div className="flex w-full flex-col gap-6">
      <h2 className="text-xl font-semibold">Action Logs</h2>
      <div className="flex flex-col gap-3">
        {logs.map((log, index) => (
          <div
            key={log.title + index}
            className="px-4 py-5 flex flex-col gap-4 rounded-md border-1 border-slate-200 hover:shadow-md hover:shadow-slate-800/10"
          >
            <div className="flex flex-col ">
              <h4 className="text-lg text-slate-800 font-semibold">
                {log.title}
              </h4>
              <p className="text-xs text-slate-500">
                triggered at:{" "}
                {dateFormaterNotUTC(
                  new Date(log.created_at),
                  true,
                  true,
                  "America/New_York"
                )}
              </p>
            </div>

            <div className="flex flex-col gap-2 mt-4">
              <h5 className="text-sm text-slate-500 font-medium">Send to:</h5>
              <div className="flex flex-wrap gap-3">
                <TooltipProvider>
                  {log.receivers.map((user, index) => (
                    <Tooltip key={user.userName + index}>
                      <TooltipTrigger className="flex gap-2 cursor-pointer items-center p-1 pr-3 border-1 rounded-full border-slate-200">
                        <AvatarElement
                          image=""
                          username={user.userName}
                          className="size-6"
                          elementClassName="text-xs"
                        />
                        <span className="text-xs text-slate-800">
                          {user.userName}
                        </span>
                      </TooltipTrigger>
                      <TooltipContent className="rounded-full">
                        {user.email}
                        <TooltipArrow
                          fill="white"
                          className="-translate-y-[1px]"
                        />
                      </TooltipContent>
                    </Tooltip>
                  ))}
                </TooltipProvider>
              </div>
            </div>
            <Separator />
            <div className="flex gap-2 items-start">
              <span className="text-sm min-w-[5rem] text-slate-500 font-medium">
                Subject:
              </span>

              <p className="text-sm text-slate-500 break-words">
                {log.subject}
              </p>
            </div>
            <Separator />
            <div className="flex gap-2 items-start">
              <span className="text-sm min-w-[5rem] text-slate-500 font-medium">
                Body:
              </span>

              <p className="text-sm text-slate-500 break-words">{log.body}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LogsList;
