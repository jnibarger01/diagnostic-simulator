import { DTC_CODE_WEIGHTS, DTC_KB, FAULTS, QUESTIONS, SYSTEMS, TAG_WEIGHTS, TESTS, type FaultTemplate } from "./knowledge";
import { evidenceShell } from "./parse";
import type { DiagnosticQuestion, Evidence, EvidenceSource, SystemId, TestDef } from "./types";

export interface RetrievedKnowledge { id: string; provider: "oem_spec" | "tsb" | "wiring" | "service_history" | "ai_retrieval"; title: string; content: string; tags: string[]; authoritative: boolean; }
export interface OemSpecificationProvider { lookup(query: { vehicle: string; system: SystemId; item: string }): RetrievedKnowledge[]; }
export interface TsbProvider { search(query: { vehicle: string; symptom?: string; dtcs?: string[] }): RetrievedKnowledge[]; }
export interface WiringInformationProvider { find(query: { vehicle: string; system: SystemId; circuit?: string }): RetrievedKnowledge[]; }
export interface ServiceRepairHistoryProvider { find(query: { vehicle: string; concern: string }): RetrievedKnowledge[]; }
export interface AiAssistedRetrievalProvider { retrieve(query: { vehicle: string; question: string }): RetrievedKnowledge[]; }
export interface RetrievedEvidenceInput { observation: string; source: EvidenceSource; type: Evidence["type"]; tags: string[]; reliability?: Evidence["reliability"]; structuredValue?: Evidence["structuredValue"]; notes?: string; }
export interface DiagnosticKnowledge { systems: readonly { id: SystemId; label: string }[]; faults: readonly FaultTemplate[]; questions: readonly DiagnosticQuestion[]; tests: readonly TestDef[]; dtcKnowledge: typeof DTC_KB; tagWeights: typeof TAG_WEIGHTS; dtcCodeWeights: typeof DTC_CODE_WEIGHTS; }
export interface DiagnosticKnowledgeProvider { knowledge(): DiagnosticKnowledge; retrieveEvidence(query: { vehicle: unknown; faultIds: string[]; query: string }): Evidence[]; normalizeEvidence(input: RetrievedEvidenceInput): Evidence; oemSpecifications: OemSpecificationProvider; tsbs: TsbProvider; wiring: WiringInformationProvider; serviceHistory: ServiceRepairHistoryProvider; aiRetrieval: AiAssistedRetrievalProvider; }

const emptyProvider = { lookup: () => [], search: () => [], find: () => [], retrieve: () => [] };

/** Deterministic default. Real network/LLM adapters belong outside the engine. */
export class InMemoryDiagnosticKnowledgeProvider implements DiagnosticKnowledgeProvider {
  readonly oemSpecifications: OemSpecificationProvider = emptyProvider;
  readonly tsbs: TsbProvider = emptyProvider;
  readonly wiring: WiringInformationProvider = emptyProvider;
  readonly serviceHistory: ServiceRepairHistoryProvider = emptyProvider;
  readonly aiRetrieval: AiAssistedRetrievalProvider = emptyProvider;
  constructor(private readonly bundle: DiagnosticKnowledge = STATIC_KNOWLEDGE) {}
  knowledge(): DiagnosticKnowledge { return this.bundle; }
  retrieveEvidence(_query: { vehicle: unknown; faultIds: string[]; query: string }): Evidence[] { return []; }
  normalizeEvidence(input: RetrievedEvidenceInput): Evidence {
    return evidenceShell({ source: input.source, type: input.type, observation: input.observation.trim(), tags: [...new Set(input.tags.filter(Boolean))], reliability: input.reliability ?? "high", structuredValue: input.structuredValue, notes: input.notes });
  }
}

export const STATIC_KNOWLEDGE: DiagnosticKnowledge = { systems: SYSTEMS, faults: FAULTS, questions: QUESTIONS, tests: TESTS, dtcKnowledge: DTC_KB, tagWeights: TAG_WEIGHTS, dtcCodeWeights: DTC_CODE_WEIGHTS };
export const DEFAULT_KNOWLEDGE_PROVIDER: DiagnosticKnowledgeProvider = new InMemoryDiagnosticKnowledgeProvider(STATIC_KNOWLEDGE);
export const defaultKnowledgeProvider = DEFAULT_KNOWLEDGE_PROVIDER;
