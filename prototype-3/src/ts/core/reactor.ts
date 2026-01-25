import { Target, Payload, Mediator, Listener, ListenerOptions, ListenerRecord, Terminator, ListenerOptionsTuple, ReactorOptions, Watcher } from "../types/reactor";
import type { Paths, WCPaths } from "../types/obj";
import { isObj, isArr, assignAny, mergeObjs, getTrailPaths, getTrailRecord, isIter } from "../utils";

export const TERMINATOR: Terminator = Symbol("TERMINATOR");

export class Event<T, P extends WCPaths<T> = WCPaths<T>> {
  static readonly NONE = 0;
  static readonly CAPTURING_PHASE = 1;
  static readonly AT_TARGET = 2;
  static readonly BUBBLING_PHASE = 3;
  public type: Payload<T, P>["type"];
  public currentTarget: Payload<T, P>["currentTarget"];
  public eventPhase: number = Event.NONE;
  readonly target: Payload<T, P>["target"];
  readonly root: Payload<T, P>["root"];
  readonly path: Target<T, P>["path"];
  readonly value: Target<T, P>["value"];
  readonly oldValue: Target<T, P>["oldValue"];
  readonly bubbles: boolean;
  readonly rejectable: boolean;
  readonly timestamp: number;
  private _propagationStopped = false;
  private _immediatePropagationStopped = false;
  private _rejected = "";

  constructor(payload: Payload<T, P> & { bubbles?: boolean; rejectable?: boolean }) {
    this.type = payload.type;
    this.target = payload.target;
    this.currentTarget = payload.currentTarget;
    this.root = payload.root;
    this.value = payload.target.value;
    this.oldValue = payload.target.oldValue;
    this.path = payload.target.path;
    this.bubbles = payload.bubbles ?? true;
    this.rejectable = payload.rejectable ?? true;
    this.timestamp = Date.now();
  }
  get propagationStopped(): boolean {
    return this._propagationStopped;
  }
  stopPropagation(): void {
    this._propagationStopped = true;
  }
  get immediatePropagationStopped(): boolean {
    return this._immediatePropagationStopped;
  }
  stopImmediatePropagation(): void {
    this._propagationStopped = true;
    this._immediatePropagationStopped = true;
  }
  get rejected(): string {
    return this._rejected;
  }
  reject(reason?: string): void {
    if (!this.rejectable) return console.warn(`Ignored reject() call on a non-rejectable "${this.type}" at "${this.path}"`);
    if (this.eventPhase !== Event.CAPTURING_PHASE) console.warn(`Rejecting an intent on "${this.type}" at "${this.path}" outside of the capture phase is unadvised.`);
    if (this.rejectable) console.log((this._rejected = reason || `Couldn't ${this.type} intended value at "${this.path}"`));
  }
  composedPath(): WCPaths<T>[] {
    return getTrailPaths(this.path);
  }
}
// uses low level non-stack loops considering this is surgical work on data
export default class Reactor<T extends object> {
  private rejectable: boolean;
  private getters = new Map<Paths<T>, Set<Mediator<T>>>();
  private setters = new Map<Paths<T>, Set<Mediator<T>>>();
  private watchers = new Map<Paths<T>, Set<Watcher<T>>>();
  private listenersRecord = new Map<WCPaths<T>, Set<ListenerRecord<T>>>();
  private batch = new Map<Paths<T>, Payload<T>>();
  private isBatching = false;
  private queue: Set<() => void> = new Set(); // tasks to run after _flush
  private proxyCache = new WeakMap<object, any>();
  public core: T;

  constructor(obj: T = {} as T, options: ReactorOptions = {}) {
    this.rejectable = options.rejectable ?? false;
    this.core = this._proxify(obj);
  }

  private _proxify(obj: any, path = ""): any {
    if (!(isObj(obj) || isArr(obj)) || "symbol" === typeof obj || "function" === typeof obj || obj instanceof Map || obj instanceof Set || obj instanceof WeakMap || obj instanceof Promise || obj instanceof Element || obj instanceof EventTarget) return obj; // handles direct objects and arrays
    if (this.proxyCache.has(obj)) return this.proxyCache.get(obj);
    // Robust Proxy handler
    const proxy = new Proxy(obj, {
      get: (object, key, receiver) => {
        const safeKey = String(key),
          fullPath = (path ? `${path}.${safeKey}` : safeKey) as Paths<T>,
          target: Target<T> = { path: fullPath, value: Reflect.get(object, key, receiver), key: safeKey, object },
          payload: Payload<T> = { type: "get", target, currentTarget: target, root: this.core };
        if (this.getters.has(fullPath as Paths<T>)) return this._mediate(fullPath as Paths<T>, payload as Payload<T, Paths<T>>, false);
        return this._proxify(target.value, fullPath);
      },
      set: (object, key, value, receiver) => {
        const safeKey = String(key),
          fullPath = (path ? `${path}.${safeKey}` : safeKey) as Paths<T>,
          target: Target<T> = { path: fullPath, value, oldValue: Reflect.get(object, key, receiver), key: safeKey, object },
          payload: Payload<T> = { type: "set", target, currentTarget: target, root: this.core };
        if (this.setters.has(fullPath as Paths<T>)) target.value = this._mediate(fullPath as Paths<T>, payload as Payload<T, Paths<T>>, true);
        return (target.value !== TERMINATOR && Reflect.set(object, key, target.value, receiver) && this._notify(fullPath, payload as Payload<T, Paths<T>>), true);
      },
      deleteProperty: (object, key) => {
        const safeKey = String(key),
          fullPath = (path ? `${path}.${safeKey}` : safeKey) as Paths<T>,
          target: Target<T> = { path: fullPath, oldValue: Reflect.get(object, key), key: safeKey, object },
          payload: Payload<T> = { type: "delete", target, currentTarget: target, root: this.core };
        if (this.setters.has(fullPath as Paths<T>)) target.value = this._mediate(fullPath as Paths<T>, payload as Payload<T, Paths<T>>, true);
        return (target.value !== TERMINATOR && Reflect.deleteProperty(object, key) && this._notify(fullPath, payload as Payload<T, Paths<T>>), true);
      },
    });
    this.proxyCache.set(obj, proxy);
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
      const response = arr[i](value, terminated, payload); // all will mediate
      if (!terminated) value = response;
    }
    return value; // set - FIFO, get - LIFO
  }

  private _notify<P extends Paths<T>>(path: P, payload: Payload<T, P>) {
    if (this.watchers.has(path)) for (const fn of this.watchers.get(path)!) fn(payload.target.value, payload); // watchers do not support termination
    this._schedule(path, payload);
  }
  private _schedule = (path: Paths<T>, payload: Payload<T>) => (this.batch.set(path, payload), this._initBatching());
  private _initBatching(): void {
    if (!this.isBatching) return;
    this.isBatching = true;
    queueMicrotask(() => this._flush());
  }
  private _flush(): void {
    (this.tick(this.batch.keys()), this.batch.clear(), (this.isBatching = false));
    for (const task of this.queue) task();
    this.queue.clear();
  }

  private _wave(path: Paths<T>, payload: Payload<T>): void {
    const e = new Event<T>({ ...payload, rejectable: this.rejectable }),
      chain = getTrailRecord(this.core, path); // either build a large array to climb back up or have to derive
    // 1: CAPTURE phase (core -> parent) - intent owners reject here, capture should preferably be used to reject
    e.eventPhase = Event.CAPTURING_PHASE;
    for (let i = 0; i <= chain.length - 2; i++) {
      if (e.propagationStopped) break;
      this._fire(chain[i], e, true);
    }
    if (e.propagationStopped) return;
    // 2: TARGET phase (leaf)
    e.eventPhase = Event.AT_TARGET;
    this._fire(chain[chain.length - 1], e, true); // CAPTURE
    !e.immediatePropagationStopped && this._fire(chain[chain.length - 1], e, false); // BUBBLE
    if (!e.bubbles) return;
    // 3: BUBBLE phase (parent -> core) - listeners always see it, rejection is just a flag for smart optimists
    e.eventPhase = Event.BUBBLING_PHASE;
    for (let i = chain.length - 2; i >= 0; i--) {
      if (e.propagationStopped) break;
      this._fire(chain[i], e, false);
    }
    if (e.rejected) return; // 4: DEFAULT phase if ever, whole architecture can be reimagined: `State vs Intent` is my view; reactor is dumb
  }
  private _fire([path, object, value]: ReturnType<typeof getTrailRecord<T>>[number], e: Event<T>, isCapture: boolean): void {
    const records = this.listenersRecord.get(path);
    if (!records?.size) return;
    const originalType = e.type;
    e.type = path !== e.target.path ? "update" : e.type; // `update` for ancestors
    e.currentTarget = { path, value, oldValue: e.type !== "update" ? e.target.oldValue : undefined, key: path.split(".").pop() || "", object };
    for (const record of [...records]) {
      if (e.immediatePropagationStopped) break;
      if (record.capture !== isCapture) continue;
      if (record.once) records.delete(record);
      record.cb(e);
    }
    e.type = originalType;
  }

  tick(paths?: Paths<T> | Iterable<Paths<T>>): void {
    if (!paths) return this._flush();
    for (const path of "string" === typeof paths ? [paths] : paths) this.batch.has(path) && (this._wave(path, this.batch.get(path)!), this.batch.delete(path));
  }

  stall = (task: () => any) => (this.queue.add(task), this._initBatching());
  nostall = (task: () => any) => this.queue.delete(task);

  get<P extends Paths<T>>(path: P, cb: Mediator<T, P>, lazy?: boolean): () => void {
    const task = () => (this.getters.get(path) ?? this.getters.set(path, new Set()).get(path)!).add(cb as Mediator<T>);
    lazy ? this.stall(task) : task(); // a progressive enhancment for gets that are virtual and should not affect init
    return () => (lazy && this.nostall(task), this.noget<P>(path, cb));
  }
  noget = <P extends Paths<T>>(path: P, cb: Mediator<T, P>) => this.getters.get(path)?.delete(cb as Mediator<T>); // undefined - no search list, boolean - result

  set<P extends Paths<T>>(path: P, cb: Mediator<T, P>, lazy?: boolean): () => void {
    const task = () => (this.setters.get(path) ?? this.setters.set(path, new Set()).get(path)!).add(cb as Mediator<T>);
    lazy ? this.stall(task) : task();
    return () => (lazy && this.nostall(task), this.noset<P>(path, cb));
  }
  noset = <P extends Paths<T>>(path: P, cb: Mediator<T, P>) => this.setters.get(path)?.delete(cb as Mediator<T>);

  watch<P extends Paths<T>>(path: P, cb: Watcher<T, P>, lazy?: boolean): () => void {
    const task = () => (this.watchers.get(path) ?? this.watchers.set(path, new Set()).get(path)!).add(cb as Watcher<T>);
    lazy ? this.stall(task) : task();
    return () => (lazy && this.nostall(task), this.nowatch<P>(path, cb));
  }
  nowatch = <P extends Paths<T>>(path: P, cb: Watcher<T, P>) => this.watchers.get(path)?.delete(cb as Watcher<T>);

  on<P extends WCPaths<T>>(path: P, cb: Listener<T, P>, options?: ListenerOptions): (typeof this)["off"] {
    const records = this.listenersRecord.get(path),
      capture = Reactor.parseEOpt(options, "capture");
    let added = false;
    for (const record of records ?? []) {
      if (record.cb === cb && capture === record.capture) {
        added = true;
        break;
      }
    }
    if (!added) (records ?? this.listenersRecord.set(path, new Set()).get(path)!).add({ cb: cb as Listener<T>, capture, once: Reactor.parseEOpt(options, "once") });
    return () => this.off<P>(path, cb, options);
  }
  once = <P extends WCPaths<T>>(path: P, cb: Listener<T, P>, options?: Omit<ListenerOptions, "once">): (typeof this)["off"] => this.on<P>(path, cb, { ...options, once: true });
  off<P extends WCPaths<T>>(path: P, cb: Listener<T, P>, options?: ListenerOptions) {
    const records = this.listenersRecord.get(path),
      capture = Reactor.parseEOpt(options, "capture");
    if (!records) return undefined;
    for (const record of [...records]) {
      if (record.cb === cb && record.capture === capture) return (records.delete(record), !records.size && this.listenersRecord.delete(path), true);
    }
    return false;
  }
  static parseEOpt = (options: ListenerOptions = false, opt: keyof ListenerOptionsTuple) => ("boolean" === typeof options ? options : !!options?.[opt]);

  cascade = ({ type, currentTarget: { path, value: news, oldValue: olds } }: Event<T>, objSafe = true): void => {
    if (!isObj(news) || !isObj(olds) || (type !== "set" && type !== "delete")) return;
    for (const [key, value] of Object.entries(objSafe ? mergeObjs(olds, news) : news)) assignAny(this.core, `${path}.${key}` as Paths<T>, value); // smart progressive enhancement for objects
  };

  reset(): void {
    (this.getters.clear(), this.setters.clear(), this.watchers.clear(), this.listenersRecord.clear());
    (this.queue.clear(), this.batch.clear(), (this.isBatching = false));
    this.proxyCache = new WeakMap();
    (this.core as any) = null;
  }
}
