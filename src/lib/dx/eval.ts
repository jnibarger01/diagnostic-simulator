import type { CaseDefinition } from "@/lib/sim/types";
import { trueHypothesisId } from "./sim-bridge";
import type { DiagnosticSession, EngineEval, EngineEvalStep, Likelihood } from "./types";

function rankOf(session: DiagnosticSession, hid: string | null): { rank: number | null; likelihood: Likelihood | null } {
  if (!hid) return { rank: null, likelihood: null };
  const i = session.hypotheses.findIndex((h) => h.id === hid);
  if (i < 0) return { rank: null, likelihood: null };
  return { rank: i + 1, likelihood: session.hypotheses[i]!.likelihood };
}

export function evalStep(session: DiagnosticSession, def: CaseDefinition | undefined, trigger: string, extra?: Partial<EngineEvalStep>): EngineEvalStep {
  const hid = def ? trueHypothesisId(def) : null;
  const { rank, likelihood } = rankOf(session, hid);
  return {
    at: Date.now(),
    trigger,
    trueCauseRank: rank,
    trueCauseLikelihood: likelihood,
    topId: session.hypotheses[0]?.id ?? "",
    ...extra,
  };
}

export function summarizeEval(session: DiagnosticSession, def: CaseDefinition): EngineEval {
  const hid = trueHypothesisId(def);
  const log = session.evalLog;
  const first = log[0];
  const last = log[log.length - 1];
  const { rank } = rankOf(session, hid);
  const hyp = session.hypotheses.find((h) => h.id === hid);
  const tests = session.testsRun.map((t) => t.testId);
  const valuable = new Set(def.valuableTests);
  const unnecessary = tests.filter((t) => ![...valuable].some((v) => t.includes(v) || v.includes(t)));
  const falseKept = session.hypotheses
    .filter((h) => h.id !== hid && (h.likelihood === "high" || h.likelihood === "very_high"))
    .map((h) => h.component);
  return {
    sessionId: session.id,
    caseId: def.id,
    trueCause: def.fault.rootCause,
    trueHypothesisId: hid,
    initialRank: first?.trueCauseRank ?? rank,
    finalRank: last?.trueCauseRank ?? rank,
    reachedVeryHigh: hyp?.likelihood === "very_high" || log.some((s) => s.trueCauseLikelihood === "very_high"),
    confirmed: hyp?.status === "confirmed",
    steps: log.length,
    questionsAsked: session.answered.length,
    testsRecommended: tests,
    unnecessaryTests: unnecessary,
    falseHypothesesRetained: falseKept,
    testsToDiagnosis: hyp?.status === "confirmed" ? tests.length : null,
    falseConfirmation: session.hypotheses.some((h) => h.id !== hid && h.status === "confirmed"),
    unsafeRecommendation: Boolean(session.nextAction?.safety),
    log,
    at: Date.now(),
  };
}
