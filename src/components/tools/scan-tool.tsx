import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Led } from "@/components/format";
import { runHealthCheck } from "@/lib/sim/measurements";
import { PID_META, pidValue } from "@/lib/sim/types";
import { useGame } from "@/lib/store/game-store";
import { cn, formatPid } from "@/lib/utils";

const TABS = ["Health", "DTCs", "Data", "Graph", "Utility"] as const;

export function ScanTool() {
  const def = useGame((s) => s.def)!;
  const vehicle = useGame((s) => s.vehicle)!;
  const pinned = useGame((s) => s.pinned);
  const pinPid = useGame((s) => s.pinPid);
  const history = useGame((s) => s.pidHistory);
  const scanVehicle = useGame((s) => s.scanVehicle);
  const clearDtcs = useGame((s) => s.clearDtcs);
  const [tab, setTab] = useState<(typeof TABS)[number]>("Health");
  const health = useMemo(() => runHealthCheck(vehicle, def), [vehicle, def]);
  const pids = PID_META.filter((p) => def.pidSet === "full" || p.basic);

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex items-center justify-between gap-2 border-b border-border bg-elevated px-3 py-2">
        <div>
          <div className="font-mono text-xs tracking-wider text-data">TECHSTREAM · GTS+</div>
          <div className="text-micro text-muted">
            {def.vehicle.vin} · {def.vehicle.engine} · cal {def.roNumber}A
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Led fault={vehicle.mil} on={!vehicle.mil} />
          <span className="text-micro uppercase tracking-wider text-muted">{vehicle.mil ? "MIL" : "READY"}</span>
        </div>
      </div>
      <div className="flex gap-1 border-b border-border px-2 py-1">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => {
              setTab(t);
              if (t === "Health" || t === "DTCs") scanVehicle();
            }}
            className={cn(
              "rounded-sm px-2.5 py-1.5 text-xs transition-colors duration-150",
              tab === t ? "bg-elevated text-fg" : "text-muted hover:text-fg",
            )}
          >
            {t}
          </button>
        ))}
      </div>
      <div className="min-h-0 flex-1 overflow-auto p-3">
        {tab === "Health" && (
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <h3 className="mb-2 text-micro uppercase tracking-wider text-subtle">Modules</h3>
              <ul className="space-y-1">
                {health.comms.map((m) => (
                  <li key={m.id} className="flex items-center justify-between rounded-sm bg-elevated px-2 py-1.5 text-xs">
                    <span>{m.name}</span>
                    <span className={cn("font-mono", m.online ? "text-ok" : "text-fault")}>{m.online ? "ONLINE" : "NO COMM"}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="mb-2 text-micro uppercase tracking-wider text-subtle">Readiness</h3>
              <ul className="space-y-1">
                {Object.entries(health.ready).map(([k, v]) => (
                  <li key={k} className="flex items-center justify-between rounded-sm bg-elevated px-2 py-1.5 text-xs">
                    <span className="capitalize">{k}</span>
                    <span className={cn("font-mono", v ? "text-ok" : "text-warn")}>{v ? "COMPLETE" : "NOT READY"}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-micro text-muted">
                Confirmed DTCs {health.confirmed} · Pending {health.pending}
              </p>
            </div>
          </div>
        )}
        {tab === "DTCs" && (
          <div className="space-y-3">
            {vehicle.dtcs.length === 0 ? (
              <p className="text-sm text-muted">No codes stored.</p>
            ) : (
              vehicle.dtcs.map((d) => (
                <article key={d.code + d.setSimTime} className="rounded-md bg-elevated p-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="font-mono text-sm text-fault">{d.code}</div>
                    <span className="text-micro uppercase tracking-wider text-muted">
                      {d.status} · {d.module.toUpperCase()}
                      {d.mil ? " · MIL" : ""}
                    </span>
                  </div>
                  <p className="mt-1 text-sm">{d.description}</p>
                  {d.freezeFrame ? (
                    <dl className="mt-2 grid grid-cols-3 gap-2 text-micro font-mono text-data sm:grid-cols-5">
                      <div>RPM {d.freezeFrame.rpm}</div>
                      <div>VSS {d.freezeFrame.vss}</div>
                      <div>ECT {d.freezeFrame.ect}°F</div>
                      <div>STFT {d.freezeFrame.stft}%</div>
                      <div>LTFT {d.freezeFrame.ltft}%</div>
                      <div>MAF {d.freezeFrame.maf}</div>
                      <div>MAP {d.freezeFrame.map}</div>
                      <div>IAT {d.freezeFrame.iat}°F</div>
                      <div>VPWR {d.freezeFrame.vpwr}V</div>
                      <div>LOAD {d.freezeFrame.load}%</div>
                    </dl>
                  ) : null}
                </article>
              ))
            )}
          </div>
        )}
        {tab === "Data" && (
          <div className="grid grid-cols-1 gap-1 sm:grid-cols-2">
            {pids.map((p) => {
              const v = pidValue(vehicle, p.id);
              const on = pinned.includes(p.id);
              return (
                <button
                  key={p.id}
                  onClick={() => pinPid(p.id)}
                  className={cn(
                    "flex items-center justify-between rounded-sm px-2 py-1.5 text-left text-xs",
                    on ? "bg-elevated" : "hover:bg-elevated/60",
                  )}
                >
                  <span className="text-muted">{p.label}</span>
                  <span className="font-mono tabular-nums text-data">
                    {formatPid(p.id, v)} <span className="text-subtle">{p.unit}</span>
                    {on ? " · PIN" : ""}
                  </span>
                </button>
              );
            })}
          </div>
        )}
        {tab === "Graph" && <PidGraph ids={pinned} history={history} />}
        {tab === "Utility" && (
          <div className="space-y-3">
            <p className="text-sm text-muted">Clearing codes does not repair the vehicle. Recreate the condition to see if they return.</p>
            <Button variant="primary" onClick={clearDtcs}>
              Clear DTCs
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

function PidGraph({ ids, history }: { ids: string[]; history: { t: number; [k: string]: number }[] }) {
  if (ids.length === 0 || history.length < 2) {
    return <p className="text-sm text-muted">Pin PIDs in Data, then graph them here or during a test drive.</p>;
  }
  const w = 640;
  const h = 220;
  const t0 = history[0]!.t;
  const t1 = history[history.length - 1]!.t;
  const span = Math.max(1, t1 - t0);
  const colors = ["#8ec9c0", "#c5cdd6", "#c9a36a", "#d16b6b", "#6fbf9a", "#9aa8b8"];
  return (
    <div>
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full rounded-md bg-bg" role="img">
        {[0.25, 0.5, 0.75].map((y) => (
          <line key={y} x1={0} x2={w} y1={h * y} y2={h * y} stroke="#2a2e34" strokeWidth={1} />
        ))}
        {ids.map((id, i) => {
          const vals = history.map((s) => Number(s[id] ?? 0));
          const min = Math.min(...vals);
          const max = Math.max(...vals);
          const rng = max - min || 1;
          const d = history
            .map((s, idx) => {
              const x = ((s.t - t0) / span) * w;
              const y = h - ((Number(s[id] ?? 0) - min) / rng) * (h - 8) - 4;
              return `${idx === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
            })
            .join(" ");
          return <path key={id} d={d} fill="none" stroke={colors[i % colors.length]} strokeWidth={1.5} />;
        })}
      </svg>
      <div className="mt-2 flex flex-wrap gap-3 text-micro">
        {ids.map((id, i) => (
          <span key={id} className="font-mono" style={{ color: colors[i % colors.length] }}>
            {id}
          </span>
        ))}
      </div>
    </div>
  );
}
