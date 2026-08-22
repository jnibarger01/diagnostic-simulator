export type Likelihood = "very_high" | "high" | "moderate" | "low" | "very_low";

export type EvidenceSource =
  | "customer"
  | "technician"
  | "dtc"
  | "freeze_frame"
  | "live_pid"
  | "inspection"
  | "dvom"
  | "oscilloscope"
  | "pressure"
  | "scan_test"
  | "service_history"
  | "previous_repair"
  | "simulator"
  | "notes";

export type EvidenceType = "symptom" | "condition" | "measurement" | "dtc" | "inspection" | "history" | "statement";

export type Audience = "customer" | "technician";

export type CriterionKind = "confirmation" | "refutation";

export interface DiagnosticCriterion {
  id: string;
  description: string;
  kind: CriterionKind;
  required: boolean;
  match: { allTags?: string[]; anyTags?: string[]; source?: EvidenceSource[]; type?: EvidenceType[]; observationIncludes?: string[]; structured?: { key: string; value?: string | number | boolean; units?: string }; requiresProviderEvidence?: boolean };
}

export interface CriterionState { id: string; description: string; satisfied: boolean; evidenceIds: string[]; required: boolean; }
export interface HypothesisCriteria { confirmation: CriterionState[]; refutation: CriterionState[]; allRequiredConfirmationSatisfied: boolean; anyRefutationSatisfied: boolean; }

export type SystemId =
  | "power_ecu"
  | "engine_position"
  | "fuel"
  | "ignition"
  | "airflow"
  | "mechanical"
  | "network"
  | "security"
  | "charging"
  | "parasitic"
  | "adas"
  | "starting"
  | "evap"
  | "hvac"
  | "body_electrical";

export type ComplaintFamily =
  | "stall"
  | "no_start"
  | "no_crank"
  | "fuel_trim"
  | "parasitic"
  | "network"
  | "adas"
  | "charging"
  | "misfire"
  | "rich"
  | "evap"
  | "hvac"
  | "intermittent_electrical"
  | "generic";

export type SessionMode = "assistant" | "simulator";

export type SessionStatus = "intake" | "active" | "supported" | "verified" | "closed";

export interface VehicleProfile {
  year?: number;
  make?: string;
  model?: string;
  engine?: string;
  mileage?: number;
  vin?: string;
}

export interface Evidence {
  id: string;
  timestamp: number;
  source: EvidenceSource;
  type: EvidenceType;
  observation: string;
  structuredValue?: { key: string; value: number | string | boolean; units?: string };
  operatingCondition?: string;
  reliability: "high" | "medium" | "low";
  supports: string[];
  contradicts: string[];
  neutralTo: string[];
  tags: string[];
  notes?: string;
}

export interface Hypothesis {
  id: string;
  systemId: SystemId;
  systemLabel: string;
  component: string;
  failureMode: string;
  likelihood: Likelihood;
  score: number;
  evidenceConfidence: "none" | "low" | "medium" | "high";
  supporting: string[];
  contradicting: string[];
  missing: string[];
  moreLikelyWhen: string[];
  lessLikelyWhen: string[];
  confirmTest: string;
  refuteTest: string;
  criteria: HypothesisCriteria;
  testable: boolean;
  testCostUsd: number;
  testHours: number;
  safety?: string;
  status: "active" | "ruled_out" | "confirmed" | "deferred";
}

export interface QuestionOption {
  id: string;
  label: string;
  tags: string[];
  narrative: string;
}

export interface DiagnosticQuestion {
  id: string;
  audience: Audience;
  families: ComplaintFamily[];
  prompt: string;
  rationale: string;
  options: QuestionOption[];
}

export interface RankedQuestion {
  def: DiagnosticQuestion;
  value: number;
}

export interface TestDef {
  id: string;
  name: string;
  families: ComplaintFamily[];
  discriminates: string[];
  why: string;
  expectedOutcomes: string[];
  timeHr: number;
  cost: string;
  invasiveness: "none" | "low" | "moderate" | "high";
  safety?: string;
  technicianOnly: boolean;
}

export interface NextBestAction {
  kind: "question" | "test" | "inspection" | "repair" | "verify" | "inconclusive";
  title: string;
  why: string;
  expectedOutcomes: string[];
  timeHr: number;
  cost: string;
  discrimination: "high" | "moderate" | "low";
  invasiveness: "none" | "low" | "moderate" | "high";
  safety?: string;
  question?: DiagnosticQuestion;
  testId?: string;
  alternatives: { title: string; why: string; timeHr: number; testId?: string; questionId?: string }[];
}

export interface DifferentialSnapshot {
  at: number;
  trigger: string;
  ranked: { id: string; label: string; likelihood: Likelihood; score: number }[];
}

export interface LikelihoodMove {
  id: string;
  label: string;
  from: Likelihood;
  to: Likelihood;
  reason: string;
}

export interface VerificationPlan {
  originalConditions: string[];
  steps: string[];
  mustNotMarkCompleteUntil: string[];
}

export interface RepairRecommendation {
  action: string;
  hypothesisId: string;
  evidenceStrength: Likelihood;
  supporting: string[];
  missing: string[];
  status: string;
  inspectFirst?: string;
}

export interface EngineEvalStep {
  at: number;
  trigger: string;
  trueCauseRank: number | null;
  trueCauseLikelihood: Likelihood | null;
  topId: string;
  questionId?: string;
  testId?: string;
}

export interface EngineEval {
  sessionId: string;
  caseId: string;
  trueCause: string;
  trueHypothesisId: string | null;
  initialRank: number | null;
  finalRank: number | null;
  reachedVeryHigh: boolean;
  confirmed: boolean;
  steps: number;
  questionsAsked: number;
  testsRecommended: string[];
  unnecessaryTests: string[];
  falseHypothesesRetained: string[];
  testsToDiagnosis: number | null;
  falseConfirmation: boolean;
  unsafeRecommendation: boolean;
  log: EngineEvalStep[];
  at: number;
}

export interface DiagnosticSession {
  id: string;
  mode: SessionMode;
  createdAt: number;
  updatedAt: number;
  vehicle: VehicleProfile;
  concern: string;
  warningLights: string;
  dtcsRaw: string;
  recentRepairs: string;
  serviceHistory: string;
  techNotes: string;
  family: ComplaintFamily;
  tags: string[];
  symptoms: string[];
  operatingConditions: string[];
  evidence: Evidence[];
  hypotheses: Hypothesis[];
  history: DifferentialSnapshot[];
  askedQuestionIds: string[];
  answered: { questionId: string; optionId: string; at: number }[];
  testsRun: { testId: string; result: string; at: number }[];
  nextAction: NextBestAction | null;
  lastMovement: LikelihoodMove[];
  repair?: RepairRecommendation;
  verification?: VerificationPlan;
  status: SessionStatus;
  simCaseId?: string;
  evalLog: EngineEvalStep[];
  safetyFlags: string[];
  reasoningSummary: string;
}

export interface IntakeInput {
  vehicle: VehicleProfile;
  concern: string;
  warningLights?: string;
  dtcsRaw?: string;
  recentRepairs?: string;
  serviceHistory?: string;
  techNotes?: string;
  mode?: SessionMode;
  simCaseId?: string;
}

export const LIKELIHOOD_LABEL: Record<Likelihood, string> = {
  very_high: "Very High",
  high: "High",
  moderate: "Moderate",
  low: "Low",
  very_low: "Very Low",
};

export const LIKELIHOOD_ORDER: Likelihood[] = ["very_high", "high", "moderate", "low", "very_low"];

export function likelihoodRank(l: Likelihood): number {
  return LIKELIHOOD_ORDER.indexOf(l);
}
