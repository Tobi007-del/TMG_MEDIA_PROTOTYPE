import { Paths } from "sia-reactor";
import { TimelineConfig } from "../../../components";
import { CtlrConfig } from "../../../types/config";
import { OptRange } from "../../../types/generics";

export interface CTime extends OptRange {
  mode: "elapsed" | "remaining";
  format: "digital" | "human" | "human-long";
  start: number | null | undefined;
  end: number;
  loop: boolean;
}

export interface TimeState {
  guardedPaths: Extract<Paths<CtlrConfig>, `${string}time${string}`>[];
}
