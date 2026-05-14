import { PERSIST_MODULE_BUILD } from "sia-reactor/modules";
import { Persist } from "./types";

export const PERSIST_BUILD: Partial<Persist> = {
  ...PERSIST_MODULE_BUILD,
  whitelist: ["settings"],
};
