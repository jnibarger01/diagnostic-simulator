import { useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Led } from "@/components/format";
import { CASES, engineLine, vehicleLine } from "@/lib/cases/catalog";
import { ACHIEVEMENTS, useGame } from "@/lib/store/game-store";
import { formatHours } from "@/lib/utils";
import { useEffect } from "react";
import { Shell } from "@/components/shell";

export function SimBay() {
  const navigate = useNavigate();
  const profile = useGame((s) => s.profile);
  const startCase = useGame((s) => s.startCase);
  const startDaily = useGame((s) => s.startDaily);
  const hydrate = useGame((s) => s.hydrate);
  useEffect(() => {
    hydrate();
  }, [hydrate]);

  const generated = profile.generatedCases;
  const open = (id: string) => {
    startCase(id);
    void navigate({ to: "/lab" });
  };

  return (
    <Shell badge="Simulator" title="Hidden-fault cases" sub="Same reasoning engine. The root cause is never injected into the differential.">
      <main className="mx-auto grid max-w-6xl gap-6 px-4 py-6 sm:px-8 lg:grid-cols-[1fr_18rem]">
        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-micro uppercase tracking-[0.14em] text-muted">Repair orders</h2>
            <div className="flex gap-2">
              <Button size="sm" onClick={() => void navigate({ to: "/creator" })}>
                Case creator
              </Button>
              <Button
                size="sm"
                variant="primary"
                onClick={() => {
                  startDaily();
                  void navigate({ to: "/lab" });
                }}
              >
                Daily challenge
              </Button>
            </div>
          </div>
          <div className="grid gap-3">
            {CASES.map((c) => {
              const best = profile.bestByCase[c.id];
              return (
                <button
                  key={c.id}
                  onClick={() => open(c.id)}
                  className="rounded-lg bg-surface p-4 text-left shadow-[var(--shadow-border)] transition-colors duration-150 hover:bg-elevated"
                >
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <div className="font-mono text-micro text-subtle">RO #{c.roNumber}</div>
                      <div className="text-lg font-medium">
                        {vehicleLine(c)} · {c.title}
                      </div>
                      <div className="text-xs text-muted">{engineLine(c)}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Led on={best != null} />
                      <span className="text-micro uppercase tracking-wider text-muted">{c.difficulty}</span>
                    </div>
                  </div>
                  <p className="mt-2 line-clamp-2 text-sm text-muted">{c.concern}</p>
                  <div className="mt-2 flex gap-3 text-micro text-subtle">
                    <span>{c.category}</span>
                    {best != null ? <span className="text-data">Best {best}</span> : <span>Unattempted</span>}
                    <span>Expert {c.expertPathHours.toFixed(1)} hr</span>
                  </div>
                </button>
              );
            })}
            {generated.map((c) => (
              <button
                key={c.id}
                onClick={() => open(c.id)}
                className="rounded-lg bg-surface p-4 text-left shadow-[var(--shadow-border)] hover:bg-elevated"
              >
                <div className="text-micro uppercase tracking-wider text-subtle">Generated · RO #{c.roNumber}</div>
                <div className="text-lg font-medium">{vehicleLine(c)}</div>
                <p className="mt-1 line-clamp-2 text-sm text-muted">{c.concern}</p>
              </button>
            ))}
          </div>
        </section>
        <aside className="space-y-4">
          <div className="rounded-lg bg-surface p-4 shadow-[var(--shadow-border)]">
            <h2 className="text-micro uppercase tracking-[0.14em] text-muted">How this mode works</h2>
            <p className="mt-2 text-sm text-muted">
              A hidden causal fault drives every PID, DTC, waveform, and inspection. The diagnostic engine only sees what a technician could obtain — never the fault model.
            </p>
          </div>
          <div className="rounded-lg bg-surface p-4 shadow-[var(--shadow-border)]">
            <h2 className="text-micro uppercase tracking-[0.14em] text-muted">Marks</h2>
            <ul className="mt-3 space-y-2">
              {ACHIEVEMENTS.map((a) => (
                <li key={a.id} className="flex items-start gap-2 text-sm">
                  <Led on={profile.achievements.includes(a.id)} />
                  <span>
                    <span className={profile.achievements.includes(a.id) ? "text-fg" : "text-muted"}>{a.label}</span>
                    <span className="block text-micro text-subtle">{a.desc}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <p className="text-micro text-subtle">Avg case time {profile.scores.length ? formatHours(profile.scores.reduce((a, b) => a + b.hours, 0) / profile.scores.length) : "—"}</p>
        </aside>
      </main>
    </Shell>
  );
}
