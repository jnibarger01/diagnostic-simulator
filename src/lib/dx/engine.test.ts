import { describe, expect, it } from "vitest";
import { addEvidence, addObservation, answerQuestion, createSession } from "./engine";
import { InMemoryDiagnosticKnowledgeProvider } from "./providers";
import { evidenceShell } from "./parse";
import { FAULTS } from "./knowledge";
import { criteriaForFault } from "./criteria";

const input = (concern: string) => ({ vehicle: { year: 2020, make: "Toyota", model: "RAV4" }, concern });

describe("evidence-driven diagnostic engine", () => {
  it("has explicit confirmation and refutation criteria for every catalog fault", () => {
    for (const fault of FAULTS) {
      const criteria = criteriaForFault(fault.id);
      expect(criteria.confirmation.length, fault.id).toBeGreaterThan(0);
      expect(criteria.refutation.length, fault.id).toBeGreaterThan(0);
    }
  });

  it("does not confirm from score or evidence confidence alone", () => {
    const s = createSession(input("instant stall after warm-up"));
    const h = s.hypotheses.find((x) => x.id === "ckp_sync");
    expect(h).toBeDefined();
    expect(h?.status).not.toBe("confirmed");
    expect(h?.criteria.allRequiredConfirmationSatisfied).toBe(false);
  });

  it("confirms only after the machine-readable criterion is satisfied", () => {
    const s = addEvidence(createSession(input("cranks but will not start")), evidenceShell({ source: "oscilloscope", type: "measurement", observation: "CKP waveform drops out during cranking", reliability: "high", tags: ["ckp_wave_loss"] }));
    const h = s.hypotheses.find((x) => x.id === "ckp_sync");
    expect(h?.status).toBe("confirmed");
    expect(h?.criteria.confirmation[0]?.satisfied).toBe(true);
    expect(h?.criteria.confirmation[0]?.evidenceIds).toHaveLength(1);
  });

  it("lets explicit refutation rule out a hypothesis regardless of score", () => {
    const s = addEvidence(createSession(input("cranks but will not start")), evidenceShell({ source: "oscilloscope", type: "measurement", observation: "CKP waveform remains stable", reliability: "high", tags: ["ckp_wave_ok"] }));
    const h = s.hypotheses.find((x) => x.id === "ckp_sync");
    expect(h?.status).toBe("ruled_out");
    expect(h?.criteria.anyRefutationSatisfied).toBe(true);
  });

  it("keeps likelihood movement separate from evidence confidence", () => {
    const before = createSession(input("rough idle and lean fuel trims"));
    const after = addObservation(before, "STFT 18%\nLTFT 16%", "idle", "live_pid");
    const h = after.hypotheses.find((x) => x.id === "unmetered_air");
    expect(h?.likelihood).not.toBe("very_low");
    expect(h?.evidenceConfidence).toBe("medium");
    expect(after.lastMovement.length).toBeGreaterThan(0);
  });

  it("selects a discriminating next action and accepts normalized provider evidence", () => {
    const provider = new InMemoryDiagnosticKnowledgeProvider();
    const normalized = provider.normalizeEvidence({ source: "pressure", type: "measurement", observation: "pressure collapsed", tags: ["fuel_pressure_low", "fuel_pressure_low", ""], reliability: "high" });
    expect(normalized.tags).toEqual(["fuel_pressure_low"]);
    const s = addEvidence(createSession(input("stalls under load")), normalized);
    expect(s.nextAction).toBeDefined();
    expect(s.nextAction?.title).toMatch(/fuel|pressure|spark|CKP|test/i);
  });

  it("supports question evidence and Toyota complaint families", () => {
    const s = createSession(input("blind spot monitor warning after bumper repair"));
    expect(s.family).toBe("adas");
    const q = s.nextAction?.question;
    if (q) {
      const option = q.options.find((x) => x.tags.includes("bsm_no_init")) ?? q.options[0];
      const answered = answerQuestion(s, q.id, option!.id);
      expect(answered.answered).toHaveLength(1);
      expect(answered.hypotheses.every((h) => h.criteria.confirmation.length > 0 && h.criteria.refutation.length > 0)).toBe(true);
    }
  });
});
