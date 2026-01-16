import type { WCPaths, Paths, PathValue } from "../types/paths";
import type { UIObject, UISettings } from "../types/UIOptions";
import { isDef, camelize } from ".";

export function isIter(obj: any): boolean {
  return obj != null && "function" === typeof obj[Symbol.iterator];
}

export function isObj(obj: any): boolean {
  return "object" === typeof obj && obj !== null && !isArr(obj) && "function" !== typeof obj;
}

export function isArr(obj: any): boolean {
  return Array.isArray(obj);
}

export function assignDef(target: any, key: string, value: any): void {
  isDef(value) && target != null && assignAny(target, key, value);
}

export function assignHTMLConfig<T extends object>(target: T, attr: `tmg--${Paths<T, "--">}`, value: any): void {
  assignAny<T, "--">(
    target,
    attr.replace("tmg--", "") as Paths<T, "--">,
    (() => {
      if (value.includes(",")) return value.split(",")?.map((v: string) => v.replace(/\s+/g, ""));
      if (/^(true|false|null|\d+)$/.test(value)) return JSON.parse(value);
      return value;
    })(),
    "--",
    (p) => camelize(p)
  );
}

export function assignAny<T extends object, const S extends string = ".">(target: T, key: Paths<T, S>, value: any, separator: S = "." as S, keyFunc = (p: string): string => p): void {
  const keys = key.split(separator).map((p) => keyFunc(p));
  let currObj: any = target;
  keys.forEach((key, i) => {
    const match = key.match(/^([^\[\]]+)\[(\d+)\]$/);
    if (match) {
      const [, key, iStr] = match;
      if (!isArr(currObj[key])) currObj[key] = [];
      if (i === keys.length - 1) currObj[key][Number(iStr)] = value;
      else (currObj[key][Number(iStr)] ||= {}), (currObj = currObj[key][Number(iStr)]);
    } else {
      if (i === keys.length - 1) currObj[key] = value;
      else (currObj[key] ||= {}), (currObj = currObj[key]);
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
      if (!isObj(currObj) || !(key in currObj)) return undefined;
      currObj = currObj[key];
    }
  }
  return currObj;
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

function isUISetting(obj: any): obj is UISettings<any> {
  return isObj(obj) && "options" in obj && isArr(obj.options);
}
export function parseUIObj<T extends object>(obj: T): UIObject<T> {
  const result: any = {} as UIObject<T>;
  for (const key of Object.keys(obj)) {
    const entry = (obj as any)[key];
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
