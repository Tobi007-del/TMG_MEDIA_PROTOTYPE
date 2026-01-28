import { whiteListedKeys } from "../consts/generics";
import { isArr } from "./obj";

type KeyStruct = Record<"ctrlKey" | "shiftKey" | "altKey" | "metaKey", boolean> & { key: string };

export const parseKeyCombo = (combo: string): KeyStruct => {
  const parts = combo.toLowerCase().split("+");
  return { ctrlKey: parts.includes("ctrl"), shiftKey: parts.includes("shift"), altKey: parts.includes("alt"), metaKey: parts.includes("meta") || parts.includes("cmd"), key: parts.find((p) => !["ctrl", "shift", "alt", "meta", "cmd"].includes(p)) || "" };
};

export const stringifyKeyCombo = (e: KeyStruct | KeyboardEvent): string => {
  const parts: string[] = [];
  if (e.ctrlKey) parts.push("ctrl");
  if (e.altKey) parts.push("alt");
  if (e.shiftKey) parts.push("shift");
  if (e.metaKey) parts.push("meta");
  parts.push(e.key?.toLowerCase() ?? "");
  return parts.join("+");
};

// export function cleanKeyCombo(combo: string): string;
// export function cleanKeyCombo(combo: string[]): string[];
export function cleanKeyCombo(combo: string | string[]): string | string[] {
  const clean = (combo: string): string => {
    const m = ["ctrl", "alt", "shift", "meta"],
      alias: Record<string, string> = { cmd: "meta" };
    if (combo === " " || combo === "+") return combo;
    combo = combo.replace(/\+\s*\+$/, "+plus");
    const p = combo
      .toLowerCase()
      .split("+")
      .filter((k) => k !== "")
      .map((k) => alias[k] || (k === "plus" ? "+" : k.trim() || " "));
    return [...p.filter((k) => m.includes(k)).sort((a, b) => m.indexOf(a) - m.indexOf(b)), ...(p.filter((k) => !m.includes(k)) || "")].join("+");
  };
  return isArr(combo) ? combo.map(clean) : clean(combo);
}

export const matchKeys = (required: string | string[], actual: string, strict = false): boolean => {
  const match = (required: string, actual: string): boolean => {
    if (strict) return required === actual;
    const reqKeys = required.split("+"),
      actKeys = actual.split("+");
    return reqKeys.every((k) => actKeys.includes(k));
  };
  return isArr(required) ? required.some((req) => match(req, actual)) : match(required, actual);
};

export const formatKeyForDisplay = (combo: string | string[]): string => ` ${(isArr(combo) ? combo : [combo]).map((c) => `(${c})`).join(" or ")}`;

export const getTermsForKey = (combo: string, settings: any): { override: boolean; block: boolean; allowed: boolean; action: string | null } => {
  const terms = { override: false, block: false, allowed: false, action: null as string | null },
    { overrides = [], shortcuts = {}, blocks = [], strictMatches: s = false } = settings?.keys || {};
  if (matchKeys(overrides, combo, s)) terms.override = true;
  if (matchKeys(blocks, combo, s)) terms.block = true;
  if (matchKeys(whiteListedKeys as unknown as string[], combo)) terms.allowed = true;
  terms.action = Object.entries(shortcuts).find(([, shortcut]) => matchKeys(shortcut as string | string[], combo, s))?.[0] || null;
  return terms;
};

export const keyEventAllowed = (e: KeyboardEvent, settings: any): boolean | string => {
  if (settings?.keys?.disabled || ((e.key === " " || e.key === "Enter") && (e.currentTarget as any)?.document?.activeElement?.tagName === "BUTTON") || (e.currentTarget as any)?.document?.activeElement?.matches("input,textarea,[contenteditable='true']")) return false;
  const combo = stringifyKeyCombo(e),
    { override, block, action, allowed } = getTermsForKey(combo, settings);
  if (block) return false;
  if (override) e.preventDefault();
  if (action) return action;
  if (allowed) return e.key.toLowerCase();
  return false;
};

export const formatKeyShortcutsForDisplay = (keyShortcuts: Record<string, string | string[]>): Record<string, string> => {
  const shortcuts: Record<string, string> = {};
  for (const action of Object.keys(keyShortcuts)) shortcuts[action] = formatKeyForDisplay(keyShortcuts[action]);
  return shortcuts;
};
