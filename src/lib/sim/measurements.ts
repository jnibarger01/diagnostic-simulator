import type { CaseDefinition, DvomMode, DvomReading, TestResult, VehicleState, WiringNode } from "./types";
import { sampleSignal } from "./waveforms";

function nodeById(def: CaseDefinition, id: string): WiringNode | undefined {
  return def.wiring.nodes.find((n) => n.id === id);
}

function dcAt(node: WiringNode | undefined, state: VehicleState, def: CaseDefinition): number {
  if (!node) return 0;
  return sampleSignal(node.signal, state.simTime, state, def);
}

export function measureDvom(
  mode: DvomMode,
  redId: string,
  blackId: string,
  state: VehicleState,
  def: CaseDefinition,
): DvomReading {
  const red = nodeById(def, redId);
  const black = nodeById(def, blackId);
  if (!red || !black) {
    return { display: "-----", numeric: null, unit: "", valid: false, note: "Probe a valid point." };
  }
  if (redId === blackId) {
    return { display: "0.00", numeric: 0, unit: mode === "ohm" ? "Ω" : "V", valid: true, note: "Both leads on the same point." };
  }

  const f = def.fault;
  const failed = !state.faultCleared;

  if (mode === "ohm" || mode === "continuity") {
    if (state.key === "on" || state.engineRunning) {
      return {
        display: mode === "ohm" ? "OL" : "OPEN",
        numeric: null,
        unit: "Ω",
        valid: false,
        note: "Circuit is powered. Resistance readings are invalid with KOEO/KOER.",
      };
    }
    const involvesFault = redId === f.componentId || blackId === f.componentId || red.circuit === black.circuit;
    const acrossSensor =
      (red.kind === "sensor" && black.kind === "ecu") ||
      (black.kind === "sensor" && red.kind === "ecu") ||
      (red.kind === "sensor" && black.kind === "ground") ||
      (black.kind === "sensor" && red.kind === "ground") ||
      red.kind === "connector" ||
      black.kind === "connector";

    if (f.kind === "open_circuit" && failed && involvesFault && acrossSensor) {
      return {
        display: "OL",
        numeric: null,
        unit: "Ω",
        valid: true,
        note: "Open circuit.",
      };
    }
    if (f.kind === "temp_resistance" && failed && involvesFault) {
      const cold = f.resistanceOhms ?? 980;
      const hot = f.resistanceHotOhms ?? 48000;
      const t = (state.componentF - 70) / Math.max(1, (f.minComponentF ?? 205) - 70);
      const r = cold + Math.max(0, t) * (hot - cold);
      return { display: r > 10000 ? `${(r / 1000).toFixed(1)}k` : r.toFixed(0), numeric: r, unit: "Ω", valid: true };
    }
    if (f.kind === "intermittent_connection" && failed && (red.kind === "connector" || black.kind === "connector")) {
      const r = state.wiggleTimer > 0 || state.vibration > 0.4 ? 12000 + Math.random() * 8000 : 1.4;
      return { display: r > 100 ? r.toFixed(0) : r.toFixed(1), numeric: r, unit: "Ω", valid: true, note: r > 100 ? "Unstable — wiggle the connector." : undefined };
    }
    if (red.kind === "ground" && black.kind === "ground") {
      return { display: "0.2", numeric: 0.2, unit: "Ω", valid: true };
    }
    if (red.signal === black.signal && red.circuit === black.circuit) {
      return { display: "0.4", numeric: 0.4, unit: "Ω", valid: true };
    }
    if (acrossSensor && (red.circuit === black.circuit || involvesFault)) {
      const r = f.resistanceOhms ?? 1120;
      return { display: r.toFixed(0), numeric: r, unit: "Ω", valid: true };
    }
    const open = mode === "continuity" ? "OPEN" : "OL";
    return { display: open, numeric: null, unit: "Ω", valid: true };
  }

  const vr = dcAt(red, state, def);
  const vb = dcAt(black, state, def);
  const dc = vr - vb;

  if (mode === "dcv" || mode === "vdrop") {
    return {
      display: dc.toFixed(2),
      numeric: dc,
      unit: "V",
      valid: true,
      note: mode === "vdrop" && Math.abs(dc) > 0.3 && (red.kind === "ground" || black.kind === "ground") ? "Voltage drop exceeds 0.3 V." : undefined,
    };
  }

  // ACV — useful on VR sensors and alternator ripple
  let ac = 0;
  if (red.signal === "ckp_vr" || black.signal === "ckp_vr") {
    ac = state.rpm > 50 && state.crankOk ? Math.min(8, state.rpm / 180) : 0.02;
    if (f.kind === "open_circuit" && f.componentId.includes("ckp") && failed) ac = 0.01;
    if (f.kind === "temp_resistance" && failed) ac *= Math.max(0.05, 1 - state.faultSeverity);
  } else if (red.signal === "alt_bplus" || red.signal === "battery") {
    ac = state.rippleVac;
  } else if (red.signal === "can_h" || red.signal === "can_l") {
    ac = f.kind === "can_bus_fault" && failed ? 0.12 : 1.0;
  } else {
    ac = Math.abs(dc) * 0.04;
  }
  return { display: ac.toFixed(2), numeric: ac, unit: "V~", valid: true };
}

export function runFuelTest(state: VehicleState, def: CaseDefinition): TestResult {
  const psi = state.fuelPsi;
  const spec = 47;
  const ok = psi >= spec;
  const useful = def.fault.kind === "fuel_delivery" || def.valuableTests.includes("fuel");
  return {
    id: "fuel",
    title: "Fuel pressure (KOEO/KOER)",
    laborHr: 0.3,
    useful,
    narrative: ok
      ? `Rail holds ${psi.toFixed(0)} psi. Spec is ${spec}–62 psi. Delivery is within spec.`
      : `Rail pressure ${psi.toFixed(0)} psi — below the ${spec} psi minimum. Volume may also be low under load.`,
    lines: [
      { k: "Key state", v: state.engineRunning ? "KOER" : state.key === "off" ? "Key off" : "KOEO" },
      { k: "Rail pressure", v: `${psi.toFixed(1)} psi`, flag: ok ? "ok" : "fault" },
      { k: "Spec", v: "47–62 psi (Denso, 2.5/3.5)" },
      { k: "Deadhead", v: `${Math.min(90, psi + (ok ? 18 : 4)).toFixed(0)} psi` },
      { k: "Leakdown 5 min", v: ok ? "Hold (drop < 8 psi)" : "Drops rapidly", flag: ok ? "ok" : "warn" },
    ],
  };
}

export function runSmokeTest(state: VehicleState, def: CaseDefinition): TestResult {
  const leak = def.fault.kind === "vacuum_leak" && !state.faultCleared;
  return {
    id: "smoke",
    title: "Smoke test — intake / EVAP",
    laborHr: 0.4,
    useful: leak || def.valuableTests.includes("smoke"),
    narrative: leak
      ? `Smoke exits at ${def.fault.leakLocation ?? "the intake tube downstream of the MAF"}. Unmetered air is present.`
      : "No visible smoke at the intake boot, vacuum tees, or EVAP purge path. System holds.",
    lines: [
      { k: "Machine pressure", v: "4.0 inH2O" },
      { k: "Intake boot", v: leak && (def.fault.leakLocation ?? "").includes("boot") ? "SMOKE VISIBLE" : "Sealed", flag: leak ? "fault" : "ok" },
      { k: "Pulleys / PCV", v: "No leak" },
      { k: "Purge solenoid", v: "Holds (valve closed)" },
      { k: "Throttle shaft", v: "Trace seepage — typical" },
    ],
  };
}

export function runParasiticTest(state: VehicleState, def: CaseDefinition): TestResult {
  const a = state.key === "off" ? state.parasiticA : 0;
  const ok = a < 0.05;
  return {
    id: "parasitic",
    title: "Parasitic draw (in-line ammeter)",
    laborHr: 0.4,
    useful: def.fault.kind === "parasitic_draw" || def.valuableTests.includes("parasitic"),
    narrative: ok
      ? `Key-off draw is ${(a * 1000).toFixed(0)} mA. Spec is typically < 50 mA after modules sleep.`
      : `Key-off draw is ${(a * 1000).toFixed(0)} mA — well above the 50 mA spec. Pull fuses to isolate the circuit.`,
    lines: [
      { k: "Key", v: state.key.toUpperCase() },
      { k: "Draw", v: `${(a * 1000).toFixed(0)} mA`, flag: ok ? "ok" : "fault" },
      { k: "Sleep wait", v: "Modules gated (sim)" },
      { k: "DOME 7.5A fuse", v: !ok && def.fault.kind === "parasitic_draw" ? "Pulling this fuse drops draw to 22 mA" : "No change" },
      { k: "ALT B+ cable", v: "0.0 A additional" },
    ],
  };
}

export function runChargingTest(state: VehicleState, def: CaseDefinition): TestResult {
  const loaded = state.engineRunning;
  const v = loaded ? state.altV : state.batteryV;
  const ripple = state.rippleVac;
  const vOk = loaded ? v >= 13.5 && v <= 14.8 : v >= 12.2;
  const rOk = ripple < 0.4;
  return {
    id: "charging",
    title: "Charging system",
    laborHr: 0.25,
    useful: def.fault.kind === "charging_fault" || def.valuableTests.includes("charging"),
    narrative: loaded
      ? `Running voltage ${v.toFixed(2)} V, ripple ${ripple.toFixed(2)} V AC. ${vOk && rOk ? "Alternator output is in spec." : "Charging is out of spec."}`
      : "Engine is not running. Start the vehicle to load-test the alternator.",
    lines: [
      { k: "Battery rest", v: `${state.batteryV.toFixed(2)} V`, flag: state.batteryV < 12.2 ? "warn" : "ok" },
      { k: "KOER voltage", v: loaded ? `${v.toFixed(2)} V` : "—" },
      { k: "Ripple (AC)", v: loaded ? `${ripple.toFixed(2)} V` : "—", flag: rOk ? "ok" : "fault" },
      { k: "Loaded (headlamps)", v: loaded ? `${(v - 0.12).toFixed(2)} V` : "—" },
    ],
  };
}

export function runHealthCheck(state: VehicleState, def: CaseDefinition) {
  const comms = def.modules.map((m) => ({
    id: m.id,
    name: m.name,
    online: state.moduleOnline[m.id] !== false,
  }));
  const confirmed = state.dtcs.filter((d) => d.status === "confirmed").length;
  const pending = state.dtcs.filter((d) => d.status === "pending").length;
  return {
    mil: state.mil,
    confirmed,
    pending,
    comms,
    ready: {
      catalyst: state.runTime > 80,
      evap: false,
      o2: state.runTime > 40,
      o2htr: state.coolantF > 160,
      egr: true,
      misfire: true,
      fuel: state.runTime > 20,
    },
  };
}

export const INSPECTION_AREAS = [
  { id: "underhood", label: "Underhood visual" },
  { id: "connectors", label: "Connectors" },
  { id: "harness", label: "Harness wiggle" },
  { id: "battery", label: "Battery terminals" },
  { id: "grounds", label: "Engine / body grounds" },
  { id: "vacuum", label: "Vacuum hoses / intake" },
  { id: "fluids", label: "Fluids" },
  { id: "underbody", label: "Underbody" },
  { id: "interior", label: "Interior / glove box" },
  { id: "stereo", label: "Aftermarket electronics" },
] as const;

export function inspectArea(area: string, state: VehicleState, def: CaseDefinition, wiggle = false): TestResult {
  const hits = def.fault.inspectionFindings.filter((f) => f.area === area);
  const lines: TestResult["lines"] = [];
  let narrative = "No obvious defects in this area.";
  let useful = false;
  if (hits.length === 0) {
    lines.push({ k: "Result", v: "No visible fault", flag: "ok" });
  } else {
    for (const h of hits) {
      if (h.requiresWiggle && !wiggle && state.wiggleTimer <= 0) {
        lines.push({ k: h.label, v: "Looks seated. Wiggle to load the circuit.", flag: "warn" });
        continue;
      }
      if (h.visibleOnlyIfFault && state.faultCleared) {
        lines.push({ k: h.label, v: "Previously noted condition is repaired.", flag: "ok" });
        continue;
      }
      lines.push({ k: h.label, v: h.finding, flag: h.reveals ? "fault" : "warn" });
      if (h.reveals) {
        narrative = h.finding;
        useful = true;
      }
    }
  }
  return {
    id: `inspect:${area}`,
    title: `Inspection — ${INSPECTION_AREAS.find((a) => a.id === area)?.label ?? area}`,
    laborHr: wiggle ? 0.15 : 0.2,
    useful,
    narrative,
    lines,
  };
}

export function matchInterview(q: string, def: CaseDefinition): string {
  const ql = q.toLowerCase().trim();
  if (ql.length < 2) return def.interview.greeting;
  let best = def.interview.unknown;
  let score = 0;
  for (const item of def.interview.items) {
    let s = 0;
    for (const k of item.keywords) if (ql.includes(k)) s += 1;
    if (s > score) {
      score = s;
      best = item.answer;
    }
  }
  return score === 0 ? def.interview.unknown : best;
}
