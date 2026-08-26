"use client";

import * as React from "react";
import * as SwitchPrimitive from "@radix-ui/react-switch";
import { cn } from "@/lib/utils";

export interface SwitchProps extends React.ComponentPropsWithoutRef<typeof SwitchPrimitive.Root> {}

const Switch = React.forwardRef<React.ElementRef<typeof SwitchPrimitive.Root>, SwitchProps>(
  ({ className, ...props }, ref) => (
    <SwitchPrimitive.Root
      ref={ref}
      className={cn(
        "peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full",
        "bg-[var(--color-border-primary)]",
        "data-[state=checked]:bg-[var(--color-accent-primary)]",
        "focus-ring",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        className={cn(
          "pointer-events-none block h-5 w-5 rounded-full",
          "bg-white shadow-[var(--shadow-hard)]",
          "data-[state=checked]:translate-x-5",
          "transition-transform"
        )}
      />
    </SwitchPrimitive.Root>
  )
);
Switch.displayName = SwitchPrimitive.Root.displayName;

export { Switch };