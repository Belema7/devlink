import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded border-2 border-black bg-clip-padding font-display text-xs font-extrabold uppercase tracking-normal whitespace-nowrap shadow-[4px_4px_0px_#000] transition-all duration-150 ease-out outline-none select-none hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_#000] active:translate-x-1 active:translate-y-1 active:shadow-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg]:stroke-[2.25] [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          "bg-black text-white hover:bg-black",
        outline:
          "bg-white text-black hover:bg-muted aria-expanded:bg-muted",
        secondary:
          "bg-muted text-black hover:bg-white aria-expanded:bg-muted",
        ghost:
          "border-transparent bg-transparent text-black shadow-none hover:translate-x-0 hover:translate-y-0 hover:bg-muted hover:shadow-none aria-expanded:bg-muted",
        destructive:
          "border-destructive bg-white text-destructive hover:bg-destructive hover:text-white focus-visible:border-destructive/40 focus-visible:ring-destructive/20 dark:bg-white dark:hover:bg-destructive dark:focus-visible:ring-destructive/40",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default:
          "h-12 gap-2 px-8 has-data-[icon=inline-end]:pr-6 has-data-[icon=inline-start]:pl-6",
        xs: "h-8 gap-1 rounded px-3 text-[10px] in-data-[slot=button-group]:rounded has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-10 gap-1.5 rounded px-6 text-[0.7rem] in-data-[slot=button-group]:rounded has-data-[icon=inline-end]:pr-4 has-data-[icon=inline-start]:pl-4 [&_svg:not([class*='size-'])]:size-3.5",
        lg: "h-14 gap-2 px-10 has-data-[icon=inline-end]:pr-8 has-data-[icon=inline-start]:pl-8",
        icon: "size-12",
        "icon-xs":
          "size-8 rounded in-data-[slot=button-group]:rounded [&_svg:not([class*='size-'])]:size-3",
        "icon-sm":
          "size-10 rounded in-data-[slot=button-group]:rounded",
        "icon-lg": "size-14",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot.Root : "button"

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
