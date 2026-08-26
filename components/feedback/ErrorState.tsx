import { AlertTriangle, RefreshCw, Wifi, Shield, Search } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

interface ErrorStateProps {
  title: string;
  message?: string;
  variant?: "default" | "network" | "permission" | "not-found";
  onRetry?: () => void;
}

const variantConfig = {
  default: { icon: AlertTriangle, color: "var(--color-status-error)" },
  network: { icon: Wifi, color: "var(--color-status-warning)" },
  permission: { icon: Shield, color: "var(--color-status-error)" },
  "not-found": { icon: Search, color: "var(--color-text-muted)" },
};

export function ErrorState({ title, message, variant = "default", onRetry }: ErrorStateProps) {
  const config = variantConfig[variant];
  const Icon = config.icon;

  return (
    <Card className="p-12 text-center">
      <Icon className="h-12 w-12 mx-auto mb-4" style={{ color: config.color }} />
      <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-2">{title}</h3>
      {message && <p className="text-sm text-[var(--color-text-secondary)] mb-4 max-w-md mx-auto">{message}</p>}
      {onRetry && (
        <Button variant="secondary" size="sm" onClick={onRetry}>
          <RefreshCw className="h-4 w-4" /> Try Again
        </Button>
      )}
    </Card>
  );
}