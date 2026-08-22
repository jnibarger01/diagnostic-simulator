# Diagnostic architecture and evaluation

The deterministic DX engine ranks hypotheses using likelihood weights, but likelihood and evidence confidence are separate from diagnostic status. A hypothesis is confirmed only when every required machine-readable confirmation criterion is satisfied by concrete evidence. A score, likelihood band, evidence count, or confidence level cannot confirm it. Any satisfied refutation criterion makes the hypothesis ruled_out; the UI receives every criterion state and evidence IDs through hypothesis.criteria.

## Knowledge boundary

The provider module defines extension points for OEM specifications, TSBs, wiring information, service/repair history, and AI-assisted retrieval. The default InMemoryDiagnosticKnowledgeProvider is network-free. Retrieved values must be normalized into typed evidence before the deterministic engine consumes them. OEM-dependent numeric limits intentionally remain lookup-required criteria; the local catalog does not invent a voltage, pressure, resistance, current, or aiming specification.

## Evaluation methodology

The diagnostic eval runs 66 deterministic known-answer cases (three variants for each explicit scenario) spanning Toyota no-start/stall, misfire, lean/rich, charging/start, parasitic draw, CAN/network, BSM/ADAS, HVAC, EVAP, and intermittent electrical faults. Each case declares its true hypothesis and injects one concrete machine-readable test result. The report measures Top-1 accuracy, Top-3 recall, false-confirmation rate, tests-to-diagnosis, and parts-cannon/unsafe recommendation rate. It exits nonzero below 80% Top-1, 95% Top-3, any false confirmation, or over 5% unsafe/parts-cannon recommendations.

Unit tests exercise confirmation/refutation, ranking movement, next-best-test behavior, provider normalization, missing criteria, and representative Toyota complaint families.
