import { createFileRoute, Link } from "@tanstack/react-router";
import { Shell } from "@/components/shell";
import { useDx } from "@/lib/store/dx-store";
import { useEffect } from "react";
import { LIKELIHOOD_LABEL } from "@/lib/dx/types";

export const Route = createFileRoute("/eval")({ component: EvalPage });

function EvalPage() {
  const hydrate = useDx((s) => s.hydrate);
  const evals = useDx((s) => s.evals);
  useEffect(() => {
    hydrate();
  }, [hydrate]);
  return (
    <Shell title="Engine evaluation" sub="Simulator cases scoring the same reasoning engine. Hidden faults never enter the differential.">
      <div className="mx-auto max-w-3xl px-4 py-6">
        {!evals.length ? (
          <p className="text-sm text-muted">
            Close a simulator RO to record an evaluation. The harness compares the true hidden cause against the engine’s rank after each evidence step.
          </p>
        ) : null}
        <ul className="space-y-3">
          {evals.map((e) => (
            <li key={e.sessionId} className="rounded-lg bg-surface p-4 shadow-[var(--shadow-border)]">
              <div className="font-mono text-micro text-subtle">{e.caseId}</div>
              <div className="mt-1 text-sm">
                Initial rank {e.initialRank ?? "—"} → final {e.finalRank ?? "—"} · {e.reachedVeryHigh ? "reached Very High" : "did not reach Very High"} · {e.confirmed ? "confirmed" : "not confirmed"}
              </div>
              <p className="mt-2 text-micro text-muted">
                Steps {e.steps} · Questions {e.questionsAsked} · Tests {e.testsRecommended.length}
                {e.unnecessaryTests.length ? ` · Extra tests: ${e.unnecessaryTests.join(", ")}` : ""}
              </p>
              {e.falseHypothesesRetained.length ? (
                <p className="mt-1 text-micro text-warn">Still ranked high (not the cause): {e.falseHypothesesRetained.join("; ")}</p>
              ) : null}
              <ol className="mt-2 space-y-0.5 font-mono text-micro text-subtle">
                {e.log.slice(-8).map((s) => (
                  <li key={s.at}>
                    {s.trigger} · true #{s.trueCauseRank ?? "—"} {s.trueCauseLikelihood ? LIKELIHOOD_LABEL[s.trueCauseLikelihood] : ""}
                  </li>
                ))}
              </ol>
              <p className="mt-2 text-micro text-subtle">True cause is recorded only in this evaluation view — not shown during the case.</p>
            </li>
          ))}
        </ul>
        <Link to="/simulator" className="mt-6 inline-block text-sm text-data">
          Open simulator
        </Link>
      </div>
    </Shell>
  );
}
