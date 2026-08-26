import { cn } from "@/lib/utils";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "text" | "circular" | "rectangular";
  width?: string | number;
  height?: string | number;
}

export function Skeleton({ className, variant = "rectangular", width, height, ...props }: SkeletonProps) {
  const variants = {
    text: "h-4 w-full rounded-[var(--radius-md)]",
    circular: "rounded-full",
    rectangular: "rounded-[var(--radius-md)]",
  };

  return (
    <div
      className={cn("skeleton", variants[variant], className)}
      style={{ width, height }}
      {...props}
      aria-hidden="true"
    />
  );
}

export function CardSkeleton() {
  return (
    <div className="card-base p-4 space-y-3">
      <div className="flex items-center gap-3">
        <Skeleton variant="circular" width={40} height={40} />
        <div className="flex-1 space-y-2">
          <Skeleton variant="text" width="60%" />
          <Skeleton variant="text" width="40%" />
        </div>
      </div>
      <Skeleton variant="text" />
      <Skeleton variant="text" width="80%" />
    </div>
  );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="card-base">
      <div className="p-4 border-b-2 border-[var(--color-border-primary)]">
        <Skeleton variant="text" width="200px" />
      </div>
      <div className="divide-y divide-[var(--color-border-primary)]">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 p-4">
            <Skeleton variant="text" width="60px" />
            <Skeleton variant="text" className="flex-1" />
            <Skeleton variant="text" width="80px" />
            <Skeleton variant="text" width="60px" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function ListSkeleton({ items = 4 }: { items?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: items }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}