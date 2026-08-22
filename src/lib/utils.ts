import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

export function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

export function approach(current: number, target: number, rate: number, dt: number) {
  const delta = target - current;
  const max = rate * dt;
  if (Math.abs(delta) <= max) return target;
  return current + Math.sign(delta) * max;
}

export function formatHours(h: number) {
  if (h < 1) return `${Math.round(h * 60)} min`;
  const hrs = Math.floor(h);
  const min = Math.round((h - hrs) * 60);
  return min ? `${hrs}h ${min}m` : `${hrs}.0 hr`;
}

export function formatMoney(n: number) {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}

export function formatPid(id: string, value: number | string | boolean | null | undefined) {
  if (value === null || value === undefined) return "---";
  if (typeof value === "boolean") return value ? "ON" : "OFF";
  if (typeof value === "string") return value;
  if (!Number.isFinite(value)) return "---";
  const abs = Math.abs(value);
  if (abs >= 100) return value.toFixed(0);
  if (abs >= 10) return value.toFixed(1);
  return value.toFixed(2);
}

export function mulberry32(seed: number) {
  let a = seed >>> 0;
  return function rng() {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function hashString(s: string) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}
