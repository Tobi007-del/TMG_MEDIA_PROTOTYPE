import Reactor from "../core/reactor";
import type { ReactorOptions } from "../types/reactor";

export type Reactified<T extends object> = T & Pick<Reactor<T>, "stall" | "nostall" | "get" | "noget" | "set" | "noset" | "watch" | "nowatch" | "on" | "once" | "off" | "cascade" | "tick" | "reset">;

export function reactified<T extends object>(target: T | Reactor<T>, options?: ReactorOptions): T & Reactified<T> {
  const r = target instanceof Reactor ? target : new Reactor(target, options);
  Object.assign(r.core, {
    tick: r.tick.bind(r),
    stall: r.stall.bind(r),
    nostall: r.nostall.bind(r),
    get: r.get.bind(r),
    noget: r.noget.bind(r),
    set: r.set.bind(r),
    noset: r.noset.bind(r),
    watch: r.watch.bind(r),
    nowatch: r.nowatch.bind(r),
    on: r.on.bind(r),
    once: r.once.bind(r),
    off: r.off.bind(r),
    cascade: r.cascade.bind(r),
    reset: r.reset.bind(r),
  } as Reactified<T>);
  return r.core as T & Reactified<T>;
}
