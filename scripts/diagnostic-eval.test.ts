import { describe, expect, it } from "vitest";
import { DIAGNOSTIC_EVAL_CASES, runDiagnosticEval } from "../src/lib/dx/diagnostic-eval";
import type { ComplaintFamily } from "../src/lib/dx/types";

describe("diagnostic eval regression gate", () => {
  it("covers 50-100 known-answer Toyota scenarios and meets thresholds", () => {
    expect(DIAGNOSTIC_EVAL_CASES.length).toBeGreaterThanOrEqual(50);
    expect(DIAGNOSTIC_EVAL_CASES.length).toBeLessThanOrEqual(100);

    const report = runDiagnosticEval();
    expect(report.cases).toBe(DIAGNOSTIC_EVAL_CASES.length);
    expect(report.top1Accuracy).toBeGreaterThanOrEqual(0.8);
    expect(report.top3Recall).toBeGreaterThanOrEqual(0.95);
    expect(report.falseConfirmationRate).toBe(0);
    expect(report.testsToDiagnosis).toBeGreaterThan(0);
    expect(report.partsCannonUnsafeRate).toBeLessThanOrEqual(0.05);
    expect(report.criteriaCoverage).toEqual({ faults: 31, confirmationCriteria: 31, refutationCriteria: 31 });
    expect(report.passed, report.failures.join("\n")).toBe(true);
  });

  it("covers each required diagnostic domain", () => {
    const families = new Set(DIAGNOSTIC_EVAL_CASES.map((testCase) => testCase.family));
    const requiredFamilies: ComplaintFamily[] = [
      "no_start",
      "stall",
      "misfire",
      "fuel_trim",
      "rich",
      "charging",
      "no_crank",
      "parasitic",
      "network",
      "adas",
      "hvac",
      "evap",
      "intermittent_electrical",
    ];
    for (const family of requiredFamilies) {
      expect(families.has(family), family).toBe(true);
    }
  });
});
