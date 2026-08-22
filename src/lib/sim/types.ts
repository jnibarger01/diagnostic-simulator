export type Difficulty = "beginner" | "technician" | "master";

export type ToolId =
  | "concern"
  | "interview"
  | "history"
  | "scan"
  | "dvom"
  | "scope"
  | "smoke"
  | "fuel"
  | "inspect"
  | "drive"
  | "wiring"
  | "parts"
  | "hypotheses"
  | "tree"
  | "notes";

export type KeyPosition = "off" | "acc" | "on" | "start";

export type DriveMode =
  | "parked"
  | "idle"
  | "city"
  | "highway"
  | "accel"
  | "decel"
  | "stop_go"
  | "hill"
  | "hot_soak";

export type FaultKind =
  | "open_circuit"
  | "temp_resistance"
  | "intermittent_connection"
  | "vacuum_leak"
  | "parasitic_draw"
  | "can_bus_fault"
  | "fuel_delivery"
  | "charging_fault";

export type DvomMode = "dcv" | "acv" | "ohm" | "continuity" | "vdrop";

export type SignalKind =
  | "ckp_vr"
  | "ckp_hall"
  | "cmp_hall"
  | "injector"
  | "ignition"
  | "can_h"
  | "can_l"
  | "can_diff"
  | "wheel_speed"
  | "tps"
  | "alt_bplus"
  | "battery"
  | "maf"
  | "ref_5v"
  | "sensor"
  | "ground"
  | "power"
  | "none";

export type HypothesisStatus = "possible" | "likely" | "unlikely" | "ruled_out" | "confirmed";

export type DtcStatus = "pending" | "confirmed" | "permanent" | "history";

export interface VehicleInfo {
  year: number;
  make: string;
  model: string;
  engine: string;
  vin: string;
  mileage: number;
}

export interface HistoryEntry {
  date: string;
  mileage: number;
  work: string;
  shop: string;
  misleading?: boolean;
}

export interface EcuModule {
  id: string;
  name: string;
  address: string;
  protocol: "CAN" | "LIN" | "ISO9141";
}

export interface ComponentDef {
  id: string;
  name: string;
  group: string;
  partCost: number;
  laborHours: number;
}

export interface WiringNode {
  id: string;
  label: string;
  kind: "sensor" | "ecu" | "ground" | "fuse" | "relay" | "connector" | "splice" | "battery" | "power" | "module";
  x: number;
  y: number;
  signal: SignalKind;
  circuit: string;
}

export interface WiringWire {
  from: string;
  to: string;
  label?: string;
  color: "blk" | "wht" | "red" | "grn" | "yel" | "blu" | "brn" | "org" | "ppl" | "gry";
}

export interface WiringDiagram {
  title: string;
  nodes: WiringNode[];
  wires: WiringWire[];
}

export interface DtcRule {
  code: string;
  description: string;
  module: string;
  mil: boolean;
  pendingSec: number;
  confirmSec: number;
  /** Evaluated against live state each tick. */
  condition: DtcCondition;
  distractor?: boolean;
}

export type DtcCondition =
  | { type: "no_ckp_while_cranking" }
  | { type: "lost_ckp_while_running" }
  | { type: "ckp_intermittent" }
  | { type: "lean_trims"; ltft: number; stft: number }
  | { type: "misfire" }
  | { type: "system_voltage_low" }
  | { type: "lost_comm"; module: string }
  | { type: "always_if_fault_active" }
  | { type: "evap_small_leak" }
  | { type: "never" };

export interface InspectionFinding {
  area: string;
  label: string;
  timeHr: number;
  finding: string;
  reveals?: boolean;
  requiresWiggle?: boolean;
  visibleOnlyIfFault?: boolean;
}

export interface InterviewItem {
  keywords: string[];
  answer: string;
  useful?: boolean;
}

export interface InterviewBank {
  greeting: string;
  unknown: string;
  items: InterviewItem[];
}

export interface VerificationReq {
  needDrive: boolean;
  needHot: boolean;
  needLoad: boolean;
  needKeyOffSoak: boolean;
  needScopeConfirm: boolean;
  needTrimConfirm: boolean;
  needNoCodeReturn: boolean;
}

export interface FaultModel {
  id: string;
  rootCause: string;
  componentId: string;
  failureMode: string;
  kind: FaultKind;
  minCoolantF?: number;
  minComponentF?: number;
  minRpm?: number;
  minLoad?: number;
  minVibration?: number;
  keyOffOnly?: boolean;
  engineRunningOnly?: boolean;
  intermittentChance?: number;
  recoverSec?: number;
  resistanceOhms?: number;
  resistanceHotOhms?: number;
  signalScale?: number;
  parasiticAmps?: number;
  canFault?: "none" | "canh-gnd" | "canl-gnd" | "shorted" | "open";
  fuelPressureDropPsi?: number;
  unmeteredAirGps?: number;
  chargingVoltage?: number;
  rippleVac?: number;
  groundDropV?: number;
  leakLocation?: string;
  inspectionHint?: string;
  dtcs: DtcRule[];
  inspectionFindings: InspectionFinding[];
  correctComponentIds: string[];
  verification: VerificationReq;
  previousBadRepair?: { part: string; shop: string; note: string };
}

export interface CaseDefinition {
  id: string;
  title: string;
  difficulty: Difficulty;
  stars: 1 | 2 | 3 | 4 | 5;
  category: "driveability" | "electrical" | "network" | "no-start";
  vehicle: VehicleInfo;
  roNumber: string;
  concern: string;
  concernDetail: string;
  ambientF: number;
  fuelLevel: number;
  serviceHistory: HistoryEntry[];
  modules: EcuModule[];
  components: ComponentDef[];
  wiring: WiringDiagram;
  fault: FaultModel;
  interview: InterviewBank;
  expertPathHours: number;
  allowanceHours: number;
  allowanceUsd: number;
  pidSet: "basic" | "full";
  hints: string[];
  valuableTests: string[];
  generated?: boolean;
}

export interface DtcRecord {
  code: string;
  description: string;
  module: string;
  status: DtcStatus;
  mil: boolean;
  setSimTime: number;
  freezeFrame?: FreezeFrame;
  distractor?: boolean;
}

export interface FreezeFrame {
  rpm: number;
  vss: number;
  ect: number;
  load: number;
  stft: number;
  ltft: number;
  maf: number;
  map: number;
  iat: number;
  vpwr: number;
}

export interface VehicleState {
  seed: number;
  simTime: number;
  key: KeyPosition;
  engineRunning: boolean;
  cranking: boolean;
  rpm: number;
  vss: number;
  coolantF: number;
  iatF: number;
  ambientF: number;
  componentF: number;
  batteryV: number;
  soc: number;
  altV: number;
  rippleVac: number;
  parasiticA: number;
  load: number;
  tps: number;
  accel: number;
  maf: number;
  map: number;
  stft: number;
  ltft: number;
  fuelPsi: number;
  afr: number;
  o2dn: number;
  ignTiming: number;
  fuelPct: number;
  mode: DriveMode;
  vibration: number;
  wiggleTimer: number;
  faultActive: boolean;
  faultSeverity: number;
  lostSync: number;
  crankOk: boolean;
  camOk: boolean;
  injectorMs: number;
  spark: boolean;
  mil: boolean;
  dtcs: DtcRecord[];
  pendingTimers: Record<string, number>;
  moduleOnline: Record<string, boolean>;
  replaced: string[];
  faultCleared: boolean;
  heatSoak: boolean;
  crankAttempts: number;
  stalledEvent: boolean;
  lastStallTime: number;
  runTime: number;
  trimsLocked: boolean;
}

export interface ActionLogEntry {
  t: number;
  laborHr: number;
  kind: string;
  label: string;
  detail: string;
  testId?: string;
  useful?: boolean;
}

export interface Hypothesis {
  id: string;
  text: string;
  status: HypothesisStatus;
  evidence: { plus: string[]; minus: string[] };
}

export interface TestResult {
  id: string;
  title: string;
  laborHr: number;
  lines: { k: string; v: string; flag?: "ok" | "warn" | "fault" }[];
  narrative: string;
  useful: boolean;
}

export interface DvomReading {
  display: string;
  numeric: number | null;
  unit: string;
  valid: boolean;
  note?: string;
}

export interface ScoreBreakdown {
  total: number;
  rootCause: { got: number; max: 30 };
  evidence: { got: number; max: 20 };
  efficiency: { got: number; max: 20 };
  time: { got: number; max: 15 };
  verification: { got: number; max: 15 };
  unnecessaryTests: string[];
  unnecessaryParts: string[];
  rootCauseText: string;
  bestEvidence: string;
  diagnosticHours: number;
  expertHours: number;
  notes: string[];
}

export interface PlayerProfile {
  version: number;
  casesCompleted: number;
  scores: { caseId: string; score: number; hours: number; at: number; firstTry: boolean }[];
  bestByCase: Record<string, number>;
  unnecessaryParts: number;
  firstTimeHits: number;
  generatedCases: CaseDefinition[];
  achievements: string[];
  notesByCase: Record<string, string>;
  lastDaily: string | null;
  level: number;
}

export const PID_META: {
  id: string;
  label: string;
  unit: string;
  group: string;
  basic: boolean;
}[] = [
  { id: "rpm", label: "Engine RPM", unit: "rpm", group: "Engine", basic: true },
  { id: "vss", label: "Vehicle Speed", unit: "mph", group: "Engine", basic: true },
  { id: "coolantF", label: "Coolant Temp", unit: "°F", group: "Engine", basic: true },
  { id: "iatF", label: "Intake Air Temp", unit: "°F", group: "Engine", basic: true },
  { id: "batteryV", label: "Battery Voltage", unit: "V", group: "Electrical", basic: true },
  { id: "tps", label: "Throttle Position", unit: "%", group: "Engine", basic: true },
  { id: "accel", label: "Accelerator", unit: "%", group: "Engine", basic: true },
  { id: "maf", label: "MAF", unit: "g/s", group: "Fuel", basic: true },
  { id: "map", label: "MAP", unit: "kPa", group: "Fuel", basic: true },
  { id: "load", label: "Calc. Load", unit: "%", group: "Engine", basic: true },
  { id: "stft", label: "STFT B1", unit: "%", group: "Fuel", basic: true },
  { id: "ltft", label: "LTFT B1", unit: "%", group: "Fuel", basic: true },
  { id: "afr", label: "A/F Sensor B1S1", unit: "λ", group: "Fuel", basic: false },
  { id: "o2dn", label: "O2 B1S2", unit: "V", group: "Fuel", basic: false },
  { id: "fuelPsi", label: "Fuel Pressure", unit: "psi", group: "Fuel", basic: false },
  { id: "ignTiming", label: "Ignition Timing", unit: "°", group: "Ignition", basic: false },
  { id: "altV", label: "Alternator", unit: "V", group: "Electrical", basic: false },
  { id: "componentF", label: "Component Temp*", unit: "°F", group: "Engine", basic: false },
];

export function pidValue(state: VehicleState, id: string): number {
  const map: Record<string, number> = {
    rpm: state.rpm,
    vss: state.vss,
    coolantF: state.coolantF,
    iatF: state.iatF,
    batteryV: state.batteryV,
    tps: state.tps,
    accel: state.accel,
    maf: state.maf,
    map: state.map,
    load: state.load,
    stft: state.stft,
    ltft: state.ltft,
    afr: state.afr,
    o2dn: state.o2dn,
    fuelPsi: state.fuelPsi,
    ignTiming: state.ignTiming,
    altV: state.altV,
    componentF: state.componentF,
  };
  return map[id] ?? 0;
}
