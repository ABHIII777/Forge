"use client";

import * as React from "react";
import * as ToastPrimitive from "@radix-ui/react-toast";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

export interface ToastProps extends React.ComponentPropsWithoutRef<typeof ToastPrimitive.Root> {
  variant?: "default" | "success" | "error" | "warning";
}

const Toast = React.forwardRef<React.ElementRef<typeof ToastPrimitive.Root>, ToastProps>(
  ({ className, variant = "default", ...props }, ref) => {
    const variants = {
      default: "border-[var(--color-border-primary)]",
      success: "border-[var(--color-status-success)]",
      error: "border-[var(--color-status-error)]",
      warning: "border-[var(--color-status-warning)]",
    };

    return (
      <ToastPrimitive.Root
        ref={ref}
        className={cn(
          "pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-[var(--radius-md)]",
          "bg-[var(--color-bg-elevated)] border-2 p-4",
          "shadow-[var(--shadow-hard-lg)]",
          "data-[state=open]:animate-slide-in",
          "data-[state=closed]:animate-fade-out",
          variants[variant],
          className
        )}
        {...props}
      />
    );
  }
);
Toast.displayName = ToastPrimitive.Root.displayName;

const ToastClose = React.forwardRef<
  React.ElementRef<typeof ToastPrimitive.Close>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitive.Close>
>(({ className, ...props }, ref) => (
  <ToastPrimitive.Close
    ref={ref}
    className={cn(
      "absolute right-2 top-2 rounded-[var(--radius-sm)] p-1",
      "text-[var(--color-text-muted)]",
      "hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-tertiary)]",
      "transition-colors",
      "focus-ring",
      className
    )}
    toast-close=""
    {...props}
  >
    <X className="h-4 w-4" />
    <span className="sr-only">Close</span>
  </ToastPrimitive.Close>
));
ToastClose.displayName = ToastPrimitive.Close.displayName;

const ToastTitle = React.forwardRef<
  React.ElementRef<typeof ToastPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitive.Title>
>(({ className, ...props }, ref) => (
  <ToastPrimitive.Title
    ref={ref}
    className={cn("text-sm font-semibold text-[var(--color-text-primary)]", className)}
    {...props}
  />
));
ToastTitle.displayName = ToastPrimitive.Title.displayName;

const ToastDescription = React.forwardRef<
  React.ElementRef<typeof ToastPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitive.Description>
>(({ className, ...props }, ref) => (
  <ToastPrimitive.Description
    ref={ref}
    className={cn("text-sm text-[var(--color-text-secondary)]", className)}
    {...props}
  />
));
ToastDescription.displayName = ToastPrimitive.Description.displayName;

export type ToastActionElement = React.ReactElement<typeof ToastAction>;

const ToastAction = React.forwardRef<
  React.ElementRef<typeof ToastPrimitive.Action>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitive.Action>
>(({ className, ...props }, ref) => (
  <ToastPrimitive.Action
    ref={ref}
    className={cn(
      "inline-flex h-8 shrink-0 items-center justify-center",
      "rounded-[var(--radius-sm)] border-2 border-[var(--color-border-primary)]",
      "bg-transparent px-3 text-xs font-medium font-mono",
      "text-[var(--color-text-secondary)]",
      "hover:bg-[var(--color-bg-tertiary)] hover:text-[var(--color-text-primary)]",
      "focus-ring",
      className
    )}
    {...props}
  />
));
ToastAction.displayName = ToastPrimitive.Action.displayName;

export { Toast, ToastClose, ToastTitle, ToastDescription, ToastAction };