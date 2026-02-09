import Reactor, { INERTIA, REJECTABLE } from "../../core/reactor";
import type { ReactorOptions, Inert, Intent, Live, State } from "../../types/reactor";

const methods = [
  // --- Reactor public methods ---
  "tick",
  "stall",
  "nostall",
  "get",
  "gonce",
  "noget",
  "set",
  "sonce",
  "noset",
  "watch",
  "wonce",
  "nowatch",
  "on",
  "once",
  "off",
  "cascade",
  "snapshot",
  "reset",
  "destroy",
] as const;
export type Reactive<T extends object> = T & Pick<Reactor<T>, (typeof methods)[number]>;

export function reactive<T extends object>(target: T | Reactor<T>, options?: ReactorOptions): Reactive<T> {
  const descriptors: PropertyDescriptorMap = {},
    r = target instanceof Reactor ? target : new Reactor(target, options);
  for (const m of methods)
    descriptors[m] = {
      value: r[m].bind(r),
      writable: false,
      enumerable: false,
      configurable: true,
    };
  Object.defineProperties(r.core, descriptors);
  return r.core as Reactive<T>;
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
