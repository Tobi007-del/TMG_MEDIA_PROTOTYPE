import Reactor, { Event } from "../core/reactor";
import type { Paths, WCPaths, PathValue } from "./obj";
import { getComposedPath } from "../utils";

export interface ReactorOptions {
  rejectable?: boolean; // State Vs. Intent
}
export type Reactor<T> = typeof Reactor<T>;
export type Terminator = unique symbol;

export type Event<T, P> = typeof Event<T, P>;
export interface Target<T, P extends WCPaths<T> = WCPaths<T>> {
  path: P;
  value?: PathValue<T, P>;
  oldValue?: PathValue<T, P>;
  key: string;
  object: PathParentValue<T, P>;
}
export interface Payload<T, P extends WCPaths<T> = WCPaths<T>> {
  type: "get" | "set" | "delete" | "update";
  target: Target<T, P>;
  currentTarget: Target<T, P>; // use this always to survive shape changes from nesting
  root: T;
}

export type Mediator<T, P extends Paths<T> = Paths<T>> = (
  value?: PathValue<T, P>,
  terminated: boolean,
  payload: Payload<T, P>,
) => PathValue<T, P> | typeof TERMINATOR;
export type MediatorOptionsTuple = {
  lazy?: boolean;
  signal?: AbortSignal;
};
export type MediatorOptions = boolean | MediatorOptionsTuple;

export type Watcher<T, P extends Paths<T> = Paths<T>> = (
  value?: PathValue<T, P>,
  payload?: Payload<T, P>,
) => void;
export type WatcherOptionsTuple = MediatorOptionsTuple;
export type WatcherOptions = boolean | WatcherOptionsTuple;

export type Listener<T, P extends WCPaths<T> = WCPaths<T>> = (
  event: Event<T, P>,
) => void;
export type ListenerOptionsTuple = {
  capture?: boolean;
  once?: boolean;
  signal?: AbortSignal;
};
export type ListenerOptions = boolean | ListenerOptionsTuple;
export type ListenerRecord<T, P extends WCPaths<T> = WCPaths<T>> = {
  cb: Listener<T, P>;
} & ListenerOptionsTuple;
