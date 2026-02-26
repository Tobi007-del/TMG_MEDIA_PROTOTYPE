import { FN_KEY } from "../consts/generics";
import { uid } from ".";

// ============ Timer Utilities ============

export function setTimeout(handler: TimerHandler, timeout?: number, ...args: any[]) {
  const sig = args[0] instanceof AbortSignal ? args.shift() : undefined;
  if (sig?.aborted) return -1;
  if (!sig) return window.setTimeout(handler, timeout, ...args);
  const id = window.setTimeout(() => (sig.removeEventListener("abort", kill), typeof handler === "string" ? new Function(handler) : handler(...args)), timeout),
    kill = () => window.clearTimeout(id);
  return (sig.addEventListener("abort", kill, { once: true }), id);
}

export function setInterval(handler: TimerHandler, timeout?: number, ...args: any[]) {
  const sig = args[0] instanceof AbortSignal ? args.shift() : undefined;
  if (sig?.aborted) return -1;
  const id = window.setInterval(handler, timeout, ...args);
  return (sig?.addEventListener("abort", () => window.clearInterval(id), { once: true }), id);
}

export function requestAnimationFrame(callback: FrameRequestCallback, sig?: AbortSignal) {
  if (sig?.aborted) return -1;
  if (!sig) return window.requestAnimationFrame(callback);
  const id = window.requestAnimationFrame((t) => (sig.removeEventListener("abort", kill), callback(t))),
    kill = () => window.cancelAnimationFrame(id);
  return (sig.addEventListener("abort", kill, { once: true }), id);
}

// ============ Async Utilities ============

export const mockAsync = (timeout = 250): Promise<void> => new Promise((resolve) => setTimeout(resolve, timeout));

// ============ Limited Call Utilities ============

interface LimitedOptions {
  key?: string; /** Key for localStorage persistence (if omitted, uses session-only) */
  maxTimes?: number; /** Max times to call (default: 1) */
}
interface LimitedHandle<T extends (...args: any[]) => any> {
  (...args: Parameters<T>): ReturnType<T> | void;
  count: number;
  left: number;
  reset: () => void;
  block: () => void;
}

export function limited<T extends (...args: any[]) => any>(fn: T, opts: LimitedOptions | string = {}): LimitedHandle<T> {
  let count = 0,
    { key, maxTimes: max = 1 } = "string" === typeof opts ? { key: opts } : opts;
  const getReg = () => JSON.parse(localStorage.getItem(FN_KEY) || "{}"),
    setReg = (r: Record<string, number>) => localStorage.setItem(FN_KEY, JSON.stringify(r));
  const handle = (...args: Parameters<T>): ReturnType<T> | void => {
    if (!key) return count++ < max ? fn(...args) : undefined;
    const r = getReg(),
      c = r[key] || 0;
    return c < max ? ((r[key] = c + 1), setReg(r), fn(...args)) : undefined;
  };
  handle.left = max - (handle.count = count);
  handle.reset = () => ((count = 0), key && ((r) => (delete r[key], setReg(r)))(getReg()));
  handle.block = () => ((count = max), key && ((r) => ((r[key] = max), setReg(r)))(getReg()));
  return handle;
}

export const oncePerSession = <T extends (...args: any[]) => any>(fn: T) => limited(fn);
export const onceEver = <T extends (...args: any[]) => any>(fn: T, key = uid()) => limited(fn, key);

// ============ Deprecation Helpers ============

/**
 * Log a deprecation warning (once per session)
 * @param message - Deprecation warning message
 */
export function deprecate(message: string): void {
  oncePerSession(() => console.warn(message))();
}

/**
 * Log a deprecation warning for a major version upgrade
 * @param major - Major version number when removal occurs
 * @param oldName - Name of deprecated feature
 * @param newName - Optional replacement feature name
 */
export function deprecateForMajor(major: number, oldName: string, newName?: string): void {
  deprecate(newName ? `${oldName} is deprecated and will be removed in ${major}.0; use ${newName} instead.` : `${oldName} is deprecated and will be removed in ${major}.0.`);
}
