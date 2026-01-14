import Reactor from "../core/reactor";

export default function reactify<T extends object>(target: T, root?: any): T {
  const keys = Object.keys(target) as (keyof T)[],
    core = new Reactor(target);
  Object.assign(root ?? core.root, {
    get: core.get.bind(core),
    noget: core.noget.bind(core),
    set: core.set.bind(core),
    noset: core.noset.bind(core),
    on: core.on.bind(core),
    off: core.off.bind(core),
    propagate: core.propagate.bind(core),
    tick: core.tick.bind(core),
    reset: core.reset.bind(core),
  });
  return root && keys.forEach((k) => (root[k] = core.root[k])), core.root;
}

export type { ReactorAPI as Reactified } from "../types/reactor";