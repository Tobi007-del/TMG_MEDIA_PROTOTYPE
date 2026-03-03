import type { Inert } from "./reactor";

type Primitive = string | number | boolean | bigint | symbol | null | undefined;

type NoTraverse =
  | Primitive
  | Function
  | Date
  | Error
  | RegExp
  | Promise<any>
  | Map<any, any>
  | WeakMap<any, any>
  | Set<any>
  | WeakSet<any>
  | HTMLElement
  | Element
  | Node
  | EventTarget
  | Window
  | Document
  | DOMTokenList
  | TextTrackList
  | TextTrackCue
  | AbortSignal
  | TimeRanges
  | MediaStream
  | Inert<unknown>;

export type Paths<T, S extends string = ".", D extends number = RDepth> = [D] extends [0]
  ? never // Circuit Breaker Triggered
  : T extends NoTraverse
    ? never
    : T extends readonly (infer U)[]
      ? `${Extract<keyof T, number>}` | `${Extract<keyof T, number>}${S}${Paths<U, S, RPrev[D]>}`
      : {
          [K in keyof T & (string | number)]: T[K] extends Primitive
            ? `${K}`
            : `${K}` | `${K}${S}${Paths<T[K], S, RPrev[D]>}`;
        }[keyof T & (string | number)];
export type WildPaths<T, S extends string = "."> = "*" | Paths<T, S>;
export type ChildPaths<T, P extends WildPaths<T>, S extends string = "."> = P extends "*"
  ? Paths<T, S>
  : P | Extract<Paths<T, S>, `${P}${S}${string}`>;

export type PathKey<T, P extends string = Paths<T>, S extends string = "."> = P extends "*"
  ? keyof T & (string | number)
  : PathLeaf<P, S>; // Loose since reactor just slices strings
export type StrictPathKey<T, P extends string = Paths<T>, S extends string = "."> = P extends "*"
  ? keyof T & (string | number)
  : P extends `${infer K}${S}${infer Rest}`
    ? K extends keyof T
      ? StrictPathKey<T[K], Rest, S>
      : never
    : P extends keyof T
      ? P
      : never; // Strict since it returns existing keys only

export type PathValue<T, P extends string = Paths<T>, S extends string = "."> = P extends "*"
  ? T
  : P extends `${infer K}${S}${infer Rest}`
    ? K extends keyof T
      ? PathValue<T[K], Rest, S>
      : never
    : P extends keyof T
      ? T[P]
      : never;

export type PathBranchValue<T, P extends string = Paths<T>, S extends string = "."> = P extends "*"
  ? T
  : P extends `${string}${S}${string}`
    ? PathValue<T, PathBranch<P, S>, S>
    : T;

export type Unflatten<T extends object, S extends string = "."> = UnionToIntersection<
  {
    [K in keyof T & string]: UnflattenKey<K, T[K], S>;
  }[keyof T & string]
>; // Turns dotted keys into nested objects while preserving value types
type UnflattenKey<
  K extends string,
  V,
  S extends string,
> = K extends `${infer Head}${S}${infer Tail}`
  ? { [P in Head]: UnflattenKey<Tail, V, S> }
  : { [P in K]: V };

// Helpers
export type PathLeaf<
  P extends string,
  S extends string = ".",
> = P extends `${infer _Head}${S}${infer Tail}` ? PathLeaf<Tail, S> : P;

export type PathBranch<
  P extends string,
  S extends string = ".",
> = P extends `${infer Head}${S}${infer Tail}`
  ? Tail extends `${string}${S}${string}`
    ? `${Head}${S}${PathBranch<Tail, S>}`
    : Head
  : never;

export type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (
  k: infer I,
) => void
  ? I
  : never;

// --- "It's not that deep" WARRIORS ---
export type DeepKeys<T, D extends number = RDepth> = [D] extends [0]
  ? never
  : T extends NoTraverse
    ? never
    : T extends readonly any[]
      ? DeepKeys<T[number], RPrev[D]>
      : {
          [K in keyof T & (string | number)]: K | DeepKeys<T[K], RPrev[D]>;
        }[keyof T & (string | number)];

export type DeepMerge<T1, T2, D extends number = RDepth> = [D] extends [0]
  ? never
  : T2 extends object
    ? T1 extends object
      ? {
          [K in keyof T1 | keyof T2]: K extends keyof T2
            ? K extends keyof T1
              ? DeepMerge<T1[K], T2[K], RPrev[D]>
              : T2[K]
            : K extends keyof T1
              ? T1[K]
              : never;
        }
      : T2
    : T2;

export type DeepPartial<T, D extends number = RDepth> = [D] extends [0]
  ? never
  : T extends Function
    ? T
    : T extends Array<infer U>
      ? Array<DeepPartial<U, RPrev[D]>>
      : T extends ReadonlyArray<infer U>
        ? ReadonlyArray<DeepPartial<U, RPrev[D]>>
        : T extends object
          ? { [P in keyof T]?: DeepPartial<T[P], RPrev[D]> }
          : T;

export type DeepRequired<T, D extends number = RDepth> = [D] extends [0]
  ? never
  : T extends Function
    ? T
    : T extends Array<infer U>
      ? Array<DeepRequired<U, RPrev[D]>>
      : T extends ReadonlyArray<infer U>
        ? ReadonlyArray<DeepRequired<U, RPrev[D]>>
        : T extends object
          ? { [P in keyof T]-?: DeepRequired<T[P], RPrev[D]> }
          : T;

// --- RECURSION LIMITERS ---
type RDepth = 19; // current limit for state trees, observed ts max - 19; limit needed cuz of ts bundlers
// This tuple maps a number to the number below it (Index 4 contains 3) allowing `RPrev[D]` to subtract 1 from our depth.
type RPrev = [never, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19];
