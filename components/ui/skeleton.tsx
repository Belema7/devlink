import { cn } from "@/lib/utils"

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn("animate-pulse rounded border-2 border-black bg-muted shadow-[4px_4px_0px_#000]", className)}
      {...props}
    />
  )
}

export { Skeleton }
