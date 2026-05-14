import { RangeConfig } from "..";

export interface TimelineConfig extends RangeConfig {
  previews:
    | boolean
    | {
        address?: string;
        cols?: number;
        rows?: number;
        spf?: number;
      };
}
