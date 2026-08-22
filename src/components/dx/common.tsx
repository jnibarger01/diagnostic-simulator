import { LIKELIHOOD_LABEL, type Likelihood } from "@/lib/dx/types";
import { cn } from "@/lib/utils";
import type { VehicleProfile } from "@/lib/dx/types";

export function vehicleTitle(v: VehicleProfile) {
  const bits = [v.year, v.make, v.model].filter(Boolean).join(" ");
  return bits || "Vehicle not identified";
}

export function vehicleSub(v: VehicleProfile) {
  const bits = [
    v.engine,
    v.mileage != null ? `${v.mileage.toLocaleString()} mi` : null,
    v.vin ? `VIN ${v.vin}` : null,
  ].filter(Boolean);
  return bits.join(" · ");
}

export function LikelihoodMark({ value, className }: { value: Likelihood; className?: string }) {
  const color =
    value === "very_high"
      ? "text-data"
      : value === "high"
        ? "text-ok"
        : value === "moderate"
          ? "text-warn"
          : value === "low"
            ? "text-muted"
            : "text-subtle";
  return <span className={cn("font-mono text-micro uppercase tracking-wider", color, className)}>{LIKELIHOOD_LABEL[value]}</span>;
}

export function BandBar({ value }: { value: Likelihood }) {
  const n = { very_high: 5, high: 4, moderate: 3, low: 2, very_low: 1 }[value];
  return (
    <span className="inline-flex gap-0.5" aria-hidden>
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i} className={cn("h-2 w-2 rounded-xs", i < n ? "bg-data" : "bg-elevated")} />
      ))}
    </span>
  );
}
