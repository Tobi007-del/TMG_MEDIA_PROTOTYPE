import { BasePlug, GestureWheelPin, GESTURE_WHEEL_BUILD, type GestureWheel, GestureTouchPin, GESTURE_TOUCH_BUILD, type GestureTouch, GestureGeneralPin, GESTURE_GENERAL_BUILD, type GestureGeneral } from "..";
import { Controller } from "../../core/controller";
import type { DeepPartial } from "sia-reactor";
export * from "./general";
export * from "./touch";
export * from "./wheel";

export type Gesture = GestureGeneral & {
  wheel: GestureWheel;
  touch: GestureTouch;
};

export class GesturePlug extends BasePlug<Gesture> {
  public static readonly plugName: string = "gesture";
  public general!: GestureGeneralPin;
  public wheel!: GestureWheelPin;
  public touch!: GestureTouchPin;

  constructor(ctlr: Controller, config: Gesture, state?: any) {
    super(ctlr, config, state);
    // Variables Assignment
    this.general = new GestureGeneralPin(this.ctlr, { click: this.config.click, dblClick: this.config.dblClick }).setup();
    this.wheel = new GestureWheelPin(this.ctlr, this.config.wheel).setup();
    this.touch = new GestureTouchPin(this.ctlr, this.config.touch).setup();
  }

  public wire() {
    // Utility Injection
    const wire = () => (this.general.wire(), this.wheel.wire(), this.touch.wire());
    if (this.ctlr.state.readyState > 1) wire();
    else this.ctlr.state.once("readyState", wire, { signal: this.signal }); // waits for light state or first play
  }

  protected override onDestroy() {
    super.onDestroy();
    this.general?.destroy();
    this.wheel?.destroy();
    this.touch?.destroy();
  }
}

export const GESTURE_BUILD: DeepPartial<Gesture> = {
  ...GESTURE_GENERAL_BUILD,
  touch: GESTURE_TOUCH_BUILD,
  wheel: GESTURE_WHEEL_BUILD,
};
