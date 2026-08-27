import type { DiagnosticSession } from "./types";

export const DIAGNOSTIC_BUNDLE_FORMAT = "diagnostic-session-bundle" as const;
export const DIAGNOSTIC_BUNDLE_VERSION = 1 as const;

type DiagnosticSessionBundle = {
  format: typeof DIAGNOSTIC_BUNDLE_FORMAT;
  version: typeof DIAGNOSTIC_BUNDLE_VERSION;
  exportedAt: number;
  sessions: DiagnosticSession[];
};

export function createSessionBundle(sessions: DiagnosticSession[], exportedAt = Date.now()): string {
  const bundle: DiagnosticSessionBundle = {
    format: DIAGNOSTIC_BUNDLE_FORMAT,
    version: DIAGNOSTIC_BUNDLE_VERSION,
    exportedAt,
    sessions,
  };
  return JSON.stringify(bundle, null, 2);
}

export function parseSessionBundle(raw: string): DiagnosticSession[] {
  let value: unknown;
  try {
    value = JSON.parse(raw);
  } catch {
    throw new Error("Invalid diagnostic session bundle JSON");
  }

  if (!isRecord(value) || value.format !== DIAGNOSTIC_BUNDLE_FORMAT) {
    throw new Error("Invalid diagnostic session bundle format");
  }
  if (value.version !== DIAGNOSTIC_BUNDLE_VERSION) {
    throw new Error(`Unsupported diagnostic session bundle version: ${String(value.version)}`);
  }
  if (typeof value.exportedAt !== "number" || !Number.isFinite(value.exportedAt) || !Array.isArray(value.sessions)) {
    throw new Error("Invalid diagnostic session bundle");
  }
  if (!value.sessions.every(isDiagnosticSession)) {
    throw new Error("Invalid diagnostic session bundle session");
  }
  return value.sessions;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isDiagnosticSession(value: unknown): value is DiagnosticSession {
  if (!isRecord(value)) return false;
  const requiredStrings = ["id", "mode", "concern", "family", "status", "reasoningSummary"];
  if (!requiredStrings.every((key) => typeof value[key] === "string" && value[key])) return false;
  if (value.mode !== "assistant" && value.mode !== "simulator") return false;
  if (typeof value.createdAt !== "number" || typeof value.updatedAt !== "number" || !isRecord(value.vehicle)) return false;
  const requiredArrays = [
    "tags",
    "symptoms",
    "operatingConditions",
    "evidence",
    "hypotheses",
    "history",
    "askedQuestionIds",
    "answered",
    "testsRun",
    "evalLog",
    "safetyFlags",
  ];
  return requiredArrays.every((key) => Array.isArray(value[key]));
}
