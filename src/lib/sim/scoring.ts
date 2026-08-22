import { clamp } from "@/lib/utils";
import type { ActionLogEntry, CaseDefinition, Hypothesis, ScoreBreakdown, VehicleState } from "./types";

export interface ScoreInput {
  def: CaseDefinition;
  state: VehicleState;
  log: ActionLogEntry[];
  hypotheses: Hypothesis[];
  laborHours: number;
  partsReplaced: { id: string; name: string; cost: number }[];
  verifiedDrive: boolean;
  verifiedHot: boolean;
  verifiedLoad: boolean;
  verifiedScope: boolean;
  verifiedTrim: boolean;
  verifiedSoak: boolean;
  codesClearedAfter: boolean;
  surrendered: boolean;
  hintsUsed: number;
}

export function scoreCase(input: ScoreInput): ScoreBreakdown {
  const { def, state, log, hypotheses, laborHours, partsReplaced, surrendered } = input;
  const notes: string[] = [];
  const correct = state.faultCleared;
  const correctPart = partsReplaced.some((p) => def.fault.correctComponentIds.includes(p.id));

  let root = 0;
  if (correct && correctPart) root = 30;
  else if (correct) root = 24;
  else {
    const named = hypotheses.some(
      (h) =>
        (h.status === "confirmed" || h.status === "likely") &&
        def.fault.correctComponentIds.some((id) => h.text.toLowerCase().includes(id.replace(/_/g, " ").slice(0, 6))),
    );
    const textHit = hypotheses.some((h) => {
      const t = h.text.toLowerCase();
      return (
        (h.status === "confirmed" || h.status === "likely") &&
        (t.includes("crank") ||
          t.includes("ckp") ||
          t.includes("intake") ||
          t.includes("boot") ||
          t.includes("vacuum") ||
          t.includes("glove") ||
          t.includes("parasitic") ||
          t.includes("can") ||
          t.includes("network") ||
          t.includes("splice") ||
          t.includes("head unit") ||
          t.includes("connector"))
      );
    });
    if (named || textHit) root = 8;
  }
  if (surrendered) root = Math.min(root, 6);

  const useful = log.filter((l) => l.useful);
  const usefulKinds = new Set(useful.map((l) => l.testId ?? l.kind));
  let evidence = 0;
  evidence += Math.min(12, usefulKinds.size * 3);
  const attached = hypotheses.some((h) => h.evidence.plus.length > 0 && (h.status === "confirmed" || h.status === "likely"));
  if (attached) evidence += 5;
  if (log.some((l) => l.kind === "scope" && l.useful)) evidence += 3;
  if (log.some((l) => l.kind === "interview")) evidence += 1;
  evidence = clamp(evidence, 0, 20);
  if (hypotheses.some((h) => h.status === "confirmed" && h.evidence.plus.length === 0)) {
    evidence = Math.max(0, evidence - 4);
    notes.push("A hypothesis was confirmed without attached evidence.");
  }

  const unnecessaryTests: string[] = [];
  const seen = new Set<string>();
  for (const l of log) {
    const id = l.testId ?? l.kind;
    if (l.kind === "notes" || l.kind === "hypothesis" || l.kind === "key" || l.kind === "interview") continue;
    if (["scan", "dtc_clear", "drive", "inspect", "scope", "dvom", "fuel", "smoke", "parasitic", "charging", "wiggle"].includes(l.kind) || l.testId) {
      if (seen.has(id) && l.kind !== "drive" && l.kind !== "scan") {
        unnecessaryTests.push(`Repeat: ${l.label}`);
      }
      seen.add(id);
      if (l.useful === false && (l.kind === "smoke" || l.kind === "fuel" || l.kind === "parasitic")) {
        if (!def.valuableTests.includes(l.kind) && !def.valuableTests.includes(id)) {
          unnecessaryTests.push(l.label);
        }
      }
    }
  }
  let efficiency = 20 - Math.min(20, unnecessaryTests.length * 2);
  if (log.filter((l) => l.kind === "scan").length === 0) {
    efficiency -= 3;
    notes.push("Vehicle was never scanned.");
  }

  const ratio = laborHours / Math.max(0.4, def.expertPathHours);
  let time = 15;
  if (ratio > 1) time = clamp(15 - (ratio - 1) * 10, 0, 15);
  if (ratio < 0.5 && !correct) time = 6;

  let verification = 0;
  if (correct) {
    if (def.fault.verification.needDrive) {
      if (input.verifiedDrive) verification += 4;
      else notes.push("No post-repair test drive.");
    } else verification += 3;
    if (def.fault.verification.needHot) {
      if (input.verifiedHot) verification += 4;
      else notes.push("Original hot condition was not reproduced after the repair.");
    } else if (def.fault.verification.needKeyOffSoak) {
      if (input.verifiedSoak) verification += 4;
      else notes.push("Key-off soak was not repeated after the repair.");
    } else verification += 3;
    if (def.fault.verification.needNoCodeReturn) {
      if (input.codesClearedAfter && !state.mil) verification += 4;
      else notes.push("Codes were not cleared and rechecked after the repair.");
    } else if (input.verifiedScope || input.verifiedTrim) verification += 3;
    else verification += 2;
    verification = Math.min(15, verification);
  } else {
    notes.push("Root cause was not corrected, so verification cannot complete.");
  }

  const unnecessaryParts = partsReplaced
    .filter((p) => !def.fault.correctComponentIds.includes(p.id))
    .map((p) => p.name);
  const penalty = unnecessaryParts.length * 8 + input.hintsUsed * 3 + (surrendered ? 20 : 0);
  let total = root + evidence + efficiency + time + verification - penalty;
  total = clamp(Math.round(total), 0, 100);

  const bestEvidence =
    useful.sort((a, b) => (b.useful ? 1 : 0) - (a.useful ? 1 : 0))[0]?.detail ??
    "No discriminating test was logged.";

  return {
    total,
    rootCause: { got: root, max: 30 },
    evidence: { got: evidence, max: 20 },
    efficiency: { got: efficiency, max: 20 },
    time: { got: Math.round(time), max: 15 },
    verification: { got: verification, max: 15 },
    unnecessaryTests: [...new Set(unnecessaryTests)].slice(0, 8),
    unnecessaryParts,
    rootCauseText: def.fault.rootCause,
    bestEvidence,
    diagnosticHours: +laborHours.toFixed(2),
    expertHours: def.expertPathHours,
    notes,
  };
}

export const ACHIEVEMENTS = [
  { id: "first-close", label: "First Close", desc: "Complete a repair order" },
  { id: "no-cannon", label: "No Cannon", desc: "Finish with zero unnecessary parts" },
  { id: "sub-hour", label: "Sub-Hour", desc: "Close a case under 1.0 hr" },
  { id: "heat", label: "Heat Soaked", desc: "Solve a temperature-dependent fault" },
  { id: "bus", label: "Bus Whisperer", desc: "Solve a network case" },
  { id: "night", label: "Graveyard Draw", desc: "Solve a parasitic-draw case" },
  { id: "perfect", label: "Master Sheet", desc: "Score 95 or higher" },
  { id: "master", label: "Master Tech", desc: "Complete a Master Tech case" },
] as const;
