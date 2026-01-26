// Validators
export function isValidNum(val: any): boolean {
  return !isNaN(val ?? NaN) && val !== Infinity;
}

export function clamp(min = 0, val: number, max = Infinity) {
  return Math.min(Math.max(val, min), max);
}

export function safeNum(number: any, fallback = 0): number {
  return isValidNum(number) ? number : fallback;
}

// Parsers
export function parseIfPercent(percent: any, amount = 100): number {
  return percent?.endsWith?.("%") ? safeNum((percent.slice(0, -1) / 100) * amount) : percent;
}

export function parseCSSTime(time: string): number {
  return time.endsWith("ms") ? parseFloat(time) : parseFloat(time) * 1000;
}

export function parseCSSUnit(val: string): number {
  return val.endsWith("px") ? parseFloat(val) : remToPx(parseFloat(val));
}

export function remToPx(val: number): number {
  return parseFloat(getComputedStyle(document.documentElement).fontSize) * val;
}
