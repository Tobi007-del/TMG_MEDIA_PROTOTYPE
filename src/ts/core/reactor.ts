import { Target, Payload, Getter, Setter, Listener, ListenerOptions, ListenerRecord, ReactorOptions, Watcher, WatcherRecord, GetterRecord, SetterRecord, SyncOptions } from "../types/reactor";
import type { PathParentValue, Paths, PathValue, WCPaths } from "../types/obj";
import { isObj, isArr, setAny, mergeObjs, getTrailPaths, getTrailRecords, parseEvOpts, getAny, deepClone } from "../utils";
import { isIntent, nuke } from "../tools/mixins";
// low level non-stack loops considering this is surgical work on the root of reactivity, also cord is an alias for record

export const REJECTABLE: unique symbol = Symbol.for("S.I.A_REJECTABLE"); // State Vs. Intent Marker
export const INERTIA: unique symbol = Symbol.for("S.I.A_INERTIA"); // No Proxy Marker
export const TERMINATOR: unique symbol = Symbol.for("S.I.A_TERMINATOR"); // Obj Operation Terminator
export const REOPTS = { LISTENER: ["capture", "once", "signal", "immediate"], MEDIATOR: ["lazy", "signal", "immediate"] } as const;

export class Event<T, P extends WCPaths<T> = WCPaths<T>> {
  static readonly NONE = 0;
  static readonly CAPTURING_PHASE = 1;
  static readonly AT_TARGET = 2;
  static readonly BUBBLING_PHASE = 3;
  public type: Payload<T, P>["type"];
  public currentTarget: Payload<T, P>["currentTarget"];
  public eventPhase: number = Event.NONE;
  readonly staticType: Payload<T, P>["type"];
  readonly target: Payload<T, P>["target"];
  readonly root: Payload<T, P>["root"];
  readonly path: Target<T, P>["path"];
  readonly value: Target<T, P>["value"];
  readonly oldValue: Target<T, P>["oldValue"];
  readonly rejectable: boolean;
  readonly bubbles: boolean;
  // readonly timestamp: number;
  private _propagationStopped = false;
  private _immediatePropagationStopped = false;
  private _resolved = "";
  private _rejected = "";

  constructor(payload: Payload<T, P>, bubbles = true) {
    this.type = this.staticType = payload.type;
    this.target = payload.target;
    this.currentTarget = payload.currentTarget;
    this.root = payload.root;
    this.value = payload.target.value;
    this.oldValue = payload.target.oldValue;
    this.path = payload.target.path;
    this.rejectable = payload.rejectable;
    this.bubbles = bubbles;
    // this.timestamp = Date.now();
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
  get resolved(): string {
    return this._resolved;
  }
  resolve(message?: string): void {
    if (!this.rejectable) return console.warn(`Ignored resolve() call on a non-rejectable ${this.staticType} at "${this.path}"`);
    if (this.eventPhase !== Event.CAPTURING_PHASE) console.warn(`Resolving an intent on ${this.staticType} at "${this.path}" outside of the capture phase is unadvised.`);
    if (this.rejectable) this._resolved = message || `Could ${this.staticType} intended value at "${this.path}"`;
  }
  get rejected(): string {
    return this._rejected;
  }
  reject(reason?: string): void {
    if (!this.rejectable) return console.warn(`Ignored reject() call on a non-rejectable ${this.staticType} at "${this.path}"`);
    if (this.eventPhase !== Event.CAPTURING_PHASE) console.warn(`Rejecting an intent on ${this.staticType} at "${this.path}" outside of the capture phase is unadvised.`);
    if (this.rejectable) this._rejected = reason || `Couldn't ${this.staticType} intended value at "${this.path}"`;
  }
  composedPath(): WCPaths<T>[] {
    return getTrailPaths(this.path);
  }
}

export default class Reactor<T extends object> {
  private getters = new Map<Paths<T>, Array<GetterRecord<T>>>();
  private setters = new Map<Paths<T>, Array<SetterRecord<T>>>();
  private watchers = new Map<Paths<T>, Array<WatcherRecord<T>>>();
  private listenersRecord = new Map<WCPaths<T>, Array<ListenerRecord<T>>>();
  private batch = new Map<Paths<T>, Payload<T>>();
  private isBatching = false;
  private queue: Set<() => void> | null = null; // tasks to run after flush, `null` | pay the empty set 64 byte price for what u might never use
  private proxyCache = new WeakMap<object, any>();
  public core: T;

  constructor(obj: T = {} as T, options: ReactorOptions = {}) {
    this.core = this._proxify(obj);
  }

  private _proxify<O>(obj: O, path = "", rejectable = false): O {
    if (!(isObj(obj) || isArr(obj)) || "symbol" === typeof obj || "function" === typeof obj || (obj as any)[INERTIA] || obj instanceof Map || obj instanceof Set || obj instanceof WeakMap || obj instanceof Promise || obj instanceof Date || obj instanceof RegExp || obj instanceof Element || obj instanceof EventTarget) return obj; // handles direct objects and arrays unless inert, either we walk down that proto chain together or break a lot of tins
    if (this.proxyCache.has(obj)) return this.proxyCache.get(obj);
    rejectable ||= isIntent(obj);
    const proxy = new Proxy(obj, {
      // Robust Proxy handler
      get: (object, key, receiver) => {
        const safeKey = String(key),
          fullPath = (path ? path + "." + safeKey : safeKey) as Paths<T>,
          target: Target<T> = { path: fullPath, value: Reflect.get(object, key, receiver) as PathValue<T>, key: safeKey, object: object as PathParentValue<T>},
          payload: Payload<T> = { type: "get", target, currentTarget: target, root: this.core, rejectable };
        if (this.getters.has(fullPath as Paths<T>)) target.value = this._mediate(fullPath as Paths<T>, payload as Payload<T, Paths<T>>, false);
        return this._proxify(target.value, fullPath, rejectable);
      },
      set: (object, key, value, receiver) => {
        const safeKey = String(key),
          fullPath = (path ? path + "." + safeKey : safeKey) as Paths<T>,
          target: Target<T> = { path: fullPath, value, oldValue: Reflect.get(object, key, receiver) as PathValue<T>, key: safeKey, object: object as PathParentValue<T> },
          payload: Payload<T> = { type: "set", target, currentTarget: target, root: this.core, rejectable };
        if (this.setters.has(fullPath as Paths<T>)) target.value = this._mediate(fullPath as Paths<T>, payload as Payload<T, Paths<T>>, true);
        return target.value === TERMINATOR || (Reflect.set(object, key, target.value, receiver) && (this._notify(fullPath, payload as Payload<T, Paths<T>>), true)); // soft rejection if terminated: `true`
      },
      deleteProperty: (object, key) => {
        const safeKey = String(key),
          fullPath = (path ? path + "." + safeKey : safeKey) as Paths<T>,
          target: Target<T> = { path: fullPath, oldValue: Reflect.get(object, key) as PathValue<T>, key: safeKey, object: object as PathParentValue<T> },
          payload: Payload<T> = { type: "delete", target, currentTarget: target, root: this.core, rejectable };
        if (this.setters.has(fullPath as Paths<T>)) target.value = this._mediate(fullPath as Paths<T>, payload as Payload<T, Paths<T>>, true);
        return target.value === TERMINATOR || (Reflect.deleteProperty(object, key) && (this._notify(fullPath, payload as Payload<T, Paths<T>>), true)); // soft rejection if terminated: `true`
      },
    });
    return (this.proxyCache.set(obj, proxy), proxy);
  }

  private _mediate<P extends Paths<T>>(path: Paths<T>, payload: Payload<T, P>, set: boolean): any {
    let terminated = false,
      value = payload.target.value;
    const cords = (set ? this.setters : this.getters)?.get(path);
    if (!cords?.length) return value;
    for (let i = set ? 0 : cords.length - 1; i !== (set ? cords.length : -1); i += set ? 1 : -1) {
      if (set) terminated ||= value === TERMINATOR;
      if (cords[i].once) (cords.splice(i--, 1), !cords.length && (set ? this.setters : this.getters)?.delete(path));
      const response = set ? (cords[i].cb as Setter<T>)(value, terminated, payload) : (cords[i].cb as Getter<T>)(value, payload); // all will mediate
      if (!terminated) value = response as PathValue<T, P>;
    }
    return value; // set - FIFO, get - LIFO
  }

  private _notify<P extends Paths<T>>(path: P, payload: Payload<T, P>) {
    const cords = this.watchers.get(path);
    for (let i = 0; i < (cords?.length ?? 0); i++) {
      if (cords![i].once) (cords!.splice(i--, 1), !cords!.length && this.watchers.delete(path));
      cords![i].cb(payload.target.value, payload); // watchers do not support termination
    }
    this._schedule(path, payload);
  }
  private _schedule(path: Paths<T>, payload: Payload<T>): void {
    (this.batch.set(path, payload), this._initBatching());
  }
  private _initBatching(): void {
    if (this.isBatching) return;
    this.isBatching = true;
    queueMicrotask(() => this._flush());
  }
  private _flush(): void {
    (this.tick(this.batch.keys()), this.batch.clear(), (this.isBatching = false));
    if (this.queue?.size) for (const task of this.queue) task();
    this.queue?.clear();
  }

  private _wave(path: Paths<T>, payload: Payload<T>): void {
    const e = new Event<T>(payload),
      chain = getTrailRecords(this.core, path); // either build a large array to climb back up or have to derive
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
  private _fire([path, object, value]: ReturnType<typeof getTrailRecords<T>>[number], e: Event<T>, isCapture: boolean): void {
    const cords = this.listenersRecord.get(path);
    if (!cords?.length) return;
    e.type = path !== e.target.path ? "update" : e.type; // `update` for ancestors
    e.currentTarget = { path, value, oldValue: e.type !== "update" ? e.target.oldValue : undefined, key: e.type !== "update" ? path : path.slice(path.lastIndexOf(".") + 1) || "", object: object as PathParentValue<T> };
    for (let i = 0; i < cords.length; i++) {
      if (e.immediatePropagationStopped) break;
      if (cords[i].capture !== isCapture) continue;
      if (cords[i].once) (cords.splice(i--, 1), !cords.length && this.listenersRecord.delete(path));
      cords[i].cb(e);
    }
    e.type = e.staticType; // reset type after possible `update` change
  }

  private _getContext<P extends WCPaths<T>>(path: P): Target<T, P> {
    const lastDot = path.lastIndexOf("."),
      value = (path === "*" ? this.core : getAny(this.core, path as Paths<T>)) as PathValue<T, P>,
      object = lastDot === -1 ? this.core : getAny(this.core, path.slice(0, lastDot) as Paths<T>);
    return { path: path as P, value, key: path.slice(lastDot + 1) || "", object: object as PathParentValue<T, P> };
  }
  private _bind<Cb>(cord: any, signal?: AbortSignal): Cb {
    signal?.aborted ? cord.clup() : signal?.addEventListener("abort", cord.clup, { once: true });
    if (!signal?.aborted) cord.sclup = () => signal?.removeEventListener("abort", cord.clup);
    return cord.clup as Cb; // once incase spec changes, memory leaks too
  }

  tick(paths?: Paths<T> | Iterable<Paths<T>>): void {
    if (!paths) return this._flush();
    if ("string" === typeof paths) {
      const task = this.batch.get(paths);
      task && (this._wave(paths, task), this.batch.delete(paths));
    } else
      for (const path of paths) {
        const task = this.batch.get(path);
        task && (this._wave(path, task), this.batch.delete(path));
      }
  }
  stall(task: () => any): void {
    ((this.queue ??= new Set()), this.queue.add(task), this._initBatching());
  }
  nostall(task: () => any): boolean | undefined {
    return this.queue?.delete(task);
  }

  get<P extends Paths<T>>(path: P, cb: Getter<T, P>, opts?: SyncOptions): Reactor<T>["noget"] {
    const cords = this.getters.get(path),
      { lazy, once, signal, immediate } = parseEvOpts(opts, REOPTS.MEDIATOR);
    let cord = {} as GetterRecord<T>;
    for (let i = 0; i < (cords?.length ?? 0); i++)
      if (cords![i].cb === (cb as unknown as Getter<T>)) {
        cord = cords![i];
        break;
      }
    if (cord) return cord.clup;
    cord = { cb: cb as unknown as Getter<T>, once, clup: () => (lazy && this.nostall(task), this.noget<P>(path, cb)) };
    if (immediate) getAny(this.core, path as Paths<T>);
    const task = () => (this.getters.get(path) ?? this.getters.set(path, []).get(path)!).push(cord);
    lazy ? this.stall(task) : task(); // a progressive enhancment for gets that are virtual and should not affect init
    return this._bind(cord, signal);
  }
  gonce<P extends Paths<T>>(path: P, cb: Getter<T, P>, opts?: SyncOptions): Reactor<T>["noget"] {
    return this.get<P>(path, cb, { ...parseEvOpts(opts, REOPTS.MEDIATOR), once: true });
  }
  noget<P extends Paths<T>>(path: P, cb: Getter<T, P>): boolean | undefined {
    const cords = this.getters.get(path);
    if (!cords) return undefined;
    for (let i = 0; i < cords.length; i++) if (cords[i].cb === (cb as unknown as Getter<T>)) return (cords[i].sclup?.(), cords.splice(i--, 1), !cords.length && this.getters.delete(path), true);
    return false;
  }

  set<P extends Paths<T>>(path: P, cb: Setter<T, P>, opts?: SyncOptions): Reactor<T>["noset"] {
    const cords = this.setters.get(path),
      { lazy, once, signal, immediate } = parseEvOpts(opts, REOPTS.MEDIATOR);
    let cord = {} as SetterRecord<T>;
    for (let i = 0; i < (cords?.length ?? 0); i++)
      if (cords![i].cb === (cb as unknown as Setter<T>)) {
        cord = cords![i];
        break;
      }
    if (cord) return cord.clup;
    cord = { cb: cb as unknown as Setter<T>, once, clup: () => (lazy && this.nostall(task), this.noset<P>(path, cb)) };
    if (immediate) setAny(this.core, path as Paths<T>, this._getContext(path).value!);
    const task = () => (this.setters.get(path) ?? this.setters.set(path, []).get(path)!).push(cord);
    lazy ? this.stall(task) : task();
    return this._bind(cord, signal);
  }
  sonce<P extends Paths<T>>(path: P, cb: Setter<T, P>, opts?: SyncOptions): Reactor<T>["noset"] {
    return this.set<P>(path, cb, { ...parseEvOpts(opts, REOPTS.MEDIATOR), once: true });
  }
  noset<P extends Paths<T>>(path: P, cb: Setter<T, P>): boolean | undefined {
    const cords = this.setters.get(path);
    if (!cords) return undefined;
    for (let i = 0; i < cords.length; i++) if (cords[i].cb === (cb as unknown as Setter<T>)) return (cords[i].sclup?.(), cords.splice(i--, 1), !cords.length && this.setters.delete(path), true);
    return false;
  }

  watch<P extends Paths<T>>(path: P, cb: Watcher<T, P>, opts?: SyncOptions): Reactor<T>["nowatch"] {
    const cords = this.watchers.get(path),
      { lazy, once, signal, immediate } = parseEvOpts(opts, REOPTS.MEDIATOR);
    let cord = {} as WatcherRecord<T>;
    for (let i = 0; i < (cords?.length ?? 0); i++)
      if (cords![i].cb === cb) {
        cord = cords![i];
        break;
      }
    if (cord) return cord.clup;
    cord = { cb: cb as Watcher<T>, once, clup: () => (lazy && this.nostall(task), this.nowatch<P>(path, cb)) };
    if (immediate) {
      const target = this._getContext(path);
      cb(target.value, { type: "init", target, currentTarget: target, root: this.core, rejectable: false } as Payload<T, P>);
    }
    const task = () => (cords ?? this.watchers.set(path, []).get(path)!).push(cord);
    lazy ? this.stall(task) : task();
    return this._bind(cord, signal);
  }
  wonce<P extends Paths<T>>(path: P, cb: Watcher<T, P>, opts?: SyncOptions): Reactor<T>["nowatch"] {
    return this.watch<P>(path, cb, { ...parseEvOpts(opts, REOPTS.MEDIATOR), once: true });
  }
  nowatch<P extends Paths<T>>(path: P, cb: Watcher<T, P>): boolean | undefined {
    const cords = this.watchers.get(path);
    if (!cords) return undefined;
    for (let i = 0; i < cords.length; i++) if (cords[i].cb === cb) return (cords[i].sclup?.(), cords.splice(i--, 1), !cords.length && this.watchers.delete(path), true);
    return false;
  }

  on<P extends WCPaths<T>>(path: P, cb: Listener<T, P>, options?: ListenerOptions): Reactor<T>["off"] {
    const cords = this.listenersRecord.get(path),
      { capture, once, signal, immediate } = parseEvOpts(options, REOPTS.LISTENER);
    let cord = {} as ListenerRecord<T>;
    for (let i = 0; i < (cords?.length ?? 0); i++)
      if (cords![i].cb === cb && capture === cords![i].capture) {
        cord = cords![i];
        break;
      }
    if (cord) return cord.clup;
    cord = { cb: cb as Listener<T>, capture, once, clup: () => this.off<P>(path, cb, options) };
    if (immediate) {
      const target = this._getContext(path as Paths<T>) as Target<T, P>;
      cb(new Event<T, P>({ type: "init", target, currentTarget: target, root: this.core, rejectable: false }, false));
    }
    (cords ?? this.listenersRecord.set(path, []).get(path)!).push(cord);
    return this._bind(cord, signal);
  }
  once<P extends WCPaths<T>>(path: P, cb: Listener<T, P>, options?: ListenerOptions): Reactor<T>["off"] {
    return this.on<P>(path, cb, { ...parseEvOpts(options, REOPTS.LISTENER), once: true });
  }
  off<P extends WCPaths<T>>(path: P, cb: Listener<T, P>, options?: ListenerOptions): boolean | undefined {
    const cords = this.listenersRecord.get(path);
    if (!cords) return undefined;
    const { capture } = parseEvOpts(options, REOPTS.LISTENER);
    for (let i = 0; i < cords.length; i++) if (cords[i].cb === cb && cords[i].capture === capture) return (cords[i].sclup?.(), cords.splice(i--, 1), !cords.length && this.listenersRecord.delete(path), true);
    return false;
  }

  cascade({ type, currentTarget: { path, value: news, oldValue: olds } }: Event<T>, objSafe = true): void {
    if (!isObj(news) || !isObj(olds) || (type !== "set" && type !== "delete")) return;
    const obj = objSafe ? mergeObjs(olds, news) : news;
    for (const key of Object.keys(obj)) setAny(this.core, (path + "." + key) as Paths<T>, (obj as any)[key]); // smart progressive enhancement for objects; !*
  }

  public snapshot(): T {
    return deepClone(this.core);
  }

  reset(): void {
    (this.getters.clear(), this.setters.clear(), this.watchers.clear(), this.listenersRecord.clear());
    (this.queue?.clear(), this.batch.clear(), (this.isBatching = false));
    this.proxyCache = new WeakMap();
  }
  destroy(): void {
    (this.reset(), nuke(this));
  }
}
