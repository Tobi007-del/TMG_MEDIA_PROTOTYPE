// ==========================================
// V0 ARCHITECTURE (Reactor Fossil Reference)
// ==========================================
export const TERMINATOR = Symbol("TERMINATOR");

export class Reactor {
  constructor(object) {
    ((this.getters = new Map()), (this.setters = new Map()), (this.listeners = new Map()));
    ((this.batch = new Map()), (this.isBatching = false)); // Scheduler flag
    this.proxyCache = new WeakMap();
    this.root = this._proxify(object);
  }
  _proxify(target, path = "") {
    if (target instanceof Element || target instanceof Window || target instanceof EventTarget) return target;
    if (this.proxyCache.has(target)) return this.proxyCache.get(target);
    this.proxyCache.set(
      target,
      new Proxy(target, {
        get: (object, key, receiver) => {
          const safeKey = String(key),
            fullPath = path ? path + "." + safeKey : safeKey,
            target = { path: fullPath, value: Reflect.get(object, key, receiver), oldValue: undefined, key: safeKey, object },
            payload = { type: "get", target, currentTarget: target, root: this.root };
          return this.getters.has(fullPath) ? this._mediate(fullPath, payload, false) : typeof key === "symbol" || (typeof target.value === "object" && target.value !== null) ? target.value : this._proxify(target.value, path ? `${path}.${key}` : key);
        },
        set: (object, key, value, receiver) => {
          const safeKey = String(key),
            fullPath = path ? path + "." + safeKey : safeKey,
            target = { path: fullPath, value, oldValue: Reflect.get(object, key, receiver), key: safeKey, object },
            payload = { type: "set", target, currentTarget: target, root: this.root };
          if (this.setters.has(fullPath)) target.value = this._mediate(fullPath, payload, true);
          if (target.value === TERMINATOR || !Reflect.set(object, key, target.value, receiver)) return false; // stopping it at the root unlike vjs :)
          return (this._schedule(target.path, payload), this._bubble(path, payload), true);
        },
        deleteProperty: (object, key) => {
          const safeKey = String(key),
            fullPath = path ? path + "." + safeKey : safeKey,
            target = { path: fullPath, oldValue: Reflect.get(object, key), key: safeKey, object },
            payload = { type: "delete", target, currentTarget: target, root: this.root };
          if (this.setters.has(fullPath)) target.value = this._mediate(fullPath, payload, true);
          if (target.value === TERMINATOR || !Reflect.deleteProperty(object, key)) return false;
          return (this._schedule(target.path, payload), this._bubble(path, payload), true);
        },
      })
    );
    return this.proxyCache.get(target);
  }
  _mediate(path, payload, set = true) {
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
  _bubble(path, { type, target: currentTarget, root }) {
    const parts = path ? path.split(".") : [];
    let parent = root;
    for (let i = 0; i < parts.length; i++) {
      const target = { path: parts.slice(0, i + 1).join("."), value: (parent = Reflect.get(parent, parts[i])), key: parts[i], object: parent };
      this._schedule(target.path, { type: "update", target, currentTarget, root });
    }
    this._schedule("*", { type, target: { path: "*", value: root, object: root }, currentTarget, root });
  }
  _schedule(path, payload) {
    this.batch.set(path, payload);
    if (!this.isBatching) ((this.isBatching = true), queueMicrotask(() => this._flush()));
  }
  _flush() {
    for (const [path, payload] of this.batch.entries()) this.listeners.get(path)?.forEach((cb) => cb(payload));
    (this.batch.clear(), (this.isBatching = false));
  }
  get = (path, callback) => (this.getters.get(path) ?? this.getters.set(path, new Set()).get(path)).add(callback);
  noget = (path, callback) => this.getters.get(path)?.delete(callback);
  set = (path, callback) => (this.setters.get(path) ?? this.setters.set(path, new Set()).get(path)).add(callback);
  noset = (path, callback) => this.setters.get(path)?.delete(callback);
  on = (path, callback) => (this.listeners.get(path) ?? this.listeners.set(path, new Set()).get(path)).add(callback);
  off = (path, callback) => this.listeners.get(path)?.delete(callback);
  propagate = ({ type, target: { path: path, value: sets } }) => (type === "set" || type === "delete") && sets && Object.entries(sets).forEach(([k, v]) => tmg.assignAny(this.root, `${path}.${k}`, v));
  tick = this._flush;
  reset = () => (this.getters.clear(), this.setters.clear(), this.listeners.clear(), this.batch.clear(), (this.isBatching = false), (this.proxyCache = new WeakMap()), true);
  destroy = () => (this.reset(), (this.getters = this.setters = this.listeners = this.batch = this.proxyCache = null));
}

export function reactify(target, root) {
  const keys = Object.keys(target),
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
    destroy: core.destroy.bind(core),
  });
  return (root && keys.forEach((k) => (root[k] = core.root[k])), core.root);
}
