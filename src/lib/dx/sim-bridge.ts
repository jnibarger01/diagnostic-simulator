import type { CaseDefinition, TestResult, VehicleState } from "@/lib/sim/types";
import { TRUE_CAUSE_MAP } from "./knowledge";
import { addEvidence, addObservation } from "./engine";
import { evidenceShell, extractTags } from "./parse";
import type { DiagnosticSession, EvidenceSource } from "./types";

export function trueHypothesisId(def: CaseDefinition): string | null {
  return TRUE_CAUSE_MAP[def.fault.id] ?? null;
}

export function ingestInterview(session: DiagnosticSession, question: string, answer: string): DiagnosticSession {
  return addEvidence(
    session,
    evidenceShell({
      source: "customer",
      type: "statement",
      observation: `Customer: ${answer}`,
      reliability: "medium",
      tags: extractTags(question, answer),
      notes: question,
    }),
  );
}

export function ingestScan(session: DiagnosticSession, vehicle: VehicleState): DiagnosticSession {
  if (!vehicle.dtcs.length) {
    return addEvidence(
      session,
      evidenceShell({
        source: "dtc",
        type: "dtc",
        observation: `Scan complete. MIL ${vehicle.mil ? "ON" : "OFF"}. No DTCs stored at this time.`,
        reliability: "high",
        tags: vehicle.mil ? ["mil_on"] : ["no_mil"],
      }),
    );
  }
  let s = session;
  for (const d of vehicle.dtcs) {
    s = addEvidence(
      s,
      evidenceShell({
        source: "simulator",
        type: "dtc",
        observation: `${d.code} ${d.description} (${d.status}${d.mil ? ", MIL" : ""}). A code is evidence, not a diagnosis.`,
        structuredValue: { key: "dtc", value: d.code },
        reliability: "high",
        tags: extractTags(d.code, d.description),
      }),
    );
    if (d.freezeFrame) {
      const ff = d.freezeFrame;
      s = addObservation(
        s,
        `Freeze-frame ${d.code}: RPM ${Math.round(ff.rpm)} · VSS ${Math.round(ff.vss)} · ECT ${Math.round(ff.ect)}°F · STFT ${ff.stft.toFixed(1)}% · LTFT ${ff.ltft.toFixed(1)}% · MAF ${ff.maf.toFixed(1)} g/s · VPWR ${ff.vpwr.toFixed(1)} V`,
        "freeze-frame",
        "freeze_frame",
      );
    }
  }
  return s;
}

export function ingestTest(session: DiagnosticSession, result: TestResult, source: EvidenceSource = "scan_test"): DiagnosticSession {
  const flags = result.lines.filter((l) => l.flag === "fault" || l.flag === "warn").map((l) => `${l.k}: ${l.v}`);
  const text = `${result.title}. ${result.narrative}${flags.length ? ` Findings: ${flags.join("; ")}` : ""}`;
  return addObservation(session, text, undefined, source);
}

export function ingestDvom(session: DiagnosticSession, label: string, display: string, note?: string): DiagnosticSession {
  return addObservation(session, `DVOM ${label}: ${display}${note ? ` — ${note}` : ""}`, undefined, "dvom");
}

export function ingestScope(session: DiagnosticSession, ch: string, vehicle: VehicleState): DiagnosticSession {
  const ckpish = /ckp|crank/i.test(ch);
  if (ckpish) {
    const lost = !vehicle.crankOk;
    const text = lost
      ? `Oscilloscope on ${ch}: CKP waveform missing or dropped out at the current operating condition (RPM PID ${Math.round(vehicle.rpm)}).`
      : `Oscilloscope on ${ch}: CKP waveform present at the current operating condition.`;
    return addObservation(session, text, vehicle.engineRunning ? "engine running" : vehicle.cranking ? "cranking" : "KOEO", "oscilloscope");
  }
  const can = /can/i.test(ch);
  if (can) {
    const online = Object.values(vehicle.moduleOnline).every(Boolean);
    const text = online
      ? `Oscilloscope on ${ch}: bus activity present; modules currently online.`
      : `Oscilloscope on ${ch}: bus activity disturbed; one or more modules offline.`;
    return addObservation(session, text, undefined, "oscilloscope");
  }
  return addObservation(session, `Oscilloscope connected to ${ch}.`, undefined, "oscilloscope");
}

export function ingestLiveSnapshot(session: DiagnosticSession, vehicle: VehicleState): DiagnosticSession {
  const cond = vehicle.engineRunning ? "running" : vehicle.cranking ? "cranking" : "key on";
  const text = [
    `RPM ${Math.round(vehicle.rpm)}`,
    `ECT ${Math.round(vehicle.coolantF)}F`,
    `STFT ${vehicle.stft.toFixed(1)}%`,
    `LTFT ${vehicle.ltft.toFixed(1)}%`,
    `MAF ${vehicle.maf.toFixed(1)} g/s`,
    `MAP ${Math.round(vehicle.map)} kPa`,
    `Fuel pressure ${vehicle.fuelPsi.toFixed(0)} psi`,
    `VPWR ${vehicle.batteryV.toFixed(1)} V`,
    vehicle.cranking && vehicle.rpm === 0 ? "RPM 0 while cranking" : "",
  ]
    .filter(Boolean)
    .join("\n");
  return addObservation(session, text, cond, "live_pid");
}
