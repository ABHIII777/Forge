"use client";

import * as React from "react";
import * as AvatarPrimitive from "@radix-ui/react-avatar";
import { cn } from "@/lib/utils";
import { getInitials } from "@/lib/utils";

export interface AvatarProps extends React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root> {
  name?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
}

const sizeClasses = {
  xs: "h-6 w-6 text-[10px]",
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-12 w-12 text-base",
  xl: "h-16 w-16 text-lg",
};

const Avatar = React.forwardRef<React.ElementRef<typeof AvatarPrimitive.Root>, AvatarProps>(
  ({ className, name, size = "md", ...props }, ref) => {
    const fallback = name ? getInitials(name) : "?";

    return (
      <AvatarPrimitive.Root
        ref={ref}
        className={cn("relative inline-flex shrink-0 overflow-hidden rounded-full", className)}
        {...props}
      >
        <AvatarPrimitive.Image
          className={cn("aspect-square h-full w-full object-cover", sizeClasses[size])}
        />
        <AvatarPrimitive.Fallback
          className={cn(
            "flex items-center justify-center bg-[var(--color-bg-tertiary)] text-[var(--color-text-secondary)] font-medium font-mono",
            sizeClasses[size]
          )}
          delayMs={600}
        >
          {fallback}
        </AvatarPrimitive.Fallback>
      </AvatarPrimitive.Root>
    );
  }
);
Avatar.displayName = AvatarPrimitive.Root.displayName;

export { Avatar };