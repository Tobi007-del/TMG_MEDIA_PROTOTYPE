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

export type PathValue<T, P extends string, S = "."> = P extends "*"
  ? T
  : P extends `${infer K}${S}${infer Rest}`
  ? K extends keyof T
    ? PathValue<T[K], Rest, S>
    : never
  : P extends keyof T
  ? T[P]
  : never;

export type ReadonlyPaths<T> = Paths<{
  readonly [K in keyof T]: T[K] extends Primitive ? T[K] : Readonly<T[K]>;
}>;
