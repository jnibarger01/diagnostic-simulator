import { addEvidence, createSession, recordTest } from "./engine";
import { evidenceShell } from "./parse";
import { criteriaForFault } from "./criteria";
import { FAULTS } from "./knowledge";
import type { ComplaintFamily, Evidence } from "./types";
export interface DiagnosticEvalCase { id: string; family: ComplaintFamily; trueHypothesisId: string; concern: string; evidenceTags: string[]; }
export interface DiagnosticEvalReport { cases: number; top1Accuracy: number; top3Recall: number; falseConfirmationRate: number; testsToDiagnosis: number; partsCannonUnsafeRate: number; criteriaCoverage: { faults: number; confirmationCriteria: number; refutationCriteria: number }; passed: boolean; failures: string[]; }
const scenarios: Array<{ family: ComplaintFamily; concern: string; fault: string; tag: string }> = [
{family:"stall",concern:"Toyota stalls instantly while driving",fault:"ckp_sync",tag:"ckp_wave_loss"},{family:"stall",concern:"Toyota stalls over bumps",fault:"ckp_connector",tag:"wiggle_drop"},{family:"no_start",concern:"Toyota cranks but will not start",fault:"ecm_power",tag:"ecm_power_loss"},{family:"no_start",concern:"Toyota cranks with low fuel pressure",fault:"fuel_delivery",tag:"fuel_pressure_low"},{family:"misfire",concern:"Toyota has a P0301 misfire",fault:"misfire_coil",tag:"misfire_coil_fault"},{family:"fuel_trim",concern:"Toyota is lean at idle",fault:"unmetered_air",tag:"smoke_leak"},{family:"fuel_trim",concern:"Toyota is lean and trims are high at idle and cruise",fault:"maf_bias",tag:"maf_implausible"},{family:"rich",concern:"Toyota runs rich with black smoke",fault:"rich_condition",tag:"rich_fuel_fault"},{family:"evap",concern:"Toyota hard starts after refueling",fault:"evap_purge",tag:"purge_valve_fault"},{family:"parasitic",concern:"Toyota battery dead after sitting",fault:"parasitic_lamp",tag:"lamp_on_keyoff"},{family:"parasitic",concern:"Toyota battery drains after accessory install",fault:"parasitic_aftermarket",tag:"aftermarket_isolated_fault"},{family:"charging",concern:"Toyota charge lamp is on and voltage is low",fault:"charging_fail",tag:"charging_fault"},{family:"charging",concern:"Toyota charge lamp changes when cable moves",fault:"charging_connection",tag:"charging_connection_fault"},{family:"no_crank",concern:"Toyota clicks but will not crank",fault:"starter_control",tag:"starter_circuit_fault"},{family:"network",concern:"Toyota has multiple warning lights after radio install",fault:"can_aftermarket",tag:"can_aftermarket_fault"},{family:"network",concern:"Toyota has multiple warning lights and modules drop offline with abnormal bus",fault:"can_termination",tag:"can_termination_fault"},{family:"adas",concern:"Toyota BSM warning after sensor replacement",fault:"bsm_cal",tag:"bsm_no_init"},{family:"adas",concern:"Toyota BSM warning after bumper repair",fault:"bsm_mount",tag:"bsm_mount_fault"},{family:"adas",concern:"Toyota BSM no communication",fault:"bsm_harness",tag:"bsm_circuit_fault"},{family:"adas",concern:"Toyota BSM warning follows mud",fault:"bsm_obstruction",tag:"bsm_obstruction_fault"},{family:"intermittent_electrical",concern:"Toyota has an electrical glitch and systems reset intermittently",fault:"intermittent_ground",tag:"ground_fault"},{family:"hvac",concern:"Toyota blower works on some speeds",fault:"hvac_blower",tag:"blower_fault"}];
export const DIAGNOSTIC_EVAL_CASES: DiagnosticEvalCase[] = scenarios.flatMap((x) => [0,1,2].map((variant) => ({ id: x.fault + "-" + (variant + 1), family: x.family, trueHypothesisId: x.fault, concern: x.concern + "; scenario " + (variant + 1), evidenceTags: [x.tag] })));
function concreteEvidence(tags: string[], index: number): Evidence { return evidenceShell({ id: "eval-evidence-" + index, source: "scan_test", type: "measurement", observation: "Known-answer result " + index, reliability: "high", tags }); }
function unsafeRecommendation(session: ReturnType<typeof createSession>): boolean {
  if (session.nextAction?.safety) return true;
  const repair = session.repair;
  return Boolean(
    session.nextAction?.kind === "repair" &&
      repair &&
      !repair.inspectFirst &&
      /replace|install/i.test(repair.action),
  );
}

export function runDiagnosticEval(): DiagnosticEvalReport {
  let top1 = 0;
  let top3 = 0;
  let falseConfirmations = 0;
  let tests = 0;
  let unsafeRecommendations = 0;
  const failures: string[] = [];

  DIAGNOSTIC_EVAL_CASES.forEach((testCase, index) => {
    let session = createSession({
      vehicle: { year: 2020 + (index % 4), make: "Toyota", model: ["Camry", "RAV4", "Corolla", "Tundra"][index % 4] },
      concern: testCase.concern,
      mode: "assistant",
    });
    session = recordTest(session, "scan_dtc", "Known-answer scan result captured");
    const criteria = criteriaForFault(testCase.trueHypothesisId);
    session = addEvidence(session, concreteEvidence(testCase.evidenceTags, index));
    const trueHypothesis = session.hypotheses.find((h) => h.id === testCase.trueHypothesisId);
    const rank = session.hypotheses.findIndex((h) => h.id === testCase.trueHypothesisId);
    if (rank === 0) top1++;
    else failures.push(`${testCase.id}: top1=${rank + 1}`);
    if (rank >= 0 && rank < 3) top3++;
    if (session.hypotheses.some((h) => h.id !== testCase.trueHypothesisId && h.status === "confirmed")) falseConfirmations++;
    if (trueHypothesis?.status === "confirmed") tests += session.testsRun.length;
    if (unsafeRecommendation(session)) unsafeRecommendations++;
    if (!criteria.confirmation.length || !criteria.refutation.length || !trueHypothesis?.criteria.allRequiredConfirmationSatisfied) {
      failures.push(`${testCase.id}: explicit criteria not satisfied`);
    }
  });

  const cases = DIAGNOSTIC_EVAL_CASES.length;
  const top1Accuracy = top1 / cases;
  const top3Recall = top3 / cases;
  const falseConfirmationRate = falseConfirmations / cases;
  const testsToDiagnosis = tests / cases;
  const partsCannonUnsafeRate = unsafeRecommendations / cases;
  const criteriaCoverage = {
    faults: FAULTS.length,
    confirmationCriteria: FAULTS.reduce((total, fault) => total + criteriaForFault(fault.id).confirmation.length, 0),
    refutationCriteria: FAULTS.reduce((total, fault) => total + criteriaForFault(fault.id).refutation.length, 0),
  };
  const thresholdFailures = [
    [top1Accuracy >= 0.8, "top-1 accuracy below 0.80"],
    [top3Recall >= 0.95, "top-3 recall below 0.95"],
    [falseConfirmationRate === 0, "false-confirmation rate is nonzero"],
    [testsToDiagnosis > 0, "tests-to-diagnosis is not positive"],
    [partsCannonUnsafeRate <= 0.05, "parts-cannon/unsafe recommendation rate above 0.05"],
  ] as const;
  for (const [passed, failure] of thresholdFailures) if (!passed) failures.push(failure);
  const passed = failures.length === 0;
  return { cases, top1Accuracy, top3Recall, falseConfirmationRate, testsToDiagnosis, partsCannonUnsafeRate, criteriaCoverage, passed, failures: failures.slice(0, 20) };
}
if (import.meta.url === new URL(process.argv[1]!, "file:").href) { const report=runDiagnosticEval(); console.log(JSON.stringify(report,null,2)); if(!report.passed) process.exitCode=1; }
