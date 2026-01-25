export function uid(prefix = "tmg-"): string {
  return `${prefix}${Date.now().toString(36)}_${performance.now().toString(36).replace(".", "")}_${Math.random().toString(36).slice(2)}`;
}

export function remToPx(val: number): number {
  return parseFloat(getComputedStyle(document.documentElement).fontSize) * val;
}

export function isDef(val: any): boolean {
  return val !== undefined;
}
