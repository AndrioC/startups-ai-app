import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80",
        outline: "text-foreground",
        b2b: "border-0 bg-emerald-600 text-white hover:bg-emerald-700",
        b2c: "border-0 bg-blue-600 text-white hover:bg-blue-700",
        b2e: "border-0 bg-rose-600 text-white hover:bg-rose-700",
        b2g: "border-0 bg-purple-600 text-white hover:bg-purple-700",
        b2b2c: "border-0 bg-pink-600 text-white hover:bg-pink-700",
        b2i: "border-0 bg-fuchsia-600 text-white hover:bg-fuchsia-700",
        "b2b-b2c": "border-0 bg-red-600 text-white hover:bg-red-700",
        approved: "border-0 bg-green-600 text-white hover:bg-green-700",
        rejected: "border-0 bg-red-600 text-white hover:bg-red-700",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
