import type { Event, Target, Payload, Getter, Setter, Deleter, Watcher, Listener, ListenerOptions, ListenerRecord, WatcherRecord, GetterRecord, SetterRecord, DeleterRecord, SyncOptions, ReactorOptions } from "../types/reactor";
import type { PathBranchValue, Paths, PathKey, PathValue, WildPaths } from "../types/obj";
import { isStrictObj, mergeObjs, getTrailPaths, getTrailRecords, parseEvOpts, inAny, getAny, setAny, deleteAny, deepClone } from "../utils";
import { inert, isIntent, isVolatile, nuke } from "../tools/mixins";

/***
 * ========= The S.I.A (State Intent Architecture) `Reactor` CODE PATTERN WATCHLIST =========
 * 1. non-stack loops & multiple optimizations this is surgical work on the root of reactivity
 * 2. used cached loop lengths to optimize b4 JIT Compiler does for optimal speed throughput,
 * avoided myth of reverse while loops so new CPU's don't waste memory on a forward l1 Cache miss
 * 3. moved any logic involving `?.` or `??` outside repetitions to not accumulate the ~5x slowdown
 * 4. `?.` in cases where only other option was `&&` cuz `?.` benchmarks proves to be better
 * 5. adopted nooping strategy since JIT compiler makes it 2x faster than other alternatives
 * 6. no unorthodox string deduplication or caching since string interning is native to JS
 * 6. `cord` is an alias for record and `es` for entries, avoided object pooling incase of logs
 * 7. it's all progressive: light at creation then grows during the user of desired features
 **/

// ===========================================================================
// The S.I.A (State Intent Architecture) Constants
// ===========================================================================

export const INERTIA: unique symbol = Symbol.for("S.I.A_INERTIA"); // "No Proxy" Marker
export const REJECTABLE: unique symbol = Symbol.for("S.I.A_REJECTABLE"); // "State Vs. Intent" Marker
export const INDIFFABLE: unique symbol = Symbol.for("S.I.A_INDIFFABLE"); // "Equality Tracking" Marker
export const TERMINATOR: unique symbol = Symbol.for("S.I.A_TERMINATOR"); // "Obj Operation Terminator" Marker
export const RAW: unique symbol = Symbol.for("S.I.A_RAW"); // "Get Original Obj" Marker
const NOOP = () => {};
const R_BATCH = ("undefined" !== typeof queueMicrotask ? queueMicrotask : setTimeout).bind(window);
const R_LOG = console.log.bind(console, "[S.I.A Reactor]");
const EV_WARN = console.warn.bind(console, "[S.I.A Event]");
const EV_OPTS = { LISTENER: ["capture", "depth", "once", "signal", "immediate"], MEDIATOR: ["lazy", "signal", "immediate"] } as const;

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
  protected _propagationStopped = false;
  protected _immediatePropagationStopped = false;
  protected _resolved = "";
  protected _rejected = "";
  protected _warn: (...args: any[]) => void = NOOP;

  constructor(payload: Payload<T, P>, bubbles = false, canWarn = true) {
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
    if (canWarn) this._warn = EV_WARN;
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
    if (!this.rejectable) return this._warn(`Ignored resolve() call on a non-rejectable ${this.staticType} at "${this.path}"`);
    if (this.eventPhase !== ReactorEvent.CAPTURING_PHASE) this._warn(`Resolving an intent on ${this.staticType} at "${this.path}" outside of the capture phase is unadvised.`);
    if (this.rejectable) this._resolved = message || `Could ${this.staticType} intended value at "${this.path}"`;
  }
  get rejected(): string {
    return this._rejected;
  }
  reject(reason?: string): void {
    if (!this.rejectable) return this._warn(`Ignored reject() call on a non-rejectable ${this.staticType} at "${this.path}"`);
    if (this.eventPhase !== ReactorEvent.CAPTURING_PHASE) this._warn(`Rejecting an intent on ${this.staticType} at "${this.path}" outside of the capture phase is unadvised.`);
    if (this.rejectable) this._rejected = reason || `Couldn't ${this.staticType} intended value at "${this.path}"`;
  }
  composedPath(): WildPaths<T>[] {
    return getTrailPaths<T>(this.path);
  }
  get canWarn(): boolean {
    return this._warn === EV_WARN;
  }
}

// ===========================================================================
// The S.I.A (State Intent Architecture) `Reactor`
// ===========================================================================

export class Reactor<T extends object> {
  protected getters?: Map<WildPaths<T>, Array<GetterRecord<T>>>;
  protected setters?: Map<WildPaths<T>, Array<SetterRecord<T>>>;
  protected deleters?: Map<WildPaths<T>, Array<DeleterRecord<T>>>;
  protected watchers?: Map<WildPaths<T>, Array<WatcherRecord<T>>>;
  protected listeners?: Map<WildPaths<T>, Array<ListenerRecord<T>>>;
  protected lineage?: WeakMap<object, { parent: object; key: string }[]>; // The Engine Room: Tracks Target
  protected queue?: Set<() => void>; // Tasks to run after flush
  protected batch?: Map<Paths<T>, Payload<T>>;
  protected isBatching = false;
  protected isTracking = false;
  protected proxyCache = new WeakMap<object, any>();
  protected log: (...args: any[]) => void = NOOP;
  protected _canLog = false; // keeping track so API getter doesn't slow down internal iterations in any way
  public config: Omit<ReactorOptions<T>, "debug" | "referenceTracking"> = { crossRealms: false, eventBubbling: true, batchingFunction: R_BATCH };
  public core: T; // `?:`s | pay the ~600 byte price upfront for what u might never use

  constructor(obj: T = {} as T, options?: ReactorOptions<T>) {
    inert(this);
    this.core = this.proxied(obj);
    if (!options) return;
    if ((this.isTracking = !!options.referenceTracking)) this.lineage = new WeakMap(); // tracking one-time set to avoid reference issues
    if (options.debug) this.canLog = true;
    const { get = this.config.get, set = this.config.set, delete: del = this.config.delete, crossRealms = this.config.crossRealms, eventBubbling = this.config.eventBubbling } = options;
    Object.assign(this.config, { get, set, delete: del, crossRealms, eventBubbling });
  }

  protected proxied<O extends object>(obj: O, rejectable = false, indiffable = false, parent?: object, key?: string, path?: string): O {
    if (!obj || typeof obj !== "object") return obj; // did light type check for `.INERTIA` so `false` to strictObj typecheck param
    if (!(isStrictObj(obj, this.config.crossRealms, false) || Array.isArray(obj)) || (obj as any)[INERTIA]) return obj; // handles direct objects and arrays unless inert
    obj = (obj as any)[RAW] || obj; // prevents nested proxies
    if (this.isTracking && parent && key) this.link(obj, parent, key, false); // already checked types above
    if (this.proxyCache.has(obj)) return this.proxyCache.get(obj);
    rejectable ||= isIntent(obj);
    indiffable ||= isVolatile(obj);
    const proxy = new Proxy(obj, {
      // Robust Proxy handler
      get: (object, key, receiver) => {
        if (key === RAW) return object;
        let value = (object as any)[key];
        const safeKey = String(key),
          fullPath = this.isTracking ? undefined : ((path ? path + "." + safeKey : safeKey) as Paths<T>),
          paths = this.isTracking ? this.trace(object, safeKey) : fullPath!;
        this.log(`👀 [GET Trap] Initiated for "${safeKey}" on "${paths}"`);
        if (this.config.get) value = this.config.get(object as PathBranchValue<T>, key as PathKey<T>, value, receiver, paths);
        if (this.getters) {
          const wildcords = this.getters.get("*"); // wild cords
          for (let i = 0, len = this.isTracking ? paths.length : 1; i < len; i++) {
            const currPath = (this.isTracking ? paths[i] : fullPath!) as Paths<T>,
              cords = this.getters.get(currPath);
            if (!cords && !wildcords) continue;
            const target: Target<T> = { path: currPath, value, key: safeKey as PathKey<T>, object: receiver },
              payload = { type: "get", target, currentTarget: target, root: this.core, rejectable } as Payload<T, Paths<T>>;
            if (cords) value = this.mediate(currPath, payload, "get", cords);
            if (!wildcords) continue;
            target.value = value;
            value = this.mediate("*", payload, "get", wildcords);
          } // Mediators
        }
        return this.proxied(value, rejectable, indiffable, object, safeKey, fullPath);
      },
      set: (object, key, value, receiver) => {
        let unchanged,
          safeValue,
          safeOldValue,
          terminated = false;
        const safeKey = String(key),
          fullPath = this.isTracking ? undefined : ((path ? path + "." + safeKey : safeKey) as Paths<T>),
          paths = this.isTracking ? this.trace(object, safeKey) : fullPath!,
          oldValue = (object as any)[key];
        if (this.isTracking || !indiffable) {
          safeOldValue = oldValue?.[RAW] || oldValue;
          safeValue = value?.[RAW] || value;
          unchanged = Object.is(safeValue, safeOldValue);
        }
        if (!indiffable && unchanged) return true;
        this.log(`✏️ [SET Trap] Initiated for "${safeKey}" on "${paths}"`);
        if (this.config.set) terminated = (value = this.config.set(object as PathBranchValue<T>, key as PathKey<T>, value, oldValue, receiver, paths)) === TERMINATOR;
        if (this.setters) {
          const wildcords = this.setters.get("*");
          for (let i = 0, len = paths.length; i < len; i++) {
            const currPath = (this.isTracking ? paths[i] : fullPath!) as Paths<T>,
              cords = this.setters.get(currPath);
            if (!cords && !wildcords) continue;
            const target: Target<T> = { path: currPath, value, oldValue, key: safeKey as PathKey<T>, object: receiver },
              payload = { type: "set", target, currentTarget: target, root: this.core, terminated, rejectable } as Payload<T, Paths<T>>;
            if (cords) {
              const result = this.mediate(currPath, payload, "set", cords);
              if (!(terminated ||= payload.terminated!)) value = result;
            }
            if (!wildcords) continue;
            target.value = value;
            const result = this.mediate("*", payload, "set", wildcords);
            if (!(terminated ||= payload.terminated!)) value = result;
          } // Mediators
        }
        if (terminated) return (this.log(`🛡️ [SET Mediator] Terminated on "${paths}"`), true); // soft rejection if terminated: `true`
        (object as any)[key] = value;
        if (this.isTracking && !unchanged) (this.unlink(safeOldValue, object, safeKey), this.link(safeValue, object, safeKey));
        if (this.watchers || this.listeners)
          for (let i = 0, len = paths.length; i < len; i++) {
            const currPath = (this.isTracking ? paths[i] : fullPath!) as Paths<T>,
              target: Target<T> = { path: currPath, value, oldValue, key: safeKey as PathKey<T>, object: receiver };
            this.notify(currPath, { type: "set", target, currentTarget: target, root: this.core, terminated, rejectable } as Payload<T, Paths<T>>);
          } // Listeners
        return true;
      },
      deleteProperty: (object, key) => {
        let value: any,
          receiver = this.proxyCache.get(object),
          terminated = false;
        const safeKey = String(key),
          fullPath = this.isTracking ? undefined : ((path ? path + "." + safeKey : safeKey) as Paths<T>),
          paths = this.isTracking ? this.trace(object, safeKey) : fullPath!,
          oldValue = (object as any)[key];
        this.log(`🗑️ [DELETE Trap] Initiated for "${safeKey}" on "${paths}"`);
        if (this.config.delete) terminated = (value = this.config.delete(object as PathBranchValue<T>, key as PathKey<T>, oldValue, receiver, paths)) === TERMINATOR;
        if (this.deleters) {
          const wildcords = this.deleters.get("*");
          for (let i = 0, len = paths.length; i < len; i++) {
            const currPath = (this.isTracking ? paths[i] : fullPath!) as Paths<T>,
              cords = this.deleters.get(currPath);
            if (!cords && !wildcords) continue;
            const target: Target<T> = { path: currPath, value, oldValue, key: safeKey as PathKey<T>, object: receiver },
              payload = { type: "delete", target, currentTarget: target, root: this.core, rejectable } as Payload<T, Paths<T>>;
            if (cords) {
              const result = this.mediate(currPath, payload, "delete", cords);
              if (!(terminated ||= payload.terminated!)) value = result;
            }
            if (!wildcords) continue;
            const result = this.mediate("*", payload, "delete", wildcords);
            if (!(terminated ||= payload.terminated!)) value = result;
          } // Mediators
        }
        if (terminated) return (this.log(`🛡️ [DELETE Mediator] Terminated on "${paths}"`), true); // soft rejection if terminated: `true`
        delete (object as any)[key];
        this.isTracking && this.unlink(oldValue?.[RAW] || oldValue, object, safeKey);
        if (this.watchers || this.listeners)
          for (let i = 0, len = paths.length; i < len; i++) {
            const currPath = (this.isTracking ? paths[i] : fullPath!) as Paths<T>,
              target: Target<T> = { path: currPath, value, oldValue, key: safeKey as PathKey<T>, object: receiver };
            this.notify(currPath, { type: "delete", target, currentTarget: target, root: this.core, rejectable } as Payload<T, Paths<T>>);
          } // Listeners
        return true;
      },
    });
    return (this.proxyCache.set(obj, proxy), proxy) as O;
  }
  protected trace(target: object, path: string, paths: string[] = [], visited = new WeakSet<object>()): Paths<T>[] {
    if (Object.is(target, (this.core as any)[RAW] || this.core)) return (paths.push(path), paths as Paths<T>[]);
    if (visited.has(target)) return paths as Paths<T>[]; // Stop infinite loops
    visited.add(target);
    const parents = this.lineage!.get(target);
    if (!parents) return paths as Paths<T>[];
    for (let i = 0, len = parents.length; i < len; i++) {
      const { parent, key } = parents[i];
      this.trace(parent, key ? key + "." + path : path, paths, visited);
    }
    return paths as Paths<T>[];
  } // won't be called without `.isTracking` so internal guard avoided
  protected link(target: any, parent: object, key: string, typecheck = true, es?: { parent: object; key: string }[]): void {
    if (typecheck && !(isStrictObj(target, this.config.crossRealms) || Array.isArray(target))) return;
    es = this.lineage!.get(target) ?? (this.lineage!.set(target, (es = [])), es);
    for (let i = 0, len = es.length; i < len; i++) if (Object.is(es[i].parent, parent) && es[i].key === key) return;
    es.push({ parent, key }); // es used as a param: needed storage perk
  }
  protected unlink(target: any, parent: object, key: string): void {
    if (!(isStrictObj(target, this.config.crossRealms) || Array.isArray(target))) return;
    const es = this.lineage!.get(target);
    if (es) for (let i = 0, len = es.length; i < len; i++) if (Object.is(es[i].parent, parent) && es[i].key === key) return void es.splice(i, 1);
  }

  protected mediate<P extends WildPaths<T>>(path: WildPaths<T>, payload: Payload<T, P>, type: "get", cords: GetterRecord<T>[]): PathValue<T, P>;
  protected mediate<P extends WildPaths<T>>(path: WildPaths<T>, payload: Payload<T, P>, type: "set", cords: SetterRecord<T>[]): PathValue<T, P>;
  protected mediate<P extends WildPaths<T>>(path: WildPaths<T>, payload: Payload<T, P>, type: "delete", cords: DeleterRecord<T>[]): PathValue<T, P>;
  protected mediate<P extends WildPaths<T>>(path: WildPaths<T>, payload: Payload<T, P>, type: "get" | "set" | "delete", cords: Array<GetterRecord<T> | SetterRecord<T> | DeleterRecord<T>>) {
    let terminated = false,
      value = payload.target.value; // mediator called when necessary & ready for the argument work, all facts (params) are brought to the table so no `?.`
    const isGet = type === "get",
      isSet = type === "set",
      mediators = isGet ? this.getters : isSet ? this.setters : this.deleters;
    for (let i = !isGet ? 0 : cords.length - 1, len = !isGet ? cords.length : -1; i !== len; i += !isGet ? 1 : -1) {
      const response: any = isGet ? (cords[i] as GetterRecord<T>).cb(value, payload) : isSet ? (cords[i] as SetterRecord<T>).cb(value, terminated, payload) : (cords[i] as DeleterRecord<T>).cb(terminated, payload); // all will mediate
      if (isGet || !(terminated ||= payload.terminated = response === TERMINATOR)) value = response as PathValue<T, P>;
      if (cords[i].once) (cords.splice(i--, 1), !cords.length && mediators!.delete(path));
    }
    return value; // set - FIFO, get - LIFO
  }

  protected notify<P extends Paths<T>>(path: P, payload: Payload<T, P>): void {
    if (this.watchers) {
      const wildcords = this.watchers.get("*"),
        cords = this.watchers.get(path);
      if (cords)
        for (let i = 0, len = cords.length; i < len; i++) {
          cords[i].cb(payload.target.value, payload); // watchers do not terminate as they're after the OP
          if (cords[i].once) (cords.splice(i--, 1), !cords.length && this.watchers!.delete(path));
        }
      if (wildcords)
        for (let i = 0, len = wildcords.length; i < len; i++) {
          wildcords[i].cb(payload.target.value, payload);
          if (wildcords[i].once) (wildcords.splice(i--, 1), !wildcords.length && this.watchers!.delete("*"));
        }
    }
    this.listeners && this.schedule(path, payload); // batch is undefined till listeners are available
  }
  protected schedule<P extends Paths<T>>(path: P, payload: Payload<T, P>): void {
    this.batch ??= new Map<Paths<T>, Payload<T>>();
    (this.batch.set(path, payload), !this.isBatching && this.initBatching());
  }
  protected initBatching(): void {
    ((this.isBatching = true), this.config.batchingFunction!(() => this.flush())); // do the `!isBatching` check outisde so the func cost is only on first batch
  }
  protected flush(): void {
    ((this.isBatching = false), this.batch && this.tick(this.batch.keys())); // not slowing dis down with a `?.size` since it's like always filled, rather pay the empty iterator cost once when empty
    if (this.queue?.size) for (const task of this.queue) (task(), this.queue.delete(task)); // you can still stall with an empty batch, and slowing dis down with `?.size`; almost always empty
  }

  protected wave(path: Paths<T>, payload: Payload<T>): void {
    const e = new ReactorEvent<T>(payload, this.config.eventBubbling, this._canLog) as Event<T>, // a wave is started only when really necessary all things considered
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
    this.fire(chain[chain.length - 1], e, true); // CAPTURE fires
    !e.immediatePropagationStopped && this.fire(chain[chain.length - 1], e, false); // BUBBLE fires
    if (!e.bubbles) return;
    // 3: BUBBLE phase (parent -> core) - listeners always see it, rejection is just a flag for smart optimists
    e.eventPhase = ReactorEvent.BUBBLING_PHASE;
    for (let i = chain.length - 2; i >= 0; i--) {
      if (e.propagationStopped) break;
      this.fire(chain[i], e, false);
    }
    // if (e.rejected) return; // 4: DEFAULT phase if ever, whole architecture can be reimagined: `State vs Intent` is my view; reactor is still dumb
  }
  protected fire([path, object, value]: ReturnType<typeof getTrailRecords<T>>[number], e: Event<T>, isCapture: boolean, cords = this.listeners!.get(path)): void {
    if (!cords) return; // not doing `.listeners?.` in param cuz this is called in a loop and internally, listeners are defined before this is touched
    e.type = path !== e.target.path ? "update" : e.staticType; // `update` for ancestors
    e.currentTarget = { path, value, oldValue: e.type !== "update" ? e.target.oldValue : undefined, key: (e.type !== "update" ? path : path.slice(path.lastIndexOf(".") + 1) || "") as PathKey<T>, object: object as PathBranchValue<T> };
    let tDepth, lDepth;
    for (let i = 0, len = cords.length; i < len; i++) {
      if (e.immediatePropagationStopped) break;
      if (cords[i].capture !== isCapture) continue;
      if (cords[i].depth !== undefined) {
        ((tDepth ??= this.getDepth(e.target.path)), (lDepth ??= this.getDepth(path))); // calc if ever needed
        if (tDepth > lDepth + cords[i].depth!) continue;
      }
      cords[i].cb(e);
      if (cords[i].once) (cords.splice(i--, 1), !cords.length && this.listeners!.delete(path));
    }
  }

  protected bind<Cb>(cord: GetterRecord<T> | SetterRecord<T> | DeleterRecord<T> | WatcherRecord<T> | ListenerRecord<T>, signal?: AbortSignal): Cb {
    signal?.aborted ? cord.clup() : signal?.addEventListener("abort", cord.clup, { once: true });
    if (signal && !signal.aborted) cord.sclup = () => signal.removeEventListener("abort", cord.clup);
    return cord.clup as Cb; // once incase spec changes, memory leaks too
  }
  protected getContext<P extends WildPaths<T>>(path: P): Target<T, P> {
    const lastDot = path.lastIndexOf("."),
      value = (path === "*" ? this.core : getAny(this.core, path as Paths<T>)) as PathValue<T, P>,
      object = lastDot === -1 ? this.core : getAny(this.core, path.slice(0, lastDot) as Paths<T>);
    return { path: path as P, value, key: (path.slice(lastDot + 1) || "") as PathKey<T, P>, object: object as PathBranchValue<T, P> };
  }
  public getDepth(p: string, d = !p ? 0 : 1): number {
    for (let i = 0, len = p.length; i < len; i++) if (p.charCodeAt(i) === 46) d++; // zero alloc; so when we say it's optmized, it's not cap :)
    return d;
  }

  public tick(paths?: Paths<T> | Iterable<Paths<T>>): void {
    if (!paths) return this.flush(); // we are sure listeners are defined before waving since batch depends on them
    if ("string" === typeof paths) {
      const task = this.batch?.get(paths);
      task && (this.wave(paths, task), this.batch!.delete(paths));
    } else
      for (const path of paths) {
        const task = this.batch!.get(path); // `!` cuz tick is only called inside the class with iterable paths when batch is defined
        task && (this.wave(path, task), this.batch!.delete(path));
      }
  }
  public stall(task: () => any): void {
    this.queue ??= new Set();
    (this.queue.add(task), !this.isBatching && this.initBatching());
  }
  public nostall(task: () => any): boolean | undefined {
    return this.queue?.delete(task);
  }

  public get<P extends WildPaths<T>>(path: P, cb: Getter<T, P>, opts?: SyncOptions): Reactor<T>["noget"] {
    this.getters ??= new Map<WildPaths<T>, Array<GetterRecord<T>>>();
    const { lazy = false, once = false, signal, immediate = false } = parseEvOpts(opts, EV_OPTS.MEDIATOR);
    let cords = this.getters.get(path),
      cord: GetterRecord<T> | undefined;
    if (cords)
      for (let i = 0, len = cords.length; i < len; i++)
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
  public gonce<P extends WildPaths<T>>(path: P, cb: Getter<T, P>, opts?: SyncOptions): Reactor<T>["noget"] {
    return this.get<P>(path, cb, { ...parseEvOpts(opts, EV_OPTS.MEDIATOR), once: true });
  }
  public noget<P extends WildPaths<T>>(path: P, cb: Getter<T, P>): boolean | undefined {
    const cords = this.getters?.get(path);
    if (!cords) return undefined;
    for (let i = 0, len = cords.length; i < len; i++) if (Object.is(cords[i].cb, cb)) return (cords[i].sclup?.(), cords.splice(i--, 1), !cords.length && this.getters!.delete(path), true);
    return false;
  }

  public set<P extends WildPaths<T>>(path: P, cb: Setter<T, P>, opts?: SyncOptions): Reactor<T>["noset"] {
    this.setters ??= new Map<WildPaths<T>, Array<SetterRecord<T>>>();
    const { lazy = false, once = false, signal, immediate = false } = parseEvOpts(opts, EV_OPTS.MEDIATOR);
    let cords = this.setters.get(path),
      cord: SetterRecord<T> | undefined;
    if (cords)
      for (let i = 0, len = cords.length; i < len; i++)
        if (Object.is(cords![i].cb, cb)) {
          cord = cords![i];
          break;
        }
    if (cord) return cord.clup;
    cord = { cb: cb as unknown as Setter<T>, once, clup: () => (lazy && this.nostall(task), this.noset<P>(path, cb)) };
    if (immediate) (immediate !== "auto" || inAny(this.core, path)) && setAny(this.core, path as Paths<T>, getAny(this.core, path as Paths<T>)!);
    const task = () => (cords ?? (this.setters!.set(path, (cords = [])), cords)).push(cord);
    lazy ? this.stall(task) : task();
    return this.bind(cord, signal);
  }
  public sonce<P extends WildPaths<T>>(path: P, cb: Setter<T, P>, opts?: SyncOptions): Reactor<T>["noset"] {
    return this.set<P>(path, cb, Object.assign(parseEvOpts(opts, EV_OPTS.MEDIATOR), { once: true }));
  }
  public noset<P extends WildPaths<T>>(path: P, cb: Setter<T, P>): boolean | undefined {
    const cords = this.setters?.get(path);
    if (!cords) return undefined;
    for (let i = 0, len = cords.length; i < len; i++) if (Object.is(cords[i].cb, cb)) return (cords[i].sclup?.(), cords.splice(i--, 1), !cords.length && this.setters!.delete(path), true);
    return false;
  }

  public delete<P extends WildPaths<T>>(path: P, cb: Deleter<T, P>, opts?: SyncOptions): Reactor<T>["nodelete"] {
    this.deleters ??= new Map<WildPaths<T>, Array<DeleterRecord<T>>>();
    const { lazy = false, once = false, signal, immediate = false } = parseEvOpts(opts, EV_OPTS.MEDIATOR);
    let cords = this.deleters.get(path),
      cord: DeleterRecord<T> | undefined;
    if (cords)
      for (let i = 0, len = cords.length; i < len; i++)
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
  public donce<P extends WildPaths<T>>(path: P, cb: Deleter<T, P>, opts?: SyncOptions): Reactor<T>["nodelete"] {
    return this.delete<P>(path, cb, Object.assign(parseEvOpts(opts, EV_OPTS.MEDIATOR), { once: true }));
  }
  public nodelete<P extends WildPaths<T>>(path: P, cb: Deleter<T, P>): boolean | undefined {
    const cords = this.deleters?.get(path);
    if (!cords) return undefined;
    for (let i = 0, len = cords.length; i < len; i++) if (Object.is(cords[i].cb, cb)) return (cords[i].sclup?.(), cords.splice(i--, 1), !cords.length && this.deleters!.delete(path), true);
    return false;
  }

  public watch<P extends WildPaths<T>>(path: P, cb: Watcher<T, P>, opts?: SyncOptions): Reactor<T>["nowatch"] {
    this.watchers ??= new Map<WildPaths<T>, Array<WatcherRecord<T>>>();
    const { lazy = false, once = false, signal, immediate = false } = parseEvOpts(opts, EV_OPTS.MEDIATOR);
    let cords = this.watchers.get(path),
      cord: WatcherRecord<T> | undefined;
    if (cords)
      for (let i = 0, len = cords.length; i < len; i++)
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
  public wonce<P extends WildPaths<T>>(path: P, cb: Watcher<T, P>, opts?: SyncOptions): Reactor<T>["nowatch"] {
    return this.watch<P>(path, cb, Object.assign(parseEvOpts(opts, EV_OPTS.MEDIATOR), { once: true }));
  }
  public nowatch<P extends WildPaths<T>>(path: P, cb: Watcher<T, P>): boolean | undefined {
    const cords = this.watchers?.get(path);
    if (!cords) return undefined;
    for (let i = 0, len = cords.length; i < len; i++) if (Object.is(cords[i].cb, cb)) return (cords[i].sclup?.(), cords.splice(i--, 1), !cords.length && this.watchers!.delete(path), true);
    return false;
  }

  public on<P extends WildPaths<T>>(path: P, cb: Listener<T, P>, options?: ListenerOptions): Reactor<T>["off"] {
    this.listeners ??= new Map<WildPaths<T>, Array<ListenerRecord<T>>>();
    const { capture = false, once = false, signal, immediate = false, depth } = parseEvOpts(options, EV_OPTS.LISTENER);
    let cords = this.listeners.get(path),
      cord: ListenerRecord<T> | undefined;
    if (cords)
      for (let i = 0, len = cords.length; i < len; i++)
        if (Object.is(cords![i].cb, cb) && capture === cords![i].capture) {
          cord = cords![i];
          break;
        }
    if (cord) return cord.clup;
    cord = { cb: cb as Listener<T>, capture, depth, once, clup: () => this.off<P>(path, cb, options) };
    if (immediate && (immediate !== "auto" || inAny(this.core, path))) {
      const target = this.getContext(path) as Target<T, P>;
      cb(new ReactorEvent<T, P>({ type: "init", target, currentTarget: target, root: this.core, rejectable: false }, this.config.eventBubbling, this._canLog) as Event<T, P>);
    }
    (cords ?? (this.listeners.set(path, (cords = [])), cords)).push(cord);
    return this.bind(cord, signal);
  }
  public once<P extends WildPaths<T>>(path: P, cb: Listener<T, P>, options?: ListenerOptions): Reactor<T>["off"] {
    return this.on<P>(path, cb, Object.assign(parseEvOpts(options, EV_OPTS.LISTENER), { once: true }));
  }
  public off<P extends WildPaths<T>>(path: P, cb: Listener<T, P>, options?: ListenerOptions): boolean | undefined {
    const cords = this.listeners?.get(path);
    if (!cords) return undefined;
    const { capture } = parseEvOpts(options, EV_OPTS.LISTENER);
    for (let i = 0, len = cords.length; i < len; i++) if (Object.is(cords[i].cb, cb) && cords[i].capture === capture) return (cords[i].sclup?.(), cords.splice(i--, 1), !cords.length && this.listeners!.delete(path), true);
    return false;
  }

  get canLog(): boolean {
    return this.log === R_LOG; // more accurate check for public API just in case :)
  }
  set canLog(value: boolean) {
    this.log = (this._canLog = value) ? R_LOG : NOOP;
  }
  get canTrackReferences(): boolean {
    return this.isTracking;
  }

  public snapshot(): T {
    return deepClone(this.core, !!this.config.crossRealms);
  }
  public cascade({ type, currentTarget: { path, value: news, oldValue: olds } }: ReactorEvent<T>, objSafe = true): void {
    if ((type !== "set" && type !== "delete") || !(isStrictObj(news, this.config.crossRealms) || Array.isArray(news)) || (objSafe ? !(isStrictObj(olds, this.config.crossRealms) || Array.isArray(olds)) : false)) return;
    const obj = objSafe ? mergeObjs(olds!, news) : news, // don't set objSafe for arrays, merger doesn't play nice
      keys = Object.keys(obj);
    for (let i = 0, len = keys.length; i < len; i++) setAny(this.core, (path + "." + keys[i]) as Paths<T>, (obj as any)[keys[i]]); // smart progressive enhancement for objects; !*
  }
  public reset(): void {
    (this.getters?.clear(), this.setters?.clear(), this.deleters?.clear(), this.watchers?.clear(), this.listeners?.clear());
    (this.queue?.clear(), this.batch?.clear(), (this.isBatching = false));
    this.proxyCache = new WeakMap();
  }
  public destroy(): void {
    (this.reset(), nuke(this));
  }
}
