import { cn } from "@/utils/cn";
import type { ComponentProps } from "react";

export default function ContainerWrapper({
  children,
  className,
  ...props
}: {
  children: React.ReactNode;
} & ComponentProps<"div">) {
  return (
    <div
      className={cn("mx-auto px-4  max-w-[1280px] sm:px-2 lg:px-8", className)}
      {...props}
    >
      {children}
    </div>
  );
}
