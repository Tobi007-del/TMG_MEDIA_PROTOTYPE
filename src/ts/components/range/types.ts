import { AptRange } from "../../types/generics";
import { ComponentState } from "../base";

export interface RangeConfig extends AptRange {
  value: number;
  previewValue: number;
  label: string;
  scrub: {
    sync: boolean;
    relative: boolean;
    cancel: {
      delta: number;
      timeout: number;
    };
  };
  wheel: {
    disabled: boolean;
    axisRatio: number;
  };
}

export interface RangeState extends ComponentState {
  scrubbing: boolean;
  shouldCancelScrub: boolean;
  stallCancelScrub: boolean;
}
