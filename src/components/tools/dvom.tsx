import { Button } from "@/components/ui/button";
import { useGame } from "@/lib/store/game-store";
import type { DvomMode } from "@/lib/sim/types";
import { cn } from "@/lib/utils";

const MODES: { id: DvomMode; label: string }[] = [
  { id: "dcv", label: "DC V" },
  { id: "acv", label: "AC V" },
  { id: "ohm", label: "Ω" },
  { id: "continuity", label: "CONT" },
  { id: "vdrop", label: "V DROP" },
];

export function Dvom() {
  const def = useGame((s) => s.def)!;
  const dvom = useGame((s) => s.dvom);
  const setDvom = useGame((s) => s.setDvom);
  const measure = useGame((s) => s.measure);
  const vehicle = useGame((s) => s.vehicle)!;

  return (
    <div className="grid gap-4 lg:grid-cols-[18rem_1fr]">
      <div className="rounded-lg bg-elevated p-4 shadow-[var(--shadow-border)]">
        <div className="text-micro uppercase tracking-wider text-subtle">Fluke-style meter</div>
        <div className="mt-3 rounded-sm bg-bg px-3 py-4 text-center">
          <div className="font-mono text-4xl tabular-nums tracking-tight text-data">
            {dvom.last?.display ?? "0.00"}
          </div>
          <div className="mt-1 text-xs text-muted">{dvom.last?.unit || MODES.find((m) => m.id === dvom.mode)?.label}</div>
        </div>
        <div className="mt-3 grid grid-cols-5 gap-1">
          {MODES.map((m) => (
            <button
              key={m.id}
              onClick={() => setDvom({ mode: m.id, last: null })}
              className={cn(
                "rounded-sm py-2 text-micro",
                dvom.mode === m.id ? "bg-accent text-accent-fg" : "bg-surface text-muted",
              )}
            >
              {m.label}
            </button>
          ))}
        </div>
        <Button className="mt-3 w-full" variant="data" onClick={measure}>
          Measure
        </Button>
        {dvom.last?.note ? <p className="mt-2 text-xs text-warn">{dvom.last.note}</p> : null}
        {dvom.last && !dvom.last.valid ? <p className="mt-2 text-xs text-fault">Setup invalid — reading is not trustworthy.</p> : null}
        <p className="mt-3 text-micro text-muted">
          Key is {vehicle.key.toUpperCase()}. Resistance with power applied is invalid.
        </p>
      </div>
      <div>
        <div className="mb-2 text-micro uppercase tracking-wider text-subtle">Probe points</div>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="block text-xs text-muted">
            Red
            <select
              className="mt-1 w-full rounded-sm border border-border bg-elevated px-2 py-2 text-sm text-fg"
              value={dvom.red}
              onChange={(e) => setDvom({ red: e.target.value })}
            >
              {def.wiring.nodes.map((n) => (
                <option key={n.id} value={n.id}>
                  {n.label}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-xs text-muted">
            Black
            <select
              className="mt-1 w-full rounded-sm border border-border bg-elevated px-2 py-2 text-sm text-fg"
              value={dvom.black}
              onChange={(e) => setDvom({ black: e.target.value })}
            >
              {def.wiring.nodes.map((n) => (
                <option key={n.id} value={n.id}>
                  {n.label}
                </option>
              ))}
            </select>
          </label>
        </div>
        <p className="mt-3 text-sm text-muted">
          Points come from the case wiring. The meter will not highlight the correct circuit. Wrong mode on a VR sensor,
          or ohms across a live feed, returns a misleading number — just like the bench.
        </p>
      </div>
    </div>
  );
}
