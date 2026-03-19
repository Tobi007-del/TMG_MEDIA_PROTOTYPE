import {
  REJECTABLE,
  INERTIA,
  INDIFFABLE,
  TERMINATOR,
  Reactor,
  ReactorEvent,
} from "../core/reactor";
import type { Paths, WildPaths, ChildPaths, PathValue, PathBranchValue, PathKey } from "./obj";
import { getComposedPath } from "../utils";
import { Reactive } from "../tools/mixins";

// ===========================================================================
// CORE MARKERS & STATE WRAPPERS
// ===========================================================================

export type Inert<T> = T & { [INERTIA]?: true };
export type Live<T> = T extends Inert<infer U> ? U : T;

export type Intent<T> = T & { [REJECTABLE]?: true };
export type State<T> = T extends Intent<infer U> ? U : T;

export type Volatile<T> = T & { [INDIFFABLE]?: true };
export type Stable<T> = T extends Volatile<infer U> ? U : T;

export type { Reactor };

// ===========================================================================
// EVENT SYSTEM & PAYLOADS
// ===========================================================================

export interface Target<T, P extends WildPaths<T> = WildPaths<T>> {
  path: P;
  value: PathValue<T, P>;
  oldValue?: PathValue<T, P>;
  key: PathKey<T, P>;
  object: PathBranchValue<T, P>;
}

// Discriminated Payload Type (Creates the IDE magic)
export type Payload<T, P extends WildPaths<T> = WildPaths<T>> =
  | DirectPayload<T, P>
  | UpdatePayload<T, P>;

export interface BasePayload<T, P extends WildPaths<T> = WildPaths<T>> {
  currentTarget: Target<T, P>; // use this to survive shape changes from nesting
  root: T;
  terminated?: boolean; // for mediators to signal operation termination but doesn't stop the chain
  rejectable: boolean;
}
export interface DirectPayload<T, P extends WildPaths<T> = WildPaths<T>> extends BasePayload<T, P> {
  type: "init" | "get" | "set" | "delete"; // init during `immediate: true` sync
  target: Target<T, P>;
}
export interface UpdatePayload<T, P extends WildPaths<T> = WildPaths<T>> extends BasePayload<T, P> {
  type: "update";
  target: Target<T, ChildPaths<T, P>>; // Target is strictly one of the child paths!
}

// Discriminated Event Type (Creates the IDE magic)
export type REvent<T, P extends WildPaths<T> = WildPaths<T>> =
  | (Omit<ReactorEvent<T, P>, OverrideEvProp> &
      DirectPayload<T, P> &
      OverrideEvPart<DirectPayload<T, P>>)
  | (Omit<ReactorEvent<T, P>, OverrideEvProp> &
      UpdatePayload<T, P> &
      OverrideEvPart<UpdatePayload<T, P>>);

type OverrideEvProp = "type" | "target" | "value" | "oldValue" | "path";
interface OverrideEvPart<PL extends { target: { path: any; value: any; oldValue?: any } }> {
  path: PL["target"]["path"];
  value: PL["target"]["value"];
  oldValue: PL["target"]["oldValue"];
}

// ===========================================================================
// REACTIVITY CALLBACKS (The Handlers)
// ===========================================================================

export type Getter<T, P extends WildPaths<T> = WildPaths<T>> = (
  value: PathValue<T, P>,
  payload: Payload<T, P>,
) => PathValue<T, P> | undefined;

export type Setter<T, P extends WildPaths<T> = WildPaths<T>> = (
  value: PathValue<T, P>,
  terminated: boolean,
  payload: Payload<T, P>,
) => PathValue<T, P> | typeof TERMINATOR | undefined;

export type Deleter<T, P extends WildPaths<T> = WildPaths<T>> = (
  terminated: boolean,
  payload: Payload<T, P>,
) => typeof TERMINATOR | undefined;

export type Watcher<T, P extends WildPaths<T> = WildPaths<T>> = (
  value: PathValue<T, P>,
  payload: Payload<T, P>,
) => void;

export type Listener<T, P extends WildPaths<T> = WildPaths<T>> = (event: REvent<T, P>) => void;

// ===========================================================================
// ENGINE RECORDS (Internal Storage)
// ===========================================================================

export type GetterRecord<T extends object, P extends WildPaths<T> = WildPaths<T>> = {
  cb: Getter<T, P>;
  clup: () => ReturnType<Reactor<T>["noget"]>;
  sclup?: () => void;
} & SyncOptionsTuple;

export type SetterRecord<T extends object, P extends WildPaths<T> = WildPaths<T>> = {
  cb: Setter<T, P>;
  clup: () => ReturnType<Reactor<T>["noset"]>;
  sclup?: () => void;
} & SyncOptionsTuple;

export type DeleterRecord<T extends object, P extends WildPaths<T> = WildPaths<T>> = {
  cb: Deleter<T, P>;
  clup: () => ReturnType<Reactor<T>["nodelete"]>;
  sclup?: () => void;
} & SyncOptionsTuple;

export type WatcherRecord<T extends object, P extends WildPaths<T> = WildPaths<T>> = {
  cb: Watcher<T, P>;
  clup: () => ReturnType<Reactor<T>["nowatch"]>;
  sclup?: () => void;
} & SyncOptionsTuple;

export type ListenerRecord<T extends object, P extends WildPaths<T> = WildPaths<T>> = {
  cb: Listener<T, P>;
  clup: () => ReturnType<Reactor<T>["off"]>;
  sclup?: () => void;
} & ListenerOptionsTuple;

// ===========================================================================
// CONFIGURATION OPTIONS
// ===========================================================================

export interface SyncOptionsTuple {
  lazy?: boolean;
  once?: boolean;
  signal?: AbortSignal;
  immediate?: boolean | "auto";
} // "*" path apart from listener's should not use `immediate`
export type SyncOptions = boolean | SyncOptionsTuple;

export interface ListenerOptionsTuple extends Omit<SyncOptionsTuple, "lazy"> {
  capture?: boolean;
  depth?: number;
}
export type ListenerOptions = boolean | ListenerOptionsTuple;

// "almighty" mediation, (mediator|listener) for desired path, equality checks eg: `object.is()`
export interface ReactorOptions<T extends object, P extends Paths<T> = Paths<T>> {
  get?: (
    object: PathBranchValue<T, P>,
    key: PathKey<T, P>,
    value: PathValue<T, P>,
    receiver: Reactive<T>,
    path: Paths<T> | Paths<T>[],
  ) => PathValue<T, P> | undefined;
  set?: (
    object: PathBranchValue<T, P>,
    key: PathKey<T, P>,
    value: PathValue<T, P>,
    oldValue: PathValue<T, P>,
    receiver: Reactive<T>,
    path: Paths<T> | Paths<T>[],
  ) => PathValue<T, P> | typeof TERMINATOR | undefined;
  delete?: (
    object: PathBranchValue<T, P>,
    key: PathKey<T, P>,
    oldValue: PathValue<T, P>,
    receiver: Reactive<T>,
    path: Paths<T> | Paths<T>[],
  ) => typeof TERMINATOR | undefined;
  debug?: boolean;
  crossRealms?: boolean; // needed for object type detection if using across realms e.g, iframes or other environments
  smartCloning?: boolean; // one-time set for structural sharing, needs `.referenceTracking: true`
  eventBubbling?: boolean; // default true, set to false to prevent bubbling (not recommended if you want power)
  lineageTracing?: boolean; // one-time set for tree walking to search for refs on property access, needs `.referenceTracking = true`
  batchingFunction?: (cb: () => void) => void; // one-time set for listener's notifications, e.g: `queueMicrotask`, `unstable_batchedUpdates` from ReactDOM
  referenceTracking?: boolean; // one-time set to activate
} // debating making use of the Reflect API opt-in
