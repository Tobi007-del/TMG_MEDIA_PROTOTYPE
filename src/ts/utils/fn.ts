import { ONCE_KEY } from "../consts/constants";

// ============ Async Utilities ============

export const mockAsync = (timeout = 250): Promise<void> => new Promise((resolve) => setTimeout(resolve, timeout));

// ============ Once Utilities ============

export const oncePerSession = <T extends (...args: any[]) => any>(fn: T): ((...args: Parameters<T>) => ReturnType<T> | void) => {
  let called = false;
  return (...args: Parameters<T>): ReturnType<T> | void => (called ? undefined : ((called = true), fn(...args)));
};

export const onceEver = <T extends (...args: any[]) => any>(key: string, fn: T): ((...args: Parameters<T>) => ReturnType<T> | void) => {
  return (...args: Parameters<T>): ReturnType<T> | void => {
    if (typeof localStorage === "undefined") return fn(...args);
    const reg = new Set<string>(JSON.parse(localStorage.getItem(ONCE_KEY) || "[]"));
    if (!reg.has(key)) return (reg.add(key), localStorage.setItem(ONCE_KEY, JSON.stringify([...reg])), fn(...args));
  };
};

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
  const msg = newName ? `${oldName} is deprecated and will be removed in ${major}.0; use ${newName} instead.` : `${oldName} is deprecated and will be removed in ${major}.0.`;
  deprecate(msg);
}
