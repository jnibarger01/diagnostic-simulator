import { approach, clamp, lerp, mulberry32 } from "@/lib/utils";
import type {
  ActionLogEntry,
  CaseDefinition,
  DriveMode,
  DtcRecord,
  FaultModel,
  FreezeFrame,
  KeyPosition,
  VehicleState,
} from "./types";

const STEP_HINT = 1 / 30;

export function createInitialState(def: CaseDefinition, seed: number): VehicleState {
  const f = def.fault;
  const arrivesHot = false;
  const ambient = def.ambientF;
  const lowBatt = f.kind === "parasitic_draw";
  const soc = lowBatt ? 0.42 : 0.86;
  const batt = lowBatt ? 11.86 : 12.58;
  const modules: Record<string, boolean> = {};
  for (const m of def.modules) modules[m.id] = true;
  if (f.kind === "can_bus_fault") {
    modules.abs = false;
    modules.bcm = Math.random() > 0.4;
    modules.audio = false;
  }
  return {
    seed,
    simTime: 0,
    key: "off",
    engineRunning: false,
    cranking: false,
    rpm: 0,
    vss: 0,
    coolantF: arrivesHot ? 186 : ambient,
    iatF: ambient,
    ambientF: ambient,
    componentF: arrivesHot ? 178 : ambient,
    batteryV: batt,
    soc,
    altV: 0,
    rippleVac: 0,
    parasiticA: 0.018,
    load: 0,
    tps: 0,
    accel: 0,
    maf: 0,
    map: 101,
    stft: 0,
    ltft: f.kind === "vacuum_leak" ? 12 : 1.4,
    fuelPsi: 0,
    afr: 1,
    o2dn: 0.45,
    ignTiming: 0,
    fuelPct: def.fuelLevel,
    mode: "parked",
    vibration: 0,
    wiggleTimer: 0,
    faultActive: false,
    faultSeverity: 0,
    lostSync: 0,
    crankOk: true,
    camOk: true,
    injectorMs: 0,
    spark: false,
    mil: false,
    dtcs: [],
    pendingTimers: {},
    moduleOnline: modules,
    replaced: [],
    faultCleared: false,
    heatSoak: false,
    crankAttempts: 0,
    stalledEvent: false,
    lastStallTime: -999,
    runTime: 0,
    trimsLocked: false,
  };
}

export function evaluateFault(state: VehicleState, fault: FaultModel, rng: () => number): {
  active: boolean;
  severity: number;
  crankOk: boolean;
  camOk: boolean;
} {
  if (state.faultCleared) {
    return { active: false, severity: 0, crankOk: true, camOk: true };
  }
  const c = fault;
  let cond = true;
  if (c.minCoolantF != null) cond = cond && state.coolantF >= c.minCoolantF;
  if (c.minComponentF != null) cond = cond && state.componentF >= c.minComponentF;
  if (c.minRpm != null) cond = cond && state.rpm >= c.minRpm;
  if (c.minLoad != null) cond = cond && state.load >= c.minLoad;
  if (c.minVibration != null) cond = cond && state.vibration >= c.minVibration;
  if (c.keyOffOnly) cond = cond && state.key === "off" && !state.engineRunning;
  if (c.engineRunningOnly) cond = cond && state.engineRunning;

  let active = cond;
  let severity = 0;

  if (c.kind === "open_circuit") {
    active = true;
    severity = 1;
  } else if (c.kind === "temp_resistance") {
    const lo = c.minComponentF ?? 205;
    const t = state.componentF;
    if (t < lo - 8) {
      active = false;
      severity = 0;
    } else {
      severity = clamp((t - (lo - 8)) / 20, 0, 1);
      active = severity > 0.25 && (c.intermittentChance == null || rng() < c.intermittentChance * severity + 0.15);
    }
  } else if (c.kind === "intermittent_connection") {
    const vib = Math.max(state.vibration, state.wiggleTimer > 0 ? 0.9 : 0);
    const chance = (c.intermittentChance ?? 0.35) * vib;
    active = vib > 0.25 && rng() < chance;
    severity = active ? clamp(vib, 0.3, 1) : 0;
  } else if (c.kind === "vacuum_leak") {
    active = true;
    severity = state.engineRunning ? clamp(0.45 + (800 - Math.min(state.rpm, 800)) / 1600, 0.4, 0.9) : 0.2;
  } else if (c.kind === "parasitic_draw") {
    active = state.key === "off" && !state.engineRunning;
    severity = active ? 1 : 0;
  } else if (c.kind === "can_bus_fault") {
    const vib = state.vibration;
    active = true;
    severity = 0.55 + vib * 0.4;
  } else if (c.kind === "fuel_delivery") {
    const heat = clamp((state.componentF - 160) / 50, 0, 1);
    const load = state.load / 100;
    severity = clamp(0.2 + heat * 0.5 + load * 0.5, 0, 1);
    active = severity > 0.35;
  } else if (c.kind === "charging_fault") {
    active = state.engineRunning;
    severity = active ? 1 : 0;
  }

  let crankOk = true;
  let camOk = true;
  const onCkp = c.componentId.includes("ckp");
  const onCam = c.componentId.includes("cmp") || c.componentId.includes("cam");
  if (onCkp && active) {
    if (c.kind === "open_circuit") crankOk = false;
    else if (c.kind === "temp_resistance") crankOk = severity < 0.55;
    else if (c.kind === "intermittent_connection") crankOk = !active;
  }
  if (onCam && active) camOk = false;

  return { active, severity, crankOk, camOk };
}

function modeTargets(mode: DriveMode, running: boolean) {
  if (!running) return { rpm: 0, vss: 0, load: 0, tps: 0, accel: 0, vib: 0 };
  switch (mode) {
    case "parked":
    case "idle":
      return { rpm: 720, vss: 0, load: 18, tps: 2.4, accel: 0, vib: 0.08 };
    case "city":
      return { rpm: 1680, vss: 28, load: 32, tps: 14, accel: 18, vib: 0.35 };
    case "highway":
      return { rpm: 2320, vss: 68, load: 38, tps: 22, accel: 24, vib: 0.28 };
    case "accel":
      return { rpm: 3400, vss: 44, load: 78, tps: 62, accel: 80, vib: 0.55 };
    case "decel":
      return { rpm: 1400, vss: 36, load: 8, tps: 0, accel: 0, vib: 0.22 };
    case "stop_go":
      return { rpm: 1100, vss: 12, load: 28, tps: 11, accel: 20, vib: 0.48 };
    case "hill":
      return { rpm: 2800, vss: 38, load: 72, tps: 48, accel: 62, vib: 0.42 };
    case "hot_soak":
      return { rpm: 0, vss: 0, load: 0, tps: 0, accel: 0, vib: 0 };
    default:
      return { rpm: 720, vss: 0, load: 18, tps: 2, accel: 0, vib: 0.08 };
  }
}

function captureFF(s: VehicleState): FreezeFrame {
  return {
    rpm: Math.round(s.rpm),
    vss: Math.round(s.vss),
    ect: Math.round(s.coolantF),
    load: Math.round(s.load),
    stft: +s.stft.toFixed(1),
    ltft: +s.ltft.toFixed(1),
    maf: +s.maf.toFixed(2),
    map: +s.map.toFixed(1),
    iat: Math.round(s.iatF),
    vpwr: +s.batteryV.toFixed(2),
  };
}

function evalCondition(cond: FaultModel["dtcs"][0]["condition"], s: VehicleState): boolean {
  switch (cond.type) {
    case "no_ckp_while_cranking":
      return s.cranking && !s.crankOk;
    case "lost_ckp_while_running":
      return s.stalledEvent && s.runTime > 8;
    case "ckp_intermittent":
      return s.stalledEvent && s.faultActive;
    case "lean_trims":
      return s.engineRunning && s.ltft >= cond.ltft && s.stft >= cond.stft && s.runTime > 12;
    case "misfire":
      return s.engineRunning && s.faultSeverity > 0.7 && s.stft > 18;
    case "system_voltage_low":
      return s.batteryV < 11.5;
    case "lost_comm":
      return s.moduleOnline[cond.module] === false;
    case "always_if_fault_active":
      return s.faultActive;
    case "evap_small_leak":
      return s.runTime > 40 && s.engineRunning;
    case "never":
      return false;
  }
}

function updateDtcs(s: VehicleState, def: CaseDefinition, dt: number): VehicleState {
  const next = { ...s, dtcs: s.dtcs.map((d) => ({ ...d })), pendingTimers: { ...s.pendingTimers } };
  for (const rule of def.fault.dtcs) {
    if (rule.distractor && def.difficulty !== "master") continue;
    const firing = evalCondition(rule.condition, s);
    const t = next.pendingTimers[rule.code] ?? 0;
    next.pendingTimers[rule.code] = firing ? t + dt : Math.max(0, t - dt * 0.4);
    const existing = next.dtcs.find((d) => d.code === rule.code);
    if (firing && next.pendingTimers[rule.code] >= rule.pendingSec) {
      if (!existing) {
        next.dtcs.push({
          code: rule.code,
          description: rule.description,
          module: rule.module,
          status: next.pendingTimers[rule.code] >= rule.confirmSec ? "confirmed" : "pending",
          mil: rule.mil && next.pendingTimers[rule.code] >= rule.confirmSec,
          setSimTime: s.simTime,
          freezeFrame: captureFF(s),
          distractor: rule.distractor,
        });
      } else if (existing.status === "pending" && next.pendingTimers[rule.code] >= rule.confirmSec) {
        existing.status = "confirmed";
        existing.mil = rule.mil;
      }
    }
  }
  if (def.fault.kind === "can_bus_fault" && s.faultActive) {
    const codes = [
      { code: "U0100", description: "Lost Communication with ECM/PCM", module: "gateway" },
      { code: "U0121", description: "Lost Communication with ABS", module: "gateway" },
      { code: "U0155", description: "Lost Communication with IPC", module: "gateway" },
    ];
    for (const c of codes) {
      if (!next.dtcs.some((d) => d.code === c.code)) {
        next.dtcs.push({
          ...c,
          status: "confirmed",
          mil: true,
          setSimTime: s.simTime,
          freezeFrame: captureFF(s),
        });
      }
    }
  }
  next.mil = next.dtcs.some((d) => d.mil && d.status === "confirmed");
  return next;
}

export function tick(state: VehicleState, def: CaseDefinition, dt: number, rng: () => number): VehicleState {
  const s = { ...state };
  s.simTime += dt;
  const fault = def.fault;

  if (s.wiggleTimer > 0) s.wiggleTimer = Math.max(0, s.wiggleTimer - dt);

  const soak = s.mode === "hot_soak";
  if (soak) {
    s.engineRunning = false;
    s.cranking = false;
    s.key = "off";
    s.heatSoak = true;
  }

  const ev = evaluateFault(s, fault, rng);
  s.faultActive = ev.active;
  s.faultSeverity = ev.severity;
  s.crankOk = ev.crankOk;
  s.camOk = ev.camOk;

  // Key / cranking
  if (s.key === "start" && !s.engineRunning) {
    s.cranking = true;
    s.crankAttempts += dt > 0 ? dt : 0;
  } else {
    s.cranking = false;
  }

  const canStart =
    s.crankOk &&
    s.camOk &&
    s.soc > 0.18 &&
    (fault.kind !== "fuel_delivery" || s.fuelPsi > 28 || s.faultCleared);

  if (s.cranking) {
    const crankRpm = s.soc > 0.3 ? 220 : 90;
    s.rpm = s.crankOk ? crankRpm : 0;
    s.batteryV = clamp(s.batteryV - 1.8, 9.2, 12.6);
    if (canStart && s.fuelPsi > 25) {
      s.engineRunning = true;
      s.cranking = false;
      s.key = "on";
      s.stalledEvent = false;
    }
  }

  const tgt = modeTargets(s.mode, s.engineRunning);
  if (s.engineRunning) {
    s.runTime += dt;
    if (!s.crankOk || !s.camOk) {
      s.lostSync += dt;
      s.rpm = lerp(s.rpm, 0, clamp(s.lostSync * 8, 0, 1));
      if (s.lostSync > 0.18) {
        s.engineRunning = false;
        s.stalledEvent = true;
        s.lastStallTime = s.simTime;
        s.rpm = 0;
        s.spark = false;
        s.injectorMs = 0;
        s.lostSync = 0;
      }
    } else {
      s.lostSync = 0;
      s.rpm = approach(s.rpm, tgt.rpm, 2400, dt);
      s.spark = true;
      s.injectorMs = 2.4 + (tgt.load / 100) * 8;
    }
    s.vss = approach(s.vss, tgt.vss, 28, dt);
    s.load = approach(s.load, tgt.load, 50, dt);
    s.tps = approach(s.tps, tgt.tps, 70, dt);
    s.accel = approach(s.accel, tgt.accel, 80, dt);
    s.vibration = approach(s.vibration, Math.max(tgt.vib, s.wiggleTimer > 0 ? 0.95 : 0), 2, dt);

    // Warmup
    const heat = 4.2 + (s.rpm / 700) * 2.4 + (s.load / 100) * 3;
    s.coolantF = approach(s.coolantF, 196, heat, dt);
    s.componentF = approach(s.componentF, s.coolantF + 18 + (s.load / 100) * 14, heat * 1.3, dt);
    s.iatF = approach(s.iatF, s.ambientF + 12 + s.load * 0.08, 3, dt);

    // Charging
    if (fault.kind === "charging_fault" && !s.faultCleared) {
      s.altV = fault.chargingVoltage ?? 12.3;
      s.rippleVac = fault.rippleVac ?? 1.4;
      s.batteryV = approach(s.batteryV, s.altV, 0.4, dt);
    } else {
      s.altV = 14.12;
      s.rippleVac = 0.07;
      s.batteryV = approach(s.batteryV, 14.08, 1.6, dt);
      s.soc = approach(s.soc, 0.92, 0.02, dt);
    }

    // Fuel pressure
    let psi = 58;
    if (fault.kind === "fuel_delivery" && !s.faultCleared && s.faultActive) {
      psi = Math.max(16, 58 - (fault.fuelPressureDropPsi ?? 30) * s.faultSeverity);
    }
    s.fuelPsi = approach(s.fuelPsi, psi, 80, dt);

    // Air metering
    const expectedMaf = 2.6 * (s.rpm / 700) * (0.7 + s.load / 140);
    let unmetered = 0;
    if (fault.kind === "vacuum_leak" && !s.faultCleared) {
      unmetered = (fault.unmeteredAirGps ?? 2.8) * (s.rpm < 1200 ? 1 : 0.45);
    }
    s.maf = Math.max(0.4, expectedMaf - unmetered * 0.55);
    s.map = s.engineRunning ? 32 + s.load * 0.55 + unmetered * 4 : 101;

    const trueAir = s.maf + unmetered;
    const error = s.maf > 0.2 ? ((trueAir - s.maf) / trueAir) * 100 : 0;
    if (!s.trimsLocked) {
      s.stft = approach(s.stft, clamp(error * 1.15, -25, 35), 18, dt);
      if (Math.abs(s.stft) > 8) s.ltft = approach(s.ltft, clamp(s.ltft + s.stft * 0.04 * dt, -25, 35), 4, dt);
    }
    s.afr = 1 + s.stft / 200;
    s.o2dn = s.stft > 8 ? 0.12 : 0.62 + Math.sin(s.simTime * 2) * 0.12;
    s.ignTiming = 8 + s.load * 0.12 - (s.coolantF < 140 ? 4 : 0);

    if (s.fuelPsi < 22 && s.engineRunning) {
      s.lostSync += dt * 0.5;
    }
  } else {
    s.rpm = s.cranking && s.crankOk ? s.rpm : 0;
    s.vss = 0;
    s.load = 0;
    s.tps = 0;
    s.accel = 0;
    s.maf = 0;
    s.map = 101;
    s.injectorMs = 0;
    s.spark = false;
    s.ignTiming = 0;
    s.altV = 0;
    s.rippleVac = 0;
    s.stft = approach(s.stft, 0, 12, dt);
    if (s.key === "on" || s.cranking) {
      s.fuelPsi = approach(s.fuelPsi, 54, 90, dt);
      s.batteryV = approach(s.batteryV, 12.2 + s.soc * 0.5, 0.8, dt);
    } else {
      s.fuelPsi = approach(s.fuelPsi, 0, 12, dt);
    }
    // Cool down / heat soak
    if (s.heatSoak && s.runTime > 30) {
      s.componentF = approach(s.componentF, Math.min(s.componentF + 8, s.coolantF + 28), 6, dt);
      s.coolantF = approach(s.coolantF, s.ambientF + 40, 1.2, dt);
    } else {
      s.coolantF = approach(s.coolantF, s.ambientF, 0.7, dt);
      s.componentF = approach(s.componentF, s.ambientF, 0.9, dt);
    }
    s.iatF = approach(s.iatF, s.ambientF, 1.4, dt);
    s.vibration = approach(s.vibration, s.wiggleTimer > 0 ? 0.95 : 0, 3, dt);

    // Parasitic draw
    let draw = 0.018;
    if (fault.kind === "parasitic_draw" && !s.faultCleared && s.key === "off") {
      draw = fault.parasiticAmps ?? 1.85;
    }
    s.parasiticA = draw;
    if (s.key === "off") {
      const used = (draw * dt) / 3600 / 70;
      s.soc = clamp(s.soc - used, 0, 1);
      s.batteryV = 10.6 + s.soc * 2.2;
    }
  }

  if (fault.kind === "can_bus_fault" && !s.faultCleared) {
    const drop = s.faultSeverity > 0.5;
    s.moduleOnline = {
      ...s.moduleOnline,
      abs: !drop,
      audio: false,
      bcm: s.vibration < 0.4,
      ipc: !drop || rng() > 0.4,
    };
  } else {
    const online: Record<string, boolean> = { ...s.moduleOnline };
    for (const k of Object.keys(online)) online[k] = true;
    s.moduleOnline = online;
  }

  if (s.engineRunning && s.coolantF > 160) s.heatSoak = false;

  const withDtc = updateDtcs(s, def, dt);
  return withDtc;
}

export function setKey(state: VehicleState, key: KeyPosition): VehicleState {
  const s = { ...state, key };
  if (key === "off") {
    s.engineRunning = false;
    s.cranking = false;
  }
  if (key === "on" && state.key === "off") {
    s.trimsLocked = false;
  }
  return s;
}

export function setMode(state: VehicleState, mode: DriveMode): VehicleState {
  const s = { ...state, mode };
  if (mode === "hot_soak") {
    s.engineRunning = false;
    s.key = "off";
    s.heatSoak = true;
  } else if (mode !== "parked" && !s.engineRunning && s.crankOk) {
    // driver will try to start — caller should key-start
  }
  return s;
}

export function startEngineAttempt(state: VehicleState): VehicleState {
  return { ...state, key: "start" };
}

export function replaceComponent(state: VehicleState, def: CaseDefinition, componentId: string): {
  state: VehicleState;
  cleared: boolean;
} {
  const replaced = state.replaced.includes(componentId) ? state.replaced : [...state.replaced, componentId];
  const correct = def.fault.correctComponentIds.includes(componentId);
  let next = { ...state, replaced };
  if (componentId === "battery") {
    next.soc = 0.95;
    next.batteryV = 12.62;
  }
  if (componentId === "maf_sensor" || componentId === "ecm") {
    next.stft = 0;
    next.ltft = 0;
  }
  if (correct) {
    next.faultCleared = true;
    next.faultActive = false;
    next.faultSeverity = 0;
    next.crankOk = true;
    next.camOk = true;
    next.stalledEvent = false;
  }
  return { state: next, cleared: correct };
}

export function clearCodes(state: VehicleState): VehicleState {
  const history = state.dtcs
    .filter((d) => d.status === "confirmed" || d.status === "pending")
    .map((d) => ({ ...d, status: "history" as const, mil: false }));
  return {
    ...state,
    dtcs: history,
    mil: false,
    pendingTimers: {},
    stalledEvent: false,
  };
}

export function wiggle(state: VehicleState): VehicleState {
  return { ...state, wiggleTimer: 4, vibration: 0.95 };
}

export function parkOvernight(state: VehicleState, def: CaseDefinition): VehicleState {
  let s: VehicleState = { ...state, key: "off", engineRunning: false, cranking: false, mode: "parked" };
  const hours = 12;
  const rng = mulberry32(state.seed + 99);
  const steps = 40;
  const dt = (hours * 3600) / steps;
  for (let i = 0; i < steps; i++) s = tick(s, def, dt, rng);
  s.coolantF = s.ambientF;
  s.componentF = s.ambientF;
  s.heatSoak = false;
  s.simTime = state.simTime + hours * 3600;
  return s;
}

export function snapshotPids(state: VehicleState) {
  return {
    t: state.simTime,
    rpm: state.rpm,
    vss: state.vss,
    coolantF: state.coolantF,
    iatF: state.iatF,
    batteryV: state.batteryV,
    tps: state.tps,
    accel: state.accel,
    maf: state.maf,
    map: state.map,
    load: state.load,
    stft: state.stft,
    ltft: state.ltft,
    afr: state.afr,
    o2dn: state.o2dn,
    fuelPsi: state.fuelPsi,
    ignTiming: state.ignTiming,
    altV: state.altV,
    componentF: state.componentF,
  };
}

export function laborFor(kind: string): number {
  const table: Record<string, number> = {
    scan: 0.1,
    dtc_clear: 0.05,
    live_pin: 0.02,
    interview: 0.1,
    inspect: 0.2,
    wiggle: 0.15,
    smoke: 0.4,
    fuel: 0.3,
    scope: 0.2,
    dvom: 0.15,
    drive: 0.3,
    wiring: 0.1,
    overnight: 0.2,
    replace: 0,
    notes: 0.02,
    hypothesis: 0.02,
    key: 0.02,
  };
  return table[kind] ?? 0.1;
}

export function makeLog(
  state: VehicleState,
  kind: string,
  label: string,
  detail: string,
  extra?: Partial<ActionLogEntry>,
): ActionLogEntry {
  return {
    t: state.simTime,
    laborHr: extra?.laborHr ?? laborFor(kind),
    kind,
    label,
    detail,
    testId: extra?.testId,
    useful: extra?.useful,
  };
}

export { STEP_HINT };
