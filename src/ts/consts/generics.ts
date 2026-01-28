import type { Terminator } from "../types/reactor";

// ============ Constants ============
export const FN_KEY = "tmg_fn_registry";

export const TERMINATOR: Terminator = Symbol("TERMINATOR");

export const errorCodes = [
  1, // MEDIA_ERR_ABORTED
  2, // MEDIA_ERR_NETWORK
  3, // MEDIA_ERR_DECODE
  4, // MEDIA_ERR_SRC_NOT_SUPPORTED
  5, // MEDIA_ERR_UNKNOWN
] as const;

export const whiteListedKeys = [" ", "enter", "escape", "arrowup", "arrowdown", "arrowleft", "arrowright", "home", "end", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9"] as const;
