"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "primary" | "secondary" | "success" | "warning" | "error" | "info" | "default";
  size?: "sm" | "md";
}

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = "default", size = "md", children, ...props }, ref) => {
    const variants = {
      primary: "badge-primary",
      secondary: "badge-secondary",
      success: "badge-success",
      warning: "badge-warning",
      error: "badge-error",
      info: "badge-info",
      default: "badge bg-[var(--color-bg-tertiary)] text-[var(--color-text-secondary)] border-[var(--color-border-primary)]",
    };

    const sizes = {
      sm: "px-2 py-0.5 text-[10px] gap-1",
      md: "px-2.5 py-0.5 text-xs gap-1.5",
    };

    return (
      <span
        ref={ref}
        className={cn("badge", variants[variant], sizes[size], className)}
        {...props}
      >
        {children}
      </span>
    );
  }
);

Badge.displayName = "Badge";

export { Badge };