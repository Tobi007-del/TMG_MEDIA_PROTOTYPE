import { DeepPartial } from "sia-reactor";
import { TIME_TRAVEL_MODULE_BUILD } from "sia-reactor/modules";
import { TimeTravel } from "./types";

export const TIME_TRAVEL_BUILD: DeepPartial<TimeTravel> = {
  module: {
    ...TIME_TRAVEL_MODULE_BUILD,
    whitelist: ["intent"],
  },
};
