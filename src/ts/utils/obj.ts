import type { Control, ControlPanelBottomTuple } from "../plugs";
import type { DeepMerge, Unflatten, WCPaths, Paths, PathValue } from "../types/obj";
import type { UIObject, UISettings } from "../types/UIOptions";
import { camelize } from ".";
const arrRx = /^([^\[\]]+)\[(\d+)\]$/;

// Type Guards
export function isDef(val: any): boolean {
  return val !== undefined;
}

export function isArr<T = unknown>(obj: any): obj is T[] {
  return Array.isArray(obj);
}

export function isObj<T extends object = object>(obj: any): obj is T {
  return "object" === typeof obj && obj !== null && !isArr(obj) && "function" !== typeof obj;
}

export function isIter<T = unknown>(obj: any): obj is Iterable<T> {
  return obj != null && "function" === typeof obj[Symbol.iterator];
}

export function isUISetting<T = unknown>(obj: any): obj is UISettings<T> {
  return isObj(obj) && "options" in obj && isArr(obj.options);
}

export function inBoolArrOpt(opt: any, str: string): boolean {
  return opt?.includes?.(str) ?? opt;
}

// Assignment & Derivation
export function assignDef<T extends object>(target: T, key: Paths<T>, value: PathValue<T, typeof key>): void {
  isDef(value) && target != null && setAny(target, key, value);
}

export function assignHTMLConfig<T extends object>(target: T, attr: `tmg--${Paths<T, "--">}`, value: string): void {
  const path = attr.replace("tmg--", "") as Paths<T, "--">;
  const parsedValue = (() => {
    if (value.includes(",")) return value.split(",")?.map((v: string) => v.replace(/\s+/g, ""));
    if (value === "true") return true;
    if (value === "false") return false;
    if (value === "null") return null;
    if (/^\d+$/.test(value)) return Number(value);
    return value;
  })() as PathValue<T, typeof path, "--">;
  setAny<T, "--">(target, path, parsedValue, "--", (p) => camelize(p));
}

export function setAny<T extends object, const S extends string = ".">(target: T, key: Paths<T, S>, value: PathValue<T, typeof key, S>, separator: S = "." as S, keyFunc?: (p: string) => string): void {
  if (!key.includes(separator)) return void ((target as any)[keyFunc ? keyFunc(key) : key] = value);
  const keys = key.split(separator);
  let currObj: any = target;
  for (let i = 0; i < keys.length; i++) {
    let key = keyFunc ? keyFunc(keys[i]) : keys[i];
    const match = key[0] === "[" && key.match(arrRx);
    if (match) {
      const [, key, iStr] = match;
      if (!isArr(currObj[key])) currObj[key] = [];
      if (i === keys.length - 1) currObj[key][Number(iStr)] = value;
      else ((currObj[key][Number(iStr)] ||= {}), (currObj = currObj[key][Number(iStr)]));
    } else {
      if (i === keys.length - 1) currObj[key] = value;
      else ((currObj[key] ||= {}), (currObj = currObj[key]));
    }
  }
}

export function getAny<T extends object, const S extends string = ".">(source: T, key: Paths<T, S>, separator: S = "." as S, keyFunc?: (p: string) => string): PathValue<T, typeof key, S> | undefined {
  if (!key.includes(separator)) return (source as any)[keyFunc ? keyFunc(key) : key];
  const keys = key.split(separator);
  let currObj: any = source;
  for (let i = 0; i < keys.length; i++) {
    let key = keyFunc ? keyFunc(keys[i]) : keys[i];
    const match = key[0] === "[" && key.match(arrRx);
    if (match) {
      const [, key, iStr] = match;
      if (!isArr(currObj[key])) return undefined;
      currObj = currObj[key][Number(iStr)];
    } else {
      if (!isObj<Record<string, any>>(currObj) || !(key in currObj)) return undefined;
      currObj = currObj[key];
    }
  }
  return currObj;
}

export function deleteAny<T extends object, const S extends string = ".">(target: T, key: Paths<T, S>, separator: S = "." as S, keyFunc?: (p: string) => string): void {
  if (!key.includes(separator)) return void delete (target as any)[keyFunc ? keyFunc(key) : key];
  const keys = key.split(separator);
  let currObj: any = target;
  for (let i = 0; i < keys.length; i++) {
    let key = keyFunc ? keyFunc(keys[i]) : keys[i];
    const match = key[0] === "[" && key.match(arrRx);
    if (match) {
      const [, key, iStr] = match;
      if (!isArr(currObj[key])) return;
      if (i === keys.length - 1) delete currObj[key][Number(iStr)];
      else currObj = currObj[key][Number(iStr)];
    } else {
      if (!isObj<Record<string, any>>(currObj) || !(key in currObj)) return;
      if (i === keys.length - 1) delete currObj[key];
      else currObj = currObj[key];
    }
  }
}

export function parseUIObj<T extends Record<string, any>>(obj: T): UIObject<T> {
  const result: any = {} as UIObject<T>,
    keys = Object.keys(obj);
  for (let i = 0; i < keys.length; i++) {
    const entry = obj[keys[i]];
    if (!isObj(entry)) continue;
    if (isUISetting(entry)) {
      result[keys[i]] = {
        values: entry.options.map((opt: any) => ("value" in opt ? opt.value : opt)),
        displays: entry.options.map((opt: any) => ("display" in opt ? opt.display : String(opt))),
      };
    } else result[keys[i]] = parseUIObj(entry); // recurse on sub-branch
  }
  return result;
}

export function parseAnyObj<T extends Record<string, any>, const S extends string = ".">(obj: T, separator: S = "." as S, keyFunc = (p: string) => p, visited = new WeakSet()): Unflatten<T, S> {
  if (!isObj(obj) || visited.has(obj)) return obj as Unflatten<T, S>; // no circular references
  visited.add(obj);
  const result: any = {};
  Object.keys(obj).forEach((k) => (k.includes(separator) ? setAny(result, k as any, parseAnyObj(obj[k] as any, separator, keyFunc, visited), separator, keyFunc) : (result[k] = isObj(obj[k]) ? parseAnyObj(obj[k] as any, separator, keyFunc, visited) : obj[k])));
  return result as Unflatten<T, S>;
}

export function parsePanelBottomObj(obj: Partial<ControlPanelBottomTuple> | Control[][] | Control[] | unknown, arr?: false): ControlPanelBottomTuple | false;
export function parsePanelBottomObj(obj: Partial<ControlPanelBottomTuple> | Control[][] | Control[] | unknown, arr: true): Control[] | false;
export function parsePanelBottomObj(obj: Partial<ControlPanelBottomTuple> | Control[][] | Control[] | unknown = [], arr = false): ControlPanelBottomTuple | Control[] | false {
  if (!isObj(obj) && !isArr(obj)) return false;
  const [third = [], second = [], first = []] = isObj<Partial<ControlPanelBottomTuple>>(obj) ? (Object.values(obj).reverse() as Control[][]) : isArr((obj as Control[][])[0]) ? [...(obj as Control[][])].reverse() : [obj as Control[]];
  return arr ? ([...third, ...second, ...first] as Control[]) : ({ 1: first, 2: second, 3: third } as ControlPanelBottomTuple);
}

export function parseEvOpts<T extends object>(options: T | boolean | undefined, opts: (keyof T)[] | readonly (keyof T)[], boolOpt: keyof T = opts[0], result = {} as T): T {
  for (let i = 0; i < opts.length; i++) (result as any)[opts[i]] = false;
  return (Object.assign(result, "boolean" === typeof options ? { [boolOpt]: options } : options), result);
}

// Merging & Traversal
export function mergeObjs<T1 extends object, T2 extends object>(o1: T1, o2: T2): DeepMerge<T1, T2>;
export function mergeObjs<T1 extends object>(o1: T1): T1;
export function mergeObjs<T2 extends object>(o1: undefined | null, o2: T2): T2;
export function mergeObjs(o1: any = {}, o2: any = {}): any {
  const merged = { ...(o1 || {}), ...(o2 || {}) };
  return (Object.keys(merged).forEach((k) => isObj(o1?.[k]) && isObj(o2?.[k]) && (merged[k] = mergeObjs(o1[k], o2[k]))), merged);
}

export function getTrailPaths<T>(path: WCPaths<T>, reverse: boolean = true): WCPaths<T>[] {
  const parts = path.split("."),
    chain: WCPaths<T>[] = ["*"];
  let acc = "";
  for (let i = 0; i < parts.length; i++) {
    acc += (i === 0 ? "" : ".") + parts[i];
    chain.push(acc as WCPaths<T>);
  }
  return reverse ? chain.reverse() : chain; // for mostly logs
}

export function getTrailRecords<T extends object>(obj: T, path: WCPaths<T>): [WCPaths<T>, PathValue<T, WCPaths<T>>, PathValue<T, WCPaths<T>>][] {
  const parts = path.split("."),
    record: ReturnType<typeof getTrailRecords<T>> = [["*", obj, obj]];
  let acc = "",
    currObj: any = obj;
  for (let i = 0; i < parts.length; i++) {
    acc += (i === 0 ? "" : ".") + parts[i];
    record.push([acc as WCPaths<T>, currObj, (currObj = Reflect.get(currObj, parts[i]))]); // at most one iteration per depth, storage over derivation
  }
  return record;
}

// Cloning
export function deepClone<T>(obj: T, visited = new WeakMap()): T {
  if (!isObj(obj) || visited.has(obj) || "symbol" === typeof obj || "function" === typeof obj || obj instanceof Map || obj instanceof Set || obj instanceof WeakMap || obj instanceof Promise || obj instanceof Element || obj instanceof EventTarget) return obj; // no circular references
  const clone: any = isArr(obj) ? [] : {};
  visited.set(obj, clone);
  const keys = Object.keys(obj);
  for (let i = 0; i < keys.length; i++) {
    const val = (obj as any)[keys[i]];
    clone[keys[i]] = isObj(val) || isArr(val) ? deepClone(val, visited) : val;
  }
  return clone;
}
