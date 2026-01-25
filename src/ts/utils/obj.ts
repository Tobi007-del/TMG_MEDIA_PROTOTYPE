import type { DeepMerge, Unflatten, WCPaths, Paths, PathValue } from "../types/obj";
import type { UIObject, UISettings } from "../types/UIOptions";
import { isDef, camelize } from ".";

export function isIter<T = unknown>(obj: any): obj is Iterable<T> {
  return obj != null && "function" === typeof obj[Symbol.iterator];
}

export function isObj<T extends object = object>(obj: any): obj is T {
  return "object" === typeof obj && obj !== null && !isArr(obj) && "function" !== typeof obj;
}

export function isArr<T = unknown>(obj: any): obj is T[] {
  return Array.isArray(obj);
}

export function isUISetting<T = unknown>(obj: any): obj is UISettings<T> {
  return isObj(obj) && "options" in obj && isArr(obj.options);
}

export function assignDef<T extends object>(target: T, key: Paths<T>, value: PathValue<T, typeof key>): void {
  isDef(value) && target != null && assignAny(target, key, value);
}

export function assignHTMLConfig<T extends object>(target: T, attr: `tmg--${Paths<T, "--">}`, value: string): void {
  const path = attr.replace("tmg--", "") as Paths<T, "--">;
  const parsedValue = (() => {
    if (value.includes(",")) return value.split(",")?.map((v: string) => v.replace(/\s+/g, ""));
    if (/^(true|false|null|\d+)$/.test(value)) return JSON.parse(value);
    return value;
  })();
  assignAny<T, "--">(target, path, parsedValue, "--", (p) => camelize(p));
}

export function assignAny<T extends object, const S extends string = ".">(target: T, key: Paths<T, S>, value: PathValue<T, typeof key, S>, separator: S = "." as S, keyFunc = (p: string): string => p): void {
  const keys = key.split(separator).map((p) => keyFunc(p));
  let currObj: any = target;
  keys.forEach((key, i) => {
    const match = key.match(/^([^\[\]]+)\[(\d+)\]$/);
    if (match) {
      const [, key, iStr] = match;
      if (!isArr(currObj[key])) currObj[key] = [];
      if (i === keys.length - 1) currObj[key][Number(iStr)] = value;
      else ((currObj[key][Number(iStr)] ||= {}), (currObj = currObj[key][Number(iStr)]));
    } else {
      if (i === keys.length - 1) currObj[key] = value;
      else ((currObj[key] ||= {}), (currObj = currObj[key]));
    }
  });
}

export function deriveAny<T extends object, const S extends string = ".">(source: T, key: Paths<T, S>, separator: S = "." as S, keyFunc = (p: string): string => p): PathValue<T, typeof key, S> | undefined {
  const keys = key.split(separator).map((p) => keyFunc(p));
  let currObj: any = source;
  for (const key of keys) {
    const match = key.match(/^([^\[\]]+)\[(\d+)\]$/);
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

export function parseUIObj<T extends Record<string, any>>(obj: T): UIObject<T> {
  const result: any = {} as UIObject<T>;
  for (const key of Object.keys(obj)) {
    const entry = obj[key];
    if (!isObj(entry)) continue;
    if (isUISetting(entry)) {
      result[key] = {
        values: entry.options.map((opt: any) => ("value" in opt ? opt.value : opt)),
        displays: entry.options.map((opt: any) => ("display" in opt ? opt.display : `${opt}`)),
      };
    } else result[key] = parseUIObj(entry); // recurse on sub-branch
  }
  return result;
}

export function parseAnyObj<T extends Record<string, any>, const S extends string = ".">(obj: T, separator: S = "." as S, keyFunc = (p: string) => p, visited = new WeakSet()): Unflatten<T, S> {
  if (!isObj(obj) || visited.has(obj)) return obj as Unflatten<T, S>; // no circular references
  visited.add(obj);
  const result: any = {};
  Object.entries(obj).forEach(([k, v]) => (k.includes(separator) ? assignAny(result, k as any, parseAnyObj(v as any, separator, keyFunc, visited), separator, keyFunc) : (result[k] = isObj(v) ? parseAnyObj(v as any, separator, keyFunc, visited) : v)));
  return result as Unflatten<T, S>;
}

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
  return reverse ? chain.reverse() : chain; // for logs
}

export function getTrailRecord<T extends object>(obj: T, path: WCPaths<T>): [WCPaths<T>, PathValue<T, WCPaths<T>>, PathValue<T, WCPaths<T>>][] {
  const parts = path.split("."),
    record: ReturnType<typeof getTrailRecord<T>> = [["*", obj, obj]];
  let acc = "",
    currObj: any = obj;
  for (let i = 0; i < parts.length; i++) {
    acc += (i === 0 ? "" : ".") + parts[i];
    record.push([acc as WCPaths<T>, currObj, (currObj = Reflect.get(currObj, parts[i]))]); // at most one iteration per depth, storage over derivation
  }
  return record;
}
