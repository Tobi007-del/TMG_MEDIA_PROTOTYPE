export type Primitive =
  | string
  | number
  | boolean
  | bigint
  | symbol
  | null
  | undefined;

export type Paths<T> =
  | "*"
  | (T extends Primitive
      ? never
      : T extends readonly (infer U)[]
      ?
          | `${Extract<keyof T, number>}`
          | `${Extract<keyof T, number>}.${Paths<U>}`
      : {
          [K in keyof T & (string | number)]: T[K] extends Primitive
            ? `${K}`
            : `${K}` | `${K}.${Paths<T[K]>}`;
        }[keyof T & (string | number)]);

export type PathValue<
  T,
  P extends string
> = P extends `${infer K}.${infer Rest}`
  ? K extends keyof T
    ? PathValue<T[K], Rest>
    : never
  : P extends keyof T
  ? T[P]
  : never;

export type ReadonlyPaths<T> = Paths<{
  readonly [K in keyof T]: T[K] extends Primitive ? T[K] : Readonly<T[K]>;
}>;
