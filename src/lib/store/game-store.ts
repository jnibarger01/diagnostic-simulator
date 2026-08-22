import { create } from "zustand";
import { CASES, getCase } from "@/lib/cases/catalog";
import { scoreCase, ACHIEVEMENTS, type ScoreInput } from "@/lib/sim/scoring";
import {
  clearCodes,
  createInitialState,
  laborFor,
  makeLog,
  parkOvernight,
  replaceComponent,
  setKey,
  setMode,
  snapshotPids,
  tick,
  wiggle,
} from "@/lib/sim/engine";
import { inspectArea, matchInterview, measureDvom, runChargingTest, runFuelTest, runParasiticTest, runSmokeTest } from "@/lib/sim/measurements";
import type {
  ActionLogEntry,
  CaseDefinition,
  DriveMode,
  DvomMode,
  Hypothesis,
  HypothesisStatus,
  KeyPosition,
  PlayerProfile,
  ScoreBreakdown,
  TestResult,
  ToolId,
  VehicleState,
} from "@/lib/sim/types";
import { mulberry32 } from "@/lib/utils";
import { levelFrom, loadProfile, saveProfile, upsertGenerated } from "./persist";
import { useDx } from "./dx-store";

export type PidSample = ReturnType<typeof snapshotPids>;

let uiAcc = 0;
let runtimeVehicle: VehicleState | null = null;

interface ReplaceOffer {
  id: string;
  name: string;
  cost: number;
  labor: number;
  evidence: "none" | "low" | "moderate" | "high";
  warning?: string;
}

interface GameStore {
  profile: PlayerProfile;
  def: CaseDefinition | null;
  vehicle: VehicleState | null;
  rng: () => number;
  tool: ToolId;
  laborHours: number;
  partsCost: number;
  laborCost: number;
  log: ActionLogEntry[];
  hypotheses: Hypothesis[];
  notes: string;
  interviewLog: { q: string; a: string }[];
  testResults: TestResult[];
  pinned: string[];
  pidHistory: PidSample[];
  dvom: { mode: DvomMode; red: string; black: string; last: ReturnType<typeof measureDvom> | null };
  scope: { ch1: string; ch2: string; tDiv: number; vDiv: number; paused: boolean };
  partsReplaced: { id: string; name: string; cost: number }[];
  replaceOffer: ReplaceOffer | null;
  scorecard: ScoreBreakdown | null;
  hintsUsed: number;
  hintOpen: boolean;
  verifiedDrive: boolean;
  verifiedHot: boolean;
  verifiedLoad: boolean;
  verifiedScope: boolean;
  verifiedTrim: boolean;
  verifiedSoak: boolean;
  codesClearedAfter: boolean;
  surrendered: boolean;
  simSpeed: number;
  paused: boolean;
  crankHold: number;

  hydrate: () => void;
  startCase: (id: string, from?: CaseDefinition) => void;
  startDaily: () => void;
  setTool: (t: ToolId) => void;
  step: (dtReal: number) => void;
  setKeyPos: (k: KeyPosition) => void;
  setDriveMode: (m: DriveMode) => void;
  holdStart: () => void;
  addHypothesis: (text: string) => void;
  setHypothesis: (id: string, status: HypothesisStatus) => void;
  addEvidence: (id: string, side: "plus" | "minus", text: string) => void;
  askCustomer: (q: string) => void;
  runTest: (kind: "smoke" | "fuel" | "parasitic" | "charging") => void;
  inspect: (area: string, doWiggle?: boolean) => void;
  doWiggle: () => void;
  overnight: () => void;
  measure: () => void;
  setDvom: (p: Partial<GameStore["dvom"]>) => void;
  setScope: (p: Partial<GameStore["scope"]>) => void;
  pinPid: (id: string) => void;
  scanVehicle: () => void;
  clearDtcs: () => void;
  offerReplace: (componentId: string) => void;
  confirmReplace: () => void;
  cancelReplace: () => void;
  setNotes: (n: string) => void;
  useHint: () => void;
  closeRO: () => void;
  surrender: () => void;
  saveGenerated: (c: CaseDefinition) => void;
}

const LABOR_RATE = 185;

function evidenceFor(componentId: string, log: ActionLogEntry[], def: CaseDefinition): ReplaceOffer["evidence"] {
  const useful = log.filter((l) => l.useful);
  const name = componentId.replace(/_/g, " ");
  const related = useful.filter((l) => (l.detail + l.label).toLowerCase().includes(name.slice(0, 6)) || (l.testId ?? "").includes(componentId));
  if (def.fault.correctComponentIds.includes(componentId) && useful.length >= 2) return related.length ? "high" : "moderate";
  if (related.length) return "moderate";
  if (useful.length) return "low";
  return "none";
}

function persistLater(p: PlayerProfile) {
  saveProfile({ ...p, level: levelFrom(p) });
}

export const useGame = create<GameStore>((set, get) => ({
  profile: loadProfile(),
  def: null,
  vehicle: null,
  rng: () => Math.random(),
  tool: "concern",
  laborHours: 0,
  partsCost: 0,
  laborCost: 0,
  log: [],
  hypotheses: [],
  notes: "",
  interviewLog: [],
  testResults: [],
  pinned: ["rpm", "coolantF", "batteryV", "stft", "ltft", "maf"],
  pidHistory: [],
  dvom: { mode: "dcv", red: "ecm_ckp", black: "chassis_gnd", last: null },
  scope: { ch1: "ckp_sensor", ch2: "cmp_sensor", tDiv: 0.005, vDiv: 5, paused: false },
  partsReplaced: [],
  replaceOffer: null,
  scorecard: null,
  hintsUsed: 0,
  hintOpen: false,
  verifiedDrive: false,
  verifiedHot: false,
  verifiedLoad: false,
  verifiedScope: false,
  verifiedTrim: false,
  verifiedSoak: false,
  codesClearedAfter: false,
  surrendered: false,
  simSpeed: 12,
  paused: false,
  crankHold: 0,

  hydrate: () => set({ profile: loadProfile() }),

  startCase: (id, from) => {
    const def = from ?? getCase(id) ?? get().profile.generatedCases.find((c) => c.id === id);
    if (!def) return;
    const seed = (Date.now() ^ def.id.length * 997) >>> 0;
    const vehicle = createInitialState(def, seed);
    runtimeVehicle = vehicle;
    uiAcc = 0;
    const ch1 = def.wiring.nodes.find((n) => n.signal.includes("ckp") || n.signal === "can_h")?.id ?? def.wiring.nodes[0]?.id ?? "";
    const ch2 = def.wiring.nodes.find((n) => n.id !== ch1 && (n.signal.includes("cmp") || n.signal === "can_l" || n.kind === "sensor"))?.id ?? ch1;
    set({
      def,
      vehicle,
      rng: mulberry32(seed),
      tool: "concern",
      laborHours: 0,
      partsCost: 0,
      laborCost: 0,
      log: [],
      hypotheses: [],
      notes: get().profile.notesByCase[def.id] ?? "",
      interviewLog: [],
      testResults: [],
      pidHistory: [snapshotPids(vehicle)],
      dvom: { mode: "dcv", red: ch1, black: "chassis_gnd", last: null },
      scope: { ch1, ch2, tDiv: 0.005, vDiv: 5, paused: false },
      partsReplaced: [],
      replaceOffer: null,
      scorecard: null,
      hintsUsed: 0,
      hintOpen: false,
      verifiedDrive: false,
      verifiedHot: false,
      verifiedLoad: false,
      verifiedScope: false,
      verifiedTrim: false,
      verifiedSoak: false,
      codesClearedAfter: false,
      surrendered: false,
      paused: false,
      crankHold: 0,
      simSpeed: 12,
    });
    useDx.getState().startFromSimulator(def);
  },

  startDaily: () => {
    const day = new Date().toISOString().slice(0, 10);
    let h = 0;
    for (let i = 0; i < day.length; i++) h = (h * 33 + day.charCodeAt(i)) >>> 0;
    const c = CASES[h % CASES.length];
    get().startCase(c.id);
    set((s) => {
      const profile = { ...s.profile, lastDaily: day };
      persistLater(profile);
      return { profile };
    });
  },

  setTool: (tool) => {
    const { vehicle, laborHours } = get();
    if (!vehicle) {
      set({ tool });
      return;
    }
    const add = tool === get().tool ? 0 : 0.02;
    set({ tool, laborHours: laborHours + add });
  },

  step: (dtReal) => {
    const { def, rng, paused, simSpeed, crankHold } = get();
    const vehicle = runtimeVehicle ?? get().vehicle;
    if (!def || !vehicle || paused) return;
    let dt = Math.min(dtReal, 0.1) * simSpeed;
    if (vehicle.mode === "hot_soak") dt *= 2.2;
    let next = tick(vehicle, def, dt, rng);
    let hold = crankHold;
    if (hold > 0) {
      hold -= dt;
      if (hold <= 0 && next.key === "start" && !next.engineRunning) {
        next = setKey(next, "on");
      }
    }
    const hist = get().pidHistory;
    const sampleEvery = 0.25;
    const lastT = hist.length ? hist[hist.length - 1]!.t : -999;
    let pidHistory = hist;
    if (next.simTime - lastT >= sampleEvery) {
      pidHistory = [...hist.slice(-240), snapshotPids(next)];
    }
    const extra: Partial<GameStore> = {};
    if (get().partsReplaced.some((p) => def.fault.correctComponentIds.includes(p.id))) {
      if (next.engineRunning && next.coolantF > 190) extra.verifiedHot = true;
      if (next.mode === "hill" || next.mode === "accel") extra.verifiedLoad = true;
    }
    uiAcc += dtReal;
    const jumped = next.engineRunning !== vehicle.engineRunning || next.stalledEvent !== vehicle.stalledEvent || next.mil !== vehicle.mil;
    if (!jumped && uiAcc < 0.1) {
      runtimeVehicle = next;
      return;
    }
    uiAcc = 0;
    runtimeVehicle = next;
    set({ vehicle: next, crankHold: hold, pidHistory, ...extra });
  },

  setKeyPos: (k) => {
    const { vehicle, def } = get();
    if (!vehicle || !def) return;
    const next = setKey(vehicle, k);
    runtimeVehicle = next;
    const log = [...get().log, makeLog(next, "key", `Key ${k.toUpperCase()}`, `Ignition set to ${k}`)];
    set({ vehicle: next, log, laborHours: get().laborHours + 0.02 });
  },

  holdStart: () => {
    const { vehicle } = get();
    if (!vehicle) return;
    const started = setKey(vehicle, "start");
    runtimeVehicle = started;
    set({ vehicle: started, crankHold: 2.4 });
  },

  setDriveMode: (m) => {
    const { vehicle, def } = get();
    if (!vehicle || !def) return;
    let next = setMode(vehicle, m);
    if (m !== "parked" && m !== "hot_soak" && !next.engineRunning) {
      next = setKey(next, "start");
      set({ crankHold: 2.2 });
    }
    const log = [...get().log, makeLog(next, "drive", `Drive: ${m.replace("_", " ")}`, `Operating condition set to ${m}`, { useful: def.valuableTests.includes("drive"), laborHr: laborFor("drive") })];
    runtimeVehicle = next;
    const patched: Partial<GameStore> = { vehicle: next, log, laborHours: get().laborHours + 0.3, tool: "drive" };
    if (get().partsReplaced.some((p) => def.fault.correctComponentIds.includes(p.id))) {
      patched.verifiedDrive = true;
      if (m === "hot_soak" || m === "highway" || m === "idle") patched.verifiedHot = get().verifiedHot || next.componentF > 190;
    }
    set(patched);
  },

  addHypothesis: (text) => {
    const t = text.trim();
    if (!t) return;
    const h: Hypothesis = { id: `h-${Date.now()}`, text: t, status: "possible", evidence: { plus: [], minus: [] } };
    set({ hypotheses: [...get().hypotheses, h], laborHours: get().laborHours + 0.02 });
  },

  setHypothesis: (id, status) => {
    set({ hypotheses: get().hypotheses.map((h) => (h.id === id ? { ...h, status } : h)) });
  },

  addEvidence: (id, side, text) => {
    const t = text.trim();
    if (!t) return;
    set({
      hypotheses: get().hypotheses.map((h) =>
        h.id === id ? { ...h, evidence: { ...h.evidence, [side]: [...h.evidence[side], t] } } : h,
      ),
    });
  },

  askCustomer: (q) => {
    const { def, vehicle } = get();
    if (!def || !vehicle) return;
    const a = matchInterview(q, def);
    const useful = def.interview.items.some((it) => it.useful && it.keywords.some((k) => q.toLowerCase().includes(k)));
    const log = [...get().log, makeLog(vehicle, "interview", "Customer interview", q, { useful, laborHr: 0.08 })];
    set({
      interviewLog: [...get().interviewLog, { q, a }],
      log,
      laborHours: get().laborHours + 0.08,
    });
    useDx.getState().ingestSimInterview(q, a);
    if (def) useDx.getState().recordEval(def, "interview");
  },

  runTest: (kind) => {
    const { def, vehicle } = get();
    if (!def || !vehicle) return;
    const fn = kind === "smoke" ? runSmokeTest : kind === "fuel" ? runFuelTest : kind === "parasitic" ? runParasiticTest : runChargingTest;
    const result = fn(vehicle, def);
    const log = [...get().log, makeLog(vehicle, kind, result.title, result.narrative, { testId: result.id, useful: result.useful, laborHr: result.laborHr })];
    const patch: Partial<GameStore> = {
      testResults: [result, ...get().testResults].slice(0, 24),
      log,
      laborHours: get().laborHours + result.laborHr,
    };
    if (kind === "fuel" && get().partsReplaced.length && def.fault.kind !== "fuel_delivery") {
      /* still useful as a negative */
    }
    set(patch);
    useDx.getState().ingestSimTest(result);
    useDx.getState().recordEval(def, `test:${kind}`);
  },

  inspect: (area, doWiggle) => {
    const { def, vehicle } = get();
    if (!def || !vehicle) return;
    let s = vehicle;
    if (doWiggle) s = wiggle(s);
    const result = inspectArea(area, s, def, doWiggle);
    runtimeVehicle = s;
    const log = [...get().log, makeLog(s, doWiggle ? "wiggle" : "inspect", result.title, result.narrative, { testId: result.id, useful: result.useful, laborHr: result.laborHr })];
    set({
      vehicle: s,
      testResults: [result, ...get().testResults].slice(0, 24),
      log,
      laborHours: get().laborHours + result.laborHr,
    });
    useDx.getState().ingestSimTest(result);
    if (def) useDx.getState().recordEval(def, `inspect:${area}`);
  },

  doWiggle: () => {
    const { vehicle, def } = get();
    if (!vehicle || !def) return;
    const s = wiggle(vehicle);
    runtimeVehicle = s;
    const log = [...get().log, makeLog(s, "wiggle", "Harness wiggle", "Loaded the CKP/engine harness under vibration.", { useful: def.fault.kind === "intermittent_connection", laborHr: 0.15, testId: "wiggle" })];
    set({ vehicle: s, log, laborHours: get().laborHours + 0.15 });
  },

  overnight: () => {
    const { vehicle, def } = get();
    if (!vehicle || !def) return;
    const s = parkOvernight(vehicle, def);
    const log = [...get().log, makeLog(s, "overnight", "Parked overnight", `Key-off 12 h. Battery now ${s.batteryV.toFixed(2)} V, SOC ${(s.soc * 100).toFixed(0)}%.`, { useful: def.fault.kind === "parasitic_draw", laborHr: 0.2, testId: "overnight" })];
    runtimeVehicle = s;
    const patch: Partial<GameStore> = { vehicle: s, log, laborHours: get().laborHours + 0.2 };
    if (get().partsReplaced.some((p) => def.fault.correctComponentIds.includes(p.id))) {
      if (def.fault.verification.needKeyOffSoak) patch.verifiedSoak = true;
    }
    set(patch);
  },

  measure: () => {
    const { def, vehicle, dvom } = get();
    if (!def || !vehicle) return;
    const last = measureDvom(dvom.mode, dvom.red, dvom.black, vehicle, def);
    const useful =
      def.valuableTests.includes("dvom") &&
      (dvom.red.includes("ckp") || dvom.red.includes("can") || dvom.red.includes("glove") || last.note?.includes("Open"));
    const log = [...get().log, makeLog(vehicle, "dvom", `DVOM ${dvom.mode.toUpperCase()}`, `${dvom.red} to ${dvom.black}: ${last.display} ${last.unit}${last.note ? ` — ${last.note}` : ""}`, { useful, laborHr: 0.15, testId: `dvom:${dvom.red}` })];
    set({ dvom: { ...dvom, last }, log, laborHours: get().laborHours + 0.15 });
    useDx.getState().ingestSimDvom(`${dvom.mode} ${dvom.red}/${dvom.black}`, `${last.display} ${last.unit}`, last.note);
    if (def) useDx.getState().recordEval(def, "dvom");
  },

  setDvom: (p) => set({ dvom: { ...get().dvom, ...p } }),
  setScope: (p) => {
    const scope = { ...get().scope, ...p };
    const { def, vehicle } = get();
    if (def && vehicle && (p.ch1 || p.ch2) && get().partsReplaced.some((x) => def.fault.correctComponentIds.includes(x.id))) {
      set({ scope, verifiedScope: true });
      return;
    }
    if (def && vehicle && (p.ch1 || !get().log.some((l) => l.kind === "scope"))) {
      const log = [...get().log, makeLog(vehicle, "scope", "Oscilloscope", `Ch1 ${scope.ch1} · Ch2 ${scope.ch2}`, { useful: def.valuableTests.includes("scope"), laborHr: 0.2, testId: "scope" })];
      set({ scope, log, laborHours: get().laborHours + 0.12 });
      useDx.getState().ingestSimScope(scope.ch1, vehicle);
      useDx.getState().recordEval(def, "scope");
      return;
    }
    set({ scope });
  },

  pinPid: (id) => {
    const pinned = get().pinned.includes(id) ? get().pinned.filter((x) => x !== id) : [...get().pinned, id].slice(0, 8);
    set({ pinned });
  },

  scanVehicle: () => {
    const { vehicle, def } = get();
    if (!vehicle || !def) return;
    const useful = true;
    const log = [...get().log, makeLog(vehicle, "scan", "Scan / health check", `MIL ${vehicle.mil ? "ON" : "OFF"} · ${vehicle.dtcs.length} code(s)`, { useful, laborHr: 0.1, testId: "scan" })];
    set({ log, laborHours: get().laborHours + 0.1, tool: "scan" });
    useDx.getState().ingestSimScan(vehicle);
    if (def) useDx.getState().recordEval(def, "scan");
  },

  clearDtcs: () => {
    const { vehicle, def } = get();
    if (!vehicle || !def) return;
    const next = clearCodes(vehicle);
    runtimeVehicle = next;
    const after = get().partsReplaced.some((p) => def.fault.correctComponentIds.includes(p.id));
    const log = [...get().log, makeLog(next, "dtc_clear", "Clear DTCs", "Codes cleared. Drive cycle / reproduce conditions to verify.", { laborHr: 0.05 })];
    set({ vehicle: next, log, laborHours: get().laborHours + 0.05, codesClearedAfter: after || get().codesClearedAfter });
  },

  offerReplace: (componentId) => {
    const { def, log } = get();
    if (!def) return;
    const c = def.components.find((x) => x.id === componentId);
    if (!c) return;
    const evidence = evidenceFor(componentId, log, def);
    const warning =
      evidence === "none"
        ? `You have not demonstrated a failure in ${c.name}.`
        : evidence === "low"
          ? `Limited evidence supports replacing ${c.name}.`
          : undefined;
    set({
      replaceOffer: { id: c.id, name: c.name, cost: c.partCost, labor: c.laborHours, evidence, warning },
    });
  },

  confirmReplace: () => {
    const { replaceOffer, def, vehicle } = get();
    if (!replaceOffer || !def || !vehicle) return;
    const { state, cleared } = replaceComponent(vehicle, def, replaceOffer.id);
    runtimeVehicle = state;
    const log = [
      ...get().log,
      makeLog(state, "replace", `Replace ${replaceOffer.name}`, cleared ? "Component replaced. Fault model updated." : "Component replaced. Vehicle behavior is unchanged.", {
        laborHr: replaceOffer.labor,
        useful: cleared,
        testId: `replace:${replaceOffer.id}`,
      }),
    ];
    if (cleared && get().pidHistory.length) {
      const last = get().pidHistory[get().pidHistory.length - 1]!;
      if (Math.abs(last.stft) < 6) set({ verifiedTrim: true });
    }
    set({
      vehicle: state,
      log,
      laborHours: get().laborHours + replaceOffer.labor,
      partsCost: get().partsCost + replaceOffer.cost,
      laborCost: get().laborCost + replaceOffer.labor * LABOR_RATE,
      partsReplaced: [...get().partsReplaced, { id: replaceOffer.id, name: replaceOffer.name, cost: replaceOffer.cost }],
      replaceOffer: null,
    });
  },

  cancelReplace: () => set({ replaceOffer: null }),

  setNotes: (notes) => {
    set({ notes });
    const def = get().def;
    if (!def) return;
    const profile = { ...get().profile, notesByCase: { ...get().profile.notesByCase, [def.id]: notes } };
    persistLater(profile);
    set({ profile });
  },

  useHint: () => set({ hintOpen: !get().hintOpen, hintsUsed: get().hintOpen ? get().hintsUsed : get().hintsUsed + 1 }),

  closeRO: () => {
    const s = get();
    if (!s.def || !s.vehicle) return;
    const input: ScoreInput = {
      def: s.def,
      state: s.vehicle,
      log: s.log,
      hypotheses: s.hypotheses,
      laborHours: s.laborHours,
      partsReplaced: s.partsReplaced,
      verifiedDrive: s.verifiedDrive,
      verifiedHot: s.verifiedHot,
      verifiedLoad: s.verifiedLoad,
      verifiedScope: s.verifiedScope,
      verifiedTrim: s.verifiedTrim,
      verifiedSoak: s.verifiedSoak,
      codesClearedAfter: s.codesClearedAfter,
      surrendered: s.surrendered,
      hintsUsed: s.hintsUsed,
    };
    const scorecard = scoreCase(input);
    const firstTry = !s.profile.scores.some((x) => x.caseId === s.def!.id);
    const rec = { caseId: s.def.id, score: scorecard.total, hours: s.laborHours, at: Date.now(), firstTry };
    const bestByCase = { ...s.profile.bestByCase, [s.def.id]: Math.max(s.profile.bestByCase[s.def.id] ?? 0, scorecard.total) };
    const achievements = new Set(s.profile.achievements);
    if (s.profile.casesCompleted + 1 >= 1) achievements.add("first-close");
    if (scorecard.unnecessaryParts.length === 0 && s.vehicle.faultCleared) achievements.add("no-cannon");
    if (s.laborHours < 1 && s.vehicle.faultCleared) achievements.add("sub-hour");
    if (s.def.fault.kind === "temp_resistance" && s.vehicle.faultCleared) achievements.add("heat");
    if (s.def.fault.kind === "can_bus_fault" && s.vehicle.faultCleared) achievements.add("bus");
    if (s.def.fault.kind === "parasitic_draw" && s.vehicle.faultCleared) achievements.add("night");
    if (scorecard.total >= 95) achievements.add("perfect");
    if (s.def.difficulty === "master" && s.vehicle.faultCleared) achievements.add("master");
    const profile: PlayerProfile = {
      ...s.profile,
      casesCompleted: s.profile.casesCompleted + 1,
      scores: [rec, ...s.profile.scores].slice(0, 80),
      bestByCase,
      unnecessaryParts: s.profile.unnecessaryParts + scorecard.unnecessaryParts.length,
      firstTimeHits: s.profile.firstTimeHits + (firstTry && s.vehicle.faultCleared ? 1 : 0),
      achievements: [...achievements],
    };
    profile.level = levelFrom(profile);
    persistLater(profile);
    set({ scorecard, profile, paused: true });
    useDx.getState().closeEval(s.def);
  },

  surrender: () => {
    set({ surrendered: true, paused: true });
    get().closeRO();
  },

  saveGenerated: (c) => {
    const profile = upsertGenerated(get().profile, c);
    persistLater(profile);
    set({ profile });
  },
}));

export const LABOR_RATE_USD = LABOR_RATE;

export function catalogPlusGenerated(): CaseDefinition[] {
  const p = useGame.getState().profile;
  return [...CASES, ...p.generatedCases];
}

export { ACHIEVEMENTS };
