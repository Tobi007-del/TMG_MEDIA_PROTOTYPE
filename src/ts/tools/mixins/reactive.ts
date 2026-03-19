import { Reactor, INERTIA, REJECTABLE, INDIFFABLE, VERSION, SSVERSION } from "../../core/reactor";
import type { ReactorOptions, Inert, Intent, Live, State, Volatile, Stable } from "../../types/reactor";

// --- Reactor public methods ---
export const methods = ["tick", "stall", "nostall", "get", "gonce", "noget", "set", "sonce", "noset", "delete", "donce", "nodelete", "watch", "wonce", "nowatch", "on", "once", "off", "cascade", "snapshot", "reset", "destroy"] as const;

type Method = (typeof methods)[number];
type Prefix<P extends ReactivePrefs | undefined> = P extends { prefix?: infer X extends string } ? X : "";
type Suffix<P extends ReactivePrefs | undefined> = P extends { suffix?: infer X extends string } ? X : "";
type Whitelist<P extends ReactivePrefs | undefined> = P extends { whitelist?: infer W extends readonly Method[] } ? W[number] : never;
type ReactiveMethodMap<T extends object, P extends ReactivePrefs | undefined> = {
  [K in Method as [Prefix<P>, Suffix<P>] extends ["", ""] ? (P extends { whitelist: readonly Method[] } ? (K extends Whitelist<P> ? never : K) : K) : P extends { whitelist: readonly Method[] } ? (K extends Whitelist<P> ? `${Prefix<P>}${K}${Suffix<P>}` : K) : `${Prefix<P>}${K}${Suffix<P>}`]: Pick<Reactor<T>, Method>[K];
};

export interface ReactivePrefs {
  prefix?: string;
  suffix?: string;
  whitelist?: readonly Method[]; // keys you're already using
}
export type Reactive<T extends object, P extends ReactivePrefs | undefined = undefined> = T & ReactiveMethodMap<T, P> & { __Reactor__: Reactor<T> };

export function reactive<T extends object, const P extends ReactivePrefs | undefined = undefined>(target: T | Reactor<T>, options?: ReactorOptions<T>, prefs?: P): Reactive<T, P> {
  const descriptors: PropertyDescriptorMap = {},
    rtr = target instanceof Reactor ? target : new Reactor(target, options),
    locks = { enumerable: false, configurable: true, writable: false },
    hasAffix = !!(prefs?.prefix || prefs?.suffix);
  for (let key of methods) {
    if (hasAffix) (prefs?.whitelist?.includes(key) ?? true) && (key = `${prefs?.prefix || ""}${key}${prefs?.suffix || ""}` as Method);
    else if (prefs?.whitelist?.includes(key)) continue;
    descriptors[key] = { value: rtr[key].bind(rtr), ...locks };
  }
  descriptors["__Reactor__"] = { value: rtr, ...locks };
  return (Object.defineProperties(rtr.core, descriptors), rtr.core as Reactive<T, P>);
}

export function inert<T extends object>(target: T): Inert<T> {
  (target as any)[INERTIA] = true;
  return target as Inert<T>;
}
export function live<T extends object>(target: T): Live<T> {
  delete (target as any)[INERTIA];
  return target as Live<T>;
}
export function isInert<T extends object>(target: T): target is Inert<T> {
  return !!(target as any)[INERTIA];
}

export function intent<T extends object>(target: T): Intent<T> {
  (target as any)[REJECTABLE] = true;
  return target as Intent<T>;
}
export function state<T extends object>(target: T): State<T> {
  delete (target as any)[REJECTABLE];
  return target as State<T>;
}
export function isIntent<T extends object>(target: T): target is Intent<T> {
  return !!(target as any)[REJECTABLE];
}

export function volatile<T extends object>(target: T): Volatile<T> {
  (target as any)[INDIFFABLE] = true;
  return target as Volatile<T>;
}
export function stable<T extends object>(target: T): Stable<T> {
  delete (target as any)[INDIFFABLE];
  return target as Stable<T>;
}
export function isVolatile<T extends object>(target: T): target is Volatile<T> {
  return !!(target as any)[INDIFFABLE];
}

export function getVersion<T extends object>(target: T): number {
  return (target as any)[VERSION] || 0;
}
export function getSnapshotVersion<T extends object>(target: T): number {
  return (target as any)[SSVERSION] || 0;
}
