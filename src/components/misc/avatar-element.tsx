import { FC } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

const colors = [
  "bg-red-100 text-red-800 border-red-500",
  "bg-purple-100 text-purple-800 border-purple-500",
  "bg-green-100 text-green-800 border-green-500",
  "bg-yellow-100 text-yellow-800 border-yellow-500",
  "bg-sky-100 text-sky-800 border-sky-500",
];
export const AvatarElement: FC<{
  image: string | null;
  username?: string | null;
  className?: string;
  elementClassName?: string;
}> = ({ image, username, className, elementClassName }) => (
  <Avatar className={className}>
    <AvatarImage src={image || ""} className={elementClassName} />
    <AvatarFallback
      className={cn(
        colors[(username?.length || 5) % 5],
        "font-semibold",
        elementClassName
      )}
    >
      {username
        ?.split(" ")
        .map((val) => val[0])
        .slice(0, 2)
        .join("")}
    </AvatarFallback>
  </Avatar>
);

export default AvatarElement;
