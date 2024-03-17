import { FC } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

const colors = [
  "bg-red-100 text-red-800",
  "bg-purple-100 text-purple-800",
  "bg-green-100 text-green-800",
  "bg-yellow-100 text-yellow-800",
  "bg-sky-100 text-sky-800",
];
export const AvatarElement: FC<{
  image: string | null;
  username?: string | null;
  className?: string;
}> = ({ image, username, className }) => (
  <Avatar className={className}>
    <AvatarImage src={image || ""} />
    <AvatarFallback
      className={cn(colors[(username?.length || 5) % 5], "font-semibold")}
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
