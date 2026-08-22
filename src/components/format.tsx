import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Led({ on, warn, fault, className }: { on?: boolean; warn?: boolean; fault?: boolean; className?: string }) {
  const cls = fault ? "led-fault" : warn ? "led-warn" : on ? "led-ok" : "led-off";
  return <span className={cn("led", cls, className)} aria-hidden />;
}

export function Kpi({
  label,
  value,
  unit,
  flag,
}: {
  label: string;
  value: string | number;
  unit?: string;
  flag?: "ok" | "warn" | "fault" | "data";
}) {
  const color =
    flag === "fault" ? "text-fault" : flag === "warn" ? "text-warn" : flag === "ok" ? "text-ok" : "text-data";
  return (
    <div className="min-w-0">
      <div className="text-micro uppercase tracking-wider text-subtle">{label}</div>
      <div className={cn("font-mono text-sm tabular-nums leading-tight", color)}>
        {value}
        {unit ? <span className="ml-1 text-micro text-muted">{unit}</span> : null}
      </div>
    </div>
  );
}

export function Panel({
  title,
  right,
  children,
  className,
}: {
  title?: string;
  right?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("flex min-h-0 flex-col rounded-lg bg-surface shadow-[var(--shadow-border)]", className)}>
      {title ? (
        <header className="flex items-center justify-between gap-2 border-b border-border px-3 py-2">
          <h2 className="text-micro font-medium uppercase tracking-[0.14em] text-muted">{title}</h2>
          {right}
        </header>
      ) : null}
      <div className="min-h-0 flex-1 overflow-auto p-3">{children}</div>
    </section>
  );
}
