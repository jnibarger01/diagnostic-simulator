import { createFileRoute, Link } from "@tanstack/react-router";
import { CASES, vehicleLine } from "@/lib/cases/catalog";
import { ACHIEVEMENTS, useGame } from "@/lib/store/game-store";
import { formatHours } from "@/lib/utils";
import { Led } from "@/components/format";
import { Shell } from "@/components/shell";

export const Route = createFileRoute("/profile")({ component: Profile });

function Profile() {
  const p = useGame((s) => s.profile);
  const avg = p.scores.length ? Math.round(p.scores.reduce((a, b) => a + b.score, 0) / p.scores.length) : 0;
  const byCat = {
    electrical: avgCat("electrical"),
    driveability: avgCat("driveability"),
    network: avgCat("network"),
    "no-start": avgCat("no-start"),
  };
  function avgCat(cat: string) {
    const ids = CASES.filter((c) => c.category === cat).map((c) => c.id);
    const hits = p.scores.filter((s) => ids.includes(s.caseId));
    if (!hits.length) return 0;
    return Math.round(hits.reduce((a, b) => a + b.score, 0) / hits.length);
  }
  return (
    <Shell title="Tech file" sub={`Local to this browser. Level ${p.level}.`}>
      <div className="mx-auto max-w-3xl px-4 py-6 sm:px-8">
        <dl className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {[
            ["Closed", p.casesCompleted],
            ["Average", avg],
            ["First-time", p.casesCompleted ? `${Math.round((p.firstTimeHits / p.casesCompleted) * 100)}%` : "—"],
            ["Cannon hits", p.unnecessaryParts],
            ["Driveability", `${byCat.driveability}`],
            ["Electrical", `${byCat.electrical}`],
            ["Network", `${byCat.network}`],
            ["No-start", `${byCat["no-start"]}`],
          ].map(([k, v]) => (
            <div key={k} className="rounded-md bg-surface p-3">
              <div className="text-micro uppercase tracking-wider text-subtle">{k}</div>
              <div className="font-mono text-xl tabular-nums text-data">{v}</div>
            </div>
          ))}
        </dl>
        <h2 className="mt-8 text-micro uppercase tracking-[0.14em] text-muted">History</h2>
        <ul className="mt-2 space-y-2">
          {p.scores.length === 0 ? <li className="text-sm text-muted">No closed tickets yet.</li> : null}
          {p.scores.map((s, i) => {
            const c = CASES.find((x) => x.id === s.caseId);
            return (
              <li key={i} className="flex justify-between rounded-md bg-surface px-3 py-2 text-sm">
                <span>{c ? vehicleLine(c) : s.caseId}</span>
                <span className="font-mono text-data">
                  {s.score} · {formatHours(s.hours)}
                </span>
              </li>
            );
          })}
        </ul>
        <h2 className="mt-8 text-micro uppercase tracking-[0.14em] text-muted">Marks</h2>
        <ul className="mt-2 space-y-2">
          {ACHIEVEMENTS.map((a) => (
            <li key={a.id} className="flex items-center gap-2 text-sm">
              <Led on={p.achievements.includes(a.id)} />
              <span className={p.achievements.includes(a.id) ? "" : "text-muted"}>
                {a.label} — {a.desc}
              </span>
            </li>
          ))}
        </ul>
        <Link to="/eval" className="mt-6 inline-block text-sm text-data">
          Engine evaluation
        </Link>
      </div>
    </Shell>
  );
}
