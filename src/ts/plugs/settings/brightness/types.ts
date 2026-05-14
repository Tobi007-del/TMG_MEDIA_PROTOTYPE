import { OptRange } from "../../../types/generics";

export interface Brightness extends OptRange {
  dark: boolean;
}

export interface BrightnessState {
  aptBrightness: number;
}
