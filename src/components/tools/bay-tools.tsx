import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Led } from "@/components/format";
import { INSPECTION_AREAS } from "@/lib/sim/measurements";
import type { DriveMode, HypothesisStatus, ToolId } from "@/lib/sim/types";
import { useGame } from "@/lib/store/game-store";
import { cn } from "@/lib/utils";

const DRIVES: { id: DriveMode; label: string; note: string }[] = [
  { id: "idle", label: "Idle", note: "Park, fully warm or cold idle" },
  { id: "city", label: "City", note: "20–35 mph, light load" },
  { id: "highway", label: "Highway", note: "Cruise, heat the engine" },
  { id: "accel", label: "WOT / accel", note: "Load the fuel and ignition" },
  { id: "decel", label: "Decel", note: "Closed throttle, DFCO" },
  { id: "stop_go", label: "Stop-and-go", note: "Vibration, idle-to-off-idle" },
  { id: "hill", label: "Hill / load", note: "High load, high temp" },
  { id: "hot_soak", label: "Hot soak", note: "Key off after a heat run" },
];

export function DriveTool() {
  const vehicle = useGame((s) => s.vehicle)!;
  const setDriveMode = useGame((s) => s.setDriveMode);
  const overnight = useGame((s) => s.overnight);
  return (
    <div className="grid gap-2 sm:grid-cols-2">
      {DRIVES.map((d) => (
        <button
          key={d.id}
          onClick={() => setDriveMode(d.id)}
          className={cn(
            "rounded-md px-3 py-3 text-left transition-colors duration-150",
            vehicle.mode === d.id ? "bg-elevated shadow-[var(--shadow-border)]" : "bg-surface hover:bg-elevated",
          )}
        >
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">{d.label}</span>
            {vehicle.mode === d.id ? <Led on /> : <Led />}
          </div>
          <p className="mt-1 text-micro text-muted">{d.note}</p>
        </button>
      ))}
      <button onClick={overnight} className="rounded-md bg-surface px-3 py-3 text-left hover:bg-elevated sm:col-span-2">
        <div className="text-sm font-medium">Park overnight (12 h key-off)</div>
        <p className="mt-1 text-micro text-muted">Advances parasitic draw and battery SOC. Use on no-crank-after-sit complaints.</p>
      </button>
    </div>
  );
}

export function InspectTool() {
  const inspect = useGame((s) => s.inspect);
  const doWiggle = useGame((s) => s.doWiggle);
  const results = useGame((s) => s.testResults.filter((t) => t.id.startsWith("inspect") || t.id === "wiggle"));
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <div className="grid grid-cols-2 gap-2">
        {INSPECTION_AREAS.map((a) => (
          <Button key={a.id} size="sm" className="h-auto min-h-11 whitespace-normal py-2 text-left" onClick={() => inspect(a.id)}>
            {a.label}
          </Button>
        ))}
        <Button variant="data" className="col-span-2" onClick={() => { doWiggle(); inspect("harness", true); }}>
          Wiggle test (loaded harness)
        </Button>
      </div>
      <div className="space-y-2">
        {results.length === 0 ? <p className="text-sm text-muted">Pick an area. Some faults only show in the right place.</p> : null}
        {results.slice(0, 6).map((r) => (
          <article key={r.id + r.title} className="rounded-md bg-elevated p-3">
            <div className="text-xs font-medium">{r.title}</div>
            <p className="mt-1 text-sm text-muted">{r.narrative}</p>
            <ul className="mt-2 space-y-1">
              {r.lines.map((l) => (
                <li key={l.k} className="flex justify-between gap-2 text-micro">
                  <span className="text-subtle">{l.k}</span>
                  <span className={l.flag === "fault" ? "text-fault" : l.flag === "warn" ? "text-warn" : "text-data"}>{l.v}</span>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </div>
  );
}

export function BenchTests({ kind }: { kind: "smoke" | "fuel" | "electrical" }) {
  const runTest = useGame((s) => s.runTest);
  const results = useGame((s) => s.testResults);
  const show = results.filter((r) =>
    kind === "electrical" ? r.id === "parasitic" || r.id === "charging" : r.id === kind,
  );
  return (
    <div className="space-y-3">
      {kind === "smoke" && (
        <Button variant="primary" onClick={() => runTest("smoke")}>
          Run smoke test
        </Button>
      )}
      {kind === "fuel" && (
        <Button variant="primary" onClick={() => runTest("fuel")}>
          Gauge fuel pressure
        </Button>
      )}
      {kind === "electrical" && (
        <div className="flex flex-wrap gap-2">
          <Button variant="primary" onClick={() => runTest("parasitic")}>
            Parasitic draw
          </Button>
          <Button onClick={() => runTest("charging")}>Charging system</Button>
        </div>
      )}
      {show.map((r) => (
        <article key={r.id} className="rounded-md bg-elevated p-3">
          <div className="text-sm font-medium">{r.title}</div>
          <p className="mt-1 text-sm text-muted">{r.narrative}</p>
          <dl className="mt-2 space-y-1">
            {r.lines.map((l) => (
              <div key={l.k} className="flex justify-between gap-2 text-xs">
                <dt className="text-subtle">{l.k}</dt>
                <dd className={l.flag === "fault" ? "text-fault font-mono" : "font-mono text-data"}>{l.v}</dd>
              </div>
            ))}
          </dl>
        </article>
      ))}
    </div>
  );
}

export function WiringTool() {
  const def = useGame((s) => s.def)!;
  const setDvom = useGame((s) => s.setDvom);
  const setScope = useGame((s) => s.setScope);
  const setTool = useGame((s) => s.setTool);
  const [sel, setSel] = useState<string | null>(null);
  const d = def.wiring;
  const node = (id: string) => d.nodes.find((n) => n.id === id);
  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="mb-2 text-micro uppercase tracking-wider text-subtle">{d.title} — click a node to probe</div>
      <svg viewBox="0 0 100 100" className="min-h-56 w-full flex-1 rounded-md bg-bg">
        {d.wires.map((w, i) => {
          const a = node(w.from);
          const b = node(w.to);
          if (!a || !b) return null;
          const col: Record<string, string> = {
            blk: "#8b929a",
            wht: "#e6e8ea",
            red: "#d16b6b",
            grn: "#6fbf9a",
            yel: "#c9a36a",
            blu: "#8ec9c0",
            brn: "#a07858",
            org: "#d4a06a",
            ppl: "#a8a0b8",
            gry: "#6b7280",
          };
          return (
            <line
              key={i}
              x1={a.x}
              y1={a.y}
              x2={b.x}
              y2={b.y}
              stroke={col[w.color] ?? "#8b929a"}
              strokeWidth={0.7}
            />
          );
        })}
        {d.nodes.map((n) => (
          <g key={n.id} onClick={() => setSel(n.id)} className="cursor-pointer">
            <circle cx={n.x} cy={n.y} r={2.4} fill={sel === n.id ? "#8ec9c0" : "#171a1e"} stroke="#c5cdd6" strokeWidth={0.4} />
            <text x={n.x + 3} y={n.y + 1} fontSize={2.6} fill="#8b929a">
              {n.label}
            </text>
          </g>
        ))}
      </svg>
      {sel ? (
        <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
          <span className="text-muted">{d.nodes.find((n) => n.id === sel)?.label}</span>
          <Button
            size="sm"
            onClick={() => {
              setDvom({ red: sel });
              setTool("dvom");
            }}
          >
            Probe with DVOM
          </Button>
          <Button
            size="sm"
            onClick={() => {
              setScope({ ch1: sel });
              setTool("scope");
            }}
          >
            Scope this node
          </Button>
        </div>
      ) : (
        <p className="mt-2 text-micro text-muted">The full circuit is not auto-highlighted. You choose the points.</p>
      )}
    </div>
  );
}

export function PartsTool() {
  const def = useGame((s) => s.def)!;
  const offerReplace = useGame((s) => s.offerReplace);
  const replaced = useGame((s) => s.partsReplaced);
  return (
    <div className="space-y-2">
      <p className="text-sm text-muted">
        You may replace anything. Wrong parts stay on the ticket and the vehicle stays broken. Evidence is scored.
      </p>
      {def.components.map((c) => {
        const done = replaced.some((r) => r.id === c.id);
        return (
          <div key={c.id} className="flex items-center justify-between gap-3 rounded-md bg-elevated px-3 py-2">
            <div>
              <div className="text-sm">{c.name}</div>
              <div className="text-micro text-muted">
                ${c.partCost} · {c.laborHours.toFixed(1)} hr · {c.group}
              </div>
            </div>
            <Button size="sm" variant={done ? "ghost" : "primary"} disabled={done} onClick={() => offerReplace(c.id)}>
              {done ? "Installed" : "Replace"}
            </Button>
          </div>
        );
      })}
    </div>
  );
}

export function InterviewTool() {
  const def = useGame((s) => s.def)!;
  const log = useGame((s) => s.interviewLog);
  const ask = useGame((s) => s.askCustomer);
  const [q, setQ] = useState("");
  const canned = ["When did this start?", "Does it happen hot or cold?", "Any warning lights?", "Any recent repairs?", "Does restarting fix it?", "Does it happen after refueling?"];
  return (
    <div className="flex h-full min-h-0 flex-col">
      <p className="text-sm text-muted">{def.interview.greeting}</p>
      <div className="mt-3 min-h-0 flex-1 space-y-2 overflow-auto">
        {log.map((t, i) => (
          <div key={i}>
            <div className="text-xs text-subtle">You</div>
            <div className="text-sm">{t.q}</div>
            <div className="mt-1 text-xs text-subtle">Customer</div>
            <div className="text-sm text-data">{t.a}</div>
          </div>
        ))}
      </div>
      <div className="mt-3 flex flex-wrap gap-1">
        {canned.map((c) => (
          <button key={c} onClick={() => ask(c)} className="rounded-sm bg-elevated px-2 py-1 text-micro text-muted hover:text-fg">
            {c}
          </button>
        ))}
      </div>
      <form
        className="mt-2 flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          ask(q);
          setQ("");
        }}
      >
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Ask in plain language"
          className="h-10 min-w-0 flex-1 rounded-md border border-border bg-elevated px-3 text-sm"
        />
        <Button type="submit" variant="primary">
          Ask
        </Button>
      </form>
    </div>
  );
}

const STATUSES: HypothesisStatus[] = ["possible", "likely", "unlikely", "ruled_out", "confirmed"];

export function HypothesisTool() {
  const list = useGame((s) => s.hypotheses);
  const add = useGame((s) => s.addHypothesis);
  const setHypothesis = useGame((s) => s.setHypothesis);
  const addEvidence = useGame((s) => s.addEvidence);
  const [text, setText] = useState("");
  const [ev, setEv] = useState<Record<string, string>>({});
  return (
    <div className="space-y-3">
      <form
        className="flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          add(text);
          setText("");
        }}
      >
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="e.g. CKP failing hot"
          className="h-10 min-w-0 flex-1 rounded-md border border-border bg-elevated px-3 text-sm"
        />
        <Button type="submit" variant="primary">
          Add
        </Button>
      </form>
      {list.length === 0 ? <p className="text-sm text-muted">Name what you think is wrong. Attach evidence. Guessing without tests will show on the scorecard.</p> : null}
      {list.map((h) => (
        <article key={h.id} className="rounded-md bg-elevated p-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="text-sm font-medium">{h.text}</div>
            <select
              value={h.status}
              onChange={(e) => setHypothesis(h.id, e.target.value as HypothesisStatus)}
              className="rounded-sm border border-border bg-surface px-2 py-1 text-micro"
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s.replace("_", " ")}
                </option>
              ))}
            </select>
          </div>
          <ul className="mt-2 space-y-1 text-xs">
            {h.evidence.plus.map((e, i) => (
              <li key={i} className="text-ok">
                + {e}
              </li>
            ))}
            {h.evidence.minus.map((e, i) => (
              <li key={i} className="text-fault">
                − {e}
              </li>
            ))}
          </ul>
          <div className="mt-2 flex gap-2">
            <input
              value={ev[h.id] ?? ""}
              onChange={(e) => setEv({ ...ev, [h.id]: e.target.value })}
              placeholder="Evidence note"
              className="h-8 min-w-0 flex-1 rounded-sm border border-border bg-surface px-2 text-xs"
            />
            <Button
              size="sm"
              onClick={() => {
                addEvidence(h.id, "plus", ev[h.id] ?? "");
                setEv({ ...ev, [h.id]: "" });
              }}
            >
              +
            </Button>
            <Button
              size="sm"
              onClick={() => {
                addEvidence(h.id, "minus", ev[h.id] ?? "");
                setEv({ ...ev, [h.id]: "" });
              }}
            >
              −
            </Button>
          </div>
        </article>
      ))}
    </div>
  );
}

export function TreeTool() {
  const log = useGame((s) => s.log);
  const vehicle = useGame((s) => s.vehicle)!;
  const def = useGame((s) => s.def)!;
  const tested = (id: string) => log.some((l) => (l.testId ?? l.kind).includes(id) || l.kind === id);
  const mark = (id: string, ok?: boolean) => {
    if (ok) return "✓";
    if (tested(id)) return vehicle.faultCleared ? "✓" : "?";
    return "·";
  };
  const branches = [
    { name: "Fuel", items: ["fuel", "purge"] },
    { name: "Ignition", items: ["scope"] },
    { name: "Engine position", items: ["ckp", "scope", "dvom"] },
    { name: "Air", items: ["smoke", "vacuum"] },
    { name: "Electrical / network", items: ["parasitic", "charging", "can"] },
  ];
  return (
    <div className="font-mono text-xs leading-relaxed text-muted">
      <div className="text-fg">{def.concern.slice(0, 48).toUpperCase()}</div>
      {branches.map((b) => (
        <div key={b.name} className="mt-2">
          ├── {b.name}
          {b.items.map((it, i) => (
            <div key={it} className="pl-6">
              {i === b.items.length - 1 ? "└──" : "├──"} {it} {mark(it)}
            </div>
          ))}
        </div>
      ))}
      <p className="mt-3 font-sans text-micro text-subtle">The tree records your path. It does not reveal the correct one.</p>
    </div>
  );
}

export function NotesTool() {
  const notes = useGame((s) => s.notes);
  const setNotes = useGame((s) => s.setNotes);
  return (
    <textarea
      value={notes}
      onChange={(e) => setNotes(e.target.value)}
      className="h-full min-h-48 w-full rounded-md border border-border bg-elevated p-3 text-sm"
      placeholder="Tech notes — timestamps, known-good comparisons, things you still need to prove."
    />
  );
}

export function ConcernPanel() {
  const def = useGame((s) => s.def)!;
  return (
    <div className="space-y-3">
      <p className="text-base leading-relaxed">{def.concern}</p>
      <p className="text-sm text-muted">{def.concernDetail}</p>
      <dl className="grid grid-cols-2 gap-2 text-xs">
        <div>
          <dt className="text-subtle">Ambient</dt>
          <dd className="font-mono text-data">{def.ambientF}°F</dd>
        </div>
        <div>
          <dt className="text-subtle">Fuel</dt>
          <dd className="font-mono text-data">{Math.round(def.fuelLevel * 8)}/8</dd>
        </div>
        <div>
          <dt className="text-subtle">VIN</dt>
          <dd className="font-mono text-data">{def.vehicle.vin}</dd>
        </div>
        <div>
          <dt className="text-subtle">Allowance</dt>
          <dd className="font-mono text-data">
            {def.allowanceHours.toFixed(1)} hr / ${def.allowanceUsd}
          </dd>
        </div>
      </dl>
      {def.difficulty === "beginner" ? (
        <p className="text-micro text-warn">Beginner mode — Tech Assist is available in the header. Using it costs score.</p>
      ) : (
        <p className="text-micro text-subtle">No procedure will tell you the next button. The vehicle will.</p>
      )}
    </div>
  );
}

export function HistoryPanel() {
  const def = useGame((s) => s.def)!;
  return (
    <ul className="space-y-2">
      {def.serviceHistory.map((h, i) => (
        <li key={i} className="rounded-md bg-elevated p-3">
          <div className="flex justify-between text-micro text-muted">
            <span>{h.date}</span>
            <span className="font-mono">{h.mileage.toLocaleString()} mi</span>
          </div>
          <div className="mt-1 text-sm">{h.work}</div>
          <div className="text-micro text-subtle">{h.shop}</div>
        </li>
      ))}
    </ul>
  );
}

export const TOOL_META: { id: ToolId; label: string }[] = [
  { id: "concern", label: "RO" },
  { id: "interview", label: "Interview" },
  { id: "history", label: "History" },
  { id: "scan", label: "Scan" },
  { id: "dvom", label: "DVOM" },
  { id: "scope", label: "Scope" },
  { id: "smoke", label: "Smoke" },
  { id: "fuel", label: "Fuel" },
  { id: "inspect", label: "Inspect" },
  { id: "drive", label: "Drive" },
  { id: "wiring", label: "Wiring" },
  { id: "parts", label: "Parts" },
  { id: "hypotheses", label: "Hypotheses" },
  { id: "tree", label: "Tree" },
  { id: "notes", label: "Notes" },
];
