import { LUID_KEY } from "../consts/generics";

// Case Conversion
export function capitalize(word = ""): string {
  return word.replace(/^(\s*)([a-z])/i, (_, s, l) => s + l.toUpperCase());
}

export function camelize(str = "", { source } = /[\s_-]+/, { preserveInnerCase: pIC = true, upperFirst: uF = false } = {}): string {
  return (pIC ? str : str.toLowerCase()).replace(new RegExp(source + "(\\w)", "g"), (_, c) => c.toUpperCase()).replace(/^\w/, (c) => c[uF ? "toUpperCase" : "toLowerCase"]());
}

export function uncamelize(str = "", separator = " "): string {
  return str.replace(/([a-z])([A-Z])/g, `$1${separator}$2`).toLowerCase();
}

// Generation
export function uid(prefix = "tmg_"): string {
  return prefix + Date.now().toString(36) + "_" + performance.now().toString(36).replace(".", "") + "_" + Math.random().toString(36).slice(2);
}
export function luid(prefix = "tmg_"): string {
  let id = localStorage.getItem(LUID_KEY);
  return (!id && localStorage.setItem(LUID_KEY, (id = uid(prefix))), id || "");
}

// Checkers
export function isSameURL(src1: unknown, src2: unknown): boolean {
  if (typeof src1 !== "string" || typeof src2 !== "string" || !src1 || !src2) return false;
  try {
    const u1 = new URL(src1, window.location.href),
      u2 = new URL(src2, window.location.href);
    return decodeURIComponent(u1.origin + u1.pathname) === decodeURIComponent(u2.origin + u2.pathname);
  } catch {
    return src1.replace(/\\/g, "/").split("?")[0].trim() === src2.replace(/\\/g, "/").split("?")[0].trim();
  }
}
