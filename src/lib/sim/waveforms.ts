import type { CaseDefinition, SignalKind, VehicleState } from "./types";

function toothWave(t: number, rpm: number, teeth: number, missing: number, amp: number) {
  if (rpm < 40) return 0;
  const rps = rpm / 60;
  const angle = (t * rps * 360) % 360;
  const pitch = 360 / teeth;
  const tooth = Math.floor(angle / pitch);
  if (tooth >= teeth - missing) return 0;
  const local = (angle % pitch) / pitch;
  return Math.sin(local * Math.PI) * amp * Math.min(1, rpm / 400);
}

export function sampleSignal(
  kind: SignalKind,
  t: number,
  state: VehicleState,
  def: CaseDefinition,
): number {
  const f = def.fault;
  const failed = state.faultActive && !state.faultCleared;
  const drop = failed && state.faultSeverity > 0.5;
  const rpm = state.rpm;

  switch (kind) {
    case "ckp_vr": {
      let amp = 4.8;
      if (f.kind === "temp_resistance" && failed) amp *= Math.max(0.08, 1 - state.faultSeverity);
      if (f.kind === "open_circuit" && f.componentId.includes("ckp") && !state.faultCleared) return 0.02 * Math.sin(t * 40);
      if (drop && (f.componentId.includes("ckp") || f.kind === "intermittent_connection")) {
        const window = Math.floor(t * 20) % 7;
        if (window === 0 || window === 1) return 0;
      }
      return toothWave(t, rpm, 36, 2, amp);
    }
    case "ckp_hall": {
      if (f.kind === "open_circuit" && f.componentId.includes("ckp") && !state.faultCleared) return 0.02;
      if (rpm < 40) return 0.1;
      const rps = rpm / 60;
      const bit = Math.sin(t * rps * Math.PI * 36) > 0 ? 5 : 0.08;
      if (drop && f.componentId.includes("ckp")) {
        const window = Math.floor(t * 18) % 9;
        if (window === 0) return 0.08;
      }
      return bit;
    }
    case "cmp_hall": {
      if (rpm < 40) return 0.1;
      const rps = rpm / 60;
      return Math.sin(t * rps * Math.PI * 6) > 0.2 ? 5 : 0.08;
    }
    case "injector": {
      if (!state.engineRunning && !state.cranking) return state.key === "on" ? 12.2 : 0;
      if (!state.crankOk) return state.batteryV;
      const rps = Math.max(rpm, 1) / 60;
      const cycle = (t * rps * 2) % 1;
      const pw = (state.injectorMs || 2.5) / (1000 / Math.max(rps * 2, 1));
      return cycle < pw * 0.08 ? 0.4 : state.batteryV;
    }
    case "ignition": {
      if (!state.spark) return state.key === "on" ? 0.2 : 0;
      const rps = rpm / 60;
      const cycle = (t * rps * 2) % 1;
      if (cycle < 0.04) return 350 * Math.exp(-cycle * 80);
      if (cycle < 0.12) return 0.4;
      return 12;
    }
    case "can_h": {
      if (f.kind === "can_bus_fault" && !state.faultCleared) {
        if (f.canFault === "canh-gnd" || f.canFault === "shorted") return 0.25 + Math.random() * 0.15;
      }
      const bit = Math.sin(t * 5000) > 0 ? 3.5 : 2.5;
      return bit;
    }
    case "can_l": {
      if (f.kind === "can_bus_fault" && !state.faultCleared) {
        if (f.canFault === "canh-gnd") return 2.5 + Math.sin(t * 40) * 0.1;
        if (f.canFault === "shorted") return 0.25;
      }
      const bit = Math.sin(t * 5000) > 0 ? 1.5 : 2.5;
      return bit;
    }
    case "can_diff": {
      return sampleSignal("can_h", t, state, def) - sampleSignal("can_l", t, state, def);
    }
    case "wheel_speed": {
      if (state.vss < 1) return 0.05;
      const hz = state.vss * 4.2;
      return Math.sin(t * hz * Math.PI * 2) > 0 ? 5 : 0.08;
    }
    case "tps":
      return 0.5 + (state.tps / 100) * 4.0;
    case "alt_bplus":
      return state.engineRunning ? state.altV + Math.sin(t * (state.rpm / 60) * 6 * Math.PI * 2) * state.rippleVac : state.batteryV;
    case "battery":
      return state.batteryV;
    case "maf":
      return state.engineRunning ? 0.8 + state.maf * 0.18 : 0;
    case "ref_5v":
      return state.key === "off" ? 0 : 4.98;
    case "ground":
      return f.groundDropV && failed ? f.groundDropV : 0.02;
    case "power":
      return state.key === "off" ? 0 : state.batteryV;
    case "sensor":
      return state.key === "off" ? 0 : 1.2 + state.coolantF / 220;
    default:
      return 0;
  }
}

export function scopeTrace(
  kind: SignalKind,
  state: VehicleState,
  def: CaseDefinition,
  t0: number,
  dt: number,
  n: number,
): number[] {
  const out = new Array<number>(n);
  for (let i = 0; i < n; i++) out[i] = sampleSignal(kind, t0 + i * dt, state, def);
  return out;
}
