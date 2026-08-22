import {
  DTC_CODE_WEIGHTS,
  DTC_KB,
  FAULTS,
  QUESTIONS,
  SYSTEMS,
  TAG_WEIGHTS,
  TESTS,
  type FaultTemplate,
} from "./knowledge";
import {
  detectFamily,
  evidenceShell,
  extractConditions,
  extractSafety,
  extractSymptoms,
  extractTags,
  interpretObservation,
  makeId,
  parseDtcCodes,
  parsePidPaste,
  tagsFromPids,
  unique,
} from "./parse";
import type {
  DiagnosticQuestion,
  DiagnosticSession,
  Evidence,
  Hypothesis,
  IntakeInput,
  Likelihood,
  LikelihoodMove,
  NextBestAction,
  RepairRecommendation,
  TestDef,
  VerificationPlan,
} from "./types";
import { LIKELIHOOD_LABEL, likelihoodRank } from "./types";

function band(score: number): Likelihood {
  if (score >= 8) return "very_high";
  if (score >= 4.5) return "high";
  if (score >= 1.5) return "moderate";
  if (score >= -0.5) return "low";
  return "very_low";
}

function confidence(h: Hypothesis, evidence: Evidence[]): Hypothesis["evidenceConfidence"] {
  const tech = evidence.filter((e) => e.supports.includes(h.id) && e.source !== "customer" && e.source !== "service_history" && e.source !== "previous_repair");
  const cust = evidence.filter((e) => e.supports.includes(h.id));
  if (tech.length >= 2) return "high";
  if (tech.length === 1) return "medium";
  if (cust.length >= 2) return "low";
  return "none";
}

function applyWeights(scores: Record<string, number>, weights: Record<string, number> | undefined, scale = 1) {
  if (!weights) return;
  for (const [id, d] of Object.entries(weights)) {
    scores[id] = (scores[id] ?? 0) + d * scale;
  }
}

function templateById(id: string): FaultTemplate | undefined {
  return FAULTS.find((f) => f.id === id);
}

function scoreSession(session: DiagnosticSession): Record<string, number> {
  const scores: Record<string, number> = {};
  for (const f of FAULTS) {
    if (f.families.includes(session.family) || session.family === "generic") scores[f.id] = 1;
    else scores[f.id] = -1;
  }

  for (const tag of session.tags) applyWeights(scores, TAG_WEIGHTS[tag]);

  for (const ev of session.evidence) {
    const scale = ev.reliability === "high" ? 1 : ev.reliability === "medium" ? 0.7 : 0.4;
    for (const tag of ev.tags) applyWeights(scores, TAG_WEIGHTS[tag], scale);
    if (ev.type === "dtc" && ev.structuredValue && typeof ev.structuredValue.value === "string") {
      applyWeights(scores, DTC_CODE_WEIGHTS[ev.structuredValue.value], scale);
    }
  }

  return scores;
}

function buildHypothesis(t: FaultTemplate, score: number, evidence: Evidence[]): Hypothesis {
  const supporting: string[] = [];
  const contradicting: string[] = [];
  for (const ev of evidence) {
    let s = 0;
    let c = 0;
    for (const tag of ev.tags) {
      const w = TAG_WEIGHTS[tag]?.[t.id] ?? 0;
      if (w > 0) s += w;
      if (w < 0) c += -w;
    }
    if (ev.type === "dtc" && ev.structuredValue && typeof ev.structuredValue.value === "string") {
      const w = DTC_CODE_WEIGHTS[ev.structuredValue.value]?.[t.id] ?? 0;
      if (w > 0) s += w;
      if (w < 0) c += -w;
    }
    if (s > c && s > 0) supporting.push(ev.observation);
    else if (c > s && c > 0) contradicting.push(ev.observation);
  }
  const likelihood = band(score);
  let status: Hypothesis["status"] = "active";
  if (likelihood === "very_low" && contradicting.length) status = "ruled_out";
  const hyp: Hypothesis = {
    id: t.id,
    systemId: t.systemId,
    systemLabel: t.systemLabel,
    component: t.component,
    failureMode: t.failureMode,
    likelihood,
    score: Math.round(score * 10) / 10,
    evidenceConfidence: "none",
    supporting: unique(supporting).slice(0, 8),
    contradicting: unique(contradicting).slice(0, 8),
    missing: [...t.missing],
    moreLikelyWhen: t.moreLikelyWhen,
    lessLikelyWhen: t.lessLikelyWhen,
    confirmTest: t.confirmTest,
    refuteTest: t.refuteTest,
    testable: true,
    testCostUsd: t.testCostUsd,
    testHours: t.testHours,
    safety: t.safety,
    status,
  };
  hyp.evidenceConfidence = confidence(hyp, evidence);
  if (hyp.likelihood === "very_high" && hyp.evidenceConfidence === "high" && !hyp.contradicting.length) {
    hyp.status = "confirmed";
  }
  return hyp;
}

function relevantFaults(session: DiagnosticSession): FaultTemplate[] {
  const primary = FAULTS.filter((f) => f.families.includes(session.family));
  const extra = FAULTS.filter((f) => session.tags.some((t) => (TAG_WEIGHTS[t]?.[f.id] ?? 0) >= 2));
  const map = new Map<string, FaultTemplate>();
  for (const f of [...primary, ...extra]) map.set(f.id, f);
  if (map.size < 4) {
    for (const f of FAULTS) {
      if (map.size >= 6) break;
      map.set(f.id, f);
    }
  }
  return [...map.values()];
}

function linkEvidence(evidence: Evidence[], hyps: Hypothesis[]): Evidence[] {
  return evidence.map((ev) => {
    const supports: string[] = [];
    const contradicts: string[] = [];
    const neutralTo: string[] = [];
    for (const h of hyps) {
      let s = 0;
      for (const tag of ev.tags) s += TAG_WEIGHTS[tag]?.[h.id] ?? 0;
      if (ev.type === "dtc" && ev.structuredValue && typeof ev.structuredValue.value === "string") {
        s += DTC_CODE_WEIGHTS[ev.structuredValue.value]?.[h.id] ?? 0;
      }
      if (s > 0.8) supports.push(h.id);
      else if (s < -0.8) contradicts.push(h.id);
      else neutralTo.push(h.id);
    }
    return { ...ev, supports, contradicts, neutralTo };
  });
}

function questionAsked(session: DiagnosticSession, id: string) {
  return session.askedQuestionIds.includes(id);
}

function tagsAlreadyKnown(session: DiagnosticSession, tags: string[]) {
  if (!tags.length) return true;
  const have = new Set(session.tags);
  for (const ev of session.evidence) ev.tags.forEach((t) => have.add(t));
  return tags.every((t) => have.has(t));
}

function questionValue(q: DiagnosticQuestion, session: DiagnosticSession, hyps: Hypothesis[]): number {
  if (questionAsked(session, q.id)) return -1;
  if (!q.families.includes(session.family) && session.family !== "generic") return 0;
  const top = hyps.filter((h) => h.status === "active").slice(0, 5);
  if (!top.length) return 0;
  let value = 0;
  for (const opt of q.options) {
    if (!opt.tags.length || tagsAlreadyKnown(session, opt.tags)) continue;
    const deltas = top.map((h) => opt.tags.reduce((a, t) => a + (TAG_WEIGHTS[t]?.[h.id] ?? 0), 0));
    const spread = Math.max(...deltas) - Math.min(...deltas);
    value += spread;
  }
  if (q.audience === "customer") {
    const techEv = session.evidence.some((e) => e.source !== "customer" && e.source !== "service_history" && e.type !== "symptom");
    if (techEv) value *= 0.45;
    if (session.answered.filter((a) => QUESTIONS.find((x) => x.id === a.questionId)?.audience === "customer").length >= 4) {
      value *= 0.3;
    }
  }
  return value;
}

function testValue(t: TestDef, session: DiagnosticSession, hyps: Hypothesis[]): number {
  if (session.testsRun.some((x) => x.testId === t.id)) return -1;
  if (!t.families.includes(session.family) && session.family !== "generic") return 0.2;
  const top = hyps.filter((h) => h.status === "active").slice(0, 5);
  const hits = t.discriminates.filter((id) => top.some((h) => h.id === id));
  let value = hits.length * 3;
  const close = top.slice(0, 2);
  if (close.length === 2 && t.discriminates.includes(close[0]!.id) && t.discriminates.includes(close[1]!.id)) value += 4;
  value += 1.5 / Math.max(0.15, t.timeHr);
  if (t.invasiveness === "high") value -= 2;
  if (t.safety) value -= 0.5;
  return value;
}

function pickNext(session: DiagnosticSession, hyps: Hypothesis[]): NextBestAction {
  const confirmed = hyps.find((h) => h.status === "confirmed");
  if (confirmed) {
    return {
      kind: "repair",
      title: `Evidence supports: ${confirmed.component}`,
      why: confirmed.failureMode,
      expectedOutcomes: ["Inspect circuit/connector before replacement when applicable", "Verify at original failure conditions"],
      timeHr: confirmed.testHours,
      cost: "see recommendation",
      discrimination: "high",
      invasiveness: "moderate",
      alternatives: [],
    };
  }

  const qScores = QUESTIONS.map((q) => ({ q, v: questionValue(q, session, hyps) }))
    .filter((x) => x.v > 1.5)
    .sort((a, b) => b.v - a.v);
  const tScores = TESTS.map((t) => ({ t, v: testValue(t, session, hyps) }))
    .filter((x) => x.v > 0)
    .sort((a, b) => b.v - a.v);

  const bestQ = qScores[0];
  const bestT = tScores[0];
  const customerBudget = session.answered.filter((a) => QUESTIONS.find((x) => x.id === a.questionId)?.audience === "customer").length;
  const preferQuestion = bestQ && (customerBudget < 3 || (bestQ.v > (bestT?.v ?? 0) + 1));

  const alts: NextBestAction["alternatives"] = [];
  for (const x of qScores.slice(preferQuestion ? 1 : 0, 3)) {
    alts.push({ title: x.q.prompt, why: x.q.rationale, timeHr: 0.05, questionId: x.q.id });
  }
  for (const x of tScores.slice(preferQuestion ? 0 : 1, 4)) {
    alts.push({ title: x.t.name, why: x.t.why, timeHr: x.t.timeHr, testId: x.t.id });
  }

  if (preferQuestion && bestQ) {
    return {
      kind: "question",
      title: bestQ.q.prompt,
      why: bestQ.q.rationale,
      expectedOutcomes: bestQ.q.options.filter((o) => o.id !== "unknown").map((o) => o.label),
      timeHr: 0.05,
      cost: "none",
      discrimination: bestQ.v >= 6 ? "high" : "moderate",
      invasiveness: "none",
      question: bestQ.q,
      alternatives: alts.slice(0, 4),
    };
  }

  if (bestT) {
    return {
      kind: "test",
      title: bestT.t.name,
      why: bestT.t.why,
      expectedOutcomes: bestT.t.expectedOutcomes,
      timeHr: bestT.t.timeHr,
      cost: bestT.t.cost,
      discrimination: bestT.v >= 6 ? "high" : bestT.v >= 3 ? "moderate" : "low",
      invasiveness: bestT.t.invasiveness,
      safety: bestT.t.safety,
      testId: bestT.t.id,
      alternatives: alts.filter((a) => a.testId !== bestT.t.id).slice(0, 4),
    };
  }

  return {
    kind: "inconclusive",
    title: "Evidence remains inconclusive",
    why: "Competing hypotheses are still open. Capture the failure with RPM, fuel pressure, and a CKP waveform rather than replacing parts.",
    expectedOutcomes: [],
    timeHr: 0.4,
    cost: "minimal",
    discrimination: "moderate",
    invasiveness: "low",
    alternatives: alts.slice(0, 3),
  };
}

function verificationPlan(session: DiagnosticSession, top?: Hypothesis): VerificationPlan {
  const conds = unique([
    ...session.operatingConditions,
    ...session.evidence.map((e) => e.operatingCondition).filter((x): x is string => !!x),
  ]);
  const steps: string[] = [];
  const tags = session.tags;
  if (tags.includes("hot") || tags.includes("hot_only")) {
    steps.push("Reach full operating temperature.");
    steps.push("Continue operating beyond the previous failure threshold (time/temp).");
  }
  if (tags.includes("vibration")) steps.push("Reproduce rough-road / harness movement conditions.");
  if (tags.includes("sit_overnight")) steps.push("Key-off soak comparable to the original sit; confirm resting voltage and draw.");
  if (tags.includes("stall") || tags.includes("no_start")) steps.push("Monitor RPM synchronization (and CKP if that was the supported cause) through the original condition.");
  if (tags.includes("lean") || tags.includes("rough_idle")) steps.push("Confirm fuel trims return toward a typical range at idle and cruise. OEM specification required for pass/fail.");
  if (tags.includes("network")) steps.push("Drive over the original disturbance (bumps) and confirm modules remain online with no U-code return.");
  if (tags.includes("bsm")) steps.push("Verify BSM operation and that related DTCs do not return after OEM initialization/aiming.");
  if (!steps.length) steps.push("Reproduce the original customer operating conditions as closely as possible.");
  steps.push("Confirm relevant DTCs do not return.");
  if (top) steps.push(`Confirm the original concern does not recur after addressing ${top.component}.`);
  return {
    originalConditions: conds.length ? conds : ["Original customer operating conditions"],
    steps,
    mustNotMarkCompleteUntil: [
      "Original failure condition has been recreated or reasonably attempted",
      "Concern does not recur",
      "Supporting DTCs remain clear if they were part of the evidence",
    ],
  };
}

function repairRec(hyps: Hypothesis[]): RepairRecommendation | undefined {
  const top = hyps[0];
  if (!top || likelihoodRank(top.likelihood) > likelihoodRank("high")) return undefined;
  const inspectFirst =
    top.id === "ckp_sync" || top.id === "ckp_connector"
      ? "Inspect CKP connector and circuit integrity before component replacement."
      : top.id.startsWith("bsm")
        ? "Do not replace another sensor until communication, initialization, and mounting are documented."
        : top.id.startsWith("parasitic")
          ? "Do not replace the battery until the draw is isolated."
          : undefined;
  const status =
    top.status === "confirmed"
      ? "Confirmed by evidence. Circuit inspection still recommended when the fault can be a connector."
      : top.evidenceConfidence === "high"
        ? "Strongly supported. Remaining missing checks should be completed if cheap."
        : "Supported but not confirmed. Additional discriminating tests remain.";
  return {
    action: top.id === "ckp_connector" ? "Repair/replace CKP connector and restore circuit integrity" : `Address ${top.component}`,
    hypothesisId: top.id,
    evidenceStrength: top.likelihood,
    supporting: top.supporting,
    missing: top.missing.filter((m) => !top.supporting.some((s) => s.toLowerCase().includes(m.slice(0, 8).toLowerCase()))),
    status,
    inspectFirst,
  };
}

function summary(session: DiagnosticSession, hyps: Hypothesis[]): string {
  const top = hyps.slice(0, 3);
  const names = top.map((h) => `${h.component} (${LIKELIHOOD_LABEL[h.likelihood]})`).join("; ");
  return `${session.family.replace("_", " ")} complaint. Leading explanations: ${names}. Next: ${session.nextAction?.title ?? "collect more evidence"}. Speculation is labeled; nothing here is a confirmed OEM diagnosis without matching evidence.`;
}

function snapshot(hyps: Hypothesis[], trigger: string) {
  return {
    at: Date.now(),
    trigger,
    ranked: hyps.slice(0, 8).map((h) => ({
      id: h.id,
      label: h.component,
      likelihood: h.likelihood,
      score: h.score,
    })),
  };
}

function movement(prev: Hypothesis[] | undefined, next: Hypothesis[], latest?: Evidence): LikelihoodMove[] {
  if (!prev?.length) return [];
  const out: LikelihoodMove[] = [];
  for (const h of next) {
    const p = prev.find((x) => x.id === h.id);
    if (!p || p.likelihood === h.likelihood) continue;
    const reason =
      latest?.observation ??
      (likelihoodRank(h.likelihood) < likelihoodRank(p.likelihood)
        ? h.supporting[0] ?? "New supporting evidence."
        : h.contradicting[0] ?? "New contradicting evidence.");
    out.push({ id: h.id, label: h.component, from: p.likelihood, to: h.likelihood, reason });
  }
  return out;
}

function seedEvidence(input: IntakeInput, tags: string[]): Evidence[] {
  const ev: Evidence[] = [];
  if (input.concern.trim()) {
    ev.push(
      evidenceShell({
        source: "customer",
        type: "symptom",
        observation: input.concern.trim(),
        reliability: "medium",
        tags: extractTags(input.concern),
      }),
    );
  }
  if (input.warningLights?.trim()) {
    ev.push(
      evidenceShell({
        source: "customer",
        type: "statement",
        observation: `Warning lamps: ${input.warningLights.trim()}`,
        reliability: "medium",
        tags: extractTags(input.warningLights),
      }),
    );
  }
  if (input.recentRepairs?.trim()) {
    ev.push(
      evidenceShell({
        source: "previous_repair",
        type: "history",
        observation: `Recent repairs: ${input.recentRepairs.trim()}`,
        reliability: "medium",
        tags: extractTags(input.recentRepairs),
        notes: "Prior work influences the differential; it does not prove causality.",
      }),
    );
  }
  if (input.serviceHistory?.trim()) {
    ev.push(
      evidenceShell({
        source: "service_history",
        type: "history",
        observation: `Service history: ${input.serviceHistory.trim()}`,
        reliability: "medium",
        tags: extractTags(input.serviceHistory),
      }),
    );
  }
  if (input.techNotes?.trim()) {
    const parsed = interpretObservation(input.techNotes);
    ev.push(
      evidenceShell({
        source: parsed.source,
        type: "statement",
        observation: input.techNotes.trim(),
        reliability: "medium",
        tags: parsed.tags,
      }),
    );
  }
  for (const d of parseDtcCodes(input.dtcsRaw ?? "")) {
    const kb = DTC_KB.find((x) => x.code === d.code);
    ev.push(
      evidenceShell({
        source: "dtc",
        type: "dtc",
        observation: `${d.code} ${d.title}. ${kb?.notADiagnosis ?? "A code is evidence, not a diagnosis."}`,
        structuredValue: { key: "dtc", value: d.code },
        reliability: "high",
        tags: unique(["mil_on", ...(kb?.tags ?? [])]),
      }),
    );
  }
  void tags;
  return ev;
}

export function analyze(session: DiagnosticSession, trigger = "reanalyze"): DiagnosticSession {
  const scores = scoreSession(session);
  const templates = relevantFaults(session);
  let hyps = templates
    .map((t) => buildHypothesis(t, scores[t.id] ?? 0, session.evidence))
    .sort((a, b) => b.score - a.score || likelihoodRank(a.likelihood) - likelihoodRank(b.likelihood));

  hyps = hyps.filter((h, i) => i < 8 || h.likelihood !== "very_low" || h.supporting.length);
  hyps = hyps.slice(0, 10);

  const evidence = linkEvidence(session.evidence, hyps);
  const next: DiagnosticSession = {
    ...session,
    evidence,
    hypotheses: hyps,
    updatedAt: Date.now(),
    nextAction: null,
    lastMovement: movement(session.hypotheses, hyps, evidence[evidence.length - 1]),
    status: session.status === "intake" ? "active" : session.status,
  };
  next.nextAction = pickNext(next, hyps);
  next.repair = repairRec(hyps);
  next.verification = verificationPlan(next, hyps[0]);
  if (hyps[0]?.status === "confirmed") next.status = "supported";
  next.reasoningSummary = summary(next, hyps);
  const lastSnap = session.history[session.history.length - 1];
  const changed =
    !lastSnap ||
    lastSnap.ranked.map((r) => r.id + r.likelihood).join() !== hyps.slice(0, 5).map((h) => h.id + h.likelihood).join();
  next.history = changed ? [...session.history, snapshot(hyps, trigger)].slice(-24) : session.history;
  return next;
}

export function createSession(input: IntakeInput): DiagnosticSession {
  const concernTags = extractTags(
    input.concern,
    input.warningLights ?? "",
    input.dtcsRaw ?? "",
    input.recentRepairs ?? "",
    input.serviceHistory ?? "",
    input.techNotes ?? "",
  );
  const family = detectFamily(concernTags);
  const evidence = seedEvidence(input, concernTags);
  const base: DiagnosticSession = {
    id: makeId("dx"),
    mode: input.mode ?? "assistant",
    createdAt: Date.now(),
    updatedAt: Date.now(),
    vehicle: input.vehicle,
    concern: input.concern.trim(),
    warningLights: input.warningLights?.trim() ?? "",
    dtcsRaw: input.dtcsRaw?.trim() ?? "",
    recentRepairs: input.recentRepairs?.trim() ?? "",
    serviceHistory: input.serviceHistory?.trim() ?? "",
    techNotes: input.techNotes?.trim() ?? "",
    family,
    tags: concernTags,
    symptoms: extractSymptoms(concernTags),
    operatingConditions: extractConditions(concernTags),
    evidence,
    hypotheses: [],
    history: [],
    askedQuestionIds: [],
    answered: [],
    testsRun: [],
    nextAction: null,
    lastMovement: [],
    status: "intake",
    simCaseId: input.simCaseId,
    evalLog: [],
    safetyFlags: extractSafety([input.concern, input.techNotes ?? ""].join(" ")),
    reasoningSummary: "",
  };
  return analyze(base, "intake");
}

export function answerQuestion(session: DiagnosticSession, questionId: string, optionId: string): DiagnosticSession {
  const q = QUESTIONS.find((x) => x.id === questionId) ?? session.nextAction?.question;
  if (!q) return session;
  const opt = q.options.find((o) => o.id === optionId);
  if (!opt) return session;
  const ev = evidenceShell({
    source: q.audience === "customer" ? "customer" : "technician",
    type: "statement",
    observation: `${q.prompt} → ${opt.label}`,
    reliability: q.audience === "customer" ? "medium" : "high",
    tags: opt.tags,
    notes: opt.narrative,
  });
  const next: DiagnosticSession = {
    ...session,
    tags: unique([...session.tags, ...opt.tags]),
    symptoms: extractSymptoms(unique([...session.tags, ...opt.tags])),
    operatingConditions: extractConditions(unique([...session.tags, ...opt.tags])),
    evidence: [...session.evidence, ev],
    askedQuestionIds: unique([...session.askedQuestionIds, questionId]),
    answered: [...session.answered, { questionId, optionId, at: Date.now() }],
  };
  return analyze(next, `question:${questionId}`);
}

export function addEvidence(session: DiagnosticSession, ev: Evidence): DiagnosticSession {
  const next: DiagnosticSession = {
    ...session,
    tags: unique([...session.tags, ...ev.tags]),
    symptoms: extractSymptoms(unique([...session.tags, ...ev.tags])),
    operatingConditions: unique([...session.operatingConditions, ...extractConditions(ev.tags)]),
    evidence: [...session.evidence, ev],
  };
  if (ev.operatingCondition) {
    next.operatingConditions = unique([...next.operatingConditions, ev.operatingCondition]);
  }
  return analyze(next, `evidence:${ev.type}`);
}

export function addObservation(session: DiagnosticSession, text: string, condition?: string, source?: Evidence["source"]): DiagnosticSession {
  const parsed = interpretObservation(text, condition);
  const pids = parsed.pids.length ? parsed.pids : parsePidPaste(text);
  const extraTags = tagsFromPids(pids, condition);
  const ev = evidenceShell({
    source: source ?? parsed.source,
    type: pids.length ? "measurement" : "statement",
    observation: text.trim(),
    operatingCondition: condition,
    reliability: source === "customer" ? "medium" : "high",
    tags: unique([...parsed.tags, ...extraTags]),
    structuredValue: pids[0] ? { key: pids[0].key, value: pids[0].value, units: pids[0].units } : undefined,
  });
  return addEvidence(session, ev);
}

export function addDtcs(session: DiagnosticSession, raw: string, status?: string, freezeFrame?: string): DiagnosticSession {
  let s = session;
  for (const d of parseDtcCodes(raw)) {
    const kb = DTC_KB.find((x) => x.code === d.code);
    s = addEvidence(
      s,
      evidenceShell({
        source: "dtc",
        type: "dtc",
        observation: `${d.code} ${d.title}${status ? ` (${status})` : ""}. ${kb?.notADiagnosis ?? "A code is evidence, not a diagnosis."}`,
        structuredValue: { key: "dtc", value: d.code },
        reliability: "high",
        tags: unique(["mil_on", ...(kb?.tags ?? [])]),
        notes: freezeFrame ? `Freeze-frame: ${freezeFrame}` : undefined,
      }),
    );
  }
  if (freezeFrame?.trim()) s = addObservation(s, freezeFrame, "freeze-frame", "freeze_frame");
  return s;
}

export function addPidPaste(session: DiagnosticSession, text: string, condition?: string): DiagnosticSession {
  return addObservation(session, text, condition ?? "live data", "live_pid");
}

export function recordTest(session: DiagnosticSession, testId: string, result: string, condition?: string): DiagnosticSession {
  const t = TESTS.find((x) => x.id === testId);
  const next = addObservation(
    {
      ...session,
      testsRun: [...session.testsRun, { testId, result, at: Date.now() }],
    },
    t ? `${t.name}: ${result}` : result,
    condition,
    "scan_test",
  );
  return next;
}

export function closeSession(session: DiagnosticSession): DiagnosticSession {
  return { ...session, status: "closed", updatedAt: Date.now() };
}

export { SYSTEMS, QUESTIONS, TESTS, DTC_KB, FAULTS };
