import { TimeTravelOverlayConfig } from "sia-reactor/adapters/vanilla";
import { TimeTravelConfig } from "sia-reactor/modules";

export type TimeTravel = {
  module: TimeTravelConfig<any>;
  overlay: TimeTravelOverlayConfig;
};