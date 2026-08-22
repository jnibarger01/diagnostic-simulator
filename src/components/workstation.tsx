import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Kpi, Led, Panel } from "@/components/format";
import { SimTicker } from "@/components/sim-ticker";
import { ScanTool } from "@/components/tools/scan-tool";
import { Oscilloscope } from "@/components/tools/oscilloscope";
import { Dvom } from "@/components/tools/dvom";
import {
  BenchTests,
  ConcernPanel,
  DriveTool,
  HistoryPanel,
  HypothesisTool,
  InspectTool,
  InterviewTool,
  NotesTool,
  PartsTool,
  TOOL_META,
  TreeTool,
  WiringTool,
} from "@/components/tools/bay-tools";
import { LikelihoodMark } from "@/components/dx/common";
import { engineLine, vehicleLine } from "@/lib/cases/catalog";
import { LABOR_RATE_USD, useGame } from "@/lib/store/game-store";
import { useDx } from "@/lib/store/dx-store";
import { cn, formatHours, formatMoney, formatPid } from "@/lib/utils";
import type { ToolId } from "@/lib/sim/types";

function Workspace({ tool }: { tool: ToolId }) {
  switch (tool) {
    case "concern":
      return <ConcernPanel />;
    case "interview":
      return <InterviewTool />;
    case "history":
      return <HistoryPanel />;
    case "scan":
      return <ScanTool />;
    case "dvom":
      return <Dvom />;
    case "scope":
      return <Oscilloscope />;
    case "smoke":
      return <BenchTests kind="smoke" />;
    case "fuel":
      return <BenchTests kind="fuel" />;
    case "inspect":
      return <InspectTool />;
    case "drive":
      return <DriveTool />;
    case "wiring":
      return <WiringTool />;
    case "parts":
      return <PartsTool />;
    case "hypotheses":
      return <HypothesisTool />;
    case "tree":
      return <TreeTool />;
    case "notes":
      return <NotesTool />;
    default:
      return null;
  }
}

function clock(sec: number) {
  const s = Math.floor(sec);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const r = s % 60;
  return [h, m, r].map((n) => String(n).padStart(2, "0")).join(":");
}

export function Workstation() {
  const def = useGame((s) => s.def);
  const vehicle = useGame((s) => s.vehicle);
  const tool = useGame((s) => s.tool);
  const setTool = useGame((s) => s.setTool);
  const laborHours = useGame((s) => s.laborHours);
  const partsCost = useGame((s) => s.partsCost);
  const laborCost = useGame((s) => s.laborCost);
  const setKeyPos = useGame((s) => s.setKeyPos);
  const holdStart = useGame((s) => s.holdStart);
  const offer = useGame((s) => s.replaceOffer);
  const confirmReplace = useGame((s) => s.confirmReplace);
  const cancelReplace = useGame((s) => s.cancelReplace);
  const closeRO = useGame((s) => s.closeRO);
  const surrender = useGame((s) => s.surrender);
  const scorecard = useGame((s) => s.scorecard);
  const hintOpen = useGame((s) => s.hintOpen);
  const useHint = useGame((s) => s.useHint);
  const simSpeed = useGame((s) => s.simSpeed);
  const paused = useGame((s) => s.paused);
  const dx = useDx((s) => s.sessions.find((x) => x.id === s.currentId) ?? s.sessions.find((x) => x.simCaseId === def?.id));
  const ingestLive = useDx((s) => s.ingestSimLive);
  const recordEval = useDx((s) => s.recordEval);

  if (!def || !vehicle) {
    return (
      <div className="flex min-h-dvh items-center justify-center p-6">
        <div className="text-center">
          <p className="text-muted">No repair order loaded.</p>
          <Link to="/simulator" className="mt-3 inline-block text-sm text-data underline">
            Back to simulator
          </Link>
        </div>
      </div>
    );
  }

  const spend = partsCost + laborCost;
  const over = laborHours > def.allowanceHours || spend > def.allowanceUsd;

  return (
    <div className="flex min-h-dvh flex-col bg-bg lg:h-dvh lg:overflow-hidden">
      <SimTicker />
      <header className="flex shrink-0 flex-wrap items-center justify-between gap-2 border-b border-border px-3 py-2">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <Led on={vehicle.engineRunning} fault={vehicle.mil} warn={vehicle.stalledEvent} />
            <Link to="/simulator" className="text-micro uppercase tracking-[0.18em] text-muted hover:text-fg">
              Diagnostic Decision Lab
            </Link>
            <span className="rounded-sm bg-elevated px-1.5 py-0.5 font-mono text-micro uppercase tracking-wider text-data">
              Simulator
            </span>
          </div>
          <div className="truncate font-medium">
            {vehicleLine(def)} · {engineLine(def)} · RO #{def.roNumber}
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2 font-mono text-xs tabular-nums">
          <span className="text-data">{clock(vehicle.simTime)}</span>
          <span className="text-subtle">{def.difficulty}</span>
          <span className="text-muted">{simSpeed}×</span>
          {def.difficulty === "beginner" ? (
            <Button size="sm" onClick={useHint}>
              Tech Assist
            </Button>
          ) : null}
        </div>
      </header>

      <div className="grid min-h-0 flex-1 grid-cols-1 overflow-auto lg:grid-cols-[9.5rem_minmax(0,1fr)_17rem] lg:overflow-hidden">
        <nav className="flex min-w-0 w-full flex-row flex-nowrap gap-1 overflow-x-auto overscroll-x-contain border-b border-border p-2 lg:h-full lg:w-auto lg:flex-col lg:overflow-x-hidden lg:overflow-y-auto lg:border-b-0 lg:border-r">
          {TOOL_META.map((t) => (
            <button
              key={t.id}
              onClick={() => setTool(t.id)}
              className={cn(
                "h-10 shrink-0 whitespace-nowrap rounded-sm px-2.5 text-left text-xs lg:h-9 lg:w-full lg:whitespace-normal",
                tool === t.id ? "bg-elevated text-fg" : "text-muted hover:text-fg",
              )}
            >
              {t.label}
            </button>
          ))}
        </nav>

        <div className="grid grid-cols-4 gap-2 border-b border-border px-3 py-2 lg:hidden">
          <Kpi label="RPM" value={formatPid("rpm", vehicle.rpm)} flag={vehicle.rpm === 0 && vehicle.cranking ? "fault" : "data"} />
          <Kpi label="ECT" value={Math.round(vehicle.coolantF)} unit="°F" />
          <Kpi label="Batt" value={vehicle.batteryV.toFixed(1)} unit="V" flag={vehicle.batteryV < 12.2 ? "warn" : "data"} />
          <Kpi label="CKP" value={vehicle.crankOk ? "SYNC" : "LOSS"} flag={vehicle.crankOk ? "ok" : "fault"} />
          <div className="col-span-4 flex flex-wrap gap-1">
            {(["off", "on"] as const).map((k) => (
              <Button key={`m-${k}`} size="sm" variant={vehicle.key === k ? "primary" : "secondary"} onClick={() => setKeyPos(k)}>
                {k.toUpperCase()}
              </Button>
            ))}
            <Button size="sm" variant="data" onClick={holdStart}>
              START
            </Button>
            <span className="self-center text-micro text-muted">
              {vehicle.engineRunning ? "RUNNING" : vehicle.cranking ? "CRANKING" : "STOPPED"}
            </span>
          </div>
        </div>
        <main className="min-h-[22rem] min-w-0 overflow-hidden border-b border-border lg:border-b-0 lg:border-r">
          <div className="flex h-full min-h-0 flex-col">
            <div className="border-b border-border px-3 py-1.5 text-micro uppercase tracking-[0.14em] text-subtle">
              {TOOL_META.find((t) => t.id === tool)?.label} workspace
            </div>
            <div className="min-h-0 flex-1 overflow-auto p-3">
              {hintOpen && def.hints.length ? (
                <div className="mb-3 rounded-md bg-elevated p-3 text-sm text-warn">
                  {def.hints[Math.min(def.hints.length - 1, 0)]}
                  {def.hints.slice(1).map((h) => (
                    <p key={h} className="mt-1">
                      {h}
                    </p>
                  ))}
                </div>
              ) : null}
              <Workspace tool={tool} />
            </div>
          </div>
        </main>

        <aside className="hidden min-h-0 grid-rows-[auto_auto_1fr] gap-0 overflow-y-auto lg:grid">
          <Panel title="Live vehicle" className="rounded-none shadow-none">
            <div className="grid grid-cols-3 gap-3">
              <Kpi label="RPM" value={formatPid("rpm", vehicle.rpm)} flag={vehicle.rpm === 0 && vehicle.cranking ? "fault" : "data"} />
              <Kpi label="ECT" value={Math.round(vehicle.coolantF)} unit="°F" />
              <Kpi label="Batt" value={vehicle.batteryV.toFixed(1)} unit="V" flag={vehicle.batteryV < 12.2 ? "warn" : "data"} />
              <Kpi label="STFT" value={`${vehicle.stft >= 0 ? "+" : ""}${vehicle.stft.toFixed(1)}`} unit="%" flag={vehicle.stft > 15 ? "warn" : "data"} />
              <Kpi label="LTFT" value={`${vehicle.ltft >= 0 ? "+" : ""}${vehicle.ltft.toFixed(1)}`} unit="%" flag={vehicle.ltft > 15 ? "warn" : "data"} />
              <Kpi label="MAF" value={vehicle.maf.toFixed(1)} unit="g/s" />
              <Kpi label="VSS" value={Math.round(vehicle.vss)} unit="mph" />
              <Kpi label="Load" value={Math.round(vehicle.load)} unit="%" />
              <Kpi label="CKP" value={vehicle.crankOk ? "SYNC" : "LOSS"} flag={vehicle.crankOk ? "ok" : "fault"} />
            </div>
            <div className="mt-3 flex flex-wrap gap-1">
              {(["off", "on"] as const).map((k) => (
                <Button key={k} size="sm" variant={vehicle.key === k ? "primary" : "secondary"} onClick={() => setKeyPos(k)}>
                  {k.toUpperCase()}
                </Button>
              ))}
              <Button size="sm" variant="data" onClick={holdStart}>
                START
              </Button>
              <Button
                size="sm"
                onClick={() => {
                  ingestLive(vehicle);
                  recordEval(def, "live");
                }}
              >
                Feed PIDs
              </Button>
            </div>
            <div className="mt-2 flex items-center gap-2 text-micro text-muted">
              <Led on={vehicle.engineRunning} fault={!vehicle.engineRunning && vehicle.stalledEvent} />
              {vehicle.engineRunning ? "RUNNING" : vehicle.cranking ? "CRANKING" : "STOPPED"}
              {vehicle.mil ? <span className="text-fault">MIL</span> : null}
            </div>
          </Panel>
          <Panel title="Customer concern" className="rounded-none shadow-none">
            <p className="text-sm leading-relaxed">{def.concern}</p>
            <p className="mt-2 text-micro text-subtle">
              Weather {def.ambientF}°F · Fuel {Math.round(def.fuelLevel * 8)}/8
            </p>
          </Panel>
          <Panel title="Engine differential" className="rounded-none shadow-none">
            {!dx?.hypotheses.length ? (
              <p className="text-xs text-muted">The reasoning engine only sees evidence you collect. Scan, interview, and measure — it does not know the hidden fault.</p>
            ) : (
              <ol className="space-y-1 text-xs">
                {dx.hypotheses.slice(0, 5).map((h, i) => (
                  <li key={h.id} className="flex justify-between gap-2">
                    <span className="truncate">
                      {i + 1}. {h.component}
                    </span>
                    <LikelihoodMark value={h.likelihood} />
                  </li>
                ))}
              </ol>
            )}
            {dx?.nextAction ? <p className="mt-2 text-micro text-data">{dx.nextAction.title}</p> : null}
            {dx ? (
              <Link to="/session/$id" params={{ id: dx.id }} className="mt-2 inline-block text-micro text-muted underline">
                Open full session
              </Link>
            ) : null}
          </Panel>
        </aside>
      </div>

      <footer className="flex shrink-0 flex-wrap items-center justify-between gap-2 border-t border-border px-3 py-2 text-xs">
        <div className="flex flex-wrap gap-4 font-mono tabular-nums">
          <span>
            TIME <span className={over ? "text-warn" : "text-data"}>{formatHours(laborHours)}</span>
            <span className="text-subtle"> / {def.allowanceHours.toFixed(1)} hr</span>
          </span>
          <span>
            SPEND <span className={over ? "text-warn" : "text-data"}>{formatMoney(spend)}</span>
            <span className="text-subtle"> / {formatMoney(def.allowanceUsd)}</span>
          </span>
          <span className="text-muted">
            Parts {formatMoney(partsCost)} · Labor {formatMoney(laborCost)} @{LABOR_RATE_USD}
          </span>
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="ghost" onClick={surrender}>
            Surrender
          </Button>
          <Button size="sm" variant="primary" onClick={closeRO}>
            Close RO
          </Button>
        </div>
      </footer>

      {offer ? (
        <div className="fixed inset-0 z-40 flex items-end justify-center bg-bg/70 p-4 sm:items-center">
          <div className="w-full max-w-md rounded-xl bg-surface p-4 shadow-[var(--shadow-border)]">
            <h3 className="text-base font-medium">Replace {offer.name}</h3>
            <p className="mt-1 text-sm text-muted">
              Part {formatMoney(offer.cost)} · Labor {offer.labor.toFixed(1)} hr
            </p>
            <p className="mt-2 text-xs uppercase tracking-wider text-subtle">Evidence supporting repair: {offer.evidence}</p>
            {offer.warning ? <p className="mt-2 text-sm text-warn">{offer.warning}</p> : null}
            <p className="mt-2 text-xs text-muted">You can proceed anyway. If this is not the cause, the vehicle stays broken.</p>
            <div className="mt-4 flex justify-end gap-2">
              <Button onClick={cancelReplace}>Cancel</Button>
              <Button variant="primary" onClick={confirmReplace}>
                Install anyway
              </Button>
            </div>
          </div>
        </div>
      ) : null}

      {scorecard ? <ScoreOverlay /> : null}
      {paused && !scorecard ? <div className="pointer-events-none hidden" /> : null}
    </div>
  );
}

function ScoreOverlay() {
  const score = useGame((s) => s.scorecard)!;
  const def = useGame((s) => s.def)!;
  const surrendered = useGame((s) => s.surrendered);
  const evals = useDx((s) => s.evals);
  const lastEval = evals.find((e) => e.caseId === def.id);
  const rows = [
    ["Root cause", score.rootCause],
    ["Evidence quality", score.evidence],
    ["Test efficiency", score.efficiency],
    ["Diagnostic time", score.time],
    ["Repair verification", score.verification],
  ] as const;
  return (
    <div className="fixed inset-0 z-50 overflow-auto bg-bg/80 p-4">
      <div className="mx-auto max-w-lg rounded-xl bg-surface p-5 shadow-[var(--shadow-border)]">
        <div className="text-micro uppercase tracking-[0.18em] text-muted">Diagnostic score</div>
        <div className="mt-1 font-mono text-5xl tabular-nums text-data">{score.total}</div>
        <div className="text-sm text-muted">/ 100 {surrendered ? "· surrendered" : ""}</div>
        <ul className="mt-4 space-y-1 text-sm">
          {rows.map(([k, v]) => (
            <li key={k} className="flex justify-between font-mono tabular-nums">
              <span className="font-sans text-muted">{k}</span>
              <span>
                {v.got}/{v.max}
              </span>
            </li>
          ))}
        </ul>
        {lastEval ? (
          <p className="mt-3 text-xs text-data">
            Engine: true-cause rank {lastEval.initialRank ?? "—"} → {lastEval.finalRank ?? "—"}
            {lastEval.reachedVeryHigh ? " · reached Very High" : ""} · {lastEval.steps} steps
          </p>
        ) : null}
        {score.unnecessaryTests.length ? (
          <p className="mt-3 text-xs text-warn">Unnecessary tests: {score.unnecessaryTests.join("; ")}</p>
        ) : null}
        {score.unnecessaryParts.length ? (
          <p className="mt-1 text-xs text-fault">Unnecessary parts: {score.unnecessaryParts.join("; ")}</p>
        ) : (
          <p className="mt-3 text-xs text-ok">Unnecessary parts: none</p>
        )}
        <p className="mt-3 text-sm">
          <span className="text-subtle">Root cause. </span>
          {score.rootCauseText}
        </p>
        <p className="mt-2 text-sm">
          <span className="text-subtle">Best evidence. </span>
          {score.bestEvidence}
        </p>
        <p className="mt-2 font-mono text-xs text-muted">
          Time {score.diagnosticHours.toFixed(1)} hr · Expert path {score.expertHours.toFixed(1)} hr · {vehicleLine(def)}
        </p>
        {score.notes.map((n) => (
          <p key={n} className="mt-1 text-xs text-subtle">
            {n}
          </p>
        ))}
        <Link
          to="/simulator"
          className="mt-5 inline-flex h-10 items-center rounded-md bg-accent px-4 text-sm font-medium text-accent-fg"
        >
          Return to simulator
        </Link>
      </div>
    </div>
  );
}
