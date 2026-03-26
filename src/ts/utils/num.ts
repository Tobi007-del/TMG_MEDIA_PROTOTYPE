import { clamp } from "@t007/utils";
import { AptRange } from "../types/generics";

// Validators
export { clamp };

export function isValidNum(val: any): boolean {
  return !isNaN(val ?? NaN) && val !== Infinity;
}

export function safeNum(number: any, fallback = 0): number {
  return isValidNum(number) ? number : fallback;
}

// Parsers
export function parseIfPercent(percent: any, amount: any, autocap = 0.25): number {
  const val = percent?.endsWith?.("%") ? safeNum((parseFloat(percent) / 100) * amount) : percent;
  return val && amount && autocap && amount <= val ? amount * autocap : val;
}

export function parseCSSTime(time: any): number {
  return time?.endsWith?.("ms") ? parseFloat(time) : parseFloat(time) * 1000;
}

export function parseCSSUnit(val: any): number {
  return val?.endsWith?.("px") ? parseFloat(val) : remToPx(parseFloat(val));
}

export function remToPx(val: number): number {
  return parseFloat(getComputedStyle(document.documentElement).fontSize) * val;
}

// Helpers
export function stepNum<T extends AptRange>(v = 0, { min, max, step }: T): number {
  const s = Math.round((safeNum(v) - min) / step) * step + min;
  return clamp(min, +s.toFixed(10), max);
}

const _stepsCache = new Map<string, number[]>();
export function rotate<T>(cur: T, steps: T[] | readonly T[], dir?: "forwards" | "backwards", wrap?: boolean): T;
export function rotate(cur: number, steps: AptRange, dir?: "forwards" | "backwards", wrap?: boolean): number;
export function rotate(cur: any, steps: any, dir: "forwards" | "backwards" = "forwards", wrap = true): any {
  let list: any[];
  if (Array.isArray(steps)) list = steps;
  else {
    const key = `${steps.min}|${steps.max}|${steps.step}`; // Generate cache key from min|max|step
    if (_stepsCache.has(key)) list = _stepsCache.get(key)!;
    else _stepsCache.set(key, (list = Array.from({ length: Math.floor((steps.max - steps.min) / steps.step) + 1 }, (_, i) => steps.min + i * steps.step)));
  }
  let idx = "number" === typeof cur ? list.reduce((p, c, x) => (Math.abs(c - cur) < Math.abs(list[p] - cur) ? x : p), 0) : list.indexOf(cur);
  idx = idx + (dir === "forwards" ? 1 : -1);
  return list[wrap ? (idx + list.length) % list.length : clamp(0, idx, list.length - 1)];
}
