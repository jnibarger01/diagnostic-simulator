import { describe, expect, it } from "vitest";
import { addObservation, createSession } from "./engine";

const input = (concern: string) => ({
  vehicle: { year: 2020, make: "Toyota", model: "Camry" },
  concern,
});

describe("diagnostic engine adversarial evidence", () => {
  it("counts fresh technical support when determining confidence", () => {
    let session = createSession(input("cranks but will not start"));
    session = addObservation(
      session,
      "CKP waveform dropout during cranking",
      "cranking",
      "oscilloscope",
    );
    session = addObservation(
      session,
      "RPM drops to zero while the engine is still cranking",
      "cranking",
      "live_pid",
    );

    const hypothesis = session.hypotheses.find((item) => item.id === "ckp_sync");
    expect(hypothesis?.evidenceConfidence).toBe("high");
    expect(hypothesis?.status).toBe("confirmed");
  });

  it("honors strong refutation before aggregate score when evidence conflicts", () => {
    const session = addObservation(
      createSession(input("cranks but will not start")),
      "CKP waveform remains stable during cranking",
      "cranking",
      "oscilloscope",
    );

    const hypothesis = session.hypotheses.find((item) => item.id === "ckp_sync");
    expect(hypothesis?.contradicting).toContain("CKP waveform remains stable during cranking");
    expect(hypothesis?.status).toBe("ruled_out");
  });

  it("reopens a supported session when later evidence refutes its conclusion", () => {
    let session = createSession(input("cranks but will not start"));
    session = addObservation(
      session,
      "CKP waveform dropout during cranking",
      "cranking",
      "oscilloscope",
    );
    session = addObservation(
      session,
      "RPM drops to zero while the engine is still cranking",
      "cranking",
      "live_pid",
    );
    expect(session.status).toBe("supported");

    session = addObservation(
      session,
      "CKP waveform remains stable during cranking",
      "cranking",
      "oscilloscope",
    );

    expect(session.status).toBe("active");
    expect(session.hypotheses.find((item) => item.id === "ckp_sync")?.status).toBe("ruled_out");
  });

  it("does not overstate an incomplete symptom-only case", () => {
    const session = createSession(input("instant stall after warm-up"));

    expect(session.hypotheses.some((item) => item.status === "confirmed")).toBe(false);
    expect(session.repair).toBeUndefined();
  });

  it("keeps ranking and next-action decisions deterministic for equivalent evidence", () => {
    const first = createSession(input("stalls instantly while driving after a long drive"));
    const second = createSession(input("stalls instantly while driving after a long drive"));
    const project = (session: typeof first) => ({
      hypotheses: session.hypotheses.map(({ id, likelihood, score, status }) => ({
        id,
        likelihood,
        score,
        status,
      })),
      nextAction: session.nextAction && {
        kind: session.nextAction.kind,
        title: session.nextAction.title,
        testId: session.nextAction.testId,
        questionId: session.nextAction.question?.id,
      },
    });

    expect(project(first)).toEqual(project(second));
  });
});
