import type { Terminator, Payload, Target, Mediator, Listener } from "../types/reactor";
import type { Paths } from "../types/paths";

export const TERMINATOR: Terminator = Symbol("TERMINATOR");

export default class Reactor<T extends object> {
  private getters = new Map<Paths<T>, Set<Mediator<T>>>();
  private setters = new Map<Paths<T>, Set<Mediator<T>>>();
  private listeners = new Map<Paths<T>, Set<Listener<T>>>();

  private batch = new Map<Paths<T>, Payload<T>>();
  private isBatching = false;
  private proxyCache = new WeakMap<object, any>();

  public root: T;

  constructor(obj: T) {
    this.root = this._proxify(obj);
  }

  private _proxify(target: any, path = ""): any {
    if (target instanceof Element || target instanceof Window || target instanceof EventTarget) return target;
    if (this.proxyCache.has(target)) return this.proxyCache.get(target);

    const proxy = new Proxy(target, {
      get: (object, key, receiver) => {
        const safeKey = String(key),
          fullPath = (path ? `${path}.${safeKey}` : safeKey) as Paths<T>,
          target: Target<T> = { path: fullPath, value: Reflect.get(object, key, receiver), key: safeKey, object },
          payload: Payload<T> = { type: "get", target, currentTarget: target, root: this.root };

        if (this.getters.has(fullPath)) return this._mediate(fullPath, payload, false);
        if (typeof key === "symbol" || target.value === null || typeof target.value !== "object") return target.value;
        return this._proxify(target.value, fullPath);
      },
      set: (object, key, value, receiver) => {
        const safeKey = String(key),
          fullPath = (path ? `${path}.${safeKey}` : safeKey) as Paths<T>,
          target: Target<T> = { path: fullPath, value, oldValue: Reflect.get(object, key, receiver), key: safeKey, object },
          payload: Payload<T> = { type: "set", target, currentTarget: target, root: this.root };
        if (this.setters.has(fullPath)) target.value = this._mediate(fullPath, payload, true);
        if (target.value === TERMINATOR) return false;
        if (!Reflect.set(object, key, target.value, receiver)) return false;
        return this._schedule(fullPath, payload), this._bubble(path, payload), true;
      },
      deleteProperty: (object, key) => {
        const safeKey = String(key),
          fullPath = (path ? `${path}.${safeKey}` : safeKey) as Paths<T>,
          target: Target<T> = { path: fullPath, oldValue: Reflect.get(object, key), key: safeKey, object },
          payload: Payload<T> = { type: "delete", target, currentTarget: target, root: this.root };

        if (this.setters.has(fullPath)) target.value = this._mediate(fullPath, payload, true);
        if (target.value === TERMINATOR) return false;
        if (!Reflect.deleteProperty(object, key)) return false;
        return this._schedule(fullPath, payload), this._bubble(path, payload), true;
      },
    });

    this.proxyCache.set(target, proxy);
    return proxy;
  }

  private _mediate<P extends Paths<T>>(path: Paths<T>, payload: Payload<T, P>, set: boolean): any {
    let terminated = false,
      value = payload.target.value;
    const fns = (set ? this.setters : this.getters)?.get(path);
    if (!fns?.size) return value;
    const arr = Array.from(fns);
    for (let i = set ? 0 : arr.length - 1; i !== (set ? arr.length : -1); i += set ? 1 : -1) {
      terminated ||= value === TERMINATOR;
      value = terminated ? TERMINATOR : arr[i](value, terminated, payload);
    }
    return value;
  }

  private _bubble(path: string, { type, target: currentTarget, root }: Payload<T>): void {
    if (!path) return;
    const parts = path.split(".");
    let parent: any = this.root;

    for (let i = 0; i < parts.length; i++) {
      const target = { path: parts.slice(0, i + 1).join("."), value: (parent = Reflect.get(parent, parts[i])), key: parts[i], object: parent } as Target<T>;
      this._schedule(target.path as Paths<T>, { type: "update", target, currentTarget, root });
    }

    this._schedule("*", { type, target: { path: "*", value: root, key: "*", object: root } as unknown as Target<T>, currentTarget, root });
  }

  private _schedule(path: Paths<T>, payload: Payload<T>): void {
    this.batch.set(path, payload);
    if (!this.isBatching) {
      this.isBatching = true;
      queueMicrotask(() => this._flush());
    }
  }

  private _flush(): void {
    for (const [path, payload] of this.batch.entries()) this.listeners.get(path)?.forEach((cb) => cb(payload));
    this.batch.clear(), (this.isBatching = false);
  }

  get<P extends Paths<T>>(path: P, cb: Mediator<T, P>): void {
    (this.getters.get(path) ?? this.getters.set(path, new Set()).get(path)!).add(cb as Mediator<T>); // keeping devs typesafe not internals - generic cast
  }
  noget<P extends Paths<T>>(path: P, cb: Mediator<T, P>): void {
    this.getters.get(path)?.delete(cb as Mediator<T>);
  }

  set<P extends Paths<T>>(path: P, cb: Mediator<T, P>): void {
    (this.setters.get(path) ?? this.setters.set(path, new Set()).get(path)!).add(cb as Mediator<T>);
  }
  noset<P extends Paths<T>>(path: P, cb: Mediator<T, P>): void {
    this.setters.get(path)?.delete(cb as Mediator<T>);
  }

  on<P extends Paths<T>>(path: P, cb: Listener<T, P>): void {
    (this.listeners.get(path) ?? this.listeners.set(path, new Set()).get(path)!).add(cb as Listener<T>);
  }
  off<P extends Paths<T>>(path: P, cb: Listener<T, P>): void {
    this.listeners.get(path)?.delete(cb as Listener<T>);
  }

  propagate = ({ type, target: { path, value: sets } }: Payload<T>): void => {
    if ((type === "set" || type === "delete") && sets) Object.entries(sets).forEach(([k, v]) => assignAny(this.root, `${path}.${k}`, v));
  };

  tick = this._flush;

  reset(): void {
    this.getters.clear(), this.setters.clear(), this.listeners.clear();
    this.batch.clear(), (this.isBatching = false);
    this.proxyCache = new WeakMap();
    (this.root as any) = null;
  }
}
