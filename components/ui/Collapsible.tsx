"use client";

import * as React from "react";
import * as CollapsiblePrimitive from "@radix-ui/react-collapsible";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

export interface CollapsibleProps extends React.ComponentPropsWithoutRef<typeof CollapsiblePrimitive.Root> {}

const Collapsible = React.forwardRef<React.ElementRef<typeof CollapsiblePrimitive.Root>, CollapsibleProps>(
  ({ className, children, ...props }, ref) => (
    <CollapsiblePrimitive.Root ref={ref} className={cn("border-2 border-[var(--color-border-primary)] rounded-[var(--radius-md)] overflow-hidden bg-[var(--color-bg-elevated)]", className)} {...props}>
      {children}
    </CollapsiblePrimitive.Root>
  )
);
Collapsible.displayName = CollapsiblePrimitive.Root.displayName;

const CollapsibleTrigger = React.forwardRef<
  React.ElementRef<typeof CollapsiblePrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof CollapsiblePrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <CollapsiblePrimitive.Trigger
    ref={ref}
    className={cn(
      "flex w-full items-center justify-between px-4 py-3 text-left",
      "bg-transparent text-[var(--color-text-primary)]",
      "hover:bg-[var(--color-bg-tertiary)]",
      "focus-ring",
      className
    )}
    {...props}
  >
    {children}
    <ChevronDown className="h-4 w-4 text-[var(--color-text-muted)] transition-transform duration-200 data-[state=open]:rotate-180" />
  </CollapsiblePrimitive.Trigger>
));
CollapsibleTrigger.displayName = CollapsiblePrimitive.Trigger.displayName;

const CollapsibleContent = React.forwardRef<
  React.ElementRef<typeof CollapsiblePrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof CollapsiblePrimitive.Content>
>(({ className, ...props }, ref) => (
  <CollapsiblePrimitive.Content
    ref={ref}
    className={cn(
      "overflow-hidden data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up",
      "px-4 pb-4",
      className
    )}
    {...props}
  />
));
CollapsibleContent.displayName = CollapsiblePrimitive.Content.displayName;

export { Collapsible, CollapsibleTrigger, CollapsibleContent };