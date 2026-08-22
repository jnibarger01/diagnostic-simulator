import type { CaseDefinition, Difficulty, FaultKind } from "@/lib/sim/types";
import { canDiagram, chargingDiagram, ckpDiagram, COMMON_PARTS as P, intakeDiagram, STANDARD_MODULES } from "./wiring";

const VEHICLES = [
  { year: 2016, make: "Toyota", model: "Camry", engine: "2.5L 2AR-FE" },
  { year: 2013, make: "Toyota", model: "Tacoma", engine: "4.0L 1GR-FE" },
  { year: 2015, make: "Toyota", model: "Sienna", engine: "3.5L 2GR-FE" },
  { year: 2019, make: "Lexus", model: "RX 350", engine: "3.5L 2GR-FKS" },
  { year: 2021, make: "Toyota", model: "Highlander", engine: "3.5L 2GR-FKS" },
  { year: 2012, make: "Toyota", model: "Prius", engine: "1.8L 2ZR-FXE" },
  { year: 2018, make: "Toyota", model: "Tundra", engine: "5.7L 3UR-FE" },
  { year: 2022, make: "Toyota", model: "RAV4", engine: "2.5L A25A-FKS" },
];

function vin(seed: number) {
  const body = "2T1BURHE0HC";
  return body + String(100000 + (seed % 900000));
}

function pickKind(text: string): FaultKind {
  const t = text.toLowerCase();
  if (/(dead battery|won't start after sit|parasitic|drains)/.test(t)) return "parasitic_draw";
  if (/(warning lights|communication|network|can|modules|abs traction)/.test(t)) return "can_bus_fault";
  if (/(rough idle|check engine|lean|p0171|maf|vacuum)/.test(t)) return "vacuum_leak";
  if (/(crank.*no start|cranks but|no start|won't start|will not start)/.test(t)) return "open_circuit";
  if (/(hot|heat|warm|after driving|soak)/.test(t)) return "temp_resistance";
  if (/(stall|dies|intermittent|sometimes)/.test(t)) return "intermittent_connection";
  if (/(charge|alternator|battery light)/.test(t)) return "charging_fault";
  if (/(no start|crank)/.test(t)) return "open_circuit";
  return "temp_resistance";
}

export function generateLocalCase(prompt: string, difficulty: Difficulty = "technician"): CaseDefinition {
  const seed = Date.now() >>> 0;
  const kind = pickKind(prompt);
  const v = VEHICLES[seed % VEHICLES.length]!;
  const id = `gen-${seed.toString(36)}`;
  const ro = String(25000 + (seed % 4000));
  const concern = prompt.trim().slice(0, 280) || "Customer concern not specified.";

  const base = {
    id,
    title: concern.slice(0, 42),
    difficulty,
    stars: (difficulty === "beginner" ? 2 : difficulty === "master" ? 5 : 3) as 2 | 3 | 5,
    vehicle: { ...v, vin: vin(seed), mileage: 40000 + (seed % 160000) },
    roNumber: ro,
    concern,
    concernDetail: "Generated case. Hidden fault is simulated causally — it will not be revealed until you close the RO.",
    ambientF: 55 + (seed % 45),
    fuelLevel: 0.3 + (seed % 50) / 100,
    serviceHistory: [
      { date: "2026-02-11", mileage: 0, work: "Oil service", shop: "Dealer" },
    ],
    modules: STANDARD_MODULES,
    interview: {
      greeting: "That's pretty much what I wrote on the ticket.",
      unknown: "I don't know. It just does that thing I told you.",
      items: [
        { keywords: ["when", "start"], answer: "It's been going on a couple weeks.", useful: true },
        { keywords: ["hot", "cold"], answer: kind === "temp_resistance" ? "Only after it's been running a while." : "I don't think temperature matters.", useful: true },
        { keywords: ["light", "cel"], answer: "Sometimes the light is on, sometimes it isn't.", useful: false },
        { keywords: ["repair", "shop"], answer: "Somebody already threw a part at it. Didn't help.", useful: true },
        { keywords: ["restart"], answer: kind === "intermittent_connection" ? "It dies, then it might start, then it dies again." : "Depends.", useful: true },
      ],
    },
    hints: difficulty === "beginner" ? ["Scan first. Confirm the complaint. Test, then replace."] : [],
    generated: true,
    expertPathHours: 1.2,
    allowanceHours: 2.0,
    allowanceUsd: 220,
    pidSet: "full" as const,
  };

  if (kind === "open_circuit") {
    return {
      ...base,
      category: "no-start",
      components: [P.ckp, P.cmp, P.pump, P.relay, P.ecm],
      wiring: ckpDiagram("hall"),
      fault: {
        id: "g-open",
        rootCause: "CKP sensor open circuit. No engine-position signal while cranking.",
        componentId: "ckp_sensor",
        failureMode: "Open",
        kind,
        dtcs: [{ code: "P0335", description: "CKP Circuit A", module: "ecm", mil: true, pendingSec: 2, confirmSec: 6, condition: { type: "no_ckp_while_cranking" } }],
        inspectionFindings: [],
        correctComponentIds: ["ckp_sensor"],
        verification: { needDrive: false, needHot: false, needLoad: false, needKeyOffSoak: false, needScopeConfirm: true, needTrimConfirm: false, needNoCodeReturn: true },
      },
      valuableTests: ["scan", "scope", "dvom"],
    };
  }
  if (kind === "vacuum_leak") {
    return {
      ...base,
      category: "driveability",
      components: [P.maf, P.boot, P.pump, P.purge, P.pcv],
      wiring: intakeDiagram(),
      fault: {
        id: "g-leak",
        rootCause: "Intake boot torn downstream of MAF — unmetered air, high positive trims.",
        componentId: "intake_boot",
        failureMode: "Unmetered air",
        kind,
        unmeteredAirGps: 2.7,
        leakLocation: "intake boot after MAF",
        dtcs: [{ code: "P0171", description: "System Too Lean Bank 1", module: "ecm", mil: true, pendingSec: 8, confirmSec: 16, condition: { type: "lean_trims", ltft: 10, stft: 8 } }],
        inspectionFindings: [{ area: "vacuum", label: "Intake boot", timeHr: 0.2, finding: "Split in the intake hose after the MAF.", reveals: true, visibleOnlyIfFault: true }],
        correctComponentIds: ["intake_boot"],
        verification: { needDrive: true, needHot: false, needLoad: false, needKeyOffSoak: false, needScopeConfirm: false, needTrimConfirm: true, needNoCodeReturn: true },
      },
      valuableTests: ["scan", "smoke", "inspect:vacuum"],
    };
  }
  if (kind === "parasitic_draw") {
    return {
      ...base,
      category: "electrical",
      components: [P.batt, P.alt, P.glove],
      wiring: chargingDiagram(),
      fault: {
        id: "g-draw",
        rootCause: "Stuck glove box lamp switch. ~1.8 A key-off draw.",
        componentId: "glove_box_switch",
        failureMode: "Stuck closed",
        kind,
        keyOffOnly: true,
        parasiticAmps: 1.7,
        dtcs: [],
        inspectionFindings: [{ area: "interior", label: "Glove lamp", timeHr: 0.2, finding: "Lamp stays on with the door latched.", reveals: true, visibleOnlyIfFault: true }],
        correctComponentIds: ["glove_box_switch"],
        verification: { needDrive: false, needHot: false, needLoad: false, needKeyOffSoak: true, needScopeConfirm: false, needTrimConfirm: false, needNoCodeReturn: false },
      },
      valuableTests: ["parasitic", "inspect:interior", "overnight"],
    };
  }
  if (kind === "can_bus_fault") {
    return {
      ...base,
      category: "network",
      components: [P.splice, P.head, P.ecm],
      wiring: canDiagram(),
      modules: [
        ...STANDARD_MODULES,
        { id: "audio", name: "Audio", address: "760", protocol: "CAN" },
        { id: "gateway", name: "Gateway", address: "701", protocol: "CAN" },
      ],
      fault: {
        id: "g-can",
        rootCause: "CAN-H shorted at an aftermarket stereo splice.",
        componentId: "can_splice_stereo",
        failureMode: "CAN-H to ground",
        kind,
        canFault: "canh-gnd",
        dtcs: [{ code: "U0100", description: "Lost Comm ECM", module: "gateway", mil: true, pendingSec: 1, confirmSec: 3, condition: { type: "lost_comm", module: "abs" } }],
        inspectionFindings: [{ area: "stereo", label: "Radio harness", timeHr: 0.25, finding: "Scotch-lok on CAN-H behind the radio, shorting to a bracket.", reveals: true, visibleOnlyIfFault: true }],
        correctComponentIds: ["can_splice_stereo", "audio"],
        verification: { needDrive: true, needHot: false, needLoad: false, needKeyOffSoak: false, needScopeConfirm: true, needTrimConfirm: false, needNoCodeReturn: true },
      },
      valuableTests: ["scan", "scope", "inspect:stereo"],
    };
  }
  if (kind === "intermittent_connection") {
    return {
      ...base,
      category: "driveability",
      components: [P.ckp, P.ckp_conn, P.pump, P.coil],
      wiring: ckpDiagram("vr"),
      fault: {
        id: "g-int",
        rootCause: "Corroded CKP connector. Vibration drops the crank signal.",
        componentId: "ckp_connector",
        failureMode: "Intermittent",
        kind,
        minVibration: 0.3,
        intermittentChance: 0.4,
        dtcs: [{ code: "P0339", description: "CKP intermittent", module: "ecm", mil: false, pendingSec: 1, confirmSec: 8, condition: { type: "ckp_intermittent" } }],
        inspectionFindings: [{ area: "connectors", label: "CKP connector", timeHr: 0.2, finding: "Green corrosion on the signal pin.", reveals: true, visibleOnlyIfFault: true }],
        correctComponentIds: ["ckp_connector", "ckp_sensor"],
        verification: { needDrive: true, needHot: false, needLoad: true, needKeyOffSoak: false, needScopeConfirm: true, needTrimConfirm: false, needNoCodeReturn: true },
      },
      valuableTests: ["scan", "scope", "wiggle", "drive"],
    };
  }
  return {
    ...base,
    category: "driveability",
    components: [P.ckp, P.cmp, P.pump, P.maf],
    wiring: ckpDiagram("hall"),
    fault: {
      id: "g-hot",
      rootCause: "CKP internal resistance rises when hot. Cold tests pass. Hot signal drops out.",
      componentId: "ckp_sensor",
      failureMode: "Temp-dependent resistance",
      kind: "temp_resistance",
      minComponentF: 205,
      resistanceOhms: 980,
      resistanceHotOhms: 42000,
      dtcs: [{ code: "P0335", description: "CKP Circuit A", module: "ecm", mil: true, pendingSec: 2, confirmSec: 10, condition: { type: "lost_ckp_while_running" } }],
      inspectionFindings: [],
      correctComponentIds: ["ckp_sensor"],
      verification: { needDrive: true, needHot: true, needLoad: false, needKeyOffSoak: false, needScopeConfirm: true, needTrimConfirm: false, needNoCodeReturn: true },
    },
    valuableTests: ["scan", "scope", "drive", "dvom"],
  };
}
