import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { LikelihoodMark, vehicleSub, vehicleTitle } from "@/components/dx/common";
import { Shell } from "@/components/shell";
import { Panel } from "@/components/format";
import { Button } from "@/components/ui/button";
import { Field, Input, Textarea } from "@/components/ui/input";
import { DTC_KB, QUESTIONS, TESTS } from "@/lib/dx/knowledge";
import { LIKELIHOOD_LABEL, type DiagnosticSession, type Hypothesis } from "@/lib/dx/types";
import { nextTabIndex } from "@/lib/dx/tabs";
import { useDx } from "@/lib/store/dx-store";
import { cn } from "@/lib/utils";

const TABS = [
  "Overview",
  "Differential",
  "Evidence",
  "Questions",
  "Tests",
  "DTCs",
  "Live data",
  "Notes",
  "Verification",
] as const;
type Tab = (typeof TABS)[number];

export function DxWorkspace({ id }: { id: string }) {
  const hydrate = useDx((s) => s.hydrate);
  const sessions = useDx((s) => s.sessions);
  const open = useDx((s) => s.open);
  const exportBundle = useDx((s) => s.exportBundle);
  const importBundle = useDx((s) => s.importBundle);
  const session = sessions.find((s) => s.id === id);
  const [tab, setTab] = useState<Tab>("Overview");
  const [transferError, setTransferError] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    hydrate();
    open(id);
    setReady(true);
  }, [hydrate, open, id]);

  if (!ready) {
    return (
      <Shell>
        <div className="p-6 text-sm text-muted">Loading session…</div>
      </Shell>
    );
  }

  if (!session) {
    return (
      <Shell>
        <div className="p-6 text-center">
          <p className="text-muted">Session not found.</p>
          <Link to="/" className="mt-3 inline-block text-sm text-data">
            New diagnosis
          </Link>
        </div>
      </Shell>
    );
  }

  return (
    <Shell
      badge={session.mode === "simulator" ? "Simulator" : "Real diagnosis"}
      title={`${vehicleTitle(session.vehicle)}`}
      sub={vehicleSub(session.vehicle)}
    >
      {session.safetyFlags.length ? (
        <div className="border-b border-border bg-elevated px-4 py-2 text-sm text-warn">
          {session.safetyFlags.join(" ")}
        </div>
      ) : null}
      {session.lastMovement.length ? <MovementBanner session={session} /> : null}
      <SessionTransfer
        exportBundle={exportBundle}
        importBundle={importBundle}
        error={transferError}
        onError={setTransferError}
      />
      <nav className="flex gap-1 overflow-x-auto border-b border-border px-2 py-1" role="tablist" aria-label="Diagnostic workspace sections">
        {TABS.map((t, index) => (
          <button
            key={t}
            id={`dx-tab-${index}`}
            role="tab"
            type="button"
            aria-selected={tab === t}
            aria-controls="dx-tabpanel"
            tabIndex={tab === t ? 0 : -1}
            onClick={() => setTab(t)}
            onKeyDown={(event) => {
              const next = nextTabIndex(index, event.key, TABS.length);
              if (next === null) return;
              event.preventDefault();
              setTab(TABS[next]);
              document.getElementById(`dx-tab-${next}`)?.focus();
            }}
            className={cn(
              "h-10 shrink-0 rounded-sm px-3 text-xs",
              tab === t ? "bg-elevated text-fg" : "text-muted hover:text-fg",
            )}
          >
            {t}
          </button>
        ))}
      </nav>
      <div id="dx-tabpanel" role="tabpanel" aria-labelledby={`dx-tab-${TABS.indexOf(tab)}`} tabIndex={0} className="min-h-0 flex-1 overflow-auto p-3 sm:p-4">
        {tab === "Overview" ? <Overview session={session} go={setTab} /> : null}
        {tab === "Differential" ? <DiffPanel session={session} /> : null}
        {tab === "Evidence" ? <EvidencePanel session={session} /> : null}
        {tab === "Questions" ? <QuestionPanel session={session} /> : null}
        {tab === "Tests" ? <TestPanel session={session} /> : null}
        {tab === "DTCs" ? <DtcPanel session={session} /> : null}
        {tab === "Live data" ? <PidPanel session={session} /> : null}
        {tab === "Notes" ? <NotesPanel session={session} /> : null}
        {tab === "Verification" ? <VerifyPanel session={session} /> : null}
      </div>
    </Shell>
  );
}

function SessionTransfer({
  exportBundle,
  importBundle,
  error,
  onError,
}: {
  exportBundle: () => string;
  importBundle: (raw: string) => number;
  error: string | null;
  onError: (message: string | null) => void;
}) {
  const download = () => {
    const url = URL.createObjectURL(new Blob([exportBundle()], { type: "application/json" }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "diagnostic-sessions.json";
    anchor.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-wrap items-center gap-2 border-b border-border bg-surface px-3 py-2">
      <span className="text-micro text-muted">Local-only session file</span>
      <Button size="sm" variant="secondary" onClick={download}>Export sessions</Button>
      <label className="inline-flex h-9 cursor-pointer items-center rounded-md bg-elevated px-3 text-xs text-fg ring-1 ring-border hover:bg-surface">
        Import sessions
        <input
          className="sr-only"
          type="file"
          accept="application/json,.json"
          onChange={async (event) => {
            const file = event.target.files?.[0];
            event.target.value = "";
            if (!file) return;
            try {
              const count = importBundle(await file.text());
              onError(count ? null : "The bundle contained no sessions.");
            } catch (cause) {
              onError(cause instanceof Error ? cause.message : "Unable to import diagnostic sessions.");
            }
          }}
        />
      </label>
      <span className="text-micro text-subtle">JSON bundles stay on this device unless you choose to share them.</span>
      {error ? <span role="alert" className="text-micro text-fault">{error}</span> : null}
    </div>
  );
}

function MovementBanner({ session }: { session: DiagnosticSession }) {
  return (
    <div className="border-b border-border bg-surface px-4 py-2">
      <div className="text-micro uppercase tracking-[0.14em] text-muted">Differential updated</div>
      <ul className="mt-1 space-y-1 text-sm">
        {session.lastMovement.slice(0, 4).map((m) => (
          <li key={m.id}>
            <span className="font-medium">{m.label}</span>{" "}
            <span className="text-subtle">
              {LIKELIHOOD_LABEL[m.from]} → {LIKELIHOOD_LABEL[m.to]}
            </span>
            <span className="block text-micro text-muted">{m.reason}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Overview({ session, go }: { session: DiagnosticSession; go: (t: Tab) => void }) {
  return (
    <div className="grid gap-3 lg:grid-cols-2">
      <Panel title="Concern">
        <p className="text-sm leading-relaxed">{session.concern}</p>
        {session.symptoms.length ? (
          <p className="mt-2 text-micro text-subtle">Symptoms: {session.symptoms.join(" · ")}</p>
        ) : null}
        {session.operatingConditions.length ? (
          <p className="mt-1 text-micro text-subtle">Conditions: {session.operatingConditions.join(" · ")}</p>
        ) : null}
        {session.recentRepairs ? <p className="mt-2 text-xs text-warn">Recent repairs: {session.recentRepairs}</p> : null}
      </Panel>
      <Panel
        title="Current differential"
        right={
          <button className="text-micro text-data" onClick={() => go("Differential")}>
            Full
          </button>
        }
      >
        <DiffList session={session} compact />
      </Panel>
      <Panel title="Next best action">
        <NextBlock session={session} />
      </Panel>
      <Panel
        title="Evidence"
        right={
          <button className="text-micro text-data" onClick={() => go("Evidence")}>
            Ledger
          </button>
        }
      >
        <ul className="space-y-1 text-sm">
          {session.evidence.slice(-8).reverse().map((e) => (
            <li key={e.id} className="flex gap-2">
              <span className="text-data">+</span>
              <span className="text-muted">{e.observation}</span>
            </li>
          ))}
        </ul>
      </Panel>
      <Panel title="Reasoning tree">
        <Tree session={session} />
      </Panel>
      <Panel title="Data entry">
        <QuickEntry />
        <div className="mt-3 flex flex-wrap gap-2">
          <Button size="sm" onClick={() => go("Questions")}>
            Questions
          </Button>
          <Button size="sm" onClick={() => go("Tests")}>
            Enter test
          </Button>
          <Button size="sm" onClick={() => go("DTCs")}>
            DTCs
          </Button>
          <Button size="sm" onClick={() => go("Live data")}>
            PIDs
          </Button>
        </div>
      </Panel>
    </div>
  );
}

function DiffList({ session, compact }: { session: DiagnosticSession; compact?: boolean }) {
  return (
    <ol className="space-y-2">
      {session.hypotheses.slice(0, compact ? 5 : 10).map((h, i) => (
        <li key={h.id} className="rounded-md bg-elevated px-3 py-2">
          <div className="flex items-start justify-between gap-2">
            <div>
              <span className="mr-2 font-mono text-micro text-subtle">{i + 1}</span>
              <span className="text-sm font-medium">{h.component}</span>
              <div className="text-micro text-muted">{h.failureMode}</div>
            </div>
            <LikelihoodMark value={h.likelihood} />
          </div>
          {!compact ? <HypDetail h={h} /> : null}
        </li>
      ))}
    </ol>
  );
}

function HypDetail({ h }: { h: Hypothesis }) {
  return (
    <dl className="mt-2 grid gap-1 text-micro sm:grid-cols-2">
      <div>
        <dt className="text-subtle">Evidence confidence</dt>
        <dd className="uppercase text-muted">{h.evidenceConfidence}</dd>
      </div>
      <div>
        <dt className="text-subtle">Status</dt>
        <dd className="uppercase text-muted">{h.status.replace("_", " ")}</dd>
      </div>
      <Row k="Supporting" items={h.supporting} pos />
      <Row k="Contradicting" items={h.contradicting} />
      <Row k="Missing" items={h.missing} />
      <Row k="More likely when" items={h.moreLikelyWhen} />
      <Row k="Less likely when" items={h.lessLikelyWhen} />
      <div className="sm:col-span-2">
        <dt className="text-subtle">Confirmation criteria</dt>
        <dd className="space-y-1">
          {h.criteria.confirmation.map((c) => (
            <div key={c.id} className={c.satisfied ? "text-ok" : "text-muted"}>
              {c.satisfied ? "✓" : "○"} {c.description}{c.satisfied ? ` · ${c.evidenceIds.length} evidence item${c.evidenceIds.length === 1 ? "" : "s"}` : " · missing"}
            </div>
          ))}
        </dd>
      </div>
      <div className="sm:col-span-2">
        <dt className="text-subtle">Refutation criteria</dt>
        <dd className="space-y-1">
          {h.criteria.refutation.map((c) => (
            <div key={c.id} className={c.satisfied ? "text-warn" : "text-muted"}>
              {c.satisfied ? "!" : "○"} {c.description}{c.satisfied ? " · ruled out" : " · not observed"}
            </div>
          ))}
        </dd>
      </div>
      <div className="sm:col-span-2">
        <dt className="text-subtle">Confirm</dt>
        <dd>{h.confirmTest}</dd>
      </div>
      <div className="sm:col-span-2">
        <dt className="text-subtle">Refute</dt>
        <dd>{h.refuteTest}</dd>
      </div>
      {h.safety ? <p className="sm:col-span-2 text-warn">{h.safety}</p> : null}
    </dl>
  );
}

function Row({ k, items, pos }: { k: string; items: string[]; pos?: boolean }) {
  if (!items.length) return null;
  return (
    <div className="sm:col-span-2">
      <dt className="text-subtle">{k}</dt>
      <dd>
        {items.map((x) => (
          <div key={x} className={pos ? "text-ok" : "text-muted"}>
            {pos ? "+ " : "– "}
            {x}
          </div>
        ))}
      </dd>
    </div>
  );
}

function DiffPanel({ session }: { session: DiagnosticSession }) {
  return (
    <div className="grid gap-3 lg:grid-cols-[1fr_16rem]">
      <DiffList session={session} />
      <Panel title="History">
        <ol className="space-y-3 text-micro">
          {session.history
            .slice()
            .reverse()
            .map((snap) => (
              <li key={snap.at}>
                <div className="uppercase tracking-wider text-subtle">{snap.trigger}</div>
                <ol className="mt-1 space-y-0.5">
                  {snap.ranked.slice(0, 4).map((r, i) => (
                    <li key={r.id} className="flex justify-between gap-2">
                      <span>
                        {i + 1}. {r.label}
                      </span>
                      <LikelihoodMark value={r.likelihood} />
                    </li>
                  ))}
                </ol>
              </li>
            ))}
        </ol>
      </Panel>
    </div>
  );
}

function EvidencePanel({ session }: { session: DiagnosticSession }) {
  return (
    <ul className="space-y-2">
      {session.evidence
        .slice()
        .reverse()
        .map((e) => (
          <li key={e.id} className="rounded-md bg-surface px-3 py-2 shadow-[var(--shadow-border)]">
            <div className="flex flex-wrap items-center gap-2 text-micro uppercase tracking-wider text-subtle">
              <span>{e.source.replace("_", " ")}</span>
              <span>{e.type}</span>
              <span>{e.reliability}</span>
            </div>
            <p className="mt-1 text-sm">{e.observation}</p>
            {e.operatingCondition ? <p className="text-micro text-muted">Condition: {e.operatingCondition}</p> : null}
            {e.supports.length ? <p className="text-micro text-ok">Supports {e.supports.join(", ")}</p> : null}
            {e.contradicts.length ? <p className="text-micro text-fault">Contradicts {e.contradicts.join(", ")}</p> : null}
          </li>
        ))}
    </ul>
  );
}

function NextBlock({ session }: { session: DiagnosticSession }) {
  const a = session.nextAction;
  const answer = useDx((s) => s.answer);
  if (!a) return <p className="text-sm text-muted">No action yet.</p>;
  return (
    <div>
      <div className="text-micro uppercase tracking-wider text-subtle">{a.kind}</div>
      <h3 className="mt-1 text-base font-medium">{a.title}</h3>
      <p className="mt-2 text-sm text-muted">{a.why}</p>
      {a.expectedOutcomes.length ? (
        <ul className="mt-2 list-disc pl-4 text-micro text-subtle">
          {a.expectedOutcomes.map((o) => (
            <li key={o}>{o}</li>
          ))}
        </ul>
      ) : null}
      <p className="mt-2 font-mono text-micro text-data">
        Time ~{a.timeHr} hr · Cost {a.cost} · Discrimination {a.discrimination}
      </p>
      {a.safety ? <p className="mt-1 text-sm text-warn">{a.safety}</p> : null}
      {a.question ? (
        <div className="mt-3 grid gap-2">
          {a.question.options.map((o) => (
            <Button key={o.id} className="h-auto min-h-11 justify-start whitespace-normal py-2 text-left" onClick={() => answer(a.question!.id, o.id)}>
              {o.label}
            </Button>
          ))}
        </div>
      ) : null}
      {a.alternatives.length ? (
        <div className="mt-3">
          <div className="text-micro uppercase tracking-wider text-subtle">Other useful tests</div>
          <ol className="mt-1 space-y-1 text-sm text-muted">
            {a.alternatives.map((x, i) => (
              <li key={x.title}>
                {i + 2}. {x.title}
                <span className="block text-micro text-subtle">{x.why}</span>
              </li>
            ))}
          </ol>
        </div>
      ) : null}
    </div>
  );
}

function QuestionPanel({ session }: { session: DiagnosticSession }) {
  const answer = useDx((s) => s.answer);
  const pending = QUESTIONS.filter((q) => q.families.includes(session.family) && !session.askedQuestionIds.includes(q.id));
  const q = session.nextAction?.question ?? pending[0];
  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_16rem]">
      <Panel title="Adaptive interview">{session.nextAction?.kind === "question" ? <NextBlock session={session} /> : q ? (
        <div>
          <p className="text-sm text-muted">{q.rationale}</p>
          <h3 className="mt-2 font-medium">{q.prompt}</h3>
          <div className="mt-3 grid gap-2">
            {q.options.map((o) => (
              <Button key={o.id} className="h-auto min-h-11 justify-start whitespace-normal py-2 text-left" onClick={() => answer(q.id, o.id)}>
                {o.label}
              </Button>
            ))}
          </div>
        </div>
      ) : (
        <p className="text-sm text-muted">Highest-value customer questions are exhausted. Technician tests will discriminate more than another interview question.</p>
      )}</Panel>
      <Panel title="Asked">
        <ul className="space-y-2 text-micro">
          {session.answered.map((a) => {
            const qq = QUESTIONS.find((x) => x.id === a.questionId);
            const opt = qq?.options.find((o) => o.id === a.optionId);
            return (
              <li key={a.at}>
                <div className="text-subtle">{qq?.prompt}</div>
                <div>{opt?.label}</div>
              </li>
            );
          })}
        </ul>
      </Panel>
    </div>
  );
}

function TestPanel({ session }: { session: DiagnosticSession }) {
  const enterTest = useDx((s) => s.enterTest);
  const observe = useDx((s) => s.observe);
  const [testId, setTestId] = useState(session.nextAction?.testId ?? TESTS[0]!.id);
  const [result, setResult] = useState("");
  const [cond, setCond] = useState("");
  const [nl, setNl] = useState("");
  const t = TESTS.find((x) => x.id === testId);
  return (
    <div className="grid gap-3 lg:grid-cols-2">
      <Panel title="Recommended test">
        {session.nextAction?.kind === "test" ? <NextBlock session={session} /> : <p className="text-sm text-muted">Select a test and enter the actual result from the vehicle.</p>}
      </Panel>
      <Panel title="Enter result">
        <Field label="Test">
          <select
            className="h-11 w-full rounded-md bg-elevated px-3 text-sm ring-1 ring-border"
            value={testId}
            onChange={(e) => setTestId(e.target.value)}
          >
            {TESTS.map((x) => (
              <option key={x.id} value={x.id}>
                {x.name}
              </option>
            ))}
          </select>
        </Field>
        {t ? <p className="mt-2 text-micro text-muted">{t.why}</p> : null}
        <div className="mt-3">
          <Field label="Result">
            <Textarea className="min-h-20" value={result} onChange={(e) => setResult(e.target.value)} placeholder="47 psi · signal disappears during stall · 1.8 A key-off" />
          </Field>
        </div>
        <div className="mt-3">
          <Field label="Operating condition">
            <Input value={cond} onChange={(e) => setCond(e.target.value)} placeholder="Idle, fully warm · coolant 209°F" />
          </Field>
        </div>
        <Button
          className="mt-3"
          variant="primary"
          disabled={!result.trim()}
          onClick={() => {
            enterTest(testId, result, cond);
            setResult("");
          }}
        >
          File result
        </Button>
        <div className="mt-5 border-t border-border pt-3">
          <Field label="Or paste a natural-language observation">
            <Textarea className="min-h-20" value={nl} onChange={(e) => setNl(e.target.value)} placeholder="Fuel pressure stayed at 48 psi when it died." />
          </Field>
          <Button
            className="mt-2"
            disabled={!nl.trim()}
            onClick={() => {
              observe(nl, cond);
              setNl("");
            }}
          >
            Add observation
          </Button>
        </div>
      </Panel>
    </div>
  );
}

function DtcPanel({ session }: { session: DiagnosticSession }) {
  const enterDtcs = useDx((s) => s.enterDtcs);
  const [raw, setRaw] = useState("");
  const [status, setStatus] = useState("current");
  const [ff, setFf] = useState("");
  return (
    <div className="grid gap-3 lg:grid-cols-2">
      <Panel title="Enter DTCs">
        <p className="text-sm text-muted">A code alters the differential as evidence. It is not a diagnosis.</p>
        <Field label="Codes">
          <Input value={raw} onChange={(e) => setRaw(e.target.value)} placeholder="P0335 P0171 U0100" />
        </Field>
        <div className="mt-3 grid grid-cols-2 gap-2">
          <Field label="Status">
            <select className="h-11 w-full rounded-md bg-elevated px-3 text-sm ring-1 ring-border" value={status} onChange={(e) => setStatus(e.target.value)}>
              <option>current</option>
              <option>pending</option>
              <option>permanent</option>
              <option>history</option>
            </select>
          </Field>
        </div>
        <div className="mt-3">
          <Field label="Freeze-frame paste" hint="Optional PID dump">
            <Textarea className="min-h-20" value={ff} onChange={(e) => setFf(e.target.value)} placeholder={"RPM 712\nECT 205F\nSTFT +19%"} />
          </Field>
        </div>
        <Button
          className="mt-3"
          variant="primary"
          disabled={!raw.trim()}
          onClick={() => {
            enterDtcs(raw, status, ff);
            setRaw("");
          }}
        >
          Add codes
        </Button>
      </Panel>
      <Panel title="Library (not a diagnosis)">
        <ul className="space-y-2 text-sm">
          {DTC_KB.map((d) => (
            <li key={d.code}>
              <div className="font-mono text-data">
                {d.code} <span className="font-sans text-fg">{d.title}</span>
              </div>
              <p className="text-micro text-muted">{d.notADiagnosis}</p>
            </li>
          ))}
        </ul>
        {session.dtcsRaw ? <p className="mt-3 text-micro text-subtle">Entered at intake: {session.dtcsRaw}</p> : null}
      </Panel>
    </div>
  );
}

function PidPanel({ session }: { session: DiagnosticSession }) {
  const enterPids = useDx((s) => s.enterPids);
  const [text, setText] = useState("");
  const [cond, setCond] = useState(session.operatingConditions[0] ?? "idle, fully warm");
  void session;
  return (
    <Panel title="Live data / freeze-frame interpreter">
      <p className="text-sm text-muted">
        Paste scan-tool PIDs. Patterns are interpreted; numbers are not treated as OEM specifications.
      </p>
      <Field label="Condition">
        <Input value={cond} onChange={(e) => setCond(e.target.value)} />
      </Field>
      <div className="mt-3">
        <Field label="Paste">
          <Textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={"RPM 712\nECT 205F\nSTFT +19%\nLTFT +17%\nMAF 2.1 g/s\nFuel pressure 47 psi"}
          />
        </Field>
      </div>
      <Button
        className="mt-3"
        variant="primary"
        disabled={!text.trim()}
        onClick={() => {
          enterPids(text, cond);
          setText("");
        }}
      >
        Interpret
      </Button>
    </Panel>
  );
}

function NotesPanel({ session }: { session: DiagnosticSession }) {
  const observe = useDx((s) => s.observe);
  const [n, setN] = useState("");
  return (
    <Panel title="Technician notes">
      <Textarea value={n} onChange={(e) => setN(e.target.value)} placeholder="Inspection notes, customer quotes, anything factual" />
      <Button
        className="mt-3"
        disabled={!n.trim()}
        onClick={() => {
          observe(n, undefined, "notes");
          setN("");
        }}
      >
        Add to ledger
      </Button>
      <p className="mt-4 text-sm text-muted">{session.reasoningSummary}</p>
    </Panel>
  );
}

function VerifyPanel({ session }: { session: DiagnosticSession }) {
  const finish = useDx((s) => s.finish);
  const r = session.repair;
  const v = session.verification;
  return (
    <div className="grid gap-3 lg:grid-cols-2">
      <Panel title="Supported direction">
        {r ? (
          <div>
            <h3 className="font-medium">{r.action}</h3>
            <p className="mt-1 text-micro uppercase tracking-wider">
              Evidence strength <LikelihoodMark value={r.evidenceStrength} />
            </p>
            <p className="mt-2 text-sm text-muted">{r.status}</p>
            {r.inspectFirst ? <p className="mt-2 text-sm text-warn">{r.inspectFirst}</p> : null}
            <ul className="mt-2 space-y-1 text-sm">
              {r.supporting.map((s) => (
                <li key={s} className="text-ok">
                  + {s}
                </li>
              ))}
              {r.missing.map((s) => (
                <li key={s} className="text-subtle">
                  – Missing: {s}
                </li>
              ))}
            </ul>
            <p className="mt-3 text-micro text-subtle">You may still proceed. This is not an OEM repair authorization.</p>
          </div>
        ) : (
          <p className="text-sm text-muted">No cause is strongly supported yet. Keep discriminating; do not parts-cannon.</p>
        )}
      </Panel>
      <Panel title="Verification plan">
        {v ? (
          <div>
            <div className="text-micro uppercase tracking-wider text-subtle">Original conditions</div>
            <ul className="mt-1 list-disc pl-4 text-sm">
              {v.originalConditions.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
            <div className="mt-3 text-micro uppercase tracking-wider text-subtle">Steps</div>
            <ol className="mt-1 list-decimal pl-4 text-sm">
              {v.steps.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ol>
            <p className="mt-3 text-micro text-warn">{v.mustNotMarkCompleteUntil.join(" · ")}</p>
          </div>
        ) : null}
      </Panel>
      <Panel title="Diagnostic summary" className="lg:col-span-2">
        <Report session={session} />
        <Button className="mt-4" variant="primary" onClick={finish}>
          Save and close session
        </Button>
      </Panel>
    </div>
  );
}

function Report({ session }: { session: DiagnosticSession }) {
  const top = session.hypotheses[0];
  return (
    <article className="space-y-2 text-sm">
      <p>
        <span className="text-subtle">Vehicle. </span>
        {vehicleTitle(session.vehicle)} {vehicleSub(session.vehicle)}
      </p>
      <p>
        <span className="text-subtle">Concern. </span>
        {session.concern}
      </p>
      <p>
        <span className="text-subtle">Most supported cause. </span>
        {top ? `${top.component} — ${top.failureMode}` : "Inconclusive"}
      </p>
      <p>
        <span className="text-subtle">Confidence. </span>
        {top ? LIKELIHOOD_LABEL[top.likelihood] : "—"} · evidence {top?.evidenceConfidence ?? "none"} · {top?.status.replace("_", " ")}
      </p>
      {top?.supporting.length ? (
        <p>
          <span className="text-subtle">Key evidence. </span>
          {top.supporting.join(" · ")}
        </p>
      ) : null}
      {top?.contradicting.length ? (
        <p>
          <span className="text-subtle">Contradicting. </span>
          {top.contradicting.join(" · ")}
        </p>
      ) : null}
      <p>
        <span className="text-subtle">Recommended next action. </span>
        {session.nextAction?.title}
      </p>
      <p className="text-micro text-subtle">{session.reasoningSummary}</p>
    </article>
  );
}

function Tree({ session }: { session: DiagnosticSession }) {
  const by = new Map<string, Hypothesis[]>();
  for (const h of session.hypotheses) {
    const arr = by.get(h.systemLabel) ?? [];
    arr.push(h);
    by.set(h.systemLabel, arr);
  }
  return (
    <ul className="space-y-1 font-mono text-micro">
      <li className="uppercase tracking-wider text-subtle">{session.family.replace("_", " ")}</li>
      {[...by.entries()].map(([sys, hs]) => {
        const top = hs[0]!;
        const mark = top.status === "ruled_out" ? "×" : top.likelihood === "very_low" ? "·" : top.likelihood === "very_high" || top.likelihood === "high" ? "!" : "–";
        return (
          <li key={sys} className="pl-2">
            {mark} {sys} <LikelihoodMark value={top.likelihood} />
            <ul className="pl-3 text-muted">
              {hs.slice(0, 2).map((h) => (
                <li key={h.id}>
                  {h.component}
                </li>
              ))}
            </ul>
          </li>
        );
      })}
    </ul>
  );
}

function QuickEntry() {
  const observe = useDx((s) => s.observe);
  const [t, setT] = useState("");
  return (
    <div>
      <Textarea className="min-h-16" value={t} onChange={(e) => setT(e.target.value)} placeholder="Fuel pressure stayed at 48 psi when it died." />
      <Button
        size="sm"
        className="mt-2"
        disabled={!t.trim()}
        onClick={() => {
          observe(t);
          setT("");
        }}
      >
        Add evidence
      </Button>
    </div>
  );
}
