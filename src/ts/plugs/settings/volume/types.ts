import { OptRange } from "../../../types/generics";

export interface Volume extends OptRange {
  muted: boolean;
}

export interface VolumeState {
  aptVolume: number;
}