import {
  whiteListedKeys,
  errorCodes,
  modes,
  keyShortcutActions,
  moddedKeyShortcutActions,
  aptAutoplayOptions,
  orientationOptions,
} from "../consts/generics";

export type whiteListedKey = (typeof whiteListedKeys)[number];
export type ErrorCode = (typeof errorCodes)[number];

export type Mode = (typeof modes)[number];
export type KeyShortcutAction = (typeof keyShortcutActions)[number];
export type ModdedKeyShortcutAction = (typeof moddedKeyShortcutActions)[number];
export type AptAutoplayOption = (typeof aptAutoplayOptions)[number];
export type OrientationOption = (typeof orientationOptions)[number];

export interface PosterPreview {
  usePoster: boolean;
  time: number;
  tease: boolean;
}

export interface AptRange {
  min: number;
  max: number;
  step: number;
}

export interface OptRange {
  min: number;
  max: number;
  value: number;
  skip: number;
}
