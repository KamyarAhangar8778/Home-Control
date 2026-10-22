import type React from "react";
import { cn } from "@/lib/utils";

type AlertVariant = "default" | "destructive" | "info" | "success" | "warning" | "invert";

const variants: Record<AlertVariant, string> = {
  default: "bg-card text-card-foreground",
  destructive: "border-destructive/30 bg-destructive/4 [&>svg]:text-destructive",
  info: "border-info/30 bg-info/4 [&>svg]:text-info",
  success: "border-success/30 bg-success/4 [&>svg]:text-success",
  warning: "border-warning/30 bg-warning/4 [&>svg]:text-warning",
  invert: "border-invert bg-invert text-invert-foreground [&_[data-slot=alert-description]]:text-invert-foreground/70",
};

function Alert({
  className,
  variant = "default",
  ...props
}: React.ComponentProps<"div"> & { variant?: AlertVariant }) {
  return (
    <div
      data-slot="alert"
      role="alert"
      className={cn(
        "cn-alert relative grid w-full grid-cols-[0_1fr] items-center gap-y-0.5 rounded-lg border px-3 py-2.5 text-sm has-[>svg]:grid-cols-[calc(var(--spacing)*3)_1fr] has-[>svg]:gap-x-2.5 [&>svg:not([class*=size-])]:size-4",
        "has-[>[data-slot=alert-title]+[data-slot=alert-description]]:items-start has-[>[data-slot=alert-title]+[data-slot=alert-description]]:[&_svg]:translate-y-0.5",
        variants[variant],
        className,
      )}
      {...props}
    />
  );
}

function AlertTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-title"
      className={cn("cn-alert-title col-start-2 line-clamp-1 min-h-4 font-medium tracking-tight", className)}
      {...props}
    />
  );
}

function AlertDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-description"
      className={cn("cn-alert-description text-muted-foreground col-start-2 grid justify-items-start gap-1 text-sm [&_p]:leading-relaxed", className)}
      {...props}
    />
  );
}

function AlertAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-action"
      className={cn("cn-alert-action flex gap-1.5 max-sm:col-start-2 max-sm:mt-2 max-sm:justify-start sm:col-start-3 sm:row-start-1 sm:justify-end sm:self-center", className)}
      {...props}
    />
  );
}

export { Alert, AlertAction, AlertDescription, AlertTitle };
