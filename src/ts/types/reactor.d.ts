import Reactor, {
  Event,
  INERTIA,
  REJECTABLE,
  TERMINATOR,
} from "../core/reactor";
import type { Paths, WCPaths, PathValue, PathParentValue } from "./obj";
import { getComposedPath } from "../utils";

export type Inert<T> = T & { [INERTIA]?: true };
export type Live<T> = T extends Inert<infer U> ? U : T;

export type Intent<T> = T & { [REJECTABLE]?: true };
export type State<T> = T extends Intent<infer U> ? U : T;

export interface ReactorOptions {}
export type Reactor<T> = Reactor<T>;

export type Event<T, P> = Event<T, P>;
export interface Target<T, P extends WCPaths<T> = WCPaths<T>> {
  path: P;
  value?: PathValue<T, P>;
  oldValue?: PathValue<T, P>;
  key: string;
  object: PathParentValue<T, P>;
}
export interface Payload<T, P extends WCPaths<T> = WCPaths<T>> {
  type: "init" | "get" | "set" | "delete" | "update"; // init during `immediate: true` sync
  target: Target<T, P>;
  currentTarget: Target<T, P>; // use this always to survive shape changes from nesting
  root: T;
  rejectable: boolean;
}

export type Getter<T, P extends Paths<T> = Paths<T>> = (
  value: PathValue<T, P> | undefined,
  payload: Payload<T, P>,
) => PathValue<T, P> | undefined;

export type Setter<T, P extends Paths<T> = Paths<T>> = (
  value: PathValue<T, P> | undefined,
  terminated: boolean,
  payload: Payload<T, P>,
) => PathValue<T, P> | typeof TERMINATOR | undefined;

export type Watcher<T, P extends Paths<T> = Paths<T>> = (
  value: PathValue<T, P> | undefined,
  payload: Payload<T, P>,
) => void;

export type Listener<T, P extends WCPaths<T> = WCPaths<T>> = (
  event: Event<T, P>,
) => void;

export type GetterRecord<T, P extends Paths<T> = Paths<T>> = {
  cb: Getter<T, P>;
  clup?: Reactor<T, P>["noget"];
  sclup?: () => void;
} & SyncOptionsTuple;

export type SetterRecord<T, P extends Paths<T> = Paths<T>> = {
  cb: Setter<T, P>;
  clup?: Reactor<T, P>["noset"];
  sclup?: () => void;
} & SyncOptionsTuple;

export type WatcherRecord<T, P extends Paths<T> = Paths<T>> = {
  cb: Watcher<T, P>;
  clup?: Reactor<T, P>["nowatch"];
  sclup?: () => void;
} & WatcherOptionsTuple;

export type ListenerRecord<T, P extends WCPaths<T> = WCPaths<T>> = {
  cb: Listener<T, P>;
  clup?: Reactor<T, P>["off"];
  sclup?: () => void;
} & ListenerOptionsTuple;

export type SyncOptionsTuple = {
  lazy?: boolean;
  once?: boolean;
  signal?: AbortSignal;
  immediate?: boolean;
};
export type SyncOptions = boolean | SyncOptionsTuple;

export type ListenerOptionsTuple = {
  capture?: boolean;
  once?: boolean;
  signal?: AbortSignal;
  immediate?: boolean;
};
export type ListenerOptions = boolean | ListenerOptionsTuple;
