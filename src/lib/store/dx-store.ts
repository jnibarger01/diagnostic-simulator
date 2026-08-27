import { create } from "zustand";
import type { CaseDefinition } from "@/lib/sim/types";
import {
  addDtcs,
  addObservation,
  addPidPaste,
  answerQuestion,
  closeSession,
  createSession,
  recordTest,
} from "@/lib/dx/engine";
import { evalStep, summarizeEval } from "@/lib/dx/eval";
import {
  ingestDvom,
  ingestInterview,
  ingestLiveSnapshot,
  ingestScan,
  ingestScope,
  ingestTest,
} from "@/lib/dx/sim-bridge";
import type { DiagnosticSession, EngineEval, EvidenceSource, IntakeInput } from "@/lib/dx/types";
import type { TestResult, VehicleState } from "@/lib/sim/types";
import { loadEvals, loadSessions, saveEvals, saveSessions } from "./persist";
import { createSessionBundle, parseSessionBundle } from "@/lib/dx/session-bundle";

interface DxStore {
  sessions: DiagnosticSession[];
  currentId: string | null;
  evals: EngineEval[];
  hydrate: () => void;
  current: () => DiagnosticSession | null;
  start: (input: IntakeInput) => DiagnosticSession;
  startFromSimulator: (def: CaseDefinition) => DiagnosticSession;
  open: (id: string) => void;
  patch: (s: DiagnosticSession) => void;
  answer: (questionId: string, optionId: string) => void;
  observe: (text: string, condition?: string, source?: EvidenceSource) => void;
  enterDtcs: (raw: string, status?: string, freeze?: string) => void;
  enterPids: (text: string, condition?: string) => void;
  enterTest: (testId: string, result: string, condition?: string) => void;
  finish: () => void;
  ingestSimInterview: (q: string, a: string) => void;
  ingestSimScan: (v: VehicleState) => void;
  ingestSimTest: (r: TestResult) => void;
  ingestSimDvom: (label: string, display: string, note?: string) => void;
  ingestSimScope: (ch: string, v: VehicleState) => void;
  ingestSimLive: (v: VehicleState) => void;
  recordEval: (def: CaseDefinition, trigger: string) => void;
  closeEval: (def: CaseDefinition) => EngineEval | null;
  exportBundle: () => string;
  importBundle: (raw: string) => number;
}

function persist(sessions: DiagnosticSession[], evals?: EngineEval[]) {
  saveSessions(sessions);
  if (evals) saveEvals(evals);
}

export const useDx = create<DxStore>((set, get) => ({
  sessions: typeof localStorage === "undefined" ? [] : loadSessions(),
  currentId: null,
  evals: typeof localStorage === "undefined" ? [] : loadEvals(),

  hydrate: () => {
    set({ sessions: loadSessions(), evals: loadEvals() });
  },

  current: () => {
    const { sessions, currentId } = get();
    return sessions.find((s) => s.id === currentId) ?? null;
  },

  start: (input) => {
    const s = createSession(input);
    const sessions = [s, ...get().sessions.filter((x) => x.id !== s.id)].slice(0, 40);
    persist(sessions);
    set({ sessions, currentId: s.id });
    return s;
  },

  startFromSimulator: (def) => {
    const history = def.serviceHistory.map((h) => `${h.date} · ${h.mileage.toLocaleString()} mi · ${h.work} (${h.shop})`).join("\n");
    const s = createSession({
      mode: "simulator",
      simCaseId: def.id,
      vehicle: { ...def.vehicle },
      concern: def.concern,
      warningLights: "",
      dtcsRaw: "",
      recentRepairs: def.serviceHistory
        .filter((h) => h.misleading)
        .map((h) => h.work)
        .join("; "),
      serviceHistory: history,
      techNotes: "",
    });
    s.evalLog = [evalStep(s, def, "intake")];
    const sessions = [s, ...get().sessions.filter((x) => x.simCaseId !== def.id)].slice(0, 40);
    persist(sessions);
    set({ sessions, currentId: s.id });
    return s;
  },

  open: (id) => set({ currentId: id }),

  patch: (s) => {
    const sessions = get().sessions.map((x) => (x.id === s.id ? s : x));
    if (!sessions.some((x) => x.id === s.id)) sessions.unshift(s);
    persist(sessions);
    set({ sessions, currentId: s.id });
  },

  answer: (questionId, optionId) => {
    const cur = get().current();
    if (!cur) return;
    get().patch(answerQuestion(cur, questionId, optionId));
  },

  observe: (text, condition, source) => {
    const cur = get().current();
    if (!cur || !text.trim()) return;
    get().patch(addObservation(cur, text, condition, source));
  },

  enterDtcs: (raw, status, freeze) => {
    const cur = get().current();
    if (!cur) return;
    get().patch(addDtcs(cur, raw, status, freeze));
  },

  enterPids: (text, condition) => {
    const cur = get().current();
    if (!cur) return;
    get().patch(addPidPaste(cur, text, condition));
  },

  enterTest: (testId, result, condition) => {
    const cur = get().current();
    if (!cur) return;
    get().patch(recordTest(cur, testId, result, condition));
  },

  finish: () => {
    const cur = get().current();
    if (!cur) return;
    get().patch(closeSession(cur));
  },

  ingestSimInterview: (q, a) => {
    const cur = get().current();
    if (!cur || cur.mode !== "simulator") return;
    get().patch(ingestInterview(cur, q, a));
  },
  ingestSimScan: (v) => {
    const cur = get().current();
    if (!cur || cur.mode !== "simulator") return;
    get().patch(ingestScan(cur, v));
  },
  ingestSimTest: (r) => {
    const cur = get().current();
    if (!cur || cur.mode !== "simulator") return;
    get().patch(ingestTest(cur, r));
  },
  ingestSimDvom: (label, display, note) => {
    const cur = get().current();
    if (!cur || cur.mode !== "simulator") return;
    get().patch(ingestDvom(cur, label, display, note));
  },
  ingestSimScope: (ch, v) => {
    const cur = get().current();
    if (!cur || cur.mode !== "simulator") return;
    get().patch(ingestScope(cur, ch, v));
  },
  ingestSimLive: (v) => {
    const cur = get().current();
    if (!cur || cur.mode !== "simulator") return;
    get().patch(ingestLiveSnapshot(cur, v));
  },

  recordEval: (def, trigger) => {
    const cur = get().current();
    if (!cur || cur.mode !== "simulator") return;
    const step = evalStep(cur, def, trigger);
    get().patch({ ...cur, evalLog: [...cur.evalLog, step].slice(-40) });
  },

  closeEval: (def) => {
    const cur = get().current();
    if (!cur) return null;
    const ev = summarizeEval(cur, def);
    const evals = [ev, ...get().evals.filter((x) => x.sessionId !== ev.sessionId)].slice(0, 40);
    persist(get().sessions, evals);
    set({ evals });
    return ev;
  },

  exportBundle: () => createSessionBundle(get().sessions),

  importBundle: (raw) => {
    const imported = parseSessionBundle(raw);
    const existing = get().sessions;
    const sessions = [...imported, ...existing.filter((session) => !imported.some((item) => item.id === session.id))].slice(0, 40);
    persist(sessions);
    set({ sessions, currentId: imported[0]?.id ?? get().currentId });
    return imported.length;
  },
}));
