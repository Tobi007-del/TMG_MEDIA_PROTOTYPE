import { FN_KEY } from "../consts/generics";

// ============ Async Utilities ============

export const mockAsync = (timeout = 250): Promise<void> => new Promise((resolve) => setTimeout(resolve, timeout));

// ============ Limited Call Utilities ============

interface LimitedOptions {
  key?: string; /** Key for localStorage persistence (if omitted, uses session-only) */
  maxTimes?: number; /** Max times to call (default: 1) */
}

interface LimitedHandle<T extends (...args: any[]) => any> {
  (...args: Parameters<T>): ReturnType<T> | void;
  reset: () => void;
  block: () => void;
}

export const limited = <T extends (...args: any[]) => any>(fn: T, opts: LimitedOptions | string = {}): LimitedHandle<T> => {
  const { key, maxTimes: max = 1 } = typeof opts === "string" ? { key: opts } : opts;
  let count = 0;
  const getReg = () => (typeof localStorage === "undefined" ? {} : JSON.parse(localStorage.getItem(FN_KEY) || "{}")),
    setReg = (r: Record<string, number>) => typeof localStorage !== "undefined" && localStorage.setItem(FN_KEY, JSON.stringify(r));
  const wrapped = (...args: Parameters<T>): ReturnType<T> | void => {
    if (!key || typeof localStorage === "undefined") return count++ < max ? fn(...args) : undefined;
    const r = getReg(),
      c = r[key] || 0;
    return c < max ? ((r[key] = c + 1), setReg(r), fn(...args)) : undefined;
  };
  wrapped.reset = () => ((count = 0), key && typeof localStorage !== "undefined" && ((r) => (delete r[key], setReg(r)))(getReg()));
  wrapped.block = () => ((count = max), key && typeof localStorage !== "undefined" && ((r) => ((r[key] = max), setReg(r)))(getReg()));
  return wrapped;
};

export const oncePerSession = <T extends (...args: any[]) => any>(fn: T) => limited(fn);
export const onceEver = <T extends (...args: any[]) => any>(key: string, fn: T) => limited(fn, key);

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
