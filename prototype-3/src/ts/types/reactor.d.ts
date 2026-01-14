import type { Paths, PathValue } from "./paths";

export interface ReactorAPI<T extends object> {
  get<P extends Paths<T>>(path: P, callback: Mediator<T, P>): void;
  noget<P extends Paths<T>>(path: P, callback: Mediator<T, P>): void;
  set<P extends Paths<T>>(path: P, callback: Mediator<T, P>): void;
  noset<P extends Paths<T>>(path: P, callback: Mediator<T, P>): void;
  on<P extends Paths<T>>(path: P, callback: Listener<T, P>): void;
  off<P extends Paths<T>>(path: P, callback: Listener<T, P>): void;
  propagate(payload: Payload<T>): void;
  tick(): Promise<void>;
  reset(): void;
}

export interface Target<T, P extends Paths<T> = Paths<T>> {
  path: P;
  value?: PathValue<T, P>;
  oldValue?: PathValue<T, P>;
  key: string;
  object: object;
}

export interface Payload<T, P extends Paths<T> = Paths<T>> {
  type: "get" | "set" | "delete" | "update";
  target: Target<T, P>;
  currentTarget: Target<T, P>;
  root: T;
}

export type Mediator<T, P extends Paths<T> = Paths<T>> = (
  value?: PathValue<T, P>,
  terminated: boolean,
  payload: Payload<T, P>
) => PathValue<T, P> | typeof TERMINATOR;

export type Listener<T, P extends Paths<T> = Paths<T>> = (payload: Payload<T, P>) => void;

export type Terminator = unique symbol;
