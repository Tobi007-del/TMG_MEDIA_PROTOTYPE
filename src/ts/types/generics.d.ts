import {
  ERROR_CODES,
  MODES,
  KEYSHORTCUT_ACTIONS,
  MODDED_KEYSHORTCUT_ACTIONS,
  APT_AUTOPLAY_OPTIONS,
  ORIENTATION_OPTIONS,
} from "../consts/generics";

export type MediaType = "video" | "audio";
export type ErrorCode = (typeof ERROR_CODES)[number];
export type Mode = (typeof MODES)[number];
export type KeyShortcutAction = (typeof KEYSHORTCUT_ACTIONS)[number];
export type ModdedKeyShortcutAction = (typeof MODDED_KEYSHORTCUT_ACTIONS)[number];
export type AptAutoplayOption = (typeof APT_AUTOPLAY_OPTIONS)[number];
export type OrientationOption = (typeof ORIENTATION_OPTIONS)[number];

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
