import { Event, Target, Payload, Getter, Setter, Deleter, Watcher, Listener, ListenerOptions, ListenerRecord, WatcherRecord, GetterRecord, SetterRecord, DeleterRecord, SyncOptions, ReactorOptions } from "../types/reactor";
import type { PathBranchValue, Paths, PathKey, PathValue, WildPaths } from "../types/obj";
import { isObj, isArr, mergeObjs, getTrailPaths, getTrailRecords, parseEvOpts, inAny, getAny, setAny, deleteAny, deepClone } from "../utils";
import { inert, isIntent, nuke } from "../tools/mixins";
// low level non-stack loops considering this is surgical work on the root of reactivity
// `cord` is an alias for record and `es` for entries, avoided object pooling incase of logs
// reactor is progressive: light at creation then grows during the user of desired features

// ===========================================================================
// The S.I.A (State Intent Architecture) Constants
// ===========================================================================

export const RAW: unique symbol = Symbol.for("S.I.A_RAW"); // "Get Original Obj" Marker
export const REJECTABLE: unique symbol = Symbol.for("S.I.A_REJECTABLE"); // "State Vs. Intent" Marker
export const INERTIA: unique symbol = Symbol.for("S.I.A_INERTIA"); // "No Proxy" Marker
export const TERMINATOR: unique symbol = Symbol.for("S.I.A_TERMINATOR"); // "Obj Operation Terminator" Marker
const REOPTS = { LISTENER: ["capture", "depth", "once", "signal", "immediate"], MEDIATOR: ["lazy", "signal", "immediate"] } as const;

// ===========================================================================
// The S.I.A (State Intent Architecture) `Event`
// ===========================================================================

export class ReactorEvent<T, P extends WildPaths<T> = WildPaths<T>> {
  static readonly NONE = 0;
  static readonly CAPTURING_PHASE = 1;
  static readonly AT_TARGET = 2;
  static readonly BUBBLING_PHASE = 3;
  public eventPhase = ReactorEvent.NONE;
  public type: Payload<T, P>["type"];
  public currentTarget: Payload<T, P>["currentTarget"];
  readonly staticType: Payload<T, P>["type"];
  readonly target: Payload<T, P>["target"];
  readonly root: Payload<T, P>["root"];
  readonly path: Payload<T, P>["target"]["path"];
  readonly value: Payload<T, P>["target"]["value"];
  readonly oldValue: Payload<T, P>["target"]["oldValue"];
  readonly rejectable: boolean;
  // readonly timestamp: number;
  readonly bubbles: boolean;
  readonly canWarn: boolean;
  private _propagationStopped = false;
  private _immediatePropagationStopped = false;
  private _resolved = "";
  private _rejected = "";
  get warn() {
    return this.canWarn ? console.warn.bind(console, `[S.I.A ReactorEvent]`) : undefined;
  }

  constructor(payload: Payload<T, P>, bubbles = true, canWarn = true) {
    this.type = this.staticType = payload.type;
    this.target = payload.target;
    this.currentTarget = payload.currentTarget;
    this.root = payload.root;
    this.value = payload.target.value;
    this.oldValue = payload.target.oldValue;
    this.path = payload.target.path;
    this.rejectable = payload.rejectable;
    // this.timestamp = Date.now();
    this.bubbles = bubbles;
    this.canWarn = canWarn;
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
    if (!this.rejectable) return this.warn?.(`Ignored resolve() call on a non-rejectable ${this.staticType} at "${this.path}"`);
    if (this.eventPhase !== ReactorEvent.CAPTURING_PHASE) this.warn?.(`Resolving an intent on ${this.staticType} at "${this.path}" outside of the capture phase is unadvised.`);
    if (this.rejectable) this._resolved = message || `Could ${this.staticType} intended value at "${this.path}"`;
  }
  get rejected(): string {
    return this._rejected;
  }
  reject(reason?: string): void {
    if (!this.rejectable) return this.warn?.(`Ignored reject() call on a non-rejectable ${this.staticType} at "${this.path}"`);
    if (this.eventPhase !== ReactorEvent.CAPTURING_PHASE) this.warn?.(`Rejecting an intent on ${this.staticType} at "${this.path}" outside of the capture phase is unadvised.`);
    if (this.rejectable) this._rejected = reason || `Couldn't ${this.staticType} intended value at "${this.path}"`;
  }
  composedPath(): WildPaths<T>[] {
    return getTrailPaths<T>(this.path);
  }
}

// ===========================================================================
// The S.I.A (State Intent Architecture) `Reactor`
// ===========================================================================

export class Reactor<T extends object> {
  private getters?: Map<Paths<T>, Array<GetterRecord<T>>>;
  private setters?: Map<Paths<T>, Array<SetterRecord<T>>>;
  private deleters?: Map<Paths<T>, Array<DeleterRecord<T>>>;
  private watchers?: Map<Paths<T>, Array<WatcherRecord<T>>>;
  private listeners?: Map<WildPaths<T>, Array<ListenerRecord<T>>>;
  private queue?: Set<() => void>; // Tasks to run after flush
  private batch = new Map<Paths<T>, Payload<T>>();
  private isBatching = false;
  private proxyCache = new WeakMap<object, any>();
  private lineage = new WeakMap<object, { p: object; k: string }[]>(); // The Engine Room: Tracks Target -> Array of { parent, key }
  public options?: ReactorOptions<T>;
  public core: T; // `?:`s | pay the ~600 byte price upfront for what u might never use
  get log() {
    return this.options?.debug ? console.log.bind(console, "[S.I.A Reactor]") : undefined;
  }

  constructor(obj: T = {} as T, options?: ReactorOptions<T>) {
    inert(this);
    this.core = this.proxied(obj);
    this.options = options;
  }

  private proxied<O>(obj: O, rejectable = false, p?: object, k?: string): O {
    if (!obj || typeof obj !== "object") return obj;
    const tag = Object.prototype.toString.call(obj);
    if ((tag !== "[object Object]" && tag !== "[object Array]") || (obj as any)[INERTIA]) return obj; // handles direct objects and arrays unless inert
    obj = (obj as any)[RAW] || obj; // prevents nested proxies
    if (p && k) this.link(obj, p, k);
    if (this.proxyCache.has(obj as object)) return this.proxyCache.get(obj as object);
    rejectable ||= (obj as any)[REJECTABLE];
    const proxy = new Proxy(obj as object, {
      // Robust Proxy handler
      get: (object, key, receiver) => {
        if (key === RAW) return object;
        let value = Reflect.get(object, key, receiver);
        const safeKey = String(key),
          paths: Paths<T>[] = [];
        (this.trace(object, safeKey, paths), this.log?.(`👀 [GET Trap] Initiated for "${safeKey}" on "${paths}"`));
        this.options?.get && (value = this.options.get(object as PathBranchValue<T>, key as PathKey<T>, value, receiver, paths));
        for (let i = 0; i < paths.length; i++) {
          const getters = this.getters?.get(paths[i]);
          if (!getters) continue;
          const target: Target<T> = { path: paths[i], value, key: safeKey as PathKey<T>, object: receiver };
          value = this.mediate(paths[i], { type: "get", target, currentTarget: target, root: this.core, rejectable } as Payload<T, Paths<T>>, "get", getters);
        } // Mediators
        return this.proxied(value, rejectable, object, safeKey);
      },
      set: (object, key, value, receiver) => {
        const safeKey = String(key),
          paths: Paths<T>[] = [],
          oldValue = Reflect.get(object, key, receiver);
        (this.trace(object, safeKey, paths), this.log?.(`✏️ [SET Trap] Initiated for "${safeKey}" on "${paths}"`));
        this.options?.set && (value = this.options.set(object as PathBranchValue<T>, key as PathKey<T>, value, oldValue, receiver, paths));
        for (let i = 0; i < paths.length; i++) {
          const setters = this.setters?.get(paths[i]);
          if (!setters) continue;
          const target: Target<T> = { path: paths[i], value, oldValue, key: safeKey as PathKey<T>, object: receiver },
            result = this.mediate(paths[i], { type: "set", target, currentTarget: target, root: this.core, rejectable } as Payload<T, Paths<T>>, "set", setters);
          if (result !== TERMINATOR) value = result;
        } // Mediators
        if (value === TERMINATOR) return (this.log?.(`🛡️ [SET Mediator] Terminated on "${paths}"`), true); // soft rejection if terminated: `true`
        if (!Reflect.set(object, key, value, receiver)) return false;
        if (!Object.is((value as any)?.[RAW] || value, (oldValue as any)?.[RAW] || oldValue)) (this.unlink(oldValue, object, safeKey), this.link(value, object, safeKey));
        for (let i = 0; i < paths.length; i++) {
          const target: Target<T> = { path: paths[i], value, oldValue, key: safeKey as PathKey<T>, object: receiver };
          this.notify(paths[i], { type: "set", target, currentTarget: target, root: this.core, rejectable } as Payload<T, Paths<T>>);
        } // Listeners
        return true;
      },
      deleteProperty: (object, key) => {
        let value,
          receiver = this.proxyCache.get(object);
        const safeKey = String(key),
          paths: Paths<T>[] = [],
          oldValue = Reflect.get(object, key, receiver);
        (this.trace(object, safeKey, paths), this.log?.(`🗑️ [DELETE Trap] Initiated for "${safeKey}" on "${paths}"`));
        this.options?.delete && (value = this.options.delete(object as PathBranchValue<T>, key as PathKey<T>, oldValue, receiver, paths));
        for (let i = 0; i < paths.length; i++) {
          const deleters = this.deleters?.get(paths[i]);
          if (!deleters) continue;
          const target: Target<T> = { path: paths[i], value, oldValue, key: safeKey as PathKey<T>, object: receiver },
            result = this.mediate(paths[i], { type: "delete", target, currentTarget: target, root: this.core, rejectable } as Payload<T, Paths<T>>, "delete", deleters);
          if (result !== TERMINATOR) value = result;
        } // Mediators
        if (value === TERMINATOR) return (this.log?.(`🛡️ [DELETE Mediator] Terminated on "${paths}"`), true); // soft rejection if terminated: `true`
        if (!Reflect.deleteProperty(object, key)) return false;
        this.unlink(oldValue, object, safeKey);
        for (let i = 0; i < paths.length; i++) {
          const target: Target<T> = { path: paths[i], value, oldValue, key: safeKey as PathKey<T>, object: receiver };
          this.notify(paths[i], { type: "delete", target, currentTarget: target, root: this.core, rejectable } as Payload<T, Paths<T>>);
        } // Listeners
        return true;
      },
    });
    return (this.proxyCache.set(obj as object, proxy), proxy) as O;
  }
  private trace(target: object, key: string, paths: string[], visited = new WeakSet<object>()): void {
    if (Object.is(target, (this.core as any)?.[RAW] || this.core)) return void paths.push(key as Paths<T>);
    if (visited.has(target)) return; // Stop infinite loops
    visited.add(target);
    const parents = this.lineage.get(target);
    if (!parents) return;
    for (let i = 0; i < parents.length; i++) {
      const { p, k } = parents[i];
      this.trace(p, k ? k + "." + key : key, paths, visited);
    }
  }
  private link(child: any, p: object, k: string, es?: { p: object; k: string }[]): void {
    const target = (child as any)?.[RAW] || child;
    if (!isObj(target) && !isArr(target)) return;
    es = this.lineage.get(target) ?? (this.lineage.set(target, (es = [])), es);
    for (let i = 0; i < es.length; i++) if (Object.is(es[i].p, p) && es[i].k === k) return;
    es.push({ p, k }); // es used as a param: storage perk
  }
  private unlink(child: any, p: object, k: string): void {
    const target = (child as any)?.[RAW] || child;
    if (!target || typeof target !== "object") return;
    const es = this.lineage.get(target);
    if (es) for (let i = 0; i < es.length; i++) if (Object.is(es[i].p, p) && es[i].k === k) return void es.splice(i, 1);
  }

  private mediate<P extends Paths<T>>(path: Paths<T>, payload: Payload<T, P>, type: "get" | "set" | "delete", cords: Array<GetterRecord<T> | SetterRecord<T> | DeleterRecord<T>>): any {
    let terminated = false,
      value = payload.target.value;
    const mediators = type === "get" ? this.getters : type === "set" ? this.setters : this.deleters;
    for (let i = type !== "get" ? 0 : cords.length - 1; i !== (type !== "get" ? cords.length : -1); i += type !== "get" ? 1 : -1) {
      if (type !== "get") terminated ||= value === TERMINATOR;
      if (cords[i].once) (cords.splice(i--, 1), !cords.length && mediators!.delete(path));
      const response = type === "get" ? (cords[i] as GetterRecord<T>).cb(value, payload) : type === "set" ? (cords[i] as SetterRecord<T>).cb(value, terminated, payload) : (cords[i] as DeleterRecord<T>).cb(terminated, payload); // all will mediate
      if (!terminated) value = response as PathValue<T, P>;
    }
    return value; // set - FIFO, get - LIFO
  }

  private notify<P extends Paths<T>>(path: P, payload: Payload<T, P>) {
    const cords = this.watchers?.get(path);
    for (let i = 0; i < (cords?.length ?? 0); i++) {
      if (cords![i].once) (cords!.splice(i--, 1), !cords!.length && this.watchers!.delete(path));
      cords![i].cb(payload.target.value, payload); // watchers do not terminate as they're after the OP
    }
    this.schedule(path, payload);
  }
  private schedule<P extends Paths<T>>(path: P, payload: Payload<T, P>): void {
    (this.batch.set(path, payload), this.initBatching());
  }
  private initBatching(): void {
    if (this.isBatching) return;
    this.isBatching = true;
    queueMicrotask(() => this.flush());
  }
  private flush(): void {
    (this.tick(this.batch.keys()), this.batch.clear(), (this.isBatching = false));
    if (this.queue?.size) for (const task of this.queue) task();
    this.queue?.clear();
  }

  private wave(path: Paths<T>, payload: Payload<T>): void {
    const e = new ReactorEvent<T>(payload) as Event<T>,
      chain = getTrailRecords(this.core, path); // either build a large array to climb back up or have to derive each step
    // 1: CAPTURE phase (core -> parent) - intent owners reject here, capture should preferably be used to reject
    e.eventPhase = ReactorEvent.CAPTURING_PHASE;
    for (let i = 0; i <= chain.length - 2; i++) {
      if (e.propagationStopped) break;
      this.fire(chain[i], e, true);
    }
    if (e.propagationStopped) return;
    // 2: TARGET phase (leaf)
    e.eventPhase = ReactorEvent.AT_TARGET;
    this.fire(chain[chain.length - 1], e, true); // CAPTURE
    !e.immediatePropagationStopped && this.fire(chain[chain.length - 1], e, false); // BUBBLE
    if (!e.bubbles) return;
    // 3: BUBBLE phase (parent -> core) - listeners always see it, rejection is just a flag for smart optimists
    e.eventPhase = ReactorEvent.BUBBLING_PHASE;
    for (let i = chain.length - 2; i >= 0; i--) {
      if (e.propagationStopped) break;
      this.fire(chain[i], e, false);
    }
    // if (e.rejected) return; // 4: DEFAULT phase if ever, whole architecture can be reimagined: `State vs Intent` is my view; reactor is still dumb
  }
  private fire([path, object, value]: ReturnType<typeof getTrailRecords<T>>[number], e: Event<T>, isCapture: boolean, cords = this.listeners?.get(path)): void {
    if (!cords?.length) return;
    e.type = path !== e.target.path ? "update" : e.staticType; // `update` for ancestors
    e.currentTarget = { path, value, oldValue: e.type !== "update" ? e.target.oldValue : undefined, key: (e.type !== "update" ? path : path.slice(path.lastIndexOf(".") + 1) || "") as PathKey<T>, object: object as PathBranchValue<T> };
    let tDepth, lDepth;
    for (let i = 0; i < cords.length; i++) {
      if (e.immediatePropagationStopped) break;
      if (cords[i].capture !== isCapture) continue;
      if (cords[i].depth != undefined) {
        ((tDepth ??= this.getDepth(e.target.path)), (lDepth ??= this.getDepth(path))); // calc if ever needed
        if (tDepth > lDepth + cords[i].depth!) continue;
      }
      if (cords[i].once) (cords.splice(i--, 1), !cords.length && this.listeners!.delete(path));
      cords[i].cb(e);
    }
  }

  private bind<Cb>(cord: GetterRecord<T> | SetterRecord<T> | DeleterRecord<T> | WatcherRecord<T> | ListenerRecord<T>, signal?: AbortSignal): Cb {
    signal?.aborted ? cord.clup() : signal?.addEventListener?.("abort", cord.clup, { once: true });
    if (signal && !signal.aborted) cord.sclup = () => signal.removeEventListener?.("abort", cord.clup);
    return cord.clup as Cb; // once incase spec changes, memory leaks too
  }
  private getContext<P extends WildPaths<T>>(path: P): Target<T, P> {
    const lastDot = path.lastIndexOf("."),
      value = (path === "*" ? this.core : getAny(this.core, path as Paths<T>)) as PathValue<T, P>,
      object = lastDot === -1 ? this.core : getAny(this.core, path.slice(0, lastDot) as Paths<T>);
    return { path: path as P, value, key: (path.slice(lastDot + 1) || "") as PathKey<T, P>, object: object as PathBranchValue<T, P> };
  }
  public getDepth(p: string, d = !p ? 0 : 1): number {
    for (let i = 0; i < p.length; i++) if (p.charCodeAt(i) === 46) d++; // zero alloc; so when we say it's optmized, it's not cap :)
    return d;
  }

  public tick(paths?: Paths<T> | Iterable<Paths<T>>): void {
    if (!paths) return this.flush();
    if ("string" === typeof paths) {
      const task = this.batch.get(paths);
      task && (this.wave(paths, task), this.batch.delete(paths));
    } else
      for (const path of paths) {
        const task = this.batch.get(path);
        task && (this.wave(path, task), this.batch.delete(path));
      }
  }
  public stall(task: () => any): void {
    this.queue ??= new Set();
    (this.queue.add(task), this.initBatching());
  }
  public nostall(task: () => any): boolean | undefined {
    return this.queue?.delete(task);
  }

  public get<P extends Paths<T>>(path: P, cb: Getter<T, P>, opts?: SyncOptions): Reactor<T>["noget"] {
    this.getters ??= new Map<Paths<T>, Array<GetterRecord<T>>>();
    const { lazy = false, once = false, signal, immediate = false } = parseEvOpts(opts, REOPTS.MEDIATOR);
    let cords = this.getters.get(path),
      cord: GetterRecord<T> | undefined;
    for (let i = 0; i < (cords?.length ?? 0); i++)
      if (Object.is(cords![i].cb, cb)) {
        cord = cords![i];
        break;
      }
    if (cord) return cord.clup;
    cord = { cb: cb as unknown as Getter<T>, once, clup: () => (lazy && this.nostall(task), this.noget<P>(path, cb)) };
    if (immediate) (immediate !== "auto" || inAny(this.core, path)) && getAny(this.core, path as Paths<T>);
    const task = () => (cords ?? (this.getters!.set(path, (cords = [])), cords)).push(cord);
    lazy ? this.stall(task) : task(); // a progressive enhancment for gets that are virtual and should not affect init
    return this.bind(cord, signal);
  }
  public gonce<P extends Paths<T>>(path: P, cb: Getter<T, P>, opts?: SyncOptions): Reactor<T>["noget"] {
    return this.get<P>(path, cb, { ...parseEvOpts(opts, REOPTS.MEDIATOR), once: true });
  }
  public noget<P extends Paths<T>>(path: P, cb: Getter<T, P>): boolean | undefined {
    const cords = this.getters?.get(path);
    if (!cords) return undefined;
    for (let i = 0; i < cords.length; i++) if (Object.is(cords[i].cb, cb)) return (cords[i].sclup?.(), cords.splice(i--, 1), !cords.length && this.getters!.delete(path), true);
    return false;
  }

  public set<P extends Paths<T>>(path: P, cb: Setter<T, P>, opts?: SyncOptions): Reactor<T>["noset"] {
    this.setters ??= new Map<Paths<T>, Array<SetterRecord<T>>>();
    const { lazy = false, once = false, signal, immediate = false } = parseEvOpts(opts, REOPTS.MEDIATOR);
    let cords = this.setters.get(path),
      cord: SetterRecord<T> | undefined;
    for (let i = 0; i < (cords?.length ?? 0); i++)
      if (Object.is(cords![i].cb, cb)) {
        cord = cords![i];
        break;
      }
    if (cord) return cord.clup;
    cord = { cb: cb as unknown as Setter<T>, once, clup: () => (lazy && this.nostall(task), this.noset<P>(path, cb)) };
    if (immediate) (immediate !== "auto" || inAny(this.core, path)) && setAny(this.core, path as Paths<T>, this.getContext(path).value!);
    const task = () => (cords ?? (this.setters!.set(path, (cords = [])), cords)).push(cord);
    lazy ? this.stall(task) : task();
    return this.bind(cord, signal);
  }
  public sonce<P extends Paths<T>>(path: P, cb: Setter<T, P>, opts?: SyncOptions): Reactor<T>["noset"] {
    return this.set<P>(path, cb, Object.assign(parseEvOpts(opts, REOPTS.MEDIATOR), { once: true }));
  }
  public noset<P extends Paths<T>>(path: P, cb: Setter<T, P>): boolean | undefined {
    const cords = this.setters?.get(path);
    if (!cords) return undefined;
    for (let i = 0; i < cords.length; i++) if (Object.is(cords[i].cb, cb)) return (cords[i].sclup?.(), cords.splice(i--, 1), !cords.length && this.setters!.delete(path), true);
    return false;
  }

  public delete<P extends Paths<T>>(path: P, cb: Deleter<T, P>, opts?: SyncOptions): Reactor<T>["nodelete"] {
    this.deleters ??= new Map<Paths<T>, Array<DeleterRecord<T>>>();
    const { lazy = false, once = false, signal, immediate = false } = parseEvOpts(opts, REOPTS.MEDIATOR);
    let cords = this.deleters.get(path),
      cord: DeleterRecord<T> | undefined;
    for (let i = 0; i < (cords?.length ?? 0); i++)
      if (Object.is(cords![i].cb, cb)) {
        cord = cords![i];
        break;
      }
    if (cord) return cord.clup;
    cord = { cb: cb as unknown as Deleter<T>, once, clup: () => (lazy && this.nostall(task), this.nodelete<P>(path, cb)) };
    if (immediate) (immediate !== "auto" || inAny(this.core, path)) && deleteAny(this.core, path as Paths<T>, undefined);
    const task = () => (cords ?? (this.deleters!.set(path, (cords = [])), cords)).push(cord);
    lazy ? this.stall(task) : task();
    return this.bind(cord, signal);
  }
  public donce<P extends Paths<T>>(path: P, cb: Deleter<T, P>, opts?: SyncOptions): Reactor<T>["nodelete"] {
    return this.delete<P>(path, cb, Object.assign(parseEvOpts(opts, REOPTS.MEDIATOR), { once: true }));
  }
  public nodelete<P extends Paths<T>>(path: P, cb: Deleter<T, P>): boolean | undefined {
    const cords = this.deleters?.get(path);
    if (!cords) return undefined;
    for (let i = 0; i < cords.length; i++) if (Object.is(cords[i].cb, cb)) return (cords[i].sclup?.(), cords.splice(i--, 1), !cords.length && this.deleters!.delete(path), true);
    return false;
  }

  public watch<P extends Paths<T>>(path: P, cb: Watcher<T, P>, opts?: SyncOptions): Reactor<T>["nowatch"] {
    this.watchers ??= new Map<Paths<T>, Array<WatcherRecord<T>>>();
    const { lazy = false, once = false, signal, immediate = false } = parseEvOpts(opts, REOPTS.MEDIATOR);
    let cords = this.watchers.get(path),
      cord: WatcherRecord<T> | undefined;
    for (let i = 0; i < (cords?.length ?? 0); i++)
      if (Object.is(cords![i].cb, cb)) {
        cord = cords![i];
        break;
      }
    if (cord) return cord.clup;
    cord = { cb: cb as Watcher<T>, once, clup: () => (lazy && this.nostall(task), this.nowatch<P>(path, cb)) };
    if (immediate && immediate !== "auto" && inAny(this.core, path)) {
      const target = this.getContext(path);
      cb(target.value, { type: "init", target, currentTarget: target, root: this.core, rejectable: false } as Payload<T, P>);
    }
    const task = () => (cords ?? (this.watchers!.set(path, (cords = [])), cords)).push(cord);
    lazy ? this.stall(task) : task();
    return this.bind(cord, signal);
  }
  public wonce<P extends Paths<T>>(path: P, cb: Watcher<T, P>, opts?: SyncOptions): Reactor<T>["nowatch"] {
    return this.watch<P>(path, cb, Object.assign(parseEvOpts(opts, REOPTS.MEDIATOR), { once: true }));
  }
  public nowatch<P extends Paths<T>>(path: P, cb: Watcher<T, P>): boolean | undefined {
    const cords = this.watchers?.get(path);
    if (!cords) return undefined;
    for (let i = 0; i < cords.length; i++) if (Object.is(cords[i].cb, cb)) return (cords[i].sclup?.(), cords.splice(i--, 1), !cords.length && this.watchers!.delete(path), true);
    return false;
  }

  public on<P extends WildPaths<T>>(path: P, cb: Listener<T, P>, options?: ListenerOptions): Reactor<T>["off"] {
    this.listeners ??= new Map<WildPaths<T>, Array<ListenerRecord<T>>>();
    const { capture = false, once = false, signal, immediate = false, depth } = parseEvOpts(options, REOPTS.LISTENER);
    let cords = this.listeners.get(path),
      cord: ListenerRecord<T> | undefined;
    for (let i = 0; i < (cords?.length ?? 0); i++)
      if (Object.is(cords![i].cb, cb) && capture === cords![i].capture) {
        cord = cords![i];
        break;
      }
    if (cord) return cord.clup;
    cord = { cb: cb as Listener<T>, capture, depth, once, clup: () => this.off<P>(path, cb, options) };
    if (immediate && (immediate !== "auto" || inAny(this.core, path))) {
      const target = this.getContext(path as Paths<T>) as Target<T, P>;
      cb(new ReactorEvent<T, P>({ type: "init", target, currentTarget: target, root: this.core, rejectable: false }, false, this.options?.debug) as Event<T, P>);
    }
    (cords ?? (this.listeners.set(path, (cords = [])), cords)).push(cord);
    return this.bind(cord, signal);
  }
  public once<P extends WildPaths<T>>(path: P, cb: Listener<T, P>, options?: ListenerOptions): Reactor<T>["off"] {
    return this.on<P>(path, cb, Object.assign(parseEvOpts(options, REOPTS.LISTENER), { once: true }));
  }
  public off<P extends WildPaths<T>>(path: P, cb: Listener<T, P>, options?: ListenerOptions): boolean | undefined {
    const cords = this.listeners?.get(path);
    if (!cords) return undefined;
    const { capture } = parseEvOpts(options, REOPTS.LISTENER);
    for (let i = 0; i < cords.length; i++) if (Object.is(cords[i].cb, cb) && cords[i].capture === capture) return (cords[i].sclup?.(), cords.splice(i--, 1), !cords.length && this.listeners!.delete(path), true);
    return false;
  }

  public cascade({ type, currentTarget: { path, value: news, oldValue: olds } }: ReactorEvent<T>, objSafe = true): void {
    if (!isObj(news) || !isObj(olds) || (type !== "set" && type !== "delete")) return;
    const obj = objSafe ? mergeObjs(olds, news) : news,
      keys = Object.keys(obj);
    for (let i = 0; i < keys.length; i++) setAny(this.core, (path + "." + keys[i]) as Paths<T>, (obj as any)[keys[i]]); // smart progressive enhancement for objects; !*
  }

  public snapshot(): T {
    return deepClone(this.core);
  }

  public reset(): void {
    (this.getters?.clear(), this.setters?.clear(), this.deleters?.clear(), this.watchers?.clear(), this.listeners?.clear());
    (this.queue?.clear(), this.batch.clear(), (this.isBatching = false));
    this.proxyCache = new WeakMap();
  }
  public destroy(): void {
    (this.reset(), nuke(this));
  }
}
