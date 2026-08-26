"use client";

import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

export interface CheckboxProps extends React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> {}

const Checkbox = React.forwardRef<React.ElementRef<typeof CheckboxPrimitive.Root>, CheckboxProps>(
  ({ className, ...props }, ref) => (
    <CheckboxPrimitive.Root
      ref={ref}
      className={cn(
        "peer h-4 w-4 shrink-0 rounded-[var(--radius-sm)] border-2 border-[var(--color-border-primary)]",
        "bg-[var(--color-bg-secondary)]",
        "text-[var(--color-accent-primary)]",
        "focus-ring",
        "data-[state=checked]:bg-[var(--color-accent-primary)] data-[state=checked]:border-[var(--color-accent-primary)]",
        "data-[state=indeterminate]:bg-[var(--color-accent-primary)] data-[state=indeterminate]:border-[var(--color-accent-primary)]",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator className="flex items-center justify-center text-[var(--color-text-inverse)]">
        <Check className="h-3.5 w-3.5" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
);
Checkbox.displayName = CheckboxPrimitive.Root.displayName;

export { Checkbox };