import { DTC_KB } from "./knowledge";
import type { ComplaintFamily, Evidence, EvidenceSource } from "./types";
import { familyFor } from "./knowledge";

const TAG_PATTERNS: { re: RegExp; tags: string[] }[] = [
  { re: /\bstall(s|ed|ing)?\b|\bdie[sd]?\b|\bcuts? out\b|\bshut(?:s|ting)? off\b/i, tags: ["stall"] },
  { re: /won'?t start|will not start|no start|doesn'?t start/i, tags: ["no_start"] },
  { re: /cranks? (but|and).{0,24}(won'?t|will not|no) start|cranks?,?\s*no start/i, tags: ["crank_no_start", "no_start"] },
  { re: /no crank|doesn'?t crank|click(?:s|ing)?\b|silent/i, tags: ["no_crank"] },
  { re: /rough idle|idle (is |feels )?(rough|hunt)|wants to die/i, tags: ["rough_idle"] },
  { re: /system too lean|too lean|p0171|\blean\b/i, tags: ["lean"] },
  { re: /check engine|\bcel\b|\bmil\b/i, tags: ["mil_on"] },
  { re: /no warning|no light|no cel|no mil|no consistent warning/i, tags: ["no_mil"] },
  { re: /intermittent|sometimes|occasionally|random|ghost|on and off/i, tags: ["intermittent"] },
  { re: /after (a |the )?(long )?drive|fully warm|heat[- ]?soak|\bhot\b|20.?30 min/i, tags: ["hot"] },
  { re: /only (when |if )?cold|cold start is perfect|never (when |if )?cold/i, tags: ["cold"] },
  { re: /immediately dies|starts and (immediately )?dies|start(?:s)? and die/i, tags: ["restart_die"] },
  { re: /instant(?:ly)?|like (the )?(key|ignition)|keyed off|as if.{0,12}switched off/i, tags: ["instant_off"] },
  { re: /sputter|stumble|lose[s]? power/i, tags: ["sputter"] },
  { re: /bump|rough road|vibration|wiggle|over (a )?bump/i, tags: ["vibration"] },
  { re: /aftermarket|stereo|head unit|radio just went|new radio|alarm install/i, tags: ["aftermarket"] },
  { re: /battery.{0,24}(dead|drain)|dead battery|sit over|going dead|won'?t crank after sit/i, tags: ["dead_battery", "sit_overnight"] },
  { re: /blind[- ]?spot|\bbsm\b|rcta|rear cross/i, tags: ["bsm"] },
  { re: /multiple warning|abs.{0,12}traction|christmas tree|dash lit|half the dash/i, tags: ["network"] },
  { re: /fuel pump.{0,20}(replac|already|no change)|pump.{0,16}no change/i, tags: ["prior_fuel_pump"] },
  { re: /sensor already replaced|replaced.{0,20}sensor|bsm.{0,16}replac/i, tags: ["prior_sensor"] },
  { re: /rear (bumper|body|collision)|collision repair/i, tags: ["rear_body"] },
  { re: /while driving|on the (road|highway)|pulling away/i, tags: ["while_driving"] },
  { re: /at (a )?(stop|light|idle)|stoplights?/i, tags: ["at_idle"] },
  { re: /car wash|rain|moisture|wet/i, tags: ["rain"] },
  { re: /after (refuel|fill)|just (filled|gassed)/i, tags: ["after_refuel"] },
  { re: /charge lamp|alt(?:ernator)? (light|fail)/i, tags: ["charging_fail"] },
  { re: /usb (port|outlet)|dash cam/i, tags: ["aftermarket"] },
  { re: /glove box|dome light|trunk light/i, tags: ["lamp_on_keyoff"] },
  { re: /not (initialized|calibrated)|never (initialized|calibrated)|no (init|cal)/i, tags: ["bsm_no_init"] },
  { re: /misfire|p030[1-8]|shaking under load/i, tags: ["misfire"] },
  { re: /rich|black smoke|fuel smell/i, tags: ["rich"] },
  { re: /evap|purge|after refuel|hard start after filling/i, tags: ["evap"] },
  { re: /blower|air conditioning|heater fan|hvac/i, tags: ["hvac"] },
  { re: /voltage drop|ground strap|power feed|electrical glitch/i, tags: ["intermittent_electrical"] },
];

const SAFETY_PATTERNS: { re: RegExp; flag: string }[] = [
  { re: /brake|abs warning while driving|pedal to the floor/i, flag: "Brakes — verify the vehicle is safe to operate before any road test." },
  { re: /steering|assist lost|power steer/i, flag: "Steering — loss of assist is a safety concern on a road test." },
  { re: /airbag|srs/i, flag: "SRS — do not probe airbag circuits without OEM procedures." },
  { re: /hybrid|hv battery|orange (cable|wire)/i, flag: "HV system — follow OEM high-voltage safety. Do not invent disable procedures." },
  { re: /fuel (smell|leak)|gasoline smell|fire/i, flag: "Possible fuel leak — do not run the engine until the leak is controlled." },
  { re: /uncontrolled|lurches|takes off/i, flag: "Uncontrolled movement risk — confirm throttle and transmission safety first." },
];

const CONDITION_LABELS: Record<string, string> = {
  hot: "Hot / after extended driving",
  cold: "Cold",
  hot_only: "Hot-only",
  intermittent: "Intermittent",
  while_driving: "While driving",
  at_idle: "Idle / stopping",
  vibration: "Vibration / rough road",
  rain: "Moisture related",
  sit_overnight: "After sitting",
  after_refuel: "After refueling",
};

const SYMPTOM_LABELS: Record<string, string> = {
  stall: "Engine stall",
  no_start: "No-start",
  crank_no_start: "Cranks, no start",
  no_crank: "No-crank",
  rough_idle: "Rough idle",
  lean: "Lean / fuel-trim concern",
  instant_off: "Instant shutdown",
  sputter: "Sputter / loss of power",
  restart_die: "Starts then dies",
  dead_battery: "Battery goes dead",
  network: "Multiple warning lights",
  bsm: "Blind-spot / ADAS warning",
  mil_on: "Malfunction indicator",
  no_mil: "No consistent warning lamp",
};

export function unique(xs: string[]): string[] {
  return [...new Set(xs.filter(Boolean))];
}

export function extractTags(...texts: string[]): string[] {
  const blob = texts.filter(Boolean).join("\n");
  const tags: string[] = [];
  for (const p of TAG_PATTERNS) {
    if (p.re.test(blob)) tags.push(...p.tags);
  }
  return unique(tags);
}

export function extractSymptoms(tags: string[]): string[] {
  return tags.map((t) => SYMPTOM_LABELS[t]).filter(Boolean);
}

export function extractConditions(tags: string[]): string[] {
  return tags.map((t) => CONDITION_LABELS[t]).filter(Boolean);
}

export function extractSafety(text: string): string[] {
  return SAFETY_PATTERNS.filter((p) => p.re.test(text)).map((p) => p.flag);
}

export function detectFamily(tags: string[]): ComplaintFamily {
  return familyFor(tags);
}

export function parseDtcCodes(raw: string): { code: string; title: string }[] {
  if (!raw.trim()) return [];
  const found = raw.toUpperCase().match(/\b[PBCU][0-9A-F]{4}\b/g) ?? [];
  return unique(found).map((code) => {
    const kb = DTC_KB.find((d) => d.code === code);
    return { code, title: kb?.title ?? "OEM definition required — title not in the local library" };
  });
}

export interface PidReading {
  key: string;
  value: number;
  units?: string;
  raw: string;
}

const PID_LINE =
  /^\s*(rpm|vss|speed|ect|coolant|iat|batt(?:ery)?|vpwr|stft|ltft|maf|map|tps|accel|app|load|fuel(?:\s*pressure)?|a\/?f|o2|lambda|timing|ign)\b[^0-9+-]*([+-]?\d+(?:\.\d+)?)\s*(%|psi|kpa|v|g\/s|mph|°f|f|rpm|°)?/i;

const PID_KEY: Record<string, string> = {
  rpm: "rpm",
  vss: "vss",
  speed: "vss",
  ect: "ect",
  coolant: "ect",
  iat: "iat",
  batt: "vpwr",
  battery: "vpwr",
  vpwr: "vpwr",
  stft: "stft",
  ltft: "ltft",
  maf: "maf",
  map: "map",
  tps: "tps",
  accel: "app",
  app: "app",
  load: "load",
  fuel: "fuel_psi",
  "fuel pressure": "fuel_psi",
  "a/f": "afr",
  af: "afr",
  o2: "o2",
  lambda: "afr",
  timing: "timing",
  ign: "timing",
};

export function parsePidPaste(text: string): PidReading[] {
  const out: PidReading[] = [];
  for (const line of text.split(/\n|;/)) {
    const m = line.match(PID_LINE);
    if (!m) continue;
    const label = m[1]!.toLowerCase();
    const key = PID_KEY[label] ?? label;
    const value = Number(m[2]);
    if (!Number.isFinite(value)) continue;
    out.push({ key, value, units: m[3], raw: line.trim() });
  }
  return out;
}

export function tagsFromPids(pids: PidReading[], condition?: string): string[] {
  const tags: string[] = [];
  const get = (k: string) => pids.find((p) => p.key === k)?.value;
  const rpm = get("rpm");
  const stft = get("stft");
  const ltft = get("ltft");
  const fuel = get("fuel_psi");
  const cond = (condition ?? "").toLowerCase();
  const duringFail = /stall|fail|die|event|crank/.test(cond);

  if (rpm === 0 && duringFail) tags.push("rpm_zero_event");
  if (stft != null && ltft != null && stft > 8 && ltft > 8) tags.push("trims_idle_high", "lean");
  if (stft != null && ltft != null && stft > 8 && ltft > 8 && /cruise|highway|2500/.test(cond)) {
    tags.push("trims_cruise_high");
  }
  if (fuel != null && fuel >= 35 && fuel <= 65 && duringFail) tags.push("fuel_pressure_ok");
  if (fuel != null && fuel < 28) tags.push("fuel_pressure_low");
  return unique(tags);
}

const OBS_PATTERNS: { re: RegExp; tags: string[]; source: EvidenceSource }[] = [
  { re: /ckp.{0,40}(disappear|dropout|no signal|missing|lost)/i, tags: ["ckp_wave_loss"], source: "oscilloscope" },
  { re: /ckp.{0,40}(present|stable|clean|good|normal)/i, tags: ["ckp_wave_ok"], source: "oscilloscope" },
  { re: /rpm.{0,20}(0|zero|drops? to zero|disappear)/i, tags: ["rpm_zero_event"], source: "live_pid" },
  { re: /fuel pressure.{0,24}(\d{2})/i, tags: [], source: "pressure" },
  { re: /fuel pressure.{0,30}(spec|normal|held|stayed|ok|good)/i, tags: ["fuel_pressure_ok"], source: "pressure" },
  { re: /fuel pressure.{0,24}(low|collapse|drop|zero)/i, tags: ["fuel_pressure_low"], source: "pressure" },
  { re: /smoke.{0,20}(leak|found|split|tear)/i, tags: ["smoke_leak"], source: "inspection" },
  { re: /smoke.{0,20}(no leak|sealed|tight)/i, tags: ["smoke_seal"], source: "inspection" },
  { re: /wiggle.{0,30}(drop|die|stall|rpm)/i, tags: ["wiggle_drop"], source: "inspection" },
  { re: /corrosion|green (on )?(the )?terminal|backed.?out/i, tags: ["connector_corrosion"], source: "inspection" },
  { re: /glove.{0,20}(lit|on|stuck)/i, tags: ["lamp_on_keyoff"], source: "inspection" },
  { re: /parasitic.{0,20}(\d+(?:\.\d+)?)\s*a/i, tags: ["parasitic_high"], source: "scan_test" },
  { re: /can[- ]?h.{0,20}(0|short|collapse|ground)/i, tags: ["can_voltage_bad"], source: "dvom" },
  { re: /efi (relay|power).{0,20}(drops|lost|0)/i, tags: ["ecm_power_loss"], source: "dvom" },
  { re: /efi (relay|power).{0,20}(stays|stable|ok|12)/i, tags: ["ecm_power_ok"], source: "dvom" },
  { re: /not (initialized|calibrated)/i, tags: ["bsm_no_init"], source: "technician" },
  { re: /no comm(?:unication)? .{0,20}bsm/i, tags: ["bsm_no_comm"], source: "scan_test" },
];

export function interpretObservation(text: string, condition?: string): { tags: string[]; source: EvidenceSource; pids: PidReading[] } {
  const pids = parsePidPaste(text);
  const tags = [...extractTags(text, condition ?? ""), ...tagsFromPids(pids, condition)];
  let source: EvidenceSource = "technician";
  for (const p of OBS_PATTERNS) {
    if (p.re.test(text)) {
      tags.push(...p.tags);
      source = p.source;
    }
  }
  const fuelMatch = text.match(/fuel pressure.{0,24}(\d{2}(?:\.\d+)?)\s*psi/i);
  if (fuelMatch) {
    const v = Number(fuelMatch[1]);
    if (v >= 35 && v <= 65) tags.push("fuel_pressure_ok");
    if (v < 28) tags.push("fuel_pressure_low");
    pids.push({ key: "fuel_psi", value: v, units: "psi", raw: fuelMatch[0] });
  }
  return { tags: unique(tags), source, pids };
}

export function makeId(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
}

export function evidenceShell(partial: Omit<Evidence, "id" | "timestamp" | "supports" | "contradicts" | "neutralTo"> & { id?: string }): Evidence {
  return {
    id: partial.id ?? makeId("ev"),
    timestamp: Date.now(),
    supports: [],
    contradicts: [],
    neutralTo: [],
    ...partial,
  };
}
