import { keysSettings } from "sia-reactor/utils";
import { KeyShortcutAction, ModdedKeyShortcutAction } from "../../../types/generics";

export type KeyPhase = "keydown" | "keyup";
export type KeyMod = "" | "ctrl" | "alt" | "shift";
export type KeyHook = {
  fn: KeyHandler;
  zen?: boolean;
};
export type KeyHandler = (e: KeyboardEvent, mod: KeyMod) => void;
export type KeyRegOptions = {
  phase?: KeyPhase | readonly KeyPhase[];
  shortcut?: string | string[];
  overwrite?: boolean;
  zen?: boolean; // an isolated mode where only flagged keys work, made for 3d flipped settings view
};

export interface Keys extends Required<keysSettings> {
  shortcuts: Record<KeyShortcutAction, string | string[]>;
  mods: {
    disabled: boolean;
  } & Record<ModdedKeyShortcutAction, Partial<Record<Exclude<KeyMod, "">, number>>>;
  _handlers: Record<KeyPhase, Record<string, KeyHook>>;
}
