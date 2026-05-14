import { DeepPartial } from "sia-reactor";
import { Gesture, GestureGeneral, GestureTouch, GestureWheel } from ".";
import { IS_MOBILE } from "../../../utils";

export const GESTURE_GENERAL_BUILD: Partial<GestureGeneral> = {
  click: IS_MOBILE ? false : "paused",
  dblClick: IS_MOBILE ? "paused" : "fullscreen",
};

export const GESTURE_TOUCH_BUILD: Partial<GestureTouch> = {
  volume: true,
  brightness: true,
  timeline: true,
  threshold: 200,
  axesRatio: 3,
  inset: 20,
  sliderTimeout: 1000,
  xRatio: 1,
  yRatio: 1,
};

export const GESTURE_WHEEL_BUILD: Partial<GestureWheel> = {
  volume: true,
  brightness: true,
  timeline: true,
  timeout: 2000,
  xRatio: 12,
  yRatio: 6,
};

export const GESTURE_BUILD: DeepPartial<Gesture> = {
  ...GESTURE_GENERAL_BUILD,
  touch: GESTURE_TOUCH_BUILD,
  wheel: GESTURE_WHEEL_BUILD,
};
