import Reactor from "../core/reactor";
import type { ReactorOptions } from "../types/reactor";

export type Reactified<T extends object> = Pick<Reactor<T>, "get" | "noget" | "set" | "noset" | "on" | "off" | "cascade" | "tick" | "reset">;

export default function reactified<T extends object>(target: T | Reactor<T>, options?: ReactorOptions): T & Reactified<T> {
  const r = target instanceof Reactor ? target : new Reactor(target, options);
  Object.assign(r.core, {
    get: r.get.bind(r),
    noget: r.noget.bind(r),
    set: r.set.bind(r),
    noset: r.noset.bind(r),
    on: r.on.bind(r),
    off: r.off.bind(r),
    cascade: r.cascade.bind(r),
    tick: r.tick.bind(r),
    reset: r.reset.bind(r),
  } as Reactified<T>);
  return r.core as T & Reactified<T>;
}
