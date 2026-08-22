import type { DiagnosticCriterion, Evidence, HypothesisCriteria } from "./types";

type CriterionSpec = Omit<DiagnosticCriterion, "kind"> & { kind: DiagnosticCriterion["kind"] };

const c = (id: string, description: string, kind: CriterionSpec["kind"], allTags: string[], extra: DiagnosticCriterion["match"] = {}): CriterionSpec => ({
  id,
  description,
  kind,
  required: true,
  match: { allTags, ...extra },
});

/**
 * Confirmation and refutation are deliberately explicit. A missing entry is a
 * provider/catalog defect, never an invitation for the score to confirm.
 */
export const CRITERIA: Record<string, { confirmation: CriterionSpec[]; refutation: CriterionSpec[] }> = {
  ckp_sync: { confirmation: [c("ckp-wave-loss", "CKP waveform drops out during the failure", "confirmation", ["ckp_wave_loss"])], refutation: [c("ckp-wave-stable", "CKP waveform remains stable through the failure", "refutation", ["ckp_wave_ok"])] },
  ckp_connector: { confirmation: [c("ckp-wiggle-drop", "Loaded harness wiggle disturbs CKP/RPM", "confirmation", ["wiggle_drop"])], refutation: [c("ckp-wiggle-stable", "Loaded wiggle does not disturb CKP/RPM", "refutation", ["wiggle_stable"])] },
  ecm_power: { confirmation: [c("ecm-power-loss", "ECM or EFI relay power drops during the event", "confirmation", ["ecm_power_loss"])], refutation: [c("ecm-power-stable", "ECM and relay power remain stable", "refutation", ["ecm_power_ok"])] },
  fuel_delivery: { confirmation: [c("fuel-pressure-low", "Fuel pressure collapses during the failure", "confirmation", ["fuel_pressure_low"])], refutation: [c("fuel-pressure-ok", "Fuel pressure remains within the OEM specification", "refutation", ["fuel_pressure_ok"], { requiresProviderEvidence: true })] },
  ignition: { confirmation: [c("spark-misfire", "Spark or misfire evidence identifies ignition loss", "confirmation", ["spark_loss"])], refutation: [c("spark-present", "Spark remains present through the event", "refutation", ["spark_ok"])] },
  airflow: { confirmation: [c("airflow-tracking", "MAF/MAP/throttle tracking fails the OEM plausibility check", "confirmation", ["airflow_implausible"], { requiresProviderEvidence: true })], refutation: [c("airflow-plausible", "Airflow and throttle tracking are plausible", "refutation", ["airflow_plausible"])] },
  immobilizer: { confirmation: [c("security-interrupt", "Security authorization disables start or fuel enable", "confirmation", ["security_active"], { requiresProviderEvidence: true })], refutation: [c("security-clear", "Security authorization remains valid", "refutation", ["security_clear"])] },
  unmetered_air: { confirmation: [c("intake-smoke-leak", "Smoke test finds an intake leak after the MAF", "confirmation", ["smoke_leak"])], refutation: [c("intake-sealed", "Smoke test finds no intake leak", "refutation", ["smoke_seal"])] },
  maf_bias: { confirmation: [c("maf-oem-mismatch", "MAF/load comparison fails the OEM plausibility check", "confirmation", ["maf_implausible"], { requiresProviderEvidence: true })], refutation: [c("maf-plausible", "MAF tracks load plausibly", "refutation", ["maf_plausible"])] },
  af_sensor: { confirmation: [c("af-response-bias", "A/F sensor response is biased or fails correlation", "confirmation", ["af_sensor_bias"], { requiresProviderEvidence: true })], refutation: [c("af-response-good", "A/F sensor responds and correlates normally", "refutation", ["af_sensor_ok"])] },
  pcv_purge: { confirmation: [c("purge-trim-change", "Purge/PCV isolation changes the trim concern", "confirmation", ["purge_isolated_fault"])], refutation: [c("purge-no-effect", "Purge/PCV isolation has no effect", "refutation", ["purge_isolated_ok"])] },
  parasitic_lamp: { confirmation: [c("lamp-draw", "A lamp or door circuit remains on with a post-sleep draw", "confirmation", ["lamp_on_keyoff"])], refutation: [c("lamp-off", "Lamps are off and draw returns to the OEM sleep range", "refutation", ["parasitic_normal"], { requiresProviderEvidence: true })] },
  parasitic_aftermarket: { confirmation: [c("accessory-draw", "Isolating the aftermarket accessory removes the draw", "confirmation", ["aftermarket_isolated_fault"])], refutation: [c("accessory-no-effect", "Aftermarket isolation does not change the draw", "refutation", ["aftermarket_isolated_ok"])] },
  battery_soh: { confirmation: [c("battery-load-fail", "Battery fails a conductance/load test", "confirmation", ["battery_test_fail"], { requiresProviderEvidence: true })], refutation: [c("battery-load-pass", "Battery passes the load test", "refutation", ["battery_test_pass"])] },
  charging_fail: { confirmation: [c("charging-low", "Charging voltage/ripple fails the OEM specification", "confirmation", ["charging_fault"], { requiresProviderEvidence: true })], refutation: [c("charging-good", "Charging voltage and ripple meet the OEM specification", "refutation", ["charging_ok"], { requiresProviderEvidence: true })] },
  can_aftermarket: { confirmation: [c("can-accessory-fault", "CAN disturbance disappears when the aftermarket splice is isolated", "confirmation", ["can_aftermarket_fault"])], refutation: [c("can-accessory-clear", "CAN remains correct with the accessory isolated", "refutation", ["can_aftermarket_ok"])] },
  can_gateway: { confirmation: [c("can-backbone-fault", "Topology/isolation identifies a gateway or backbone fault", "confirmation", ["can_gateway_fault"], { requiresProviderEvidence: true })], refutation: [c("can-backbone-clear", "Gateway and backbone pass OEM network checks", "refutation", ["can_gateway_ok"], { requiresProviderEvidence: true })] },
  bsm_cal: { confirmation: [c("bsm-cal-incomplete", "OEM BSM initialization/calibration is incomplete", "confirmation", ["bsm_no_init"], { requiresProviderEvidence: true })], refutation: [c("bsm-cal-complete", "OEM BSM initialization/calibration is complete", "refutation", ["bsm_init_ok"], { requiresProviderEvidence: true })] },
  bsm_mount: { confirmation: [c("bsm-mount-damage", "Inspection finds damaged or shifted BSM mounting", "confirmation", ["bsm_mount_fault"]),], refutation: [c("bsm-mount-good", "Mounting and aiming meet the OEM specification", "refutation", ["bsm_mount_ok"], { requiresProviderEvidence: true })] },
  bsm_harness: { confirmation: [c("bsm-circuit-fault", "BSM power, ground, or communication circuit fails", "confirmation", ["bsm_circuit_fault"], { requiresProviderEvidence: true })], refutation: [c("bsm-circuit-good", "BSM power, ground, and communication pass", "refutation", ["bsm_circuit_ok"], { requiresProviderEvidence: true })] },
  bsm_sensor: { confirmation: [c("bsm-sensor-isolated", "Sensor remains failed after cal, mount, and circuit are proven good", "confirmation", ["bsm_sensor_isolated_fault"], { requiresProviderEvidence: true })], refutation: [c("bsm-alternative-open", "Calibration, mount, or circuit remains an open explanation", "refutation", ["bsm_alternative_open"])] },
  mechanical: { confirmation: [c("mechanical-fail", "Compression or mechanical inspection identifies an engine integrity fault", "confirmation", ["mechanical_fault"], { requiresProviderEvidence: true })], refutation: [c("mechanical-good", "Compression and mechanical inspection are acceptable", "refutation", ["mechanical_ok"], { requiresProviderEvidence: true })] },
  misfire_coil: { confirmation: [c("misfire-coil", "Misfire follows a coil or ignition primary fault", "confirmation", ["misfire_coil_fault"])], refutation: [c("misfire-ignition-good", "Ignition follows the cylinder and remains healthy", "refutation", ["spark_ok"])] },
  rich_condition: { confirmation: [c("rich-fuel", "Fuel pressure/injector test identifies excess fuel", "confirmation", ["rich_fuel_fault"], { requiresProviderEvidence: true })], refutation: [c("rich-fuel-clear", "Fuel pressure and injector control are normal", "refutation", ["rich_fuel_ok"], { requiresProviderEvidence: true })] },
  evap_purge: { confirmation: [c("evap-purge", "EVAP purge valve leaks or sticks open when isolated", "confirmation", ["purge_valve_fault"])], refutation: [c("evap-purge-clear", "Purge valve seals and responds to command", "refutation", ["purge_valve_ok"])] },
  starter_circuit: { confirmation: [c("starter-drop", "Starter control or feed voltage drops under load", "confirmation", ["starter_circuit_fault"], { requiresProviderEvidence: true })], refutation: [c("starter-good", "Starter feed/control passes voltage-drop testing", "refutation", ["starter_circuit_ok"], { requiresProviderEvidence: true })] },
  ground_intermittent: { confirmation: [c("ground-drop", "Ground voltage drop appears during the intermittent event", "confirmation", ["ground_fault"], { requiresProviderEvidence: true })], refutation: [c("ground-good", "Ground voltage drop remains acceptable during the event", "refutation", ["ground_ok"], { requiresProviderEvidence: true })] },
  hvac_actuator: { confirmation: [c("hvac-actuator", "HVAC actuator command and position disagree", "confirmation", ["hvac_actuator_fault"], { requiresProviderEvidence: true })], refutation: [c("hvac-actuator-good", "HVAC actuator tracks command", "refutation", ["hvac_actuator_ok"], { requiresProviderEvidence: true })] },
  hvac_blower: { confirmation: [c("blower-fault", "Blower power or speed control fails at the complaint", "confirmation", ["blower_fault"], { requiresProviderEvidence: true })], refutation: [c("blower-good", "Blower power, ground, and control remain stable", "refutation", ["blower_ok"], { requiresProviderEvidence: true })] },
  intermittent_ground: { confirmation: [c("ground-fault", "Loaded voltage drop identifies a shared ground/feed fault", "confirmation", ["ground_fault"], { requiresProviderEvidence: true })], refutation: [c("ground-good", "Loaded voltage drop remains stable", "refutation", ["ground_ok"], { requiresProviderEvidence: true })] },
  can_termination: { confirmation: [c("can-termination-fault", "OEM bus isolation identifies wiring/termination failure", "confirmation", ["can_termination_fault"], { requiresProviderEvidence: true })], refutation: [c("can-termination-good", "OEM bus isolation and waveform are normal", "refutation", ["can_termination_ok"], { requiresProviderEvidence: true })] },
  bsm_obstruction: { confirmation: [c("bsm-obstruction", "Inspection finds an obstruction at the BSM sensing area", "confirmation", ["bsm_obstruction_fault"])], refutation: [c("bsm-obstruction-clear", "Sensing area is clean and unobstructed", "refutation", ["bsm_obstruction_ok"])] },
  charging_connection: { confirmation: [c("charging-connection-fault", "Loaded voltage drop identifies a charging-path fault", "confirmation", ["charging_connection_fault"], { requiresProviderEvidence: true })], refutation: [c("charging-connection-good", "Loaded charging-path voltage drop is stable", "refutation", ["charging_connection_ok"], { requiresProviderEvidence: true })] },
  starter_control: { confirmation: [c("starter-control-fault", "Starter command or relay/feed drops during no-crank", "confirmation", ["starter_circuit_fault"], { requiresProviderEvidence: true })], refutation: [c("starter-control-good", "Starter command and feed remain stable", "refutation", ["starter_circuit_ok"], { requiresProviderEvidence: true })] },
};

export function criteriaForFault(id: string): { confirmation: DiagnosticCriterion[]; refutation: DiagnosticCriterion[] } {
  const entry = CRITERIA[id];
  if (!entry) throw new Error(`No explicit confirmation/refutation criteria for fault ${id}`);
  return { confirmation: entry.confirmation, refutation: entry.refutation };
}

function matches(evidence: Evidence, criterion: DiagnosticCriterion): boolean {
  const m = criterion.match;
  if (m.allTags?.some((tag) => !evidence.tags.includes(tag))) return false;
  if (m.anyTags?.length && !m.anyTags.some((tag) => evidence.tags.includes(tag))) return false;
  if (m.source?.length && !m.source.includes(evidence.source)) return false;
  if (m.type?.length && !m.type.includes(evidence.type)) return false;
  if (m.observationIncludes?.some((needle) => !evidence.observation.toLowerCase().includes(needle.toLowerCase()))) return false;
  if (m.structured && (!evidence.structuredValue || evidence.structuredValue.key !== m.structured.key || (m.structured.value !== undefined && evidence.structuredValue.value !== m.structured.value))) return false;
  if (m.requiresProviderEvidence && evidence.source !== "simulator" && evidence.source !== "scan_test" && evidence.source !== "technician" && evidence.source !== "dvom" && evidence.source !== "oscilloscope" && evidence.source !== "pressure" && evidence.source !== "inspection") return false;
  return true;
}

export function evaluateCriteria(evidence: Evidence[], id: string): HypothesisCriteria {
  const criteria = criteriaForFault(id);
  const state = (items: DiagnosticCriterion[]) => items.map((criterion) => {
    const evidenceIds = evidence.filter((ev) => matches(ev, criterion)).map((ev) => ev.id);
    return { id: criterion.id, description: criterion.description, satisfied: evidenceIds.length > 0, evidenceIds, required: criterion.required };
  });
  const confirmation = state(criteria.confirmation);
  const refutation = state(criteria.refutation);
  return { confirmation, refutation, allRequiredConfirmationSatisfied: confirmation.filter((x) => x.required).every((x) => x.satisfied), anyRefutationSatisfied: refutation.some((x) => x.satisfied) };
}
