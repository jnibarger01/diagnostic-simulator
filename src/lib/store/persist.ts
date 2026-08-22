import type { CaseDefinition, PlayerProfile } from "@/lib/sim/types";
import type { DiagnosticSession, EngineEval } from "@/lib/dx/types";

const KEY = "ddl.profile.v1";
const SESS_KEY = "ddl.sessions.v1";
const EVAL_KEY = "ddl.eval.v1";
const SAVE_VERSION = 1;

const defaults: PlayerProfile = {
  version: SAVE_VERSION,
  casesCompleted: 0,
  scores: [],
  bestByCase: {},
  unnecessaryParts: 0,
  firstTimeHits: 0,
  generatedCases: [],
  achievements: [],
  notesByCase: {},
  lastDaily: null,
  level: 1,
};

function migrate(raw: PlayerProfile): PlayerProfile {
  return { ...defaults, ...raw, version: SAVE_VERSION };
}

export function loadProfile(): PlayerProfile {
  try {
    const s = localStorage.getItem(KEY);
    if (!s) return { ...defaults };
    return migrate(JSON.parse(s) as PlayerProfile);
  } catch {
    return { ...defaults };
  }
}

export function saveProfile(p: PlayerProfile) {
  try {
    localStorage.setItem(KEY, JSON.stringify(p));
  } catch {
    /* private mode */
  }
}

export function upsertGenerated(p: PlayerProfile, c: CaseDefinition): PlayerProfile {
  const rest = p.generatedCases.filter((x) => x.id !== c.id);
  return { ...p, generatedCases: [c, ...rest].slice(0, 24) };
}

export function levelFrom(p: PlayerProfile) {
  const avg = p.scores.length ? p.scores.reduce((a, b) => a + b.score, 0) / p.scores.length : 0;
  const xp = p.casesCompleted * 12 + Math.round(avg);
  return Math.max(1, Math.min(10, 1 + Math.floor(xp / 40)));
}

export function loadSessions(): DiagnosticSession[] {
  try {
    if (typeof localStorage === "undefined") return [];
    const s = localStorage.getItem(SESS_KEY);
    if (!s) return [];
    return JSON.parse(s) as DiagnosticSession[];
  } catch {
    return [];
  }
}

export function saveSessions(list: DiagnosticSession[]) {
  try {
    localStorage.setItem(SESS_KEY, JSON.stringify(list.slice(0, 40)));
  } catch {
    /* private mode */
  }
}

export function loadEvals(): EngineEval[] {
  try {
    if (typeof localStorage === "undefined") return [];
    const s = localStorage.getItem(EVAL_KEY);
    if (!s) return [];
    return JSON.parse(s) as EngineEval[];
  } catch {
    return [];
  }
}

export function saveEvals(list: EngineEval[]) {
  try {
    localStorage.setItem(EVAL_KEY, JSON.stringify(list.slice(0, 40)));
  } catch {
    /* private mode */
  }
}
