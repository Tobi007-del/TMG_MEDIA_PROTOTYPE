export type Primitive =
  | string
  | number
  | boolean
  | bigint
  | symbol
  | null
  | undefined;

export type WCPaths<T> = "*" | Paths<T>;

export type Paths<T, S = "."> = T extends Primitive
  ? never
  : T extends readonly (infer U)[]
    ?
        | `${Extract<keyof T, number>}`
        | `${Extract<keyof T, number>}${S}${Paths<U, S>}`
    : {
        [K in keyof T & (string | number)]: T[K] extends Primitive
          ? `${K}`
          : `${K}` | `${K}${S}${Paths<T[K], S>}`;
      }[keyof T & (string | number)];

export type ReadonlyPaths<T> = Paths<{
  readonly [K in keyof T]: T[K] extends Primitive ? T[K] : Readonly<T[K]>;
}>;

export type PathValue<T, P extends string, S = "."> = P extends "*"
  ? T
  : P extends `${infer K}${S}${infer Rest}`
    ? K extends keyof T
      ? PathValue<T[K], Rest, S>
      : never
    : P extends keyof T
      ? T[P]
      : never;

export type PathParentValue<
  T,
  P extends string,
> = P extends `${infer Parent}.${infer _Rest}`
  ? Parent extends ""
    ? T
    : PathValue<T, Parent>
  : T;

// Helper types to turn dotted keys into nested objects while preserving value types
type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (
  k: infer I,
) => void
  ? I
  : never;
type UnflattenKey<
  K extends string,
  V,
  S extends string,
> = K extends `${infer Head}${S}${infer Tail}`
  ? { [P in Head]: UnflattenKey<Tail, V, S> }
  : { [P in K]: V };
type Unflatten<
  T extends Record<string, any>,
  S extends string = ".",
> = UnionToIntersection<
  {
    [K in keyof T & string]: UnflattenKey<K, T[K], S>;
  }[keyof T & string]
>;

export type DeepMerge<T1, T2> = T2 extends object
  ? T1 extends object
    ? {
        [K in keyof T1 | keyof T2]: K extends keyof T2
          ? K extends keyof T1
            ? DeepMerge<T1[K], T2[K]>
            : T2[K]
          : K extends keyof T1
            ? T1[K]
            : never;
      }
    : T2
  : T2;

export type DeepPartial<T> = T extends Function
  ? T
  : T extends Array<infer U>
    ? Array<DeepPartial<U>>
    : T extends ReadonlyArray<infer U>
      ? ReadonlyArray<DeepPartial<U>>
      : T extends object
        ? { [P in keyof T]?: DeepPartial<T[P]> }
        : T;

export type DeepRequired<T> = T extends Function
  ? T
  : T extends Array<infer U>
    ? Array<DeepRequired<U>>
    : T extends ReadonlyArray<infer U>
      ? ReadonlyArray<DeepRequired<U>>
      : T extends object
        ? { [P in keyof T]-?: DeepRequired<T[P]> }
        : T;
